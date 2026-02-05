const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (serviceAccountPath) {
    try {
        const serviceAccount = require(path.resolve(serviceAccountPath));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error.message);
        console.warn('Proceeding without Firebase Admin. Verification will fail.');
    }
} else {
    console.warn('FIREBASE_SERVICE_ACCOUNT_PATH not found in environment. Firebase Admin not initialized.');
}

module.exports = admin;
