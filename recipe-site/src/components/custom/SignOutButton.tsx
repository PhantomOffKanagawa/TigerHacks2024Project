import React from 'react';
import { signOutApp } from  "@/utils/firebase.utils.ts";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const SignOutButton: React.FC<{ className?: string }> = ({ className }) => {
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

    return <Button onClick={handleSignOut} className={className}>Sign Out</Button>;
};

export default SignOutButton;
