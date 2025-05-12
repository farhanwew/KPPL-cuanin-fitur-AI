from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from fastapi.responses import FileResponse
import httpx
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY not found in environment variables")

app = FastAPI(
    title="Cuan.in API",
    description="API untuk rekomendasi bisnis UMKM yang personalized",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class BusinessProfile(BaseModel):
    business_interest: str = Field(..., description="Minat bisnis pengguna")
    target_market: str = Field(..., description="Target pasar yang diinginkan")
    description: str = Field(..., description="Deskripsi usaha yang diinginkan")
    email: EmailStr = Field(..., description="Email pengguna")

class RecommendationResponse(BaseModel):
    primary_recommendation: Dict[str, Any]
    alternative_recommendations: List[Dict[str, Any]]
    success_factors: List[str]
    challenges: List[str]
    next_steps: List[str]

# API endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to Cuan.in API - Rekomendasi Bisnis UMKM"}


@app.get("/favicon.ico")
async def favicon():
    return FileResponse("static/favicon.ico")

@app.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(profile: BusinessProfile):
    try:
        # Create prompt for LLM
        prompt = f"""
        Berikan analisis dan rekomendasi usaha UMKM berdasarkan profil berikut:
        
        Minat Bisnis: {profile.business_interest}
        Target Pasar: {profile.target_market}
        Deskripsi: {profile.description}
        
        Berikan rekomendasi usaha UMKM yang paling cocok untuk profil tersebut dengan format output JSON yang berisi:
        1. "primary_recommendation": Rekomendasi usaha utama (nama usaha, deskripsi, modal yang dibutuhkan, perkiraan keuntungan, skala usaha, target pasar)
        2. "alternative_recommendations": Dua rekomendasi usaha alternatif yang lebih singkat (nama usaha, deskripsi singkat, modal yang dibutuhkan)
        3. "success_factors": Faktor-faktor kunci yang akan mendukung kesuksesan usaha yang direkomendasikan (array of strings)
        4. "challenges": Tantangan yang mungkin dihadapi dan cara mengatasinya (array of strings)
        5. "next_steps": Langkah-langkah konkret yang bisa diambil untuk memulai usaha (array of strings)
        
        Pastikan format output adalah JSON valid yang bisa langsung di-parse.
        Hanya berikan output JSON, jangan tambahkan penjelasan lain.
        """
        
        # Call OpenRouter API (or any other LLM API)
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    # "HTTP-Referer": "https://cuan.in",  # Your website URL
                },
                json={
                    "model": "meta-llama/llama-4-maverick:free",  # You can change the model
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                    "response_format": {"type": "json_object"}
                },
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, 
                                   detail=f"Error from LLM API: {response.text}")
            
            result = response.json()
            
            # Extract the content from the API response
            llm_response = result["choices"][0]["message"]["content"]
            
            # Parse the JSON response
            recommendations = json.loads(llm_response)
            
            return recommendations
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Run with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)