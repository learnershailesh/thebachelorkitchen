const admin = require('firebase-admin');

try {
    const config = {
        projectId: process.env.FIREBASE_PROJECT_ID
    };

    // Initialize Firebase Admin
    // In Production (AWS): Will use Workload Identity Federation via the environment.
    // In Local Dev: If GOOGLE_APPLICATION_CREDENTIALS is set to the federation JSON, 
    // it may fail due to missing AWS metadata service. For local token verification, 
    // the projectId alone is often sufficient.
    admin.initializeApp(config);

    console.log(`Firebase Admin initialized for project: ${config.projectId || 'default'}`);
} catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
}

module.exports = admin;
