from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import math
import random
from datetime import datetime

app = FastAPI(
    title="CampusBite AI Engine",
    description="India-Scale Campus Food Intelligence Engine (Demand Forecasting, Waste Prediction, Dynamic ETA & Owner Copilot)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ETAPredictionRequest(BaseModel):
    canteenId: str
    itemIds: List[str]
    queueLength: int = 1
    stationId: Optional[str] = None

class RecommendationRequest(BaseModel):
    studentId: Optional[str] = None
    collegeId: str
    hourOfDay: Optional[int] = 12
    dietaryPref: Optional[str] = "VEG"

class CopilotQueryRequest(BaseModel):
    canteenId: str
    prompt: str

class NLPSearchRequest(BaseModel):
    query: str
    collegeId: Optional[str] = None

@app.get("/api/v1/ai/health")
def health_check():
    return {
        "status": "online",
        "service": "CampusBite AI Engine",
        "timestamp": datetime.now().isoformat(),
        "models": {
            "demand_forecasting": "XGBoost-v2.1",
            "waste_risk": "RandomForest-v1.4",
            "eta_dynamic": "LinearRegression-Queued-v3",
            "recommendations": "Collaborative-Content-Hybrid-v2",
            "nlp_search": "Intent-Classifier-v1"
        }
    }

@app.get("/api/v1/ai/demand-forecast")
def get_demand_forecast(canteenId: str, date: Optional[str] = None):
    target_date = date or datetime.now().strftime("%Y-%m-%d")
    
    # Hourly demand curve simulation based on student meal schedules (Peak at 12-2 PM and 7-9 PM)
    hourly_curve = []
    for h in range(8, 22):
        if 12 <= h <= 14:
            base = random.randint(85, 130)
        elif 8 <= h <= 10:
            base = random.randint(45, 75)
        elif 18 <= h <= 20:
            base = random.randint(60, 95)
        else:
            base = random.randint(15, 35)
        hourly_curve.append({"hour": f"{h:02d}:00", "predictedOrders": base})
        
    prep_recommendations = [
        {"item": "Crispy Butter Masala Dosa", "recommendedQuantity": 110, "unit": "plates", "confidence": 0.94},
        {"item": "Paneer Butter Masala Thali", "recommendedQuantity": 85, "unit": "thalis", "confidence": 0.96},
        {"item": "Hyderabadi Chicken Biryani", "recommendedQuantity": 130, "unit": "plates", "confidence": 0.98},
        {"item": "Delhi Style Samosa", "recommendedQuantity": 200, "unit": "pieces", "confidence": 0.91},
        {"item": "Chocolate Cold Coffee", "recommendedQuantity": 90, "unit": "cups", "confidence": 0.89},
    ]

    return {
        "canteenId": canteenId,
        "date": target_date,
        "totalPredictedOrders": sum(item["predictedOrders"] for item in hourly_curve),
        "peakHours": ["12:00 PM - 1:30 PM", "7:30 PM - 8:30 PM"],
        "hourlyForecast": hourly_curve,
        "preparationPlan": prep_recommendations,
        "modelConfidence": 0.95
    }

@app.get("/api/v1/ai/waste-prediction")
def get_waste_prediction(canteenId: str):
    return {
        "canteenId": canteenId,
        "overallWasteRisk": "LOW_TO_MEDIUM",
        "predictedWasteKg": 3.4,
        "riskItems": [
            {
                "itemId": "item-idli-001",
                "itemName": "Steamed Idli Sambar",
                "riskLevel": "MEDIUM",
                "predictedUnsoldUnits": 12,
                "reason": "Slower demand post 11:00 AM breakfast window",
                "suggestedAction": "Create 20% Combo Discount with Cold Coffee after 11:30 AM"
            },
            {
                "itemId": "item-samosa-002",
                "itemName": "Samosa Chat",
                "riskLevel": "LOW",
                "predictedUnsoldUnits": 5,
                "reason": "Steady snack demand expected in evening shift",
                "suggestedAction": "Maintain current batch size"
            }
        ],
        "suggestedCombos": [
            {
                "comboName": "Student Afternoon Snack Pack",
                "items": ["Steamed Idli Sambar", "Cold Coffee"],
                "originalPrice": 110,
                "suggestedPrice": 90,
                "marginPercentage": 42.0
            }
        ]
    }

@app.post("/api/v1/ai/eta-predict")
def predict_eta(req: ETAPredictionRequest):
    base_item_prep = 8 # base 8 mins
    queue_factor = req.queueLength * 1.5
    estimated_mins = math.ceil(base_item_prep + queue_factor)
    
    return {
        "canteenId": req.canteenId,
        "queueLength": req.queueLength,
        "estimatedPrepTimeMinutes": estimated_mins,
        "confidenceScore": 0.93,
        "statusMessage": f"Estimated prep time: {estimated_mins} mins ({req.queueLength} orders ahead in queue)"
    }

@app.post("/api/v1/ai/recommendations")
def get_recommendations(req: RecommendationRequest):
    return {
        "studentId": req.studentId,
        "collegeId": req.collegeId,
        "recommendations": [
            {
                "itemName": "Paneer Butter Masala Combo Thali",
                "score": 0.98,
                "reason": "Top trending lunch thali at your college campus"
            },
            {
                "itemName": "Hyderabadi Dum Chicken Biryani",
                "score": 0.95,
                "reason": "Popular with students in your department"
            },
            {
                "itemName": "Crispy Butter Masala Dosa",
                "score": 0.91,
                "reason": "Fastest preparation time (8 mins)"
            }
        ]
    }

@app.post("/api/v1/ai/copilot")
def canteen_copilot(req: CopilotQueryRequest):
    prompt_lower = req.prompt.lower()
    
    if "prepare" in prompt_lower or "tomorrow" in prompt_lower or "plan" in prompt_lower:
        answer = "Based on historical Friday sales and upcoming campus lectures, prepare 130 Biryanis, 110 Masala Dosas, and 85 Paneer Thalis. Increase Samosa inventory by 20% for evening break."
    elif "profit" in prompt_lower or "margin" in prompt_lower or "highest" in prompt_lower:
        answer = "Your highest margin item is Thick Chocolate Cold Coffee (68% gross margin), followed by Crispy Butter Masala Dosa (58% gross margin). Promoting Cold Coffee in combos will boost daily gross profit."
    elif "waste" in prompt_lower or "spoilage" in prompt_lower:
        answer = "Waste risk is currently low (3.4 kg predicted today). Idli batter demand slows down after 11:30 AM; consider lowering morning batch sizes by 10%."
    else:
        answer = f"Analysis for query '{req.prompt}': Daily revenue is performing +14% above weekly campus benchmark. Average kitchen fulfillment time is optimal at 9.4 minutes per order."

    return {
        "canteenId": req.canteenId,
        "query": req.prompt,
        "answer": answer,
        "generatedAt": datetime.now().isoformat()
    }

@app.post("/api/v1/ai/nlp-search")
def nlp_search(req: NLPSearchRequest):
    q = req.query.lower()
    filters = {
        "maxPrice": None,
        "isVeg": None,
        "spiceLevel": None,
        "category": None,
        "keywords": []
    }
    
    if "under 100" in q or "under 50" in q or "cheap" in q or "budget" in q:
        filters["maxPrice"] = 100 if "under 100" in q else (50 if "under 50" in q else 80)
    if "veg" in q or "vegetarian" in q:
        filters["isVeg"] = True
    elif "non veg" in q or "chicken" in q:
        filters["isVeg"] = False
    if "spicy" in q:
        filters["spiceLevel"] = "HIGH"
    if "breakfast" in q:
        filters["category"] = "South Indian & Breakfast"
    elif "lunch" in q or "thali" in q:
        filters["category"] = "North Indian & Thalis"
    elif "snack" in q:
        filters["category"] = "Street Food & Snacks"

    return {
        "originalQuery": req.query,
        "parsedFilters": filters,
        "confidence": 0.94
    }
