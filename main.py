import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from typing import List, Dict, Any
import re
import docx2txt

app = Flask(__name__)

# Set up OpenAI API key
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY is not set. Some features may not work.")
    client = None
else:
    client = OpenAI(api_key=OPENAI_API_KEY)

# Gradient definitions and pairs (existing code)
# ...

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/user-guide')
def user_guide():
    try:
        user_guide_content = docx2txt.process("GradiShape User Guide.docx")
        return render_template('user_guide.html', user_guide_content=user_guide_content)
    except Exception as e:
        return f"Error loading user guide: {str(e)}", 500

@app.route('/analyze_scenario', methods=['POST'])
def analyze_scenario():
    # Existing code for analyze_scenario
    # ...

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
