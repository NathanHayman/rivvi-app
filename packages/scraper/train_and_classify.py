# File: train_and_predict.py

import sys
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import joblib

# Load the dataset from a JSON Lines file.
def load_data(file_path):
    return pd.read_json(file_path, lines=True)

def train_model(X_train, y_train, validation_data_path, model_path):
    # Training logic
    model = make_pipeline(TfidfVectorizer(), MultinomialNB())
    model.fit(X_train, y_train)
    joblib.dump(model, model_path)

def predict_labels(scraped_data_path, model_path, output_path):
    # Load the model and new data for prediction
    model = joblib.load(model_path)
    new_data = load_data(scraped_data_path)
    predictions = model.predict(new_data['text'])
    new_data['label'] = predictions
    new_data.to_json(output_path, orient='records', lines=True)

if __name__ == '__main__':
    action = sys.argv[1]  # Should be either 'train' or 'predict'
    
    if action == 'train':
        training_data_path = sys.argv[2]
        validation_data_path = sys.argv[3]
        model_path = sys.argv[4]
        # Load and split the training data
        training_data = load_data(training_data_path)
        X_train, y_train = training_data['text'], training_data['label']
        # Train the model
        train_model(X_train, y_train, validation_data_path, model_path)
    
    elif action == 'predict':
        scraped_data_path = sys.argv[2]
        model_path = sys.argv[3]
        output_path = sys.argv[4]
        predict_labels(scraped_data_path, model_path, output_path)
    else:
        raise ValueError('Invalid action. Use "train" or "predict".')