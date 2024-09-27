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

# Updated gradient definitions
gradient_definitions = {
    'EN(P1)': 'Change that originates from within the system or entity, driven by internal factors such as organizational policies, personal motivations, or inherent dynamics.',
    'EX(P2)': 'Change that originates from outside the system or entity, influenced by external forces such as market trends, regulations, or environmental factors.',
    'ST(P3)': 'Incremental change that maintains the core structure or identity, resulting in a state that remains recognizable over time.',
    'TR(P4)': 'Significant and fundamental change that alters the system or entity in a way that it becomes completely new or unrecognizable.',
    'TX(P5)': 'A one-time event or action that is implemented and concluded quickly, with immediate effects.',
    'CN(P6)': 'An ongoing process of change that evolves over time, requiring sustained effort and adaptation.',
    'IN(P7)': 'Change initiated by a single person or a small group, often characterized by leadership or heroic efforts that drive the transformation.',
    'CO(P8)': 'Change that emerges from the collective action of a larger group or society, involving widespread participation and consensus.',
    'PA(P9)': 'Change achieved through peaceful and non-confrontational means, such as dialogue, negotiation, or gradual reforms.',
    'VI(P10)': 'Change that occurs through conflict, force, or aggressive actions, often involving revolutions, wars, or significant upheaval.',
    'TD(P11)': 'Change initiated by those in positions of authority or leadership, typically through directives, policies, or executive orders.',
    'BU(P12)': 'Change that starts at the grassroots level, driven by individuals or groups at the lower levels of an organization or society.',
    'DO(P13)': 'Change led by a single entity or group exerting control, often characterized by a hierarchical or authoritative approach.',
    'PT(P14)': 'Change that is driven by collaborative efforts and shared decision-making, emphasizing equality and mutual support among participants.',
    'TN(P15)': 'Change that follows current patterns or fads, often temporary and reactive to the present environment.',
    'VI(P16)': 'Change guided by a long-term strategic outlook, aiming for transformative outcomes that may reshape the future.',
    'AC(P17)': 'Change that results from unforeseen events or mistakes, leading to unexpected outcomes or innovations.',
    'DE(P18)': 'Change that is carefully planned and executed, based on extensive research, strategy, and intentional actions.'
}

# Rest of the Python code remains the same
# ...

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
