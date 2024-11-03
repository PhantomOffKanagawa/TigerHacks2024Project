import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Sign in with email and password
export const signInWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Register a new user
export const signUpWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Call the register API to save the user in Firestore
        await fetch(import.meta.env.VITE_API_ENDPOINT.concat('/users/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        console.log('User registered successfully in Firestore');
        return userCredential;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Sign out
export const signOutApp = async () => {
    try {
        await signOut(auth);
        await chrome.storage.local.remove("userId");
        console.log('User signed out');
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// Listen for authentication state to change
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userId = user.uid;
        await chrome.storage.local.set({ userId });
        console.log('User is signed in:', user);
    } else {
        await chrome.storage.local.remove("userId");
        console.log('User is signed out');
    }
});
