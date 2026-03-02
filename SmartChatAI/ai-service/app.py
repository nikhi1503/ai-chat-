from flask import Flask, request, jsonify
import os
import sys
import json
from train import ChatbotModel
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
model = None

def initialize_model():
    """Initialize the chatbot model"""
    global model
    model = ChatbotModel()
    
    model_path = './model'
    if os.path.exists(model_path):
        print("Loading pre-trained model...")
        model.load_model(model_path)
    else:
        print("Training new model...")
        model.train('intents.json')
        model.save_model(model_path)
    
    print("✓ Model initialized successfully!")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'AI Service is running'})

@app.route('/predict', methods=['POST'])
def predict():
    """Predict intent and generate response"""
    try:
        data = request.get_json()
        user_input = data.get('text', '')
        
        if not user_input:
            return jsonify({'error': 'No text provided'}), 400
        
        result = model.predict(user_input)
        
        return jsonify({
            'response': result['response'],
            'intent': result['intent'],
            'confidence': result['confidence']
        })
    
    except Exception as e:
        print(f"Error in predict: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/retrain', methods=['POST'])
def retrain():
    """Retrain the model with updated intents"""
    try:
        global model
        model = ChatbotModel()
        model.train('intents.json')
        model.save_model('./model')
        return jsonify({'message': 'Model retrained successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    initialize_model()
    port = os.getenv('PORT', 5001)
    app.run(debug=True, port=int(port), host='0.0.0.0')
