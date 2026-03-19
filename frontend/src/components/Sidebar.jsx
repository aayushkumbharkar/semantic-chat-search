const chats = [
  { name: 'ML Project Group', preview: 'Aman: Submitting now... 🤞', time: '9:03 PM', color: '#818cf8', initials: 'ML', online: true, active: true },
  { name: 'Sneha Patel', preview: 'You: See you tomorrow!', time: '8:45 PM', color: '#c084fc', initials: 'SP', online: true, active: false },
  { name: 'Rahul Sharma', preview: 'Shared a link', time: '7:30 PM', color: '#f472b6', initials: 'RS', online: false, active: false },
  { name: 'Priya Desai', preview: 'Already submitted ✅', time: '6:20 PM', color: '#34d399', initials: 'PD', online: true, active: false },
  { name: 'Aman Gupta', preview: "I'll screen share...", time: '5:10 PM', color: '#fbbf24', initials: 'AG', online: false, active: false },
  { name: 'Study Group', preview: 'Chapter 5 discussion', time: '4:00 PM', color: '#60a5fa', initials: 'SG', online: false, active: false },
  { name: 'Placement Cell', preview: 'New company added!', time: '3:15 PM', color: '#f87171', initials: 'PC', online: false, active: false },
  { name: 'Code Club', preview: 'Hackathon updates', time: '2:00 PM', color: '#a78bfa', initials: 'CC', online: false, active: false },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Messages</h2>
        <button className="compose-btn" title="New message">✏</button>
      </div>
      <div className="sidebar-chat-list">
        {chats.map((chat, i) => (
          <div key={i} className={`sidebar-chat-item ${chat.active ? 'active' : ''}`}>
            <div className="chat-avatar" style={{ background: chat.color }}>
              {chat.initials}
              {chat.online && <span className="online-dot" />}
            </div>
            <div className="chat-item-info">
              <div className="chat-item-name">{chat.name}</div>
              <div className="chat-item-preview">{chat.preview}</div>
            </div>
            <span className="chat-item-time">{chat.time}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
