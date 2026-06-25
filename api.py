from fastapi import FastAPI, UploadFile, File, HTTPException
from typing import Annotated

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import gc
from typing import List
from retrieval import retrieve
from generator import generate_answer
from text_reader import pdf_reader
from chunk import chunking
from vector_store import create_vector_store

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

# How many previous conversations to send to LLM
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

    # Retrieve relevant chunks
    retrieved_docs = retrieve(query)

    # Send only recent chat history to LLM
    recent_history = session_history[-MAX_HISTORY:]

    # Generate answer
    answer = generate_answer(
        query,
        retrieved_docs,
        recent_history
    )

    # Store conversation
    chat_sessions[session_id].append(
        {
            "question": query,
            "answer": answer
        }
    )

    return {
        "answer": answer
    }


@app.post("/upload")
def upload(files: List[UploadFile] = File(...)):
    global pdf_uploaded
    if len(files) == 0:
        raise HTTPException(
            status_code=400,
            detail="Please upload at least one PDF."
        )

    if len(files) > 4:
        raise HTTPException(
            status_code=400,
            detail="Maximum 4 PDFs allowed."
        )

    try:
        # Create uploads directory
        os.makedirs("uploads", exist_ok=True)

        # Remove old vector database
        gc.collect()
   
        if os.path.exists("chroma_db"):
            shutil.rmtree("chroma_db", ignore_errors=True)
 

        all_documents = []

        # Process all uploaded PDFs
        for file in files:

            file_path = os.path.join(
                "uploads",
                file.filename
            )

            # Save PDF
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(
                    file.file,
                    buffer
                )

            print("PDF saved:", file_path)

            # Read PDF
            documents = pdf_reader(file_path)
            for doc in documents:
                doc.metadata["source"]=file.filename

            print(
                f"Loaded {len(documents)} pages from {file.filename}"
            )

            all_documents.extend(documents)

        print(
            f"Total documents loaded: {len(all_documents)}"
        )

        # Create chunks
        chunks = chunking(all_documents)

        print(
            f"Chunks created: {len(chunks)}"
        )

        # Create vector database
        create_vector_store(chunks)

        print("Vector store created")

        pdf_uploaded = True

        return {
            "message": f"{len(files)} PDFs uploaded successfully."
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