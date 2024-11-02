import React from 'react';
import { signOutApp } from  "@/utils/firebase.utils.ts";
import { useNavigate } from 'react-router-dom';

const SignOutButton: React.FC = () => {
    const navigate = useNavigate();
    const handleSignOut = async () => {
        try {
            const result = await signOutApp();
            console.log(result);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
