import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' with { type: 'json' }

async function initializeFirebase() {
    // const serviceAccount = await import('./serviceAccountKey.json', {
    //     assert: { type: 'json' }
    // });

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    return admin.firestore();
}

const db = await initializeFirebase();

export { db };
