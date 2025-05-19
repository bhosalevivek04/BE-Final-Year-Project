from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import json
from flask_cors import CORS 
from typing import Optional, Dict, Any

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

def log_transform(x):
    return np.log(x + 1)
# Load ML model
model = joblib.load('best_model.pkl')

class IrrigationAdvisor:
    def __init__(self, file_path='crop_data.json'):
        with open(file_path) as f:
            self.data = json.load(f)
    
    def get_crop_phases(self, crop_name: str, soil_type: str) -> Optional[Dict[str, Any]]:
        """Get all growth phases for a crop-soil combination"""
        for crop in self.data['crops']:
            if crop['crop_name'].lower() == crop_name.lower():
                for soil in crop['soil_types']:
                    if soil['soil_type'].lower() == soil_type.lower():
                        return {
                            'phases': soil['growth_phases'],
                            'total_cycle_days': sum(
                                (p['duration_days']['min'] + p['duration_days']['max'])/2 
                                for p in soil['growth_phases']
                            )
                        }
        return None

    def get_phase_recommendation(self, phases: list, days_since_planting: int) -> Dict[str, Any]:
        """Determine current growth phase based on plant age"""
        elapsed_days = 0
        for phase in phases:
            phase_min = phase['duration_days']['min']
            phase_max = phase['duration_days']['max']
            phase_avg = (phase_min + phase_max) / 2
            
            if days_since_planting <= (elapsed_days + phase_max):
                return {
                    'current_phase': phase['phase'],
                    'days_in_phase': f"{max(0, days_since_planting - elapsed_days)}/{phase_max}",
                    'irrigation_frequency': round(
                        (phase['irrigation_interval_days']['min'] + 
                         phase['irrigation_interval_days']['max']) / 2, 1
                    ),
                    'optimal_moisture': phase['optimal_moisture_m3_per_m3'],
                    'phase_progress': min(100, max(0, (days_since_planting - elapsed_days) / phase_max * 100))
                }
            elapsed_days += phase_avg
        
        # If beyond all phases, return last phase recommendations
        last_phase = phases[-1]
        return {
            'current_phase': last_phase['phase'] + " (completed)",
            'irrigation_frequency': round(
                (last_phase['irrigation_interval_days']['min'] + 
                 last_phase['irrigation_interval_days']['max']) / 2, 1
            ),
            'optimal_moisture': last_phase['optimal_moisture_m3_per_m3'],
            'phase_progress': 100
        }

irrigation_advisor = IrrigationAdvisor()

@app.route('/api/predict-yield', methods=['POST'])
def predict_yield():
    try:
        data = request.json
        print("Received Data:", data)  # Debugging output

        required_fields = ['Crop_Year', 'Season', 'Crop', 'Area', 'Soil_Type']
        if not all(field in data for field in required_fields):
            return jsonify({"error": f"Missing required fields: {required_fields}"}), 400

        # Validate days_since_planting
        days_since_planting = data.get('days_since_planting', 0)
        try:
            days_since_planting = int(days_since_planting)
        except ValueError:
            return jsonify({"error": "days_since_planting must be an integer"}), 400
        
        # Validate Crop & Soil Type
        crop_data = irrigation_advisor.get_crop_phases(data['Crop'], data['Soil_Type'])
        if not crop_data:
            return jsonify({"error": "Invalid crop/soil combination"}), 400

        # Create DataFrame for ML Prediction
        input_df = pd.DataFrame([{
            'Crop_Year': int(data['Crop_Year']),
            'Season': str(data['Season']),
            'Crop': str(data['Crop']),
            'Area': float(data['Area'])
        }])
        print("Input DataFrame:", input_df)

        # Ensure Model is Loaded Correctly
        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        # Make Prediction
        log_pred = model.predict(input_df)
        prediction = np.exp(log_pred) - 1
        print("Predicted Yield:", prediction)

        # Get Irrigation Recommendation
        irrigation_rec = irrigation_advisor.get_phase_recommendation(crop_data['phases'], days_since_planting)

        # Return Response
        response = {
            "prediction": {
                "crop": data['Crop'],
                "season": data['Season'],
                "yield_tonnes": round(prediction[0], 2),
                "total_cycle_days": round(crop_data['total_cycle_days'], 1)
            },
            "irrigation_recommendation": irrigation_rec
        }
        print("Response:", response)
        return jsonify(response)

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)