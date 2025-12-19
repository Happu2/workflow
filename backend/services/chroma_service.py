import chromadb
import uuid

client = chromadb.Client()
collection = client.get_or_create_collection("knowledge_base")


def store_chunks(chunks, embeddings):
    ids = [str(uuid.uuid4()) for _ in chunks]
    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings
    )


def search_vectors(query_embedding, k=3):
    res = collection.query(
        query_embeddings=[query_embedding],
        n_results=k
    )
    return res["documents"][0]
