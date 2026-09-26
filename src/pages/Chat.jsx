import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

export default function Chat({ character, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [convId, setConvId] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

// Find this section in your existing src/pages/Chat.jsx and replace it:
   useEffect(() => {
  async function initConversation() {
    // Get the authenticated user ID from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create conversation session linked strictly to this active user
    const { data: conv } = await supabase.from('conversations')
      .insert([{ character_id: character.id, user_id: user.id }])
      .select()
      .single();
      
    if (conv) {
      setConvId(conv.id);
    }
  }
  initConversation();
}, [character]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendPromptMessage = async () => {
    if (!input.trim() || !convId || loading) return;
    setLoading(True);

    const userText = input;
    setInput('');

    // Append localized client user state instantly
    const userMsg = { sender: 'user', content: userText };
    setMessages((prev) => [...prev, userMsg]);

    // Save initial history data footprint onto remote Supabase bucket tables
    await supabase.from('messages').insert([{ conversation_id: convId, sender: 'user', content: userText }]);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          system_prompt: character.system_prompt,
          history: messages,
        }),
      });

      const data = await response.json();
      const aiReply = data.reply;

      // Update client-side UI states with engine return text evaluations
      setMessages((prev) => [...prev, { sender: 'ai', content: aiReply }]);
      await supabase.from('messages').insert([{ conversation_id: convId, sender: 'ai', content: aiReply }]);
    } catch (e) {
      console.error("Transmission breakdown to your Python server framework", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 53px)', color: '#fff' }}>
      <div style={{ padding: '10px 15px', background: '#1a1a1a', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#ff4d94', cursor: 'pointer', fontSize: '16px' }}>⬅ Back</button>
        <h4 style={{ margin: 0 }}>Chat with {character.name}</h4>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', background: '#0f0f0f', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
            <div style={{ background: msg.sender === 'user' ? '#ff4d94' : '#222', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5' }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: '#666', fontSize: '12px', paddingLeft: '5px' }}>{character.name} is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ padding: '12px', background: '#1a1a1a', borderTop: '1px solid #333', display: 'flex', gap: '10px' }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Talk to ${character.name}...`}
          style={{ flex: 1, padding: '12px', background: '#252525', border: '1px solid #333', borderRadius: '6px', color: '#fff', fontSize: '14px' }}
          onKeyDown={(e) => e.key === 'Enter' && sendPromptMessage()}
        />
        <button onClick={sendPromptMessage} style={{ padding: '12px 20px', background: '#ff4d94', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Send</button>
      </div>
    </div>
  );
}