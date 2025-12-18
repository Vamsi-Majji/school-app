import React, { useState, useEffect } from 'react';

const SecureMessaging = ({ role }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    // Mock messages
    setMessages([
      { id: 1, from: 'Admin', to: role, content: 'Welcome to the secure messaging system', timestamp: '10:00 AM' },
      { id: 2, from: role, to: 'Teacher', content: 'Please review my assignment', timestamp: '11:00 AM' }
    ]);
  }, [role]);

  const sendMessage = () => {
    if (newMessage.trim() && recipient.trim()) {
      const message = {
        id: Date.now(),
        from: role,
        to: recipient,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([...messages, message]);
      setNewMessage('');
      setRecipient('');
      // Mock encryption
      console.log('Message encrypted and sent securely');
    }
  };

  return (
    <div className="secure-messaging">
      <h4>Secure Messaging</h4>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className="message">
            <strong>{msg.from} to {msg.to}:</strong> {msg.content} <em>({msg.timestamp})</em>
          </div>
        ))}
      </div>
      <div className="send-message">
        <input
          type="text"
          placeholder="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <textarea
          placeholder="Type your secure message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Secure Message</button>
      </div>
      <p><small>All messages are encrypted end-to-end</small></p>
    </div>
  );
};

export default SecureMessaging;
