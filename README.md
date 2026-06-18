# 📚 Personal Knowledge Assistant

> A full-stack Retrieval-Augmented Generation (RAG) application that enables users to upload PDF documents and chat with their knowledge using AI.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)
![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorDB-orange)
![LangChain](https://img.shields.io/badge/LangChain-RAG-purple)

---

## ✨ Overview

Personal Knowledge Assistant is a RAG-powered application that transforms PDF documents into an interactive knowledge base.

Users can upload documents, ask natural language questions, and receive AI-generated answers grounded in the uploaded content.

The application combines semantic search, vector embeddings, and LLMs to provide accurate and context-aware responses.

---

## 🎥 Demo

**Live Demo:** Coming Soon

**Screenshots:**

| Upload PDF     | Chat Interface |
| -------------- | -------------- |
| Add Screenshot | Add Screenshot |

---

## 🚀 Features

* 📄 PDF Upload & Processing
* ✂️ Intelligent Text Chunking
* 🧠 OpenAI Embeddings
* 🔍 Semantic Search
* 🤖 AI-Powered Question Answering
* 💬 Conversational Chat Interface
* 🗂 Session-Based Memory
* ⚡ FastAPI REST APIs
* 🎨 Responsive Next.js Frontend

---

## 🏗 Architecture

```text
User Uploads PDF
        ↓
Text Extraction
        ↓
Chunking
        ↓
Generate Embeddings
        ↓
Store in ChromaDB
        ↓
User Question
        ↓
Semantic Retrieval
        ↓
LLM Generation
        ↓
Final Answer
```

---

## 🛠 Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* FastAPI
* LangChain
* OpenRouter
* OpenAI Embeddings

### Database

* ChromaDB

---

## 📂 Project Structure

```text
personal-knowledge-assistant/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── public/
│
├── uploads/
├── chroma_db/
│
├── api.py
├── main.py
├── retrieval.py
├── vector_store.py
├── generator.py
├── chunk.py
├── text_reader.py
│
├── requirements.txt
├── .env
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/ked-1823/rag-personal-knowledge-assistant.git
cd rag-personal-knowledge-assistant
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Variables

Create a `.env` file:

```env
OPENROUTER_API_KEY=your_api_key
```

### 5. Start Backend

```bash
uvicorn api:app --reload
```

Backend:

```text
http://localhost:8000
```

### 6. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint   | Description   |
| ------ | ---------- | ------------- |
| GET    | `/`        | Health Check  |
| POST   | `/upload`  | Upload PDF    |
| POST   | `/chat`    | Ask Questions |
| GET    | `/history` | Chat History  |

---

## 🧠 How It Works

1. User uploads a PDF document.
2. Text is extracted and split into chunks.
3. Embeddings are generated for each chunk.
4. Chunks are stored in ChromaDB.
5. User submits a question.
6. Relevant chunks are retrieved through semantic search.
7. Retrieved context is passed to the LLM.
8. Grounded answer is returned to the user.

---

## 🎯 Key Challenges Solved

* Implemented semantic document retrieval using vector embeddings.
* Built a complete RAG pipeline from scratch.
* Integrated FastAPI backend with Next.js frontend.
* Managed conversational context across user sessions.
* Optimized chunking strategy for improved retrieval quality.

---

## 🚀 Future Improvements

* Multi-PDF Knowledge Base
* Source Citations
* Streaming Responses
* User Authentication
* Cloud Storage Integration
* Docker Support
* Production Deployment

---

## 📚 Learning Outcomes

This project demonstrates practical experience with:

* Retrieval-Augmented Generation (RAG)
* Vector Databases
* Embeddings & Semantic Search
* FastAPI Development
* LangChain Workflows
* Next.js Frontend Development
* Full-Stack AI Application Development

---

## 📄 License

This project is licensed under the MIT License.
