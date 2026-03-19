import json
import os
import time
from pathlib import Path
from contextlib import asynccontextmanager

import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# --- Data & Model Globals ---
messages = []
embeddings = None
model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load messages and precompute embeddings on startup."""
    global messages, embeddings, model

    data_path = Path(__file__).parent / "data" / "messages.json"
    with open(data_path, "r", encoding="utf-8") as f:
        messages = json.load(f)

    print(f"✅ Loaded {len(messages)} messages")

    print("⏳ Loading sentence-transformers model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    texts = [m["message"] for m in messages]
    print("⏳ Computing embeddings for all messages...")
    start = time.time()
    embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)
    elapsed = time.time() - start
    print(f"✅ Embeddings computed in {elapsed:.2f}s — shape: {embeddings.shape}")

    yield  # App runs here

    # Cleanup (nothing to do)
    print("🛑 Shutting down")


app = FastAPI(title="Meta Chat Search API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Schemas ---
class SearchQuery(BaseModel):
    query: str


class SearchResult(BaseModel):
    message: str
    sender: str
    timestamp: str
    score: float
    index: int


class SearchResponse(BaseModel):
    results: list[SearchResult]


# --- Endpoints ---
@app.get("/messages")
def get_messages():
    """Return the full message dataset."""
    return messages


@app.post("/semantic-search", response_model=SearchResponse)
def semantic_search(body: SearchQuery):
    """Semantic search using embedding cosine similarity."""
    query_embedding = model.encode([body.query], convert_to_numpy=True)
    similarities = cosine_similarity(query_embedding, embeddings)[0]

    top_indices = np.argsort(similarities)[::-1][:5]

    results = []
    for idx in top_indices:
        idx = int(idx)
        results.append(SearchResult(
            message=messages[idx]["message"],
            sender=messages[idx]["sender"],
            timestamp=messages[idx]["timestamp"],
            score=round(float(similarities[idx]), 4),
            index=idx,
        ))

    return SearchResponse(results=results)


@app.post("/keyword-search", response_model=SearchResponse)
def keyword_search(body: SearchQuery):
    """Simple substring keyword search for comparison."""
    query_lower = body.query.lower()
    results = []

    for idx, msg in enumerate(messages):
        if query_lower in msg["message"].lower():
            results.append(SearchResult(
                message=msg["message"],
                sender=msg["sender"],
                timestamp=msg["timestamp"],
                score=1.0,
                index=idx,
            ))

    # Return top 5 keyword matches
    return SearchResponse(results=results[:5])


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
