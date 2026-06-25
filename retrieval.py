from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
import os


def retrieve(query):
    load_dotenv()

    persist_directory = "chroma_db"

    embedding = OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        openai_api_base=os.getenv("OPENAI_BASE_URL")
    )

    vector_store = Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding
    )

    results = vector_store.similarity_search(query,k=10)

    # Debug metadata
    for doc in results:
        print("METADATA:", doc.metadata)

    return results