import { useState } from 'react';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);

    const loginUser = async (googleData) => {
        setLoading(true);
        try {
           
            const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5212';
            const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify({
                    email: googleData.email,
                    name: googleData.name,
                    googleId: googleData.sub,
                    picture: googleData.picture
                })
            });


            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Backend fel:', errorText);
                throw new Error(`Inloggning misslyckades: ${response.status}`);
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('💥 Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, loading };
};