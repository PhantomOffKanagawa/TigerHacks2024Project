import React from 'react';
import { signOutApp } from  "@/utils/firebase.utils.ts";

const SignOutButton: React.FC = () => {
    const handleSignOut = async () => {
        try {
            const result = await signOutApp();
            console.log(result);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
