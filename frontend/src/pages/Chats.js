import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Chats = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Fetch conversations for the current user
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/chat/my-conversations/${userId}`);
        setConversations(data);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchConversations();
  }, [userId]);

  // Fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      setLoading(true);
      try {
        const data = await api.get(`/chat/conversation/${selectedConversation.id}`);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      await api.post('/chat/message', {
        conversationId: selectedConversation.id,
        senderId: userId,
        message: newMessage
      });
      setNewMessage('');
      // Refresh messages
      const data = await api.get(`/chat/conversation/${selectedConversation.id}`);
      setMessages(data);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="chats-container" style={{ display: 'flex', minHeight: '80vh' }}>
      <div className="conversations-list" style={{ width: '30%', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <h2>Conversations</h2>
        {loading && <p>Loading...</p>}
        {conversations.length === 0 && <p>No conversations yet.</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {conversations.map(conv => (
            <li
              key={conv.id}
              style={{ cursor: 'pointer', padding: '0.5rem', background: selectedConversation && selectedConversation.id === conv.id ? '#f0f0f0' : 'transparent' }}
              onClick={() => setSelectedConversation(conv)}
            >
              {conv.item ? <b>{conv.item.title}</b> : 'Conversation'}<br />
              With: {conv.user1 && conv.user1.id === userId ? conv.user2?.name : conv.user1?.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-messages" style={{ flex: 1, padding: '1rem' }}>
        {selectedConversation ? (
          <>
            <h3>Chat</h3>
            <div style={{ minHeight: '300px', maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', marginBottom: '1rem', padding: '1rem', background: '#fafafa' }}>
              {messages.length === 0 ? <p>No messages yet.</p> : messages.map(msg => (
                <div key={msg.id} style={{ marginBottom: '0.5rem', textAlign: msg.sender?.id === userId ? 'right' : 'left' }}>
                  <span style={{ fontWeight: msg.sender?.id === userId ? 'bold' : 'normal' }}>{msg.sender?.name || 'User'}:</span> {msg.message}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1 }}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <p>Select a conversation to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default Chats; 