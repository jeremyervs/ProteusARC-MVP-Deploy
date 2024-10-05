import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from typing import List, Dict, Any
import re

app = Flask(__name__)

# Set up OpenAI API key
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY is not set. Some features may not work.")
    client = None
else:
    client = OpenAI(api_key=OPENAI_API_KEY)

# Gradient definitions
gradient_definitions = {
    'Endogenous': 'Change that originates from within the system or entity, driven by internal factors such as organizational policies, personal motivations, or inherent dynamics.',
    'Exogenous': 'Change that originates from outside the system or entity, influenced by external forces such as market trends, regulations, or environmental factors.',
    'Stable': 'Incremental change that maintains the core structure or identity, resulting in a state that remains recognizable over time.',
    'Transformational': 'Significant and fundamental change that alters the system or entity in a way that it becomes completely new or unrecognizable.',
    'Transactional': 'A one-time event or action that is implemented and concluded quickly, with immediate effects.',
    'Continuing': 'An ongoing process of change that evolves over time, requiring sustained effort and adaptation.',
    'Individual': 'Change initiated by a single person or a small group, often characterized by leadership or heroic efforts that drive the transformation.',
    'Community': 'Change that emerges from the collective action of a larger group or society, involving widespread participation and consensus.',
    'Passive': 'Change achieved through peaceful and non-confrontational means, such as dialogue, negotiation, or gradual reforms.',
    'Violent': 'Change that occurs through conflict, force, or aggressive actions, often involving revolutions, wars, or significant upheaval.',
    'Top Down': 'Change initiated by those in positions of authority or leadership, typically through directives, policies, or executive orders.',
    'Bottom Up': 'Change that starts at the grassroots level, driven by individuals or groups at the lower levels of an organization or society.',
    'Dominant': 'Change led by a single entity or group exerting control, often characterized by a hierarchical or authoritative approach.',
    'Partnership': 'Change that is driven by collaborative efforts and shared decision-making, emphasizing equality and mutual support among participants.',
    'Trend': 'Change that follows current patterns or fads, often temporary and reactive to the present environment.',
    'Vision': 'Change guided by a long-term strategic outlook, aiming for transformative outcomes that may reshape the future.',
    'Accidental': 'Change that results from unforeseen events or mistakes, leading to unexpected outcomes or innovations.',
    'Deliberate': 'Change that is carefully planned and executed, based on extensive research, strategy, and intentional actions.'
}

gradient_pairs = [
    ('Endogenous', 'Exogenous'),
    ('Stable', 'Transformational'),
    ('Transactional', 'Continuing'),
    ('Individual', 'Community'),
    ('Passive', 'Violent'),
    ('Top Down', 'Bottom Up'),
    ('Dominant', 'Partnership'),
    ('Trend', 'Vision'),
    ('Accidental', 'Deliberate')
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze_scenario', methods=['POST'])
def analyze_scenario():
    if not client:
        return jsonify({"error": "OpenAI API key is not set. Unable to analyze scenario."}), 500

    data: Dict[str, Any] = request.json or {}
    change_title: str = data.get('changeTitle', 'Untitled Change')
    gradient_values: List[Dict[str, Any]] = data.get('gradientValues', [])
    description: str = data.get('description', '')
    knowledge: str = data.get('knowledge', '')
    timeline: str = data.get('timeline', '')

    # Construct the prompt for OpenAI
    prompt = f"You are analyzing a change scenario titled '{change_title}'. This title is crucial for understanding the context of the change.\n\n"
    
    if description:
        prompt += f"Description: {description}\nThis description provides essential context for the change scenario. Use it to inform your baseline analysis.\n\n"
    
    if knowledge:
        prompt += f"Knowledge: {knowledge.capitalize()}\nThis indicates the scope of information to consider in your analysis.\n"
    
    if timeline:
        prompt += f"Timeline: {timeline.capitalize()}\nThis specifies the temporal context of the change. Adjust your analysis accordingly.\n"
    
    prompt += "\nDefinitions of Change Gradients:\n"
    for gradient in gradient_values:
        definition = gradient_definitions.get(gradient['gradient'], '')
        prompt += f"{gradient['gradient']}: {definition}\n"

    prompt += "\nImportant: The change gradients are organized into dependent pairs. Each pair represents opposite ends of a spectrum, and the total combined value for each pair must equal 100. The pairs are:\n"
    for pair in gradient_pairs:
        prompt += f"- {pair[0]} / {pair[1]}\n"

    prompt += "\nGuidelines for generating baseline values:\n"
    prompt += "1. Consider the context provided by the title, description, knowledge type, and timeline when assigning values.\n"
    prompt += "2. For pairs like Passive/Violent, consider the nature of the change. Most changes should lean heavily towards Passive unless the context strongly suggests otherwise.\n"
    prompt += "3. Ensure that your baseline values reflect a realistic and nuanced understanding of the change scenario.\n"

    prompt += "\nPlease perform the following steps:\n"
    prompt += "1. Establish your own baseline analysis of the change being examined by assigning a score (0-100) to each gradient based on the provided context and guidelines. Ensure that for each pair, the sum of the two values equals 100.\n"
    prompt += "2. Present your baseline analysis in the following format:\n"
    prompt += "BASELINE ANALYSIS:\n"
    for gradient in gradient_values:
        prompt += f"{gradient['gradient']}: [VALUE]\n"
    prompt += "\n"
    prompt += "3. Provide an overall summary of your findings, ensuring to address key insights. Label this section as OVERALL SUMMARY and present the output in paragraph form.\n"
    prompt += "4. Present your response in plain text. Do not use any Markdown formatting.\n"
    prompt += "5. Use proper spacing between paragraphs and sections for readability.\n"
    prompt += "6. Ensure there are blank lines between paragraphs and sections.\n"

    if knowledge == 'internal':
        prompt += "7. Focus primarily on the information provided in the title and description, using general knowledge only to interpret this information.\n"
    elif knowledge == 'public':
        prompt += "7. Incorporate accurate, publicly available information related to the change, balancing it with the provided description.\n"

    if timeline == 'past':
        prompt += "8. Analyze the historical impacts, outcomes, and significance of this change.\n"
    elif timeline == 'present':
        prompt += "8. Focus on current developments, ongoing impacts, and real-time analysis of this change.\n"
    elif timeline == 'future':
        prompt += "8. Emphasize potential outcomes, predictions, and hypothetical scenarios for this change.\n"

    try:
        # Make API call to OpenAI
        messages = [
            {"role": "system", "content": "You are an AI assistant analyzing change scenarios. Provide your analysis in plain text format without any Markdown. Use proper spacing and clear headings."},
            {"role": "user", "content": prompt}
        ]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=1000,
            n=1,
            temperature=0.05,
        )

        # Extract the generated text from the API response
        analysis = response.choices[0].message.content
        if analysis is not None:
            # Post-processing to ensure proper formatting
            analysis = analysis.strip()
            # Remove any potential Markdown formatting
            analysis = re.sub(r'[*#_`~]', '', analysis)
            # Ensure proper spacing between paragraphs
            analysis = re.sub(r'\n{3,}', '\n\n', analysis)
            # Ensure headings are followed by a blank line
            analysis = re.sub(r'(^|\n)([A-Z][^:\n]+:)(\n)(?!\n)', r'\1\2\n\n', analysis, flags=re.MULTILINE)

            # Post-processing to adjust baseline values
            baseline_match = re.search(r'BASELINE ANALYSIS:(.*?)(?:OVERALL SUMMARY|\Z)', analysis, re.DOTALL)
            if baseline_match:
                baseline_text = baseline_match.group(1)
                adjusted_baseline = adjust_baseline_values(baseline_text, change_title, description, knowledge, timeline)
                analysis = analysis.replace(baseline_text, adjusted_baseline)
        else:
            analysis = "No analysis generated."

        return jsonify({"analysis": analysis})
    except Exception as e:
        return jsonify({"error": f"An error occurred while analyzing the scenario: {str(e)}"}), 500

def adjust_baseline_values(baseline_text, change_title, description, knowledge, timeline):
    # Implement logic to adjust baseline values based on context
    # This is a placeholder function - you should implement the actual logic
    adjusted_text = baseline_text

    # Example adjustment: If the change is about peace or cooperation, ensure Passive is high
    if any(word in change_title.lower() + description.lower() for word in ['peace', 'cooperation', 'agreement']):
        adjusted_text = re.sub(r'Passive: (\d+)', 'Passive: 90', adjusted_text)
        adjusted_text = re.sub(r'Violent: (\d+)', 'Violent: 10', adjusted_text)

    # Add more adjustments based on the context, knowledge, and timeline

    return adjusted_text

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)