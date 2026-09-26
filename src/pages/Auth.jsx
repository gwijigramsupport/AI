import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function Auth({ onSessionActive }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Registration successful! Please check your email for verification.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data?.session) onSessionActive(data.session.user);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '20px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', color: '#fff', fontFamily: 'sans-serif' }}>
      <h3 style={{ textAlign: 'center', color: '#ff4d94', margin: '0 0 20px 0' }}>
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h3>
      
      {errorMsg && <div style={{ background: 'rgba(255, 77, 148, 0.1)', border: '1px solid #ff4d94', padding: '10px', borderRadius: '6px', fontSize: '13px', color: '#ff4d94', marginBottom: '15px' }}>{errorMsg}</div>}

      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Email Address</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', background: '#252525', border: '1px solid #333', borderRadius: '6px', color: '#fff' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', background: '#252525', border: '1px solid #333', borderRadius: '6px', color: '#fff' }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '12px', background: '#ff4d94', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '13px', color: '#aaa', marginTop: '20px' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span onClick={() => setIsSignUp(!isSignUp)} style={{ color: '#ff4d94', cursor: 'pointer', fontWeight: 'bold' }}>
          {isSignUp ? 'Log In' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
}