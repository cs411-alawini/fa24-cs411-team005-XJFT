import './Login.css';
import React from "react";
import { useEffect } from "react";


const Login: React.FC = () => {
    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'missing!';

    useEffect(() => {
        const initGoogleSignin = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                window.google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    callback: handleCredentialResponse,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById('g_id_signin'),
                    { theme: 'outline', size: 'large' }
                );
            };
            document.body.appendChild(script);
        };

        initGoogleSignin();
    }, [CLIENT_ID]);

    const handleCredentialResponse = (response: any) => {
        console.log('Signed in');
        const responsePayload = decodeJwtResponse(response.credential);

        console.log('ID: ', responsePayload.sub);
        console.log('Full Name: ', responsePayload.name);
        console.log('Image URL: ', responsePayload.picture);
        console.log('Email: ', responsePayload.email);

        fetch('http://34.56.124.135:5002/api/oauth2/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential: response.credential }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                console.log('Authentication succeeded');
                sessionStorage.setItem('user_image', data.user.profile);
                window.location.href = '/index';
            } else {
                console.error('Authentication failed:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const decodeJwtResponse = (token: string) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
    }

    return (
        <div className="login-container">
            <h1>
                Welcome to PC Studio
            </h1>
            <div id="g_id_signin"></div>
        </div>
    );
};

export default Login;