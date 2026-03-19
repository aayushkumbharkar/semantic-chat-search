import { useEffect, useRef } from 'react';

export default function SearchBar({ query, onQueryChange, mode, onModeChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-section">
      <div className="search-bar-wrapper">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search this chat..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            id="chat-search-input"
          />
          <span className="search-shortcut">Ctrl+F</span>
        </div>
        <div className="search-mode-toggle">
          <button
            className={`toggle-btn ${mode === 'semantic' ? 'active' : ''}`}
            onClick={() => onModeChange('semantic')}
          >
            ✨ Semantic
          </button>
          <button
            className={`toggle-btn ${mode === 'keyword' ? 'active' : ''}`}
            onClick={() => onModeChange('keyword')}
          >
            🔤 Keyword
          </button>
        </div>
      </div>
    </div>
  );
}
