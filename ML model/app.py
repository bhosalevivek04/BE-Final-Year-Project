from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
import joblib
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.pipeline import Pipeline

app = Flask(__name__)
CORS(app)

# Load and preprocess data
def load_and_preprocess(file_name):
    df = pd.read_csv(file_name)
    
    # Clean data
    df = df.dropna(subset=["Production"])
    df = df[df["Area"] > 0]  # Remove entries with zero area
    
    # Convert to lowercase and strip whitespace
    for col in ["Season", "Crop", "District_Name"]:
        df[col] = df[col].str.strip().str.lower()
    
    return df

# Train and save models
def train_models(df):
    print("Starting model training...")

    # Feature engineering
    X = df[["Crop_Year", "Season", "Crop", "District_Name", "Area"]]
    y = df["Production"]

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[('cat', OneHotEncoder(handle_unknown='ignore'), ["Season", "Crop", "District_Name"])],
        remainder='passthrough'
    )

    # Model pipeline
    pipeline = Pipeline([('preprocessor', preprocessor),
                         ('regressor', RandomForestRegressor(random_state=42))])

    # Simpler hyperparameter tuning to reduce computation time
    param_grid = {
        'regressor__n_estimators': [100],
        'regressor__max_depth': [None],
        'regressor__min_samples_split': [2],
        'regressor__min_samples_leaf': [1]
    }

    print("Starting grid search with simplified hyperparameters...")
    grid_search = GridSearchCV(pipeline, param_grid, cv=3, scoring='neg_mean_squared_error')
    
    # Try running with a smaller dataset first for debugging
    # grid_search.fit(X_train[:500], y_train[:500])  # Uncomment to use a subset for testing
    grid_search.fit(X_train, y_train)

    # Save best model and preprocessor
    best_model = grid_search.best_estimator_
    print("Model training complete.")
    print("Best parameters:", grid_search.best_params_)

    # Save the model to disk
    joblib.dump(best_model, "optimized_production_model.pkl")

    # Evaluate the model
    y_pred = best_model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    print(f"Optimized Model - RMSE: {rmse:.2f}, R²: {r2:.2f}")

# Load models and metadata
try:
    model = joblib.load("optimized_production_model.pkl")
    print("Optimized model loaded successfully")
except FileNotFoundError:
    print("Training new optimized model...")
    df = load_and_preprocess("ML model/filtered_Ahmednagar_data.csv")
    train_models(df)
    model = joblib.load("optimized_production_model.pkl")

# Crop recommendation logic based on input area
def recommend_crop(area):
    if area > 100:
        return "Rice, Wheat"
    elif area > 50:
        return "Cotton, Sugarcane"
    else:
        return "Vegetables, Fruits"

@app.route("/api/yield-production", methods=["POST"])
def predict_yield():
    try:
        data = request.json
        required_fields = ["crop", "season", "year", "area", "district"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Clean inputs
        input_data = {
            "Crop_Year": int(data["year"]),
            "Season": data["season"].strip().lower(),
            "Crop": data["crop"].strip().lower(),
            "District_Name": data["district"].strip().lower(),
            "Area": float(data["area"])
        }

        # Create DataFrame
        X_pred = pd.DataFrame([input_data])

        # Predict
        prediction = model.predict(X_pred)[0]

        return jsonify({
            "prediction": round(prediction, 2),
            "units": "tons",
            "input_details": input_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/crop-recommendation", methods=["POST"])
def recommend_crop_route():
    try:
        data = request.json
        required_fields = ["area"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        area = float(data["area"])
        
        # Crop recommendation based on area
        recommended_crops = recommend_crop(area)

        return jsonify({
            "recommended_crops": recommended_crops,
            "input_area": area
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)