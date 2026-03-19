# 🔍 Meta Chat Search

**AI-Powered Semantic Search for In-Chat Message Retrieval**

A modern full-stack prototype demonstrating how messaging platforms like Instagram DMs or Facebook Messenger could implement intelligent in-conversation search. Users can type vague queries like *"meeting"*, *"notes link"*, or *"exam schedule"* and instantly retrieve the most relevant messages — even when the wording is completely different.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Semantic Search** | Uses AI embeddings to find contextually relevant messages, not just exact matches |
| **Keyword Search** | Traditional substring matching for side-by-side comparison |
| **Comparison Mode** | Toggle between Semantic and Keyword search to see why AI search is superior |
| **Context Preview** | Each search result shows 2 messages before and after for full context |
| **Click-to-Navigate** | Click any result to auto-scroll and highlight the message in the chat |
| **Keyboard Shortcut** | Press `Ctrl+F` to instantly focus the search bar |
| **Realistic Chat UI** | Instagram DM-inspired dark interface with 180+ messages |
| **Relevance Scoring** | Color-coded match percentages for every search result |

---

## 🎯 Problem Statement

In long DM or group conversations, finding a specific old message is painful. Users must scroll endlessly or rely on exact keyword searches that fail when the wording differs. This prototype solves that with **AI-powered semantic search** that understands *meaning*, not just text.

### Example

> **Query:** `"meeting"`
>
> **Semantic Search finds:**
> - *"The call is at 6pm today"*
> - *"Let's sync up in the evening"*
> - *"Here you go: https://zoom.us/j/meeting-abc123"*
>
> **Keyword Search finds:**
> - *"Let's discuss this in our meeting tomorrow"* ← only exact matches

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│               (Vite · Port 5173)                        │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Sidebar  │ │  Search  │ │ Results  │ │  Message   │  │
│  │          │ │   Bar    │ │  Panel   │ │   List     │  │
│  └──────────┘ └────┬─────┘ └──────────┘ └───────────┘  │
│                    │                                    │
└────────────────────┼────────────────────────────────────┘
                     │ REST API
┌────────────────────┼────────────────────────────────────┐
│                    ▼                                    │
│              FastAPI Backend                            │
│             (Python · Port 8000)                        │
│                                                         │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │  messages.json   │  │  sentence-transformers       │  │
│  │  (180 messages)  │  │  (all-MiniLM-L6-v2)         │  │
│  └─────────────────┘  │  cosine similarity ranking   │  │
│                        └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — Functional components with hooks
- **Vite** — Lightning-fast HMR and build tooling
- **Vanilla CSS** — Custom design system with CSS variables, glassmorphism, and animations

### Backend
- **Python 3** — Core runtime
- **FastAPI** — High-performance async REST API
- **sentence-transformers** — `all-MiniLM-L6-v2` model for semantic embeddings
- **scikit-learn** — Cosine similarity computation
- **NumPy** — Efficient vector operations

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+** with pip
- **Node.js 18+** with npm
- ~500MB disk space (for the ML model on first run)

### Installation & Setup

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/meta-chat-search.git
cd meta-chat-search
```

**2. Backend Setup**

```bash
cd backend
pip install -r requirements.txt
python main.py
```

> ⏳ On first run, the `all-MiniLM-L6-v2` model (~80MB) will be downloaded and cached automatically.
> Subsequent startups are fast (~1 second for embedding computation).

The backend will be available at **http://localhost:8000**

**3. Frontend Setup** (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:5173**

**4. Open the app**

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Reference

### `GET /messages`

Returns the full message dataset.

**Response:**
```json
[
  {
    "sender": "Rahul",
    "message": "Hey everyone, good morning! 🌞",
    "timestamp": "9:00 AM"
  },
  ...
]
```

---

### `POST /semantic-search`

Performs AI-powered semantic search using embeddings and cosine similarity.

**Request:**
```json
{
  "query": "meeting"
}
```

**Response:**
```json
{
  "results": [
    {
      "message": "The call is at 6pm today right?",
      "sender": "Aman",
      "timestamp": "10:10 AM",
      "score": 0.5842,
      "index": 40
    }
  ]
}
```

---

### `POST /keyword-search`

Performs traditional substring matching for comparison.

**Request / Response:** Same schema as `POST /semantic-search` (score is always `1.0` for matches).

---

## 📁 Project Structure

```
meta-chat-search/
├── backend/
│   ├── data/
│   │   └── messages.json          # 180 realistic chat messages
│   ├── main.py                    # FastAPI server + search engine
│   └── requirements.txt           # Python dependencies
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatHeader.jsx     # Chat title bar + online status
│   │   │   ├── MessageBubble.jsx  # Individual message with URL detection
│   │   │   ├── MessageList.jsx    # Scrollable message list + highlight
│   │   │   ├── SearchBar.jsx      # Search input + Ctrl+F + mode toggle
│   │   │   ├── SearchResults.jsx  # Result cards + context preview
│   │   │   └── Sidebar.jsx        # Chat list placeholder
│   │   ├── App.jsx                # Main app orchestrator
│   │   ├── App.css
│   │   ├── index.css              # Design system (dark theme + glassmorphism)
│   │   └── main.jsx               # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🧠 How Semantic Search Works

```
1. STARTUP
   Load messages.json
         ↓
   Encode all 180 messages → 384-dim vectors using all-MiniLM-L6-v2
         ↓
   Store embedding matrix in memory (180 × 384)

2. SEARCH QUERY
   User types "meeting"
         ↓
   Encode query → 384-dim vector
         ↓
   Compute cosine similarity against all 180 message vectors
         ↓
   Sort by similarity score (descending)
         ↓
   Return top 5 results with scores
```

### Why It Works

The **all-MiniLM-L6-v2** model maps semantically similar sentences to nearby points in a 384-dimensional space. So even though *"call at 6pm"* and *"meeting"* share no words, their vectors are close because they express related concepts.

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| Embedding computation (180 msgs) | ~0.7 seconds |
| Search latency (per query) | < 50ms |
| Model size | ~80MB (cached after first download) |
| Frontend bundle | < 200KB |

---

## 🎨 UI Design

The interface is inspired by modern messaging apps with a **dark premium aesthetic**:

- **Dark theme** with carefully curated neutral palette
- **Glassmorphism** effects on panels and cards
- **Inter font** for clean, professional typography
- **Smooth animations** for search results and message highlighting
- **Color-coded sender names** for visual distinction
- **Responsive layout** that adapts to screen size

---

## 🔮 Future Enhancements

- [ ] Multi-language search support
- [ ] Search across multiple conversations
- [ ] Date range filtering
- [ ] Message type filters (links, media, text)
- [ ] Persistent search history
- [ ] WebSocket-based real-time messages
- [ ] Export search results
- [ ] Mobile-optimized layout

---

## 📄 License

This project is built as an academic / portfolio prototype. Feel free to use and modify.

---

<p align="center">
  Built with ❤️ using React, FastAPI, and sentence-transformers
</p>
