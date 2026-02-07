/*
 * ATOMIC TASKER - CHROME SYNC MODULE
 * Handles automatic task synchronization across Chrome devices
 * Uses chrome.storage.sync for free, built-in cross-device sync
 */

// ============================================================================
// CHROME SYNC STATE
// ============================================================================

let chromeSyncState = {
    isSyncing: false,
    lastSyncTime: null,
    syncQueue: [],
    conflictResolution: 'local-first', // or 'remote-first'
};

// ============================================================================
// SYNC INITIALIZATION
// ============================================================================

/**
 * Initialize Chrome Sync Storage
 * Sets up listeners and performs initial sync
 */
function initializeChromeSync() {
    logInfo('Initializing Chrome Sync Storage...');

    // Listen for storage changes from other devices
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync') {
            logInfo('Storage changed on another device');
            handleRemoteSync(changes);
        }
    });

    // Perform initial sync on startup
    syncTasksWithChrome();

    // Periodically check for sync updates (every 30 seconds)
    setInterval(syncTasksWithChrome, 30000);

    logSuccess('Chrome Sync Storage initialized');
}

// ============================================================================
// TASK SYNCHRONIZATION
// ============================================================================

/**
 * Sync tasks with Chrome cloud storage
 * Uses Promise-based storage API for cleaner code
 */
function syncTasksWithChrome() {
    if (chromeSyncState.isSyncing) {
        logInfo('Sync already in progress...');
        return;
    }

    chromeSyncState.isSyncing = true;

    Promise.all([
        storageGet(['tasks', 'categories']),
        storageSyncGet(['tasks', 'categories', 'lastModified'])
    ])
    .then(([localData, cloudData]) => {
        const localTasks = localData.tasks || [];
        const cloudTasks = cloudData.tasks || [];
        const localCategories = localData.categories || [];
        const cloudCategories = cloudData.categories || [];

        // Merge tasks intelligently
        const mergedTasks = mergeTasks(localTasks, cloudTasks, cloudData.lastModified);
        const mergedCategories = mergeCategories(localCategories, cloudCategories);

        // Update cloud storage
        return Promise.all([
            storageSyncSet({
                tasks: mergedTasks,
                categories: mergedCategories,
                lastModified: getCurrentTimestamp(),
            }),
            storageSet({
                tasks: mergedTasks,
                categories: mergedCategories,
            })
        ]).then(() => {
            chromeSyncState.lastSyncTime = new Date();
            logSuccess(`Sync complete. Tasks synced: ${mergedTasks.length}`);

            // Notify popup to refresh UI
            if (typeof updateTasksUI === 'function') {
                updateTasksUI();
            }
        });
    })
    .catch((error) => {
        logError('Sync error', error);
    })
    .finally(() => {
        chromeSyncState.isSyncing = false;
    });
}

// ============================================================================
// TASK MERGING (CONFLICT RESOLUTION)
// ============================================================================

/**
 * Intelligently merge local and cloud tasks
 * Uses shared utility function from utils.js
 * @param {Array} localTasks - Tasks from local storage
 * @param {Array} cloudTasks - Tasks from cloud storage
 * @param {string} lastSyncTime - Last sync timestamp (unused, for compatibility)
 * @returns {Array} Merged tasks
 */
function mergeTasks(localTasks, cloudTasks, lastSyncTime) {
    return mergeByTimestamp(localTasks, cloudTasks);
}

/**
 * Merge categories
 * @param {Array} localCategories
 * @param {Array} cloudCategories
 * @returns {Array} Merged categories
 */
function mergeCategories(localCategories, cloudCategories) {
    return mergeByTimestamp(localCategories, cloudCategories);
}

// ============================================================================
// REMOTE SYNC HANDLING
// ============================================================================

/**
 * Handle sync data from other devices
 * @param {Object} changes - Storage changes from chrome.storage.onChanged
 */
function handleRemoteSync(changes) {
    logInfo('Handling remote sync changes...');

    Promise.all([
        storageSyncGet(['tasks', 'categories']),
        storageGet(['tasks', 'categories'])
    ])
    .then(([cloudData, localData]) => {
        // Merge and update local storage
        const mergedTasks = mergeTasks(
            localData.tasks || [],
            cloudData.tasks || [],
            cloudData.lastModified
        );
        const mergedCategories = mergeCategories(
            localData.categories || [],
            cloudData.categories || []
        );

        return storageSet({
            tasks: mergedTasks,
            categories: mergedCategories,
        }).then(() => {
            logSuccess(`Remote sync applied. Tasks updated: ${mergedTasks.length}`);

            // Refresh UI if available
            if (typeof updateTasksUI === 'function') {
                updateTasksUI();
            }
        });
    })
    .catch((error) => {
        logError('Remote sync error', error);
    });
}

// ============================================================================
// ADD/UPDATE TASK WITH SYNC
// ============================================================================

/**
 * Add or update a task and sync to cloud
 * @param {Object} task - Task object
 */
function addTaskWithSync(task) {
    // Ensure task has required sync properties
    task.modifiedAt = getCurrentTimestamp();
    if (!task.id) {
        task.id = generateId('task');
    }

    // Update local storage and sync
    storageGet(['tasks'])
        .then((data) => {
            const tasks = data.tasks || [];
            const existingIndex = tasks.findIndex(t => t.id === task.id);

            if (existingIndex >= 0) {
                tasks[existingIndex] = task;
            } else {
                tasks.push(task);
            }

            return storageSet({ tasks }).then(() => {
                syncTasksWithChrome();
            });
        })
        .catch((error) => {
            logError('Failed to add task', error);
        });
}

/**
 * Delete a task and sync to cloud
 * @param {string} taskId - Task ID to delete
 */
function deleteTaskWithSync(taskId) {
    storageGet(['tasks'])
        .then((data) => {
            const tasks = (data.tasks || []).filter(t => t.id !== taskId);
            return storageSet({ tasks }).then(() => {
                syncTasksWithChrome();
            });
        })
        .catch((error) => {
            logError('Failed to delete task', error);
        });
}

/**
 * Update task completion status and sync
 * @param {string} taskId - Task ID
 * @param {boolean} isCompleted - Completion status
 */
function updateTaskCompletionWithSync(taskId, isCompleted) {
    storageGet(['tasks'])
        .then((data) => {
            const tasks = data.tasks || [];
            const task = tasks.find(t => t.id === taskId);

            if (task) {
                task.completed = isCompleted;
                task.modifiedAt = getCurrentTimestamp();
                if (isCompleted && !task.completedAt) {
                    task.completedAt = getCurrentTimestamp();
                }

                return storageSet({ tasks }).then(() => {
                    syncTasksWithChrome();
                });
            }
        })
        .catch((error) => {
            logError('Failed to update task completion', error);
        });
}

// ============================================================================
// SYNC STATUS
// ============================================================================

/**
 * Get current sync status
 * @returns {Object} Sync status info
 */
function getSyncStatus() {
    return {
        isSyncing: chromeSyncState.isSyncing,
        lastSyncTime: chromeSyncState.lastSyncTime,
        status: chromeSyncState.isSyncing ? 'syncing' : 'idle',
    };
}

/**
 * Force immediate sync
 */
function forceSyncNow() {
    console.log('Force syncing now...');
    chromeSyncState.isSyncing = false; // Allow sync to proceed
    syncTasksWithChrome();
}

// ============================================================================
// STORAGE QUOTA CHECK
// ============================================================================

/**
 * Check Chrome Sync storage quota
 */
function checkSyncQuota() {
    chrome.storage.sync.getBytesInUse((bytesInUse) => {
        const quotaBytes = chrome.storage.sync.QUOTA_BYTES || 102400; // 100KB
        const percentUsed = (bytesInUse / quotaBytes) * 100;
        
        logInfo(`Sync storage: ${bytesInUse}/${quotaBytes} bytes (${percentUsed.toFixed(2)}% used)`);
        
        if (percentUsed > 80) {
            logWarn('Sync storage nearly full!');
        }
    });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChromeSync);
} else {
    initializeChromeSync();
}
