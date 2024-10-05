import os
from flask import Flask, render_template, request, jsonify
import openai  # Changed from 'from openai import OpenAI' to 'import openai'
from typing import List, Dict, Any
import re

app = Flask(__name__)

# Set up OpenAI API key
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY is not set. Some features may not work.")
    openai.api_key = None  # Changed 'client = None' to 'openai.api_key = None'
else:
    openai.api_key = OPENAI_API_KEY  # Set the API key for 'openai'

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

# Advanced Elements definitions
advanced_elements_definitions = {
    'Description': {
        'definition': 'A larger text box where users can provide additional details and nuances about the change.',
        'purpose': 'Offers the AI model more context to enhance its baseline analysis and summary.'
    },
    'Knowledge': {
        'Internal': {
            'definition': "Indicates the change is unique to the user's context and not publicly known.",
            'behavior': 'The AI must rely primarily on the Title of Change and Description provided by the user, using general world knowledge only to better understand the unique information.'
        },
        'Public': {
            'definition': 'Indicates the change is generally known in the public sphere.',
            'behavior': 'The AI should rely primarily on accurate, publicly available information about the change.'
        }
    },
    'Timeline': {
        'Past': {
            'definition': 'The change occurred in the past.',
            'behavior': 'The AI should analyze the change as a historical event.'
        },
        'Present': {
            'definition': 'The change is currently happening.',
            'behavior': 'The AI should analyze the change as an ongoing current event.'
        },
        'Future': {
            'definition': 'The change is a projected or imagined future scenario.',
            'behavior': 'The AI should analyze the change as a projected or imagined future scenario.'
        }
    }
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
    if not openai.api_key:
        return jsonify({"error": "OpenAI API key is not set. Unable to analyze scenario."}), 500

    data: Dict[str, Any] = request.json or {}
    change_title: str = data.get('changeTitle', 'Untitled Change')
    gradient_values: List[Dict[str, Any]] = data.get('gradientValues', [])
    change_description: str = data.get('changeDescription', '')
    knowledge_type: str = data.get('knowledgeType', '')
    timeline: str = data.get('timeline', '')

    # Construct the prompt for OpenAI
    prompt = f"Title of Change: {change_title}\n"

    if change_description:
        prompt += f"\nDescription:\n{change_description}\n"

    if knowledge_type:
        knowledge_def = advanced_elements_definitions['Knowledge'][knowledge_type]['definition']
        knowledge_behavior = advanced_elements_definitions['Knowledge'][knowledge_type]['behavior']
        prompt += f"\nKnowledge Type: {knowledge_type}\nDefinition: {knowledge_def}\nAI Behavior: {knowledge_behavior}\n"

    if timeline:
        timeline_def = advanced_elements_definitions['Timeline'][timeline]['definition']
        timeline_behavior = advanced_elements_definitions['Timeline'][timeline]['behavior']
        prompt += f"\nTimeline: {timeline}\nDefinition: {timeline_def}\nAI Behavior: {timeline_behavior}\n"

    prompt += "\nDefinitions of Change Gradients:\n"
    for gradient in gradient_values:
        definition = gradient_definitions.get(gradient['gradient'], '')
        prompt += f"{gradient['gradient']}: {definition}\n"

    prompt += "\nImportant Notes:\n"
    prompt += "- The change gradients are organized into dependent pairs. Each pair represents opposite ends of a spectrum, and the total combined value for each pair must equal 100.\n"
    prompt += "Gradient Pairs:\n"
    for pair in gradient_pairs:
        prompt += f"- {pair[0]} / {pair[1]}\n"

    # Enhanced instructions to the AI
    prompt += (
        "\nPlease perform the following steps:\n"
        "1. **Baseline Analysis**:\n"
        "- Assign a score (0-100) to each gradient based on the provided information.\n"
        "- **You must consider the Title of Change, Description, Knowledge Type, and Timeline in your analysis.**\n"
        "- For each gradient pair, ensure the sum of the two values equals 100.\n"
        "- Present this section with clear labels and scores for each gradient.\n\n"
        "2. **Overall Summary**:\n"
        "- Provide an overall summary of your findings, addressing key insights.\n"
        "- **Explicitly reference how the Description, Knowledge Type, and Timeline influenced your analysis.**\n"
        "- Present this section in paragraph form.\n\n"
        "3. **Context Influence**:\n"
        "- Explain in detail how the additional context from the Description, Knowledge Type, and Timeline influenced your baseline analysis and overall summary.\n"
        "- **Ensure that you directly tie specific aspects of the advanced options to your analysis decisions.**\n\n"
        "Formatting Guidelines:\n"
        "- Present your response efficiently yet sufficiently in plain text.\n"
        "- Do not use any Markdown formatting.\n"
        "- Use proper spacing between paragraphs and sections for readability.\n"
        "- Use clear headings (in plain text) for each section, followed by a colon.\n"
        "- Ensure there are blank lines between paragraphs and sections.\n"
    )

    try:
        # Make API call to OpenAI
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an AI assistant analyzing change scenarios. "
                    "You must thoroughly incorporate the provided Title of Change, Description, Knowledge Type, and Timeline into your analysis. "
                    "Adhere strictly to the context provided and do not introduce external information unless Knowledge Type is 'Public'. "
                    "Provide your analysis in plain text format without any Markdown. "
                    "Use proper spacing and clear headings."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use 'gpt-3.5-turbo' or 'gpt-4' if available
            messages=messages,
            max_tokens=1500,
            n=1,
            temperature=0.2,
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
        else:
            analysis = "No analysis generated."

        return jsonify({"analysis": analysis})
    except Exception as e:
        return jsonify({"error": f"An error occurred while analyzing the scenario: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
