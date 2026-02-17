import React, { useState } from 'react';
import EnemyList from '../components/EnemyList'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Friends from '../components/Friends'; 
import Navigation from '../components/Navigation';
import '../App.css'; 


function HomePageView({user, onLogout}) {
    const handleLogout = () => {
        localStorage.clear();
        onLogout();
    };

    return (
       <Router>
            <div>
                <Navigation />
                <div style={{textAlign: 'right', padding: '10px'}}>
                    {}
                    <button 
                        onClick={handleLogout}
                        style={{marginLeft: '10px', background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px'}}
                    >
                        Logga ut
                    </button>
                </div>
                <Routes>
                    <Route path="/" element={<EnemyList user={user} />} />
                    <Route path="/Friends" element={<Friends user={user} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default HomePageView;