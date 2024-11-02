import admin from 'firebase-admin';

async function initializeFirebase() {
    const serviceAccount = await import('./serviceAccountKey.json', {
        assert: { type: 'json' }
    });

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount.default),
    });

    return admin.firestore();
}

const db = await initializeFirebase();

export { db };
