import React, { useState } from 'react';
import { signUpWithEmail, signInWithEmail } from '@/utils/firebase.utils.ts';
import { FirebaseError } from 'firebase/app';
import { Button } from "@/components/ui/button"

const Auth: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    setLoading(false);
                    return;
                }
                await signUpWithEmail(email, password);
                console.log('Registration successful');
            } else {
                await signInWithEmail(email, password);
                console.log('Sign-in successful');
            }
        } catch (err) {
            if (err instanceof FirebaseError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-emerald-900 text-white shadow-lg p-4 max-w-md">
            <h2 className="text-center p-2 mb-2 font-semibold">{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-gray-700 border border-gray-300 rounded-md p-2 items-start w-2/3 self-center"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="bg-gray-700 border border-gray-300 rounded-md p-2 items-start w-2/3 self-center"
                    required
                />
                {isSignUp && (
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="bg-gray-700 border border-gray-300 rounded-md p-2 items-start w-2/3 self-center"
                        required
                    />
                )}
                <Button type="submit" disabled={loading} className="bg-emerald-700 text-white mt-2 p-2 rounded-md w-20 self-center hover:bg-emerald-800">
                    {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
                </Button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: 'pointer'}} className="text-emerald-500 text-white p-2 rounded-md w-100 self-center">
                {isSignUp ? "Already have an account? Log in." : "Don't have an account? Sign up."}
            </p>
        </div>
    );
};

export default Auth;
