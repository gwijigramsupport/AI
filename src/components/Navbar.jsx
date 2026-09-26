import React from 'react';
import { supabase } from '../supabase';

export default function Navbar() {
  const handleLogout = () => supabase.auth.signOut();

  return (
    <nav style={{ background: '#1a1a1a', padding: '15px 20px', borderBottom: '1px solid #333', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ margin: 0, color: '#ff4d94', fontSize: '20px', letterSpacing: '1px', cursor: 'pointer' }}>🔮 X-COMPANION</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontSize: '12px', background: '#333', padding: '4px 10px', borderRadius: '12px', color: '#aaa' }}>Active</span>
        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ff4d94', color: '#ff4d94', borderRadius: '4px', padding: '3px 8px', fontSize: '12px', cursor: 'pointer' }}>Log Out</button>
      </div>
    </nav>
  );
}