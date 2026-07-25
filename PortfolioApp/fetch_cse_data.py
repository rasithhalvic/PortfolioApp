import requests
import json
import os

def fetch_and_save_data():
    print("Starting CSE data fetch...")
    # Using the approved production-safe endpoint for today's share prices
    url = "https://www.cse.lk/api/todaySharePrice"
    
    try:
        # The CSE API requires a POST request for this endpoint
        response = requests.post(url)
        response.raise_for_status()
        data = response.json()
        
        # Ensure the public folder exists
        os.makedirs("frontend/public", exist_ok=True)
        
        # Save the data into a JSON file inside the frontend's public folder
        file_path = "frontend/public/market_data.json"
        with open(file_path, "w") as f:
            json.dump(data, f)
            
        print(f"Successfully saved CSE data to {file_path}")
        
    except Exception as e:
        print(f"CRITICAL ERROR fetching data: {e}")

if __name__ == "__main__":
    fetch_and_save_data()