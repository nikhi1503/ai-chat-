import json
import re
import string
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os

# Download NLTK data
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

class ChatbotModel:
    def __init__(self):
        self.vectorizer = None
        self.classifier = None
        self.intents = None
        self.lemmatizer = WordNetLemmatizer()
        self.stopwords = set(stopwords.words('english'))
        
    def preprocess_text(self, text):
        """
        Preprocess text by lowercasing, removing punctuation, tokenizing,
        removing stopwords, and lemmatizing.
        """
        # Lowercase
        text = text.lower()
        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))
        # Tokenize
        tokens = word_tokenize(text)
        # Remove stopwords and lemmatize
        tokens = [self.lemmatizer.lemmatize(word) for word in tokens 
                 if word not in self.stopwords and len(word) > 2]
        return ' '.join(tokens)
    
    def load_intents(self, filepath):
        """Load intents from JSON file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            self.intents = json.load(f)
        print(f"Loaded {len(self.intents)} intents")
    
    def prepare_training_data(self):
        """Prepare training data from intents"""
        patterns = []
        labels = []
        
        for intent in self.intents:
            intent_name = intent['intent']
            for pattern in intent['patterns']:
                processed_pattern = self.preprocess_text(pattern)
                patterns.append(processed_pattern)
                labels.append(intent_name)
        
        print(f"Total training samples: {len(patterns)}")
        return patterns, labels
    
    def train(self, intents_filepath):
        """Train the chatbot model"""
        print("Starting model training...")
        
        # Load intents
        self.load_intents(intents_filepath)
        
        # Prepare training data
        patterns, labels = self.prepare_training_data()
        
        # Vectorize the patterns
        print("Vectorizing text data using TF-IDF...")
        self.vectorizer = TfidfVectorizer(
            max_features=500,
            ngram_range=(1, 2),
            lowercase=True,
            stop_words='english'
        )
        X = self.vectorizer.fit_transform(patterns)
        
        # Train classifier
        print("Training Logistic Regression classifier...")
        self.classifier = LogisticRegression(max_iter=1000, random_state=42)
        self.classifier.fit(X, labels)
        
        print("✓ Model training completed!")
    
    def save_model(self, model_dir='./model'):
        """Save the trained model"""
        os.makedirs(model_dir, exist_ok=True)
        joblib.dump(self.vectorizer, os.path.join(model_dir, 'vectorizer.pkl'))
        joblib.dump(self.classifier, os.path.join(model_dir, 'classifier.pkl'))
        print(f"✓ Model saved to {model_dir}")
    
    def load_model(self, model_dir='./model'):
        """Load the trained model"""
        self.vectorizer = joblib.load(os.path.join(model_dir, 'vectorizer.pkl'))
        self.classifier = joblib.load(os.path.join(model_dir, 'classifier.pkl'))
        # Also load intents
        self.load_intents('intents.json')
        print(f"✓ Model loaded from {model_dir}")
    
    def predict(self, user_input):
        """Predict intent and generate response"""
        # Preprocess input
        processed_input = self.preprocess_text(user_input)
        
        # Vectorize
        X = self.vectorizer.transform([processed_input])
        
        # Predict intent
        intent = self.classifier.predict(X)[0]
        confidence = self.classifier.predict_proba(X).max()
        
        # Find intent details
        intent_data = next((i for i in self.intents if i['intent'] == intent), None)
        
        if intent_data and confidence > 0.15:
            response = np.random.choice(intent_data['responses'])
        else:
            response = "I'm not sure I understand. Could you rephrase that?"
        
        return {
            'intent': intent,
            'response': response,
            'confidence': float(confidence)
        }

if __name__ == '__main__':
    # Initialize and train model
    model = ChatbotModel()
    model.train('intents.json')
    model.save_model()
    
    # Test predictions
    print("\n" + "="*50)
    print("Testing model predictions:")
    print("="*50)
    
    test_inputs = [
        "Hello!",
        "How are you?",
        "What's your name?",
        "Tell me about Python",
        "Thanks for helping"
    ]
    
    for test_input in test_inputs:
        result = model.predict(test_input)
        print(f"\nUser: {test_input}")
        print(f"Intent: {result['intent']}")
        print(f"Confidence: {result['confidence']:.2f}")
        print(f"Bot: {result['response']}")
