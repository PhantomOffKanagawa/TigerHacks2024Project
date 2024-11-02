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
export const registerWithEmail = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

// Sign out
export const signOutApp = () => {
    return signOut(auth);
}

// Listen for authentication state to change
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user);
    } else {
        console.log('User is signed out');
    }
});
