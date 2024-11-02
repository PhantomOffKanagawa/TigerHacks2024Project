// SignInButton.tsx
import React from 'react';
import { signInWithGooglePopup } from  "@/utils/firebase.utils.ts";

const SignInButton: React.FC = () => {
    const handleSignIn = async () => {
        try {
            const result = await signInWithGooglePopup();
            console.log('User signed in:', result.user);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    return <button onClick={handleSignIn}>Sign in with Google</button>;
};

export default SignInButton;
