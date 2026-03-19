export default function SearchResults({ results, messages, mode, onResultClick }) {
  if (!results || results.length === 0) return null;

  const getScoreClass = (score) => {
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'mid';
    return 'low';
  };

  const getContext = (index) => {
    const contextMessages = [];
    for (let i = Math.max(0, index - 2); i <= Math.min(messages.length - 1, index + 2); i++) {
      contextMessages.push({ ...messages[i], originalIndex: i, isTarget: i === index });
    }
    return contextMessages;
  };

  return (
    <div className="search-results-panel">
      <div className="results-header">
        <h4>
          {mode === 'semantic' ? '✨ Semantic Results' : '🔤 Keyword Results'}
          <span className="result-count-badge">{results.length} found</span>
        </h4>
      </div>
      <div className="results-list">
        {results.map((result, i) => {
          const context = getContext(result.index);
          return (
            <div
              key={i}
              className="result-card"
              onClick={() => onResultClick(result.index)}
              id={`search-result-${i}`}
            >
              <div className="result-card-main">
                <span className="result-sender">{result.sender}</span>
                <span className="result-message">{result.message}</span>
              </div>
              <div className="result-meta">
                <span className="result-timestamp">{result.timestamp}</span>
                {mode === 'semantic' && (
                  <span className={`result-score ${getScoreClass(result.score)}`}>
                    {(result.score * 100).toFixed(1)}% match
                  </span>
                )}
              </div>
              <div className="result-context">
                {context.map((ctx, j) => (
                  <div key={j} className={`context-msg ${ctx.isTarget ? 'target' : ''}`}>
                    <span className="ctx-sender">{ctx.sender}:</span>
                    <span>{ctx.message}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
