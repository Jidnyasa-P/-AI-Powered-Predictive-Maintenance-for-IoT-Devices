import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

def generate_dummy_data(samples=1000):
    """Simulates IoT sensor data for training."""
    np.random.seed(42)
    
    # Normal data
    temp_normal = np.random.normal(40, 5, samples // 2)
    vib_normal = np.random.normal(2, 0.5, samples // 2)
    curr_normal = np.random.normal(10, 2, samples // 2)
    fail_normal = np.zeros(samples // 2)
    
    # Failure data (High temp, high vibration, or erratic current)
    temp_fail = np.random.normal(85, 10, samples // 2)
    vib_fail = np.random.normal(8, 2, samples // 2)
    curr_fail = np.random.normal(25, 5, samples // 2)
    fail_fail = np.ones(samples // 2)
    
    data = pd.DataFrame({
        'temperature': np.concatenate([temp_normal, temp_fail]),
        'vibration': np.concatenate([vib_normal, vib_fail]),
        'current': np.concatenate([curr_normal, curr_fail]),
        'failure': np.concatenate([fail_normal, fail_fail])
    })
    
    # Shuffle
    data = data.sample(frac=1).reset_index(drop=True)
    return data

def train():
    print("🚀 Starting Model Training...")
    
    # Create directories if they don't exist
    os.makedirs('data', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    # Generate and save dataset
    data = generate_dummy_data()
    data.to_csv('data/iot_sensor_data.csv', index=False)
    print("✅ Dataset generated and saved to data/iot_sensor_data.csv")
    
    # Preprocess
    X = data[['temperature', 'vibration', 'current']]
    y = data['failure']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"📊 Model Accuracy: {accuracy * 100:.2f}%")
    
    # Save Model
    joblib.dump(model, 'models/predictive_maintenance_model.pkl')
    print("💾 Model saved to models/predictive_maintenance_model.pkl")

if __name__ == "__main__":
    train()
