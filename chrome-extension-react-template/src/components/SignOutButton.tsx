import React from 'react';
import { signOutApp } from  "@/utils/firebase.utils.ts";
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react';

const SignOutButton: React.FC<{ className?: string }> = ({ className }) => {
    const handleSignOut = async () => {
        try {
            const result = await signOutApp();
            console.log(result);
            window.close();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return <Button onClick={handleSignOut} className={`bg-emerald-700/20 text-white/70 p-1.5 rounded-md w-10 self-center hover:bg-emerald-900/60 ${className}`}>
        <LogOut className="h-4 w-4" />
    </Button>;
};

export default SignOutButton;
