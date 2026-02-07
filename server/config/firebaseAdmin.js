const admin = require('firebase-admin');
const path = require('path');

try {
    // Initialize Firebase Admin with Application Default Credentials (ADC)
    // In local development, set GOOGLE_APPLICATION_CREDENTIALS to the path of your federation config JSON.
    // In production (AWS), credentials will be automatically resolved via IAM Roles.
    admin.initializeApp();
    console.log('Firebase Admin initialized successfully (using Application Default Credentials)');
} catch (error) {
    console.error('Failed to initialize Firebase Admin:', error.message);
    console.warn('Proceeding without Firebase Admin. Verification will fail.');
}

module.exports = admin;
