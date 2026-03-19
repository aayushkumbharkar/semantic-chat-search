import { useRef, useEffect, createRef, useMemo } from 'react';
import MessageBubble from './MessageBubble';

const SELF_SENDER = 'Rahul'; // The "current user"

export default function MessageList({ messages, highlightedIndex }) {
  const containerRef = useRef(null);
  const messageRefs = useMemo(() => {
    return messages.map(() => createRef());
  }, [messages]);

  // Scroll to highlighted message
  useEffect(() => {
    if (highlightedIndex !== null && highlightedIndex >= 0 && messageRefs[highlightedIndex]?.current) {
      messageRefs[highlightedIndex].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [highlightedIndex, messageRefs]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (containerRef.current && messages.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div className="message-list-container" ref={containerRef}>
      <div className="message-date-divider">
        <span>Today</span>
      </div>
      {messages.map((msg, i) => {
        const isSelf = msg.sender === SELF_SENDER;
        const showSender = i === 0 || messages[i - 1].sender !== msg.sender;

        return (
          <MessageBubble
            key={i}
            msg={msg}
            index={i}
            isSelf={isSelf}
            isHighlighted={highlightedIndex === i}
            showSender={showSender}
            messageRef={messageRefs[i]}
          />
        );
      })}
    </div>
  );
}
