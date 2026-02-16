from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shortuuid

app = FastAPI()

# Allow frontend (Netlify / local) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for now (safe for demo project)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class URLRequest(BaseModel):
    url: str

# Temporary in-memory storage
url_database = {}

@app.get("/")
def home():
    return {"message": "URL Shortener Backend is Running!"}

@app.post("/shorten")
def shorten_url(request: URLRequest):
    long_url = request.url

    # Generate short ID
    short_id = shortuuid.random(length=6)

    # Save mapping
    url_database[short_id] = long_url

    return {
        "short_id": short_id,
        "short_url": f"/{short_id}",   # frontend will append backend domain
        "original_url": long_url
    }

@app.get("/{short_id}")
def redirect_user(short_id: str):
    if short_id not in url_database:
        return {"error": "Invalid short URL"}

    # REAL redirect
    return RedirectResponse(url_database[short_id])
