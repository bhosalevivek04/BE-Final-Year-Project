import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder, FunctionTransformer, RobustScaler
from sklearn.compose import ColumnTransformer
import joblib  # for saving the model

# Load the dataset
df = pd.read_csv('final_ahmednagar.csv')

# Remove constant columns (State and District)
df = df.drop(['State_Name', 'District_Name'], axis=1)

# --- Outlier Handling ---
# Remove extreme outliers in 'Production' using the 1st and 99th percentiles
lower_bound = df['Production'].quantile(0.01)
upper_bound = df['Production'].quantile(0.99)
df = df[(df['Production'] >= lower_bound) & (df['Production'] <= upper_bound)]

# --- Target Transformation ---
# Apply log transformation to stabilize variance
df['log_Production'] = np.log(df['Production'] + 1)

# Prepare features and target
X = df.drop(['Production', 'log_Production'], axis=1)
y = df['log_Production']

# --- Preprocessing ---
# Define a function to log-transform the 'Area' feature
def log_transform(x):
    return np.log(x + 1)

# Create a ColumnTransformer:
# - OneHotEncode categorical features.
# - Log-transform and robust-scale 'Area'.
# - Robust-scale 'Crop_Year'.
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), ['Season', 'Crop']),
        ('log_area', Pipeline([
            ('log', FunctionTransformer(log_transform)),
            ('scaler', RobustScaler())
        ]), ['Area']),
        ('num', RobustScaler(), ['Crop_Year'])
    ]
)

# --- Build Pipeline ---
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('rf', RandomForestRegressor(random_state=42, n_jobs=-1))
])

# --- Split Data ---
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --- Hyperparameter Tuning ---
param_grid = {
    'rf__n_estimators': [100, 200],
    'rf__max_depth': [5, 7, 10],
    'rf__min_samples_split': [5, 10, 15],
    'rf__min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='r2', n_jobs=-1)
grid_search.fit(X_train, y_train)
best_model = grid_search.best_estimator_
print("Best parameters:", grid_search.best_params_)

# --- Evaluate the Model ---
# Predict on test set (predictions are on the log scale)
y_pred_log = best_model.predict(X_test)
# Convert predictions back to original scale
y_pred = np.exp(y_pred_log) - 1
y_test_actual = np.exp(y_test) - 1

print(f"MAE: {mean_absolute_error(y_test_actual, y_pred):.2f}")
print(f"MSE: {mean_squared_error(y_test_actual, y_pred):.2f}")
print(f"R² Score: {r2_score(y_test_actual, y_pred):.2f}")

# --- Cross-Validation ---
cv_scores = cross_val_score(best_model, X_train, y_train, cv=5, scoring='r2')
print("CV R² scores:", cv_scores)
print("Mean CV R² score:", np.mean(cv_scores))

# --- Residual Plot ---
residuals = y_test_actual - y_pred
plt.figure(figsize=(8,6))
plt.scatter(y_pred, residuals, alpha=0.7)
plt.axhline(0, color='red', linestyle='--')
plt.xlabel("Predicted Production")
plt.ylabel("Residuals")
plt.title("Residual Plot")
# plt.show()

# --- Feature Importance ---
# Manually build feature names
# 1. Get feature names from the OneHotEncoder for categorical features.
cat_feature_names = best_model.named_steps['preprocessor'].named_transformers_['cat'].get_feature_names_out(['Season', 'Crop'])
# 2. Define names for the 'log_area' and 'Crop_Year' features.
log_area_names = ['log_Area']
num_names = ['Crop_Year']
# Concatenate feature names in the order defined in ColumnTransformer.
all_feature_names = np.concatenate([cat_feature_names, log_area_names, num_names])

# Extract and print top 5 feature importances
feature_importances = best_model.named_steps['rf'].feature_importances_
sorted_indices = np.argsort(feature_importances)[::-1]
top_features = {all_feature_names[i]: feature_importances[i] for i in sorted_indices[:5]}
print("Top 5 features:")
print(top_features)

# --- Example Prediction ---
new_data = pd.DataFrame({
    'Crop_Year': [2025],
    'Season': ['Kharif'],
    'Crop': ['Wheat'],
    'Area': [15000]
})
predicted_log = best_model.predict(new_data)
predicted_production = np.exp(predicted_log) - 1
print(f"Predicted Production: {predicted_production[0]:.2f}")

# --- Save the Model ---
# Save the best model pipeline as a pickle file for future use
joblib.dump(best_model, "best_model.pkl")
print("Model saved as best_model.pkl")