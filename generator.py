from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


def generate_answer(query, retrieved_docs,chat_history):

    # Build context from retrieved chunks
    context = "\n\n".join(
        doc.page_content for doc in retrieved_docs
    )
    
    history_text=""
    for chat in chat_history[-4:]:  # Include last 5 interactions
        history_text+=f"""User: {chat['question']}
Assistant: {chat['answer']}"""

    # RAG prompt
    prompt = f"""
Previous Conversation:
{history_text}

Context:
{context}

Current Question:
{query}

Instructions:
- Use the previous conversation only to understand references and follow-up questions.
- Use the provided context as the primary source of information.
- Answer only using information found in the context.
- If the answer is not present in the context, reply with "No records found in document".
- Do not make up information.
- Do not use outside knowledge.
- Keep the answer concise and accurate.
"""

    response = client.chat.completions.create(
        model="openrouter/auto",
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a RAG assistant. "
                    "Answer only from the provided context. "
                    "Never make up information."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content
  