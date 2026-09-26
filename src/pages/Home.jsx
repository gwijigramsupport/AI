import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function Home({ onSelectCharacter }) {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    async function loadProfiles() {
      const { data } = await supabase.from('ai_characters').select('*');
      if (data) setCharacters(data);
    }
    loadProfiles();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Select an AI Companion</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {characters.map((char) => (
          <div key={char.id} style={{ background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '160px', background: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
              👤
            </div>
            <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{char.name}</h4>
                <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 15px 0', lineHeight: '1.4' }}>{char.personality}</p>
              </div>
              <button 
                onClick={() => onSelectCharacter(char)}
                style={{ width: '100%', padding: '10px', background: '#ff4d94', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Start Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}