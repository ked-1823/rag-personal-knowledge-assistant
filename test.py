from generator import generate_answer
from retrieval import retrieve

question = input("Ask question: ")

results = retrieve(question)

answer=generate_answer(question, results)
print(answer)