import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure full CORS to safely connect with your Vite development platform server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama local connection setup 
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama", # Arbitrary key required by client validation
)

class ChatMessage(BaseModel):
    sender: str
    content: str

class ChatRequest(BaseModel):
    message: str
    system_prompt: str
    history: list[ChatMessage] = []

@app.post("/api/chat")
def chat_with_character(request: ChatRequest):
    try:
        # Build structure matching OpenAI ChatML scheme
        ai_messages = [{"role": "system", "content": request.system_prompt}]
        
        # Inject context history
        for msg in request.history:
            role = "assistant" if msg.sender == "ai" else "user"
            ai_messages.append({"role": role, "content": msg.content})
            
        # Append current user phrase
        ai_messages.append({"role": "user", "content": request.message})
        
        response = client.chat.completions.create(
            model="qwen2.5:7b-instruct", # Match your pulled model exact tag name
            messages=ai_messages,
            temperature=0.8,
        )
        
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))