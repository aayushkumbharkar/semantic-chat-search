export default function ChatHeader() {
  return (
    <div className="chat-header">
      <div className="chat-header-avatar">ML</div>
      <div className="chat-header-info">
        <h3>ML Project Group</h3>
        <span>4 members online</span>
      </div>
      <div className="chat-header-actions">
        <button title="Voice call">📞</button>
        <button title="Video call">🎥</button>
        <button title="Info">ℹ</button>
      </div>
    </div>
  );
}
