import React, { useState } from "react";
import { signUpWithEmail, signInWithEmail } from "@/utils/firebase.utils.ts";
import { FirebaseError } from "firebase/app";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from "@/components/custom/LoadingSpinner";

const Auth: React.FC<{ defaultSignUp?: boolean }> = ({ defaultSignUp = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(defaultSignUp);

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
        try {
          await signUpWithEmail(email, password);
          console.log("Registration successful");
        } catch (err) {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        await signInWithEmail(email, password);
        console.log("Sign-in successful");
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        {loading && (
            <LoadingSpinner />
        )}
      <h2 className="text-2xl font-bold text-center mb-6">{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {isSignUp && (
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading
            ? isSignUp
              ? "Signing Up..."
              : "Logging In..."
            : isSignUp
              ? "Sign Up"
              : "Log In"}
        </Button>
      </form>
      {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
      <Button
        variant="link"
        onClick={() => {setIsSignUp(!isSignUp); console.log(isSignUp)}}
        className="bg-blue-900/10 text-blue-500 focus:text-blue-400 hover:text-blue-600 mt-4 mx-auto w-full"
      >
        {isSignUp
          ? "Already have an account? Log in."
          : "Don't have an account? Sign up."}
      </Button>
    </div>
  );
};

export default Auth;
