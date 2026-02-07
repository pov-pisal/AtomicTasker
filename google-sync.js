/*
 * ATOMIC TASKER - Google Sync Module (DEPRECATED)
 * 
 * This module is kept for backward compatibility but is no longer actively used.
 * The extension now uses Chrome Sync Storage for cross-device synchronization.
 * 
 * Reasons for deprecation:
 * - Chrome Sync Storage: No OAuth verification needed, built-in to Chrome, 100% free
 * - Simpler user experience without additional account setup
 * - Better privacy with local-first sync approach
 */

// Stub functions for backward compatibility - no-op implementations
const GoogleSyncModule = {
    /**
     * Sign in with Google
     * @deprecated Use Chrome Sync Storage instead
     */
    signIn: async () => {
        logWarn('Google Sync is disabled. Chrome Sync Storage is active.');
        return false;
    },

    /**
     * Sign out from Google
     * @deprecated Use Chrome Sync Storage instead
     */
    signOut: async () => {
        logWarn('Google Sync is disabled. Chrome Sync Storage is active.');
    },

    /**
     * Sync tasks to Google
     * @deprecated Use Chrome Sync Storage instead
     */
    syncTasks: async () => {
        logWarn('Google Sync is disabled. Chrome Sync Storage is active.');
        return false;
    },

    /**
     * Initialize Google Sync
     * @deprecated Use Chrome Sync Storage instead
     */
    initialize: async () => {
        logInfo('Google Sync module disabled - Chrome Sync Storage is active');
    }
};

// Legacy function wrappers for backward compatibility
async function signInWithGoogle() {
    return GoogleSyncModule.signIn();
}

async function signOutFromGoogle() {
    return GoogleSyncModule.signOut();
}

async function syncTasksToGoogle() {
    return GoogleSyncModule.syncTasks();
}

async function initializeGoogleSync() {
    return GoogleSyncModule.initialize();
}

// Log module status
logInfo('Google Sync module ready (disabled - Chrome Sync Storage in use)');
