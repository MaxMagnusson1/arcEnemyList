import React, { useState } from "react";

function EnemyForm({ onEnemyAdded, user }) {
    const [formData, setFormData] = useState({
        name: '',
        reason: '',
        rank: 1
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rank' ? parseInt(value) || 1 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/enemy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    UserId: user.id 
                }),
            });


           if (response.ok) {
    const newEnemy = await response.json();
    
    if (onEnemyAdded) {
        onEnemyAdded(newEnemy);
    }
    
    setFormData({ name: '', reason: '', rank: 1 });
} else {
    const error = await response.text();
    console.error('❌ Backend error:', error);
    alert('Fel vid skapande av enemy');
}
        } catch (error) {
            console.error('💥 Network error:', error);
            alert('Nätverksfel - kontrollera att backend körs');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} id="enemy-form">
            <input id="name" 
                type="text" 
                name="name"
                placeholder="Enemy Name" 
                value={formData.name}
                onChange={handleChange}
                required
            /> 
             <br></br>
        <textarea id="reason"
            name="reason"
            placeholder="Reason" 
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            required
        />
             <br></br>
            <input id="ranking"
                type="number" 
                name="rank"
                placeholder="Rank (1-10)" 
                value={formData.rank}
                onChange={handleChange}
                min="1"
                max="10000"
            />
             <br></br>
            <button id="submit-button" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Enemy!'}
            </button>
        </form>
    );
}

export default EnemyForm;