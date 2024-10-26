import uuid
import asyncio
from fastapi import FastAPI, HTTPException, Depends
from v2_utils import UtilProcessor
from pathlib import Path
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List


#conda activate langchain_test_env1
#uvicorn app:app --reload --host 0.0.0.0 --port 8080
#uvicorn app:app --host 0.0.0.0 --port 8000 &
# sleep 2
# ngrok http 8080


app = FastAPI()

class LLMRequest(BaseModel):
    prompt: str
    input: str
    history: List[str]

class ChatInit(BaseModel):
    course: str
    topic: str

class Chat(BaseModel):
    user_input: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins as needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods, or specify allowed methods
    allow_headers=["*"],  # Allow all headers, or specify allowed headers
)

project_root = Path(__file__).parent
util_processor = UtilProcessor(project_root)

def get_llm_response(prompt, input, history):
    # Call your utility processor or any other logic
    # llm_ans = util_processor.get_llm_response(prompt, input, history)
    llm_ans = util_processor.aws_get_llm_response(prompt, input, history)
    
    return llm_ans

def t_get_llm_response(prompt, input, history):
    # Call your utility processor or any other logic
    llm_ans = util_processor.t_get_llm_response(prompt, input, history)
    return llm_ans

def aws_get_llm_response(prompt, input, history):
    # Call your utility processor or any other logic
    llm_ans = util_processor.aws_get_llm_response(prompt, input, history)
    return llm_ans

#check description endpoint
@app.get('/')
async def get_project_desc():
    return {'message': 'This Project is for Adaptive-Learning'}

#call_llm
@app.post("/llm-response")
def llm_response(request: LLMRequest):
    print(f"request.prompt : {request.prompt}")
    print(f"request.input : {request.input}")
    response = get_llm_response(request.prompt, request.input, request.history)
    # response = aws_get_llm_response(request.prompt, request.input, request.history)
    # response = t_get_llm_response(request.prompt, request.input, request.history)
    print(f"response : {response}")
    return {"response": response}

@app.post("/t-llm-response")
def t_llm_response(request: LLMRequest):
    print(f"request.prompt : {request.prompt}")
    print(f"request.input : {request.input}")
    response = t_get_llm_response(request.prompt, request.input, request.history)
    print(f"response : {response}")
    return {"response": response}

@app.post("/aws-llm-response")
def aws_llm_response(request: LLMRequest):
    print(f"request.prompt : {request.prompt}")
    print(f"request.input : {request.input}")
    response = aws_get_llm_response(request.prompt, request.input, request.history)
    print(f"response : {response}")
    return {"response": response}

class ChatRequest(BaseModel):
    query: str

# Endpoint to change the course or topic (only when needed)
@app.post("/chat_initialize")
def chat_initialize(request: ChatInit):
    try:
        util_processor.init_ai_teacher(request.course, request.topic)
        print(f"chat_initialize done")
        return {"message": f"Initialized help chain with course: {request.course} and topic: {request.topic}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chat endpoint for ongoing conversation
@app.post("/chat")
def chat(request: Chat):
    try:
        print(f"chat user_input : {request.user_input}")
        response = util_processor.ask_ai_teacher(request.user_input)
        print(f"chat response : {response}")
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Main 
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8080, reload=True) 