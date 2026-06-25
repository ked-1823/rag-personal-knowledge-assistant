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
        f"Source: {doc.metadata.get('source', 'Unknown')}\n\n{doc.page_content}"
        for doc in retrieved_docs
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
Instructions:
- Use the previous conversation only to understand references and follow-up questions.
- Use the provided context as the primary and only source of information.
- Answer strictly from the provided context.
- Do not use outside knowledge, assumptions, or reasoning beyond the context.
- If the answer is not present in the context, reply exactly: "No records found in document".
- Do not make up, infer, or hallucinate information.
- When information comes from different documents, clearly mention the source filename.
- For comparison questions, group the answer by source document.
- Use the format:

  Source: <filename>
  <answer>

- Return plain text only.
- Do not use Markdown formatting such as **, *, #, tables, or code blocks.
- Keep answers concise, accurate, and directly relevant to the question.
- If multiple sources contain relevant information, include all relevant sources in the answer.
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
  