import React, {useState, useEffect} from 'react'; 
import './Components.css'; 

function FriendsEnemyList({friend}){

    const [enemies, setEnemies] = useState([]);
  const [openEnemyId, setOpenEnemyId] = useState(null);
  

    const fetchFriendEnemiesData = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/enemy/${friend.friendUserId}`);
        
        if(response.ok){
            const data = await response.json();
            setEnemies(data);
        }
    } catch (error) {
        console.error('❌ Fel vid hämtning:', error);
    }
};



    useEffect(() => {
    if (friend?.friendUserId) {
      fetchFriendEnemiesData();
    }
  }, [friend?.friendUserId]);

    useEffect(() => {
  }, [enemies]);

const handleToggleReason = (enemyId) => {
  setOpenEnemyId(prev => (prev === enemyId ? null : enemyId));
};

return (
    <div className="friend-enemy-list">
      <h3>Enemies of {friend.friendName || 'Unknown User'}</h3>

      {enemies.length > 0 ? (
        enemies.map((enemy) => (
          <div id="dropdown" key={enemy.id}>
            <p
              id="nameAndRank"
              onClick={() => handleToggleReason(enemy.id)}
              style={{ cursor: 'pointer' }}
            >
              {enemy.rank}. {enemy.name}
              
            </p>
            <p id="nameAndRankshow" className={openEnemyId === enemy.id ? 'reason-visible' : 'reason-hidden'}>
              {enemy.reason}
            </p>
          </div>
        ))
      ) : (
        <p1>No enemies</p1>
      )}
    </div>
  );

}

  
    
  

export default FriendsEnemyList;