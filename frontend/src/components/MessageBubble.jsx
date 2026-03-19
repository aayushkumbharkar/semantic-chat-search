const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function renderMessageText(text) {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) => {
    if (URL_REGEX.test(part)) {
      URL_REGEX.lastIndex = 0; // reset regex state
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
}

// Assign consistent colors to senders
const SENDER_COLORS = {
  'Rahul': '#818cf8',
  'Priya': '#f472b6',
  'Aman': '#fbbf24',
  'Sneha': '#34d399',
};

export default function MessageBubble({ msg, index, isSelf, isHighlighted, showSender, messageRef }) {
  const senderColor = SENDER_COLORS[msg.sender] || '#818cf8';

  return (
    <div
      ref={messageRef}
      className={`message-row ${isSelf ? 'self' : 'other'} ${isHighlighted ? 'highlighted highlight-active' : ''} ${!showSender ? 'continuation' : ''}`}
      id={`message-${index}`}
    >
      <div className="message-bubble-wrapper">
        {showSender && (
          <span className="message-sender-name" style={{ color: senderColor }}>
            {msg.sender}
          </span>
        )}
        <div className="message-bubble">
          {renderMessageText(msg.message)}
        </div>
        <span className="message-timestamp">{msg.timestamp}</span>
      </div>
    </div>
  );
}
