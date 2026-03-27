import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI assistant. How can I help you today?", sender: "ai" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom when a new message appears
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add user's message to the chat
    const userMessage = { text: input, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Send the message to your Node.js backend
      const response = await fetch('https://my-ai-chatbot-backend-6dgv.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();

      // 3. Add AI's response to the chat
      setMessages([...newMessages, { text: data.reply, sender: 'ai' }]);
      
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { text: "Sorry, I'm having trouble connecting to the server.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>AI Chatbot</h1>
      </header>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.sender}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper ai">
            <div className="message-bubble loading">Typing...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form className="input-area" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;