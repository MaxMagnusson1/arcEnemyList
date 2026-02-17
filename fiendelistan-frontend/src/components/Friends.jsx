import React, { useState, useEffect } from "react";
import './Components.css'
import FriendsEnemyList from './FriendsEnemyList'

function Friends({user}){
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    useEffect(() => {
        fetchFriends();
    }, []);

     const fetchFriends = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friend/${user.id}`); 
            
            if (response.ok) {
                const data = await response.json();
                setFriends(data);
            }
        } catch (error) {
            console.error('💥 Fel vid hämtning:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchUsers = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friend/search/${encodeURIComponent(searchTerm.trim())}`);
            
            if (response.ok) {
                const users = await response.json();
                setSearchResults(users);
            } else {
                console.error('❌ Fel vid sökning');
                setSearchResults([]);
            }
        } catch (error) {
            console.error('💥 Fel vid sökning:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddFriend = async (selectedUser) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserId: user.id,
                    FriendUserId: selectedUser.id 
                }),
            });

            if (response.ok) {
                const newFriend = await response.json();
                await fetchFriends(); 
                setSearchTerm('');
                setSearchResults([]);
                setShowForm(false);
                alert(`${selectedUser.name} är nu din vän!`);
            } else {
                const errorText = await response.text();
                console.error('❌ Misslyckades att lägga till vän:', errorText);
                alert(errorText || 'Kunde inte lägga till vän. Försök igen.');
            }
        } catch (error) {
            console.error('💥 Nätverksfel:', error);
            alert('Nätverksfel. Kontrollera att backend körs.');
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        searchUsers(value);
    };

    if (loading) {
        return <div>Loading friends...</div>;
    }
    
    return (
        <div id="friend-list">
            <p id="friends-header">Friends</p>

            {showForm && (
                <div id="friend-form">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Sök på namn, email!"
                        id="friend-search-input"
                    />
                    
                    {isSearching && <p>Söker...</p>}
                    
                    {searchResults.length > 0 && (
                        <div id="search-results">
                            <h4>Sökresultat:</h4>
                            {searchResults.map(user => (
                                <div key={user.id} className="search-result-item">
                                    <div className="user-info">
                                        <strong>{user.name}</strong>
                                        <br />
                                        <small>{user.email}</small>
                                        <br />
                                        <small>ID: {user.shortId}</small>
                                    </div>
                                    <button 
                                        onClick={() => handleAddFriend(user)}
                                        className="add-friend-btn"
                                    >
                                        Lägg till som vän
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {searchTerm && !isSearching && searchResults.length === 0 && (
                        <p>Inga användare hittades för "{searchTerm}"</p>
                    )}
                    
                    <button 
                        type="button" 
                        onClick={() => {
                            setShowForm(false);
                            setSearchTerm('');
                            setSearchResults([]);
                        }}
                        id="cancel-friend-button"
                    >
                        Avbryt
                    </button>
                </div>
            )}

            <div className={`friends-layout ${selectedFriend ? 'friends-layout--split' : 'friends-layout--single'}`}>
                <div className="friends-column friends-column-left">
                    <div id="friend-con">
                        {friends.length > 0 ? (
                            friends.map(friend => (
                                <div key={friend.id} className="friends">
                                    <div
                                        className="friend-display"
                                        onClick={() => setSelectedFriend(friend)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <strong>{friend.friendName || 'Okänd användare'}</strong>
                                        {friend.friendEmail && (
                                            <div className="friend-email">{friend.friendEmail}</div>
                                        )}
                                        {}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="friends no-friends-message">
                                Inga vänner än. Klicka på + för att lägga till!
                            </div>
                        )}
                    </div>

                    {!showForm && (
                        <div className="add-friends-wrap">
                            <button
                                id="add-friends"
                                onClick={() => setShowForm(true)}
                            >
                                +
                            </button>
                            <p2 className="add-friends-text">Add friends</p2>
                        </div>
                    )}

                </div>

                {selectedFriend && (
                    <div className="friends-column friends-column-right">
                        <FriendsEnemyList
                            friend={selectedFriend}
                            user={user}
                            onClose={() => setSelectedFriend(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
    
}

export default Friends; 