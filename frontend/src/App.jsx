import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import MessageList from './components/MessageList';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchMode, setSearchMode] = useState('semantic');
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch messages on mount
  useEffect(() => {
    fetch(`${API_BASE}/messages`)
      .then((res) => res.json())
      .then(setMessages)
      .catch(console.error);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHighlightedIndex(null);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query, searchMode);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchMode]);

  const performSearch = async (q, mode) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const endpoint = mode === 'semantic' ? 'semantic-search' : 'keyword-search';
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setHighlightedIndex(null);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = useCallback((index) => {
    // Reset then set to trigger animation
    setHighlightedIndex(null);
    requestAnimationFrame(() => {
      setHighlightedIndex(index);
    });

    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedIndex(null);
    }, 3000);
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="chat-main">
        <ChatHeader />
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          mode={searchMode}
          onModeChange={setSearchMode}
        />
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <span>Searching...</span>
          </div>
        )}
        {!loading && results.length > 0 && (
          <SearchResults
            results={results}
            messages={messages}
            mode={searchMode}
            onResultClick={handleResultClick}
          />
        )}
        {!loading && query.trim() && results.length === 0 && (
          <div className="empty-results">No results found for "{query}"</div>
        )}
        <MessageList
          messages={messages}
          highlightedIndex={highlightedIndex}
        />
      </div>
    </div>
  );
}

export default App;
