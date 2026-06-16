from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
import os
from dotenv import load_dotenv

def create_vector_store(chunks):
    load_dotenv()
    persist_directory = "chroma_db"
    embedding = OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=os.getenv("OPENAI_API_KEY"),
                                 openai_api_base=os.getenv("OPENAI_BASE_URL"))
    vector_store = Chroma.from_documents(chunks, embedding, persist_directory=persist_directory)
    return vector_store