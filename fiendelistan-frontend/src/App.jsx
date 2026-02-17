import React, { useState, useEffect } from 'react';
import './App.css';
import GoogleLoginButton from './components/GoogleLoginButton';
import HomePageView from './views/HomePageView';
import { useAuth } from './backEndcommunication/UseAut';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleGoogleSuccess = async (googleUserData) => {
    setLoading(true);
    try {
      
      const backendUser = await loginUser(googleUserData);
      
      
      localStorage.setItem('user', JSON.stringify(backendUser));
      setUser(backendUser);
      
    } catch (error) {
      console.error('❌ Backend-fel:', error);
      alert('Något gick fel vid inloggning. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        <>
          <h1 className="loginHeader">Archenemy list 🔥</h1>
          <h2 className="loginHeader">Login or create an account to begin your list journey</h2>
          
          {loading ? (
            <p>Loggar in...</p>
          ) : (
            <GoogleLoginButton onSuccess={handleGoogleSuccess} />
          )}
          
          <p className="credits">
            Fun projekt developed by Max Magnusson <br />
            Inspired by Sheldon Coopers archenemy list
          </p>
        </>
      ) : (
        <HomePageView user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
