import React from 'react';
import { signOutApp } from  "@/utils/firebase.utils.ts";
import { Button } from "@/components/ui/button"

const SignOutButton: React.FC = () => {
    const handleSignOut = async () => {
        try {
            const result = await signOutApp();
            console.log(result);
            window.close();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return <Button onClick={handleSignOut} className="bg-emerald-700 text-white p-1.5 rounded-md w-25 self-center hover:bg-emerald-900">Sign Out</Button>;
};

export default SignOutButton;
