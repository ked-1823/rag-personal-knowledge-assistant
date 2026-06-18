from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from retrieval import retrieve
from generator import generate_answer
from text_reader import pdf_reader
from chunk import chunking
from vector_store import create_vector_store
from pydantic import BaseModel
from fastapi import HTTPException
import os
import shutil


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


pdf_uploaded = False

chat_sessions = {}

# how many previous conversations to send to LLM
MAX_HISTORY = 3


@app.get("/")
def home():
    return {
        "message": "RAG api working"
    }

class ChatRequest(BaseModel):
    query: str
    session_id: str

@app.post("/chat")
def chat(request: ChatRequest):
    query = request.query
    session_id = request.session_id

    if not pdf_uploaded:
        return {
            "error": "Please upload a PDF first"
        }

    if session_id not in chat_sessions:
        chat_sessions[session_id] = []
    session_history = chat_sessions[session_id]
    retrieved_docs = retrieve(query)


    # send only recent chat history to LLM
    recent_history = session_history[-MAX_HISTORY:]


    answer = generate_answer(
        query,
        retrieved_docs,
        recent_history
    )


    chat_sessions[session_id].append({
        "question": query,
        "answer": answer
    })

    return {
        "answer": answer
    }



@app.post("/upload")
def upload(file: UploadFile = File(...)):
    global pdf_uploaded

    try:
        os.makedirs("uploads", exist_ok=True)

        file_path = os.path.join(
            "uploads",
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        # Remove old vector database
        if os.path.exists("chroma_db"):
            shutil.rmtree("chroma_db")

        print("PDF saved:", file_path)

        documents = pdf_reader(file_path)
        print("PDF loaded")

        chunks = chunking(documents)
        print(f"Chunks created: {len(chunks)}")

        create_vector_store(chunks)
        print("Vector store created")

        pdf_uploaded = True

        return {
            "message": f"File '{file.filename}' uploaded successfully."
        }

    except Exception as e:
        print("=" * 50)
        print("UPLOAD ERROR")
        print(str(e))
        print("=" * 50)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/history/{session_id}")
def get_history(session_id: str):

    if session_id not in chat_sessions:
        return {
            "chat_history": []
        }

    return {
        "chat_history": chat_sessions[session_id]
    }
