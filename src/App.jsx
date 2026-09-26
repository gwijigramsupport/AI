import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Chat from './pages/Chat';

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Check initial login session state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
      setCheckingSession(false);
    });

    // Listen live for auth state transitions (sign-in / sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checkingSession) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Loading sessions...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>
      <Navbar />
      
      {!user ? (
        // Route to Auth page if no active user session exists
        <Auth onSessionActive={setUser} />
      ) : !selectedCharacter ? (
        // Route to character select page if user is logged in
        <Home onSelectCharacter={setSelectedCharacter} />
      ) : (
        // Load active chat panel
        <Chat character={selectedCharacter} onBack={() => setSelectedCharacter(null)} />
      )}
    </div>
  );
}