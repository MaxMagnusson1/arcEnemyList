import React, { useState, useEffect } from 'react';
import './Components.css';
import EnemyForm from './EnemyForm';

function EnemyList({user}) {
    const [showForm, setShowForm] = useState(false);
    const [enemies, setEnemies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleReasons, setVisibleReasons] = useState(new Set());

    useEffect(() => {
        fetchEnemies();
    }, []);

   const fetchEnemies = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/enemy/${user.id}`); 
            
            if (response.ok) {
                const data = await response.json();
                setEnemies(data);
            } else {
                console.error('❌ Misslyckades att hämta fiender');
            }
        } catch (error) {
            console.error('💥 Fel vid hämtning:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnemyAdded = async (newEnemy) => {
    await fetchEnemies(); 
    setShowForm(false);
};


    const toggleReason = (enemyId) => {
        setVisibleReasons(prev => {
            const newSet = new Set(prev);
            if (newSet.has(enemyId)) {
                newSet.delete(enemyId);
            } else {
                newSet.add(enemyId);
            }
            return newSet;
        });
    };

    if (loading) {
        return <div>Loading enemies...</div>;
    }

    return (
        <div id="enemy-list">
            <h1>Enemy List</h1>
            {showForm && <EnemyForm onEnemyAdded={handleEnemyAdded} user={user} />}
            <button onClick={() => setShowForm(!showForm)} id="cancel-enemy-button">
                {showForm ? 'Cancel' : '+'}
            </button>

            <ul>
                {enemies.length > 0 ? (
                    enemies
                        .sort((a, b) => a.rank - b.rank)
                        .map((enemy, index) => (
                            <div 
                                id="enemy-div" 
                                key={enemy.id}
                            >
                                <div className="enemy-row" onClick={() => toggleReason(enemy.id)}>
                                    <div className="enemy-main">
                                        <strong>{enemy.rank}.{enemy.name}</strong>
                                        <p className={visibleReasons.has(enemy.id) ? 'reason-visible' : 'reason-hidden'}>
                                            {enemy.reason}
                                        </p>
                                    </div>
                                    <button
                                        className="trash-btn"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (!window.confirm(`Ta bort ${enemy.name}?`)) return;
                                            try {
                                                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/enemy/${enemy.id}?userId=${user.id}`, {
                                                    method: 'DELETE'
                                                });
                                                if (res.ok) {
                                                    const updated = await res.json();
                                                    setEnemies(updated);
                                                } else {
                                                    const text = await res.text();
                                                    console.error('Delete failed', text);
                                                    alert('Kunde inte ta bort fienden');
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert('Nätverksfel vid borttagning');
                                            }
                                        }}
                                    >
                                        <svg className="trash-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M9 3v1H4v2h16V4h-5V3H9zm-3 6v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9H6z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                ) : (
                    <li>No enemies yet. Add some!</li>
                )}
            </ul>
        </div>
    );
}

export default EnemyList;