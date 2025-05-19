import pandas as pd
import numpy as np

# Define the parameters
state_name = "Maharashtra"
district_name = "Ahmednagar"
years = list(range(1997, 2025))
crops = ["maize", "wheat", "rice", "cotton", "sugarcane"]
seasons = ["rabi", "kharif", "whole year"]

# Define approximate yield factors (production per hectare)
yield_factors = {
    "maize": 3.0,
    "wheat": 2.5,
    "rice": 4.0,
    "cotton": 1.0,
    "sugarcane": 50.0
}

# Create a list to collect all records
records = []

# Generate data for every combination of year, season, and crop
for year in years:
    for season in seasons:
        for crop in crops:
            # Generate area between 1 and 100 hectares
            area = np.round(np.random.uniform(1, 100), 2)
            # Introduce a random factor (±10%) around the yield factor
            noise = np.random.uniform(0.9, 1.1)
            production = np.round(area * yield_factors[crop] * noise, 2)
            
            record = {
                "State_Name": state_name,
                "District_Name": district_name,
                "Crop_Year": year,
                "Season": season,
                "Crop": crop,
                "Area": area,
                "Production": production
            }
            records.append(record)

# Create a DataFrame from the records
df_synthetic = pd.DataFrame(records)

# Show the first few rows of the generated dataset
print(df_synthetic.head())

# Optionally, save the dataset to a CSV file
df_synthetic.to_csv("synthetic_agri_data.csv", index=False)