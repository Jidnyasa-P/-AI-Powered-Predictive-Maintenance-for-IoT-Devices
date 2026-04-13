from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# Path to the trained model
MODEL_PATH = 'models/predictive_maintenance_model.pkl'

def load_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    return None

model = load_model()

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"error": "Model not found. Please run train_model.py first."}), 500
    
    try:
        data = request.get_json()
        
        # Extract features
        temp = data.get('temperature')
        vib = data.get('vibration')
        curr = data.get('current')
        
        if None in [temp, vib, curr]:
            return jsonify({"error": "Missing required fields: temperature, vibration, current"}), 400
            
        # Prepare for prediction
        features = np.array([[temp, vib, curr]])
        prediction = model.predict(features)
        
        result = "Failure Predicted!" if prediction[0] == 1 else "Machine is running normally."
        
        return jsonify({
            "status": "success",
            "prediction": result,
            "failure_code": int(prediction[0])
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "online", "model_loaded": model is not None})

if __name__ == '__main__':
    print("🔌 Predictive Maintenance API starting on http://localhost:5000")
    app.run(debug=True, port=5000)
