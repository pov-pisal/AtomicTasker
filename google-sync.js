/*
 * ATOMIC TASKER - Google Sync Module (DEPRECATED)
 * 
 * This module is kept for backward compatibility but is no longer used.
 * The extension now uses Chrome Sync Storage for cross-device synchronization.
 * 
 * Chrome Sync advantages:
 * - No OAuth verification needed
 * - Automatic cross-device sync
 * - Built-in to Chrome
 * - 100% free
 */

// Module disabled - using chrome-sync.js instead
console.log('ℹ️  Google Sync module loaded but disabled (using Chrome Sync Storage)');

// Stub functions for backward compatibility
async function signInWithGoogle() {
    console.warn('Google Sync is disabled. Using Chrome Sync Storage instead.');
    return false;
}

async function signOutFromGoogle() {
    console.warn('Google Sync is disabled. Using Chrome Sync Storage instead.');
}

async function syncTasksToGoogle() {
    console.warn('Google Sync is disabled. Using Chrome Sync Storage instead.');
    return false;
}

async function initializeGoogleSync() {
    console.log('Google Sync disabled. Chrome Sync Storage is active.');
}

// Do NOT initialize automatically
console.log('✅ Google Sync module ready (disabled - Chrome Sync in use)');
