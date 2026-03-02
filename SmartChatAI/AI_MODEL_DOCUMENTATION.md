# AI Model Training Documentation

## Overview

The SmartChat AI chatbot uses a machine learning approach to classify user intents and generate appropriate responses. This document explains the training process, model architecture, and preprocessing techniques.

## Model Architecture

### Algorithm: Logistic Regression
- **Type**: Linear classifier
- **Training Method**: Stochastic Gradient Descent (SGD)
- **Regularization**: L2 (Ridge)
- **Multi-class**: One-vs-Rest
- **Max Iterations**: 1000

### Feature Extraction: TF-IDF
- **Max Features**: 500 most important features
- **N-gram Range**: (1, 2) - considers individual words and two-word phrases
- **Lowercase**: True
- **Stop Words**: Removed (English)
- **Min Document Frequency**: 1
- **Max Document Frequency**: 1.0

## Text Preprocessing Pipeline

### Step 1: Lowercasing
Converts all text to lowercase to normalize inputs.
```
Input:  "Hello World"
Output: "hello world"
```

### Step 2: Punctuation Removal
Removes special characters while keeping letters and numbers.
```
Input:  "How's it going?"
Output: "Hows it going"
```

### Step 3: Tokenization
Splits text into individual words.
```
Input:  "What is your name"
Output: ["What", "is", "your", "name"]
```

### Step 4: Stopword Removal
Removes common English words that don't add much meaning.
```
Common stopwords: "the", "is", "a", "and", "an", "in", "at", etc.
Input:  ["What", "is", "your", "name"]
Output: ["What", "your", "name"]  # "is" removed
```

### Step 5: Lemmatization
Converts words to their base/root form.
```
Input:  ["running", "ran", "runs"]
Output: ["run", "run", "run"]

Input:  ["better"]
Output: ["good"]

Input:  ["studying"]
Output: ["study"]
```

### Step 6: Vectorization (TF-IDF)
Converts text to numerical feature vectors.
```
TF (Term Frequency) = (count of word in document) / (total words in document)
IDF (Inverse Document Frequency) = log(total documents / documents containing word)
TF-IDF = TF × IDF

Example:
Document: ["hello", "world", "hello"]
hello: TF = 2/3 ≈ 0.67
world: TF = 1/3 ≈ 0.33
```

## Training Process

### 1. Data Preparation
```
Total Intents: 10
Total Patterns: 100+
Total Unique Tokens: 500+ (limited to 500 by TF-IDF)
```

### 2. Feature Extraction
- Preprocess all training patterns
- Build TF-IDF vocabulary
- Transform patterns to feature vectors

### 3. Model Training
- Train LogisticRegression classifier
- Learn decision boundaries for each intent
- Calculate confidence scores

### 4. Model Persistence
- Save vectorizer (vocabulary and IDF weights)
- Save classifier (trained coefficients and intercepts)
- Use joblib for serialization

## Intent Classification Examples

### Example 1: Greeting
```
User Input: "Hi there!"
Preprocessing: "hi" → "hi"
Vectorization: [0.0, 0.0, ..., 0.8, ..., 0.0]  # high weight on greeting features
Prediction: intent="greeting", confidence=0.95
Response: "Hello! How can I assist you today?"
```

### Example 2: Education
```
User Input: "Tell me about machine learning"
Preprocessing: "tell machine learning"
Vectorization: [0.0, ..., 0.7, 0.6, ..., 0.0]  # education-related features
Prediction: intent="education", confidence=0.87
Response: "Machine Learning is a subset of AI that enables systems to learn..."
```

### Example 3: Out of Scope
```
User Input: "What's the stock price today?"
Preprocessing: "stock price today"
Vectorization: [0.1, 0.2, ..., 0.0]  # low confidence on all intents
Prediction: Low confidence score
Response: "I'm not sure I understand. Could you rephrase that?"
```

## Model Performance Metrics

### Training Data Statistics
- **Total Samples**: 100+ patterns
- **Average Samples per Intent**: 10
- **Vocabulary Size**: 500 features
- **Training Time**: < 100ms
- **Model Size**: ~500KB

### Inference Performance
- **Average Inference Time**: 50-100ms
- **Throughput**: 10-20 requests/second per core
- **Confidence Threshold**: 0.3 (below 30% = fallback response)

## Extending the Model

### Adding New Intents

Edit `intents.json`:
```json
{
  "intent": "weather",
  "patterns": [
    "What's the weather like",
    "Is it raining",
    "Tell me the weather",
    "What's the temperature"
  ],
  "responses": [
    "I don't have access to real-time weather data...",
    "Let me tell you about weather forecasting..."
  ]
}
```

### Retraining the Model
```bash
# Update intents.json
nano intents.json

# Retrain
python train.py

# Or via API
curl -X POST http://localhost:5001/retrain
```

## Hyperparameter Tuning

### Current Settings
```python
TfidfVectorizer(
    max_features=500,        # Top 500 features
    ngram_range=(1, 2),     # Unigrams + Bigrams
    lowercase=True,
    stop_words='english'
)

LogisticRegression(
    max_iter=1000,          # Number of iterations
    random_state=42         # Reproducibility
)
```

### Optimization Opportunities
1. **Increase max_features** (500→1000) for better accuracy but slower inference
2. **Adjust ngram_range** to (1, 3) for capturing longer phrases
3. **Fine-tune regularization**: Add `C` parameter (default=1.0)
4. **Increase max_iter** if model doesn't converge

## Advanced Techniques

### Transfer Learning
For better performance, consider using pre-trained models:
- **BERT**: Bidirectional Encoder Representations from Transformers
- **GPT**: Generative Pre-trained Transformer
- **RoBERTa**: Robustly Optimized BERT

### Ensemble Methods
Combine multiple models:
```python
from sklearn.ensemble import VotingClassifier

models = [LogisticRegression(), SVC(), RandomForestClassifier()]
ensemble = VotingClassifier(estimators=[(name, model) for name, model in ...])
```

### Active Learning
Improve model by learning from user corrections:
1. User says prediction is wrong
2. Admin updates training data
3. Model retrains with new examples
4. Confidence improves over time

## Evaluation Metrics

### Confusion Matrix
Shows true positives, false positives, etc. for each intent.

### Precision & Recall
- **Precision**: Of predicted intents, how many were correct?
- **Recall**: Of actual intents, how many did we find?

### F1-Score
Harmonic mean of precision and recall.

### Confidence Calibration
- **Ideal**: High confidence = high accuracy
- **Current**: Uses 0.3 threshold to avoid overconfident wrong predictions

## Troubleshooting

### Low Accuracy
1. Add more training examples
2. Check for data quality issues
3. Adjust preprocessing (e.g., min word length)
4. Try different algorithms (SVM, Neural Networks)

### Biased Predictions
1. Balance training data across intents
2. Use class weights in training
3. Collect more diverse examples

### Slow Inference
1. Reduce max_features
2. Use simpler model (LogisticRegression is already fast)
3. Implement caching for common queries
4. Use GPU acceleration

## Best Practices

1. **Always preprocess consistently**: Use same preprocessing in training and inference
2. **Monitor performance**: Track accuracy over time as intents are added
3. **Version control models**: Save model versions with training metadata
4. **Collect feedback**: Log predictions and corrections for retraining
5. **Regular updates**: Retrain monthly with new conversation data
6. **Documentation**: Keep intents.json well-documented
7. **Testing**: Test edge cases and unusual inputs

## References

- NLTK Documentation: https://www.nltk.org/
- Scikit-learn: https://scikit-learn.org/
- TF-IDF Explanation: https://en.wikipedia.org/wiki/Tf%E2%80%93idf
- NLP Preprocessing: https://www.geeksforgeeks.org/nlp-text-preprocessing/

---

**Last Updated**: March 2, 2026
**Model Version**: 1.0
**Training Completed**: Yes ✓
