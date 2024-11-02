import React, { useState } from 'react';
import { signInWithEmail } from '@/utils/firebase.utils.ts';
import { FirebaseError } from 'firebase/app';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmail(email, password);
            console.log('Sign-in successful');
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
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 max-w-md">
            <h2 className="text-center p-2">Please Sign In</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input className="border border-gray-300 rounded-md p-2 items-start w-2/3 self-center"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input className="border border-gray-300 rounded-md p-2 items-start w-2/3 self-center"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" disabled={loading} className="bg-emerald-900 text-white p-2 rounded-md w-20 self-center">
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SignIn;
