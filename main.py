import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from typing import List, Dict, Any
import re
from docx import Document

app = Flask(__name__)

# Existing code...

@app.route('/user-guide')
def user_guide():
    try:
        doc = Document('GradiShape User Guide.docx')
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return '<br>'.join(full_text)
    except Exception as e:
        return f"Error reading user guide: {str(e)}"

# Rest of the existing code...

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
