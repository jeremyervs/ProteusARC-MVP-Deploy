import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from typing import List, Dict, Any

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
    change_type: str = data.get('changeType', 'current')  # Default to 'current' if not provided

    # Input validation
    if not gradient_values:
        return jsonify({"error": "No gradient values provided."}), 400

    for gradient in gradient_values:
        value = gradient.get('value')
        if value is None or not (0 <= value <= 100):
            return jsonify({"error": f"Invalid value for {gradient['gradient']}. Please provide a number between 0 and 100."}), 400

    # Construct the prompt for OpenAI
    prompt = f"You are analyzing a {change_type} change scenario titled '{change_title}'.\n\n"
    prompt += "Definitions of Change Gradients:\n"
    for gradient in gradient_values:
        definition = gradient_definitions.get(gradient['gradient'], '')
        prompt += f"{gradient['gradient']}: {definition}\n"
    
    prompt += "\nUser's gradient values:\n"
    for gradient in gradient_values:
        prompt += f"{gradient['gradient']}: {gradient['value']}%\n"

    prompt += "\nPlease perform the following steps:\n"
    prompt += "1. Establish your own baseline analysis of the change being examined by assigning a score (0-100) to each gradient based on widely accepted current knowledge.\n"
    prompt += "2. Compare your baseline scores with the user's scores and assess the alignment.\n"
    prompt += "3. Explain any significant deviations in a clear and understandable manner.\n"
    prompt += "4. Craft a potential alternate scenario based on these deviations.\n"
    prompt += "5. Present your response efficiently yet sufficiently in plain text, using whitespace between paragraphs for readability. Do not use Markdown formatting."

    try:
        # Make API call to OpenAI
        messages = [
            {"role": "system", "content": "You are an AI assistant analyzing change scenarios."},
            {"role": "user", "content": prompt}
        ]

        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Using gpt-4o-mini as it's suitable for this task
            messages=messages,
            max_tokens=1000,
            n=1,
            temperature=0.7,
        )

        # Extract the generated text from the API response
        analysis = response.choices[0].message.content
        if analysis is not None:
            analysis = analysis.strip()
        else:
            analysis = "No analysis generated."

        return jsonify({"analysis": analysis})
    except Exception as e:
        return jsonify({"error": f"An error occurred while analyzing the scenario: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
