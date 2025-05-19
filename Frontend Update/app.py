from flask import Flask, request, jsonify
import google.generativeai as genai
import PIL.Image
import io
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Configure the Gemini API
API_KEY = "AIzaSyAIvURVJNLBSorIUjTZhY-TRolfy6rMIBk"  # Replace with your API key
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/diagnose', methods=['POST'])
def diagnose_plant_disease():
    """API endpoint to diagnose plant disease from an uploaded image."""
    try:
        # Get the uploaded image
        file = request.files['image']
        if not file:
            return jsonify({"error": "No image provided"}), 400

        # Open the image using PIL
        img = PIL.Image.open(io.BytesIO(file.read()))

        # Generate content using the Gemini API
        response = model.generate_content([
            "Analyze the plant image. Describe any potential diseases or abnormalities. If possible, provide a likely diagnosis. If the image appears healthy, state so. Try to be concise.",
            img
        ])
        
        # Extract and return the disease name
        response_text = response.text.split('.')[0]  # Extract the first sentence
        return jsonify({"disease": response_text.strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chatbot():
    """API endpoint for chatbot functionality."""
    try:
        # Get the user input from the request
        user_input = request.json.get('message')
        if not user_input:
            return jsonify({"error": "No message provided"}), 400

        # Generate a response using the Gemini API
        response = model.generate_content([
            f"Respond to the following message as a helpful chatbot: {user_input}"
        ])
        
        # Return the chatbot's response
        return jsonify({"response": response.text.strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)