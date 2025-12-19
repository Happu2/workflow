import os
from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
if api_key and api_key != "your_openai_key":
    client = OpenAI(api_key=api_key)
else:
    client = None


def chunk_text(text, size=500, overlap=50):
    words = text.split()
    chunks = []
    i = 0

    while i < len(words):
        chunks.append(" ".join(words[i:i+size]))
        i += size - overlap

    return chunks


def embed_texts(texts):
    if not client:
        # Fallback to dummy embeddings for demo
        return [[0.1] * 1536 for _ in texts]
    response = client.embeddings.create(
        input=texts,
        model="text-embedding-3-small"
    )
    return [data.embedding for data in response.data]


def embed_document(text):
    chunks = chunk_text(text)
    return chunks, embed_texts(chunks)
