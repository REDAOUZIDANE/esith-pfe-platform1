import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.join(__dirname, '../../firebase-service-account.json'));

let auth: admin.auth.Auth;

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    auth = admin.auth();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.warn('Firebase initialization failed. Using development mock auth.');
    console.error(error);
    // Mock enough for the app not to crash, but it won't be able to verify real tokens
    auth = {
        verifyIdToken: async (token: string) => {
            console.log('MOCK verifyIdToken for:', token);
            // In dev mode, we could allow a specific "test-token"
            if (token === 'dev-token') return { uid: 'dev-user-id', email: 'test@esith.net' } as any;
            throw new Error('Invalid token');
        }
    } as any;
}

export { auth };
