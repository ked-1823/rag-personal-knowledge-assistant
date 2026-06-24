import os
import shutil
import hashlib

from text_reader import pdf_reader
from chunk import chunking
from vector_store import create_vector_store
from retrieval import retrieve
from generator import generate_answer


def get_file_hash(file_path):
    hasher = hashlib.sha256()

    with open(file_path, "rb") as f:
        while chunk := f.read(4096):
            hasher.update(chunk)

    return hasher.hexdigest()


print("Welcome to Personal Knowledge Assistant")

upload = input("Please upload your PDF file: ")

if not upload.endswith(".pdf"):
    print("Invalid file format. Please upload a PDF file.")
    exit()

if not os.path.exists(upload):
    print("File not found.")
    exit()


current_hash = get_file_hash(upload)


if os.path.exists("current_hash.txt"):
    with open("current_hash.txt", "r") as f:
        last_hash = f.read().strip()
else:
    last_hash = None


if current_hash == last_hash:

    print("Same PDF detected.")
    print("Using existing vector database.")

else:

    print("New PDF detected.")
    print("Rebuilding vector database...")

    if os.path.exists("chroma_db"):
        shutil.rmtree("chroma_db")

    documents = pdf_reader(upload)

    chunks = chunking(documents)

    create_vector_store(chunks)

    with open("current_hash.txt", "w") as f:
        f.write(current_hash)

    print("Vector database created successfully.")

chat_history=[]
while True:

    query = input("\nEnter your question (or type 'exit' to quit): ")

    if query.lower() == "exit":
        print(" chat history:\n ")
        for chat in chat_history:
            print(f"Q: {chat['question']}\nA: {chat['answer']}\n")
            print("-" * 40)
        print("Goodbye!")
        break

    retrieved_docs = retrieve(query)
    
    sources=set()
    
    for doc in retrieved_docs:
        source = doc.metadata.get("source", "Unknown Source")
        page = doc.metadata.get("page", 0)
        sources.add((source,page))
    print("MAIN:", chat_history)
    answer = generate_answer(
        query,
        retrieved_docs,
        chat_history
    )

    print("\nAnswer:")
    chat_history.append({
        "question": query,
        "answer": answer
    })

    print(answer)
    print("\nSources:")

    for source, page in sorted(sources):
        print(f"{os.path.basename(source)} (Page {page + 1})")