from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
import os
import gc
import shutil

def create_vector_store(chunks, session_id):
    load_dotenv()

    persist_directory = os.path.join("chroma_db", session_id)

# Remove only this session's vector database
    if os.path.exists(persist_directory):
        shutil.rmtree(persist_directory, ignore_errors=True)

    os.makedirs(persist_directory, exist_ok=True)
    
    embedding = OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        openai_api_base=os.getenv("OPENAI_BASE_URL")
    )

    vector_store = Chroma.from_documents(
        chunks,
        embedding,
        persist_directory=persist_directory
    )
    

    del vector_store
    gc.collect()

    return True