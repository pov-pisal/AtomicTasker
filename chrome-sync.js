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
    console.log('Initializing Chrome Sync Storage...');

    // Listen for storage changes from other devices
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync') {
            console.log('Storage changed on another device:', changes);
            handleRemoteSync(changes);
        }
    });

    // Perform initial sync on startup
    syncTasksWithChrome();

    // Periodically check for sync updates (every 30 seconds)
    setInterval(syncTasksWithChrome, 30000);

    console.log('Chrome Sync Storage initialized');
}

// ============================================================================
// TASK SYNCHRONIZATION
// ============================================================================

/**
 * Sync tasks with Chrome cloud storage
 */
function syncTasksWithChrome() {
    if (chromeSyncState.isSyncing) {
        console.log('Sync already in progress...');
        return;
    }

    chromeSyncState.isSyncing = true;

    // Get local tasks
    chrome.storage.local.get(['tasks', 'categories'], (localData) => {
        // Get cloud tasks
        chrome.storage.sync.get(['tasks', 'categories', 'lastModified'], (cloudData) => {
            try {
                const localTasks = localData.tasks || [];
                const cloudTasks = cloudData.tasks || [];
                const localCategories = localData.categories || [];
                const cloudCategories = cloudData.categories || [];

                // Merge tasks intelligently
                const mergedTasks = mergeTasks(localTasks, cloudTasks, cloudData.lastModified);
                const mergedCategories = mergeCategories(localCategories, cloudCategories);

                // Update cloud storage
                chrome.storage.sync.set({
                    tasks: mergedTasks,
                    categories: mergedCategories,
                    lastModified: new Date().toISOString(),
                });

                // Update local storage if cloud had newer data
                chrome.storage.local.set({
                    tasks: mergedTasks,
                    categories: mergedCategories,
                });

                chromeSyncState.lastSyncTime = new Date();
                console.log('✅ Sync complete. Tasks synced:', mergedTasks.length);

                // Notify popup to refresh UI
                if (typeof updateTasksUI === 'function') {
                    updateTasksUI();
                }
            } catch (error) {
                console.error('Sync error:', error);
            } finally {
                chromeSyncState.isSyncing = false;
            }
        });
    });
}

// ============================================================================
// TASK MERGING (CONFLICT RESOLUTION)
// ============================================================================

/**
 * Intelligently merge local and cloud tasks
 * @param {Array} localTasks - Tasks from local storage
 * @param {Array} cloudTasks - Tasks from cloud storage
 * @param {string} lastSyncTime - Last sync timestamp
 * @returns {Array} Merged tasks
 */
function mergeTasks(localTasks, cloudTasks, lastSyncTime) {
    if (!cloudTasks || cloudTasks.length === 0) {
        return localTasks;
    }

    // Create maps for quick lookup
    const cloudMap = new Map(cloudTasks.map(t => [t.id, t]));
    const localMap = new Map(localTasks.map(t => [t.id, t]));

    // Merge logic: take newer version based on modifiedAt timestamp
    const merged = new Map(cloudMap);

    localTasks.forEach(localTask => {
        const cloudTask = cloudMap.get(localTask.id);

        if (!cloudTask) {
            // Task only in local - add it
            merged.set(localTask.id, localTask);
        } else {
            // Task in both - compare timestamps
            const localTime = new Date(localTask.modifiedAt || 0);
            const cloudTime = new Date(cloudTask.modifiedAt || 0);

            if (localTime > cloudTime) {
                // Local is newer
                merged.set(localTask.id, localTask);
            } else {
                // Cloud is newer (or same)
                merged.set(localTask.id, cloudTask);
            }
        }
    });

    // Remove tasks that were deleted in cloud
    cloudTasks.forEach(cloudTask => {
        if (!localMap.has(cloudTask.id) && cloudTask.deleted) {
            merged.delete(cloudTask.id);
        }
    });

    return Array.from(merged.values());
}

/**
 * Merge categories
 * @param {Array} localCategories
 * @param {Array} cloudCategories
 * @returns {Array} Merged categories
 */
function mergeCategories(localCategories, cloudCategories) {
    if (!cloudCategories || cloudCategories.length === 0) {
        return localCategories;
    }

    const merged = new Map(cloudCategories.map(c => [c.id, c]));
    
    localCategories.forEach(localCat => {
        const cloudCat = Array.from(merged.values()).find(c => c.id === localCat.id);
        if (!cloudCat) {
            merged.set(localCat.id, localCat);
        }
    });

    return Array.from(merged.values());
}

// ============================================================================
// REMOTE SYNC HANDLING
// ============================================================================

/**
 * Handle sync data from other devices
 * @param {Object} changes - Storage changes from chrome.storage.onChanged
 */
function handleRemoteSync(changes) {
    console.log('Handling remote sync changes:', changes);

    // Get updated data
    chrome.storage.sync.get(['tasks', 'categories'], (cloudData) => {
        chrome.storage.local.get(['tasks', 'categories'], (localData) => {
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

            chrome.storage.local.set({
                tasks: mergedTasks,
                categories: mergedCategories,
            });

            console.log('✅ Remote sync applied. Tasks updated:', mergedTasks.length);

            // Refresh UI if available
            if (typeof updateTasksUI === 'function') {
                updateTasksUI();
            }
        });
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
    task.modifiedAt = new Date().toISOString();
    if (!task.id) {
        task.id = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Update local storage
    chrome.storage.local.get(['tasks'], (data) => {
        const tasks = data.tasks || [];
        const existingIndex = tasks.findIndex(t => t.id === task.id);

        if (existingIndex >= 0) {
            tasks[existingIndex] = task;
        } else {
            tasks.push(task);
        }

        chrome.storage.local.set({ tasks });

        // Sync to cloud
        syncTasksWithChrome();
    });
}

/**
 * Delete a task and sync to cloud
 * @param {string} taskId - Task ID to delete
 */
function deleteTaskWithSync(taskId) {
    chrome.storage.local.get(['tasks'], (data) => {
        const tasks = (data.tasks || []).filter(t => t.id !== taskId);
        chrome.storage.local.set({ tasks });

        // Sync to cloud
        syncTasksWithChrome();
    });
}

/**
 * Update task completion status and sync
 * @param {string} taskId - Task ID
 * @param {boolean} isCompleted - Completion status
 */
function updateTaskCompletionWithSync(taskId, isCompleted) {
    chrome.storage.local.get(['tasks'], (data) => {
        const tasks = data.tasks || [];
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            task.completed = isCompleted;
            task.modifiedAt = new Date().toISOString();
            if (isCompleted && !task.completedAt) {
                task.completedAt = new Date().toISOString();
            }

            chrome.storage.local.set({ tasks });
            syncTasksWithChrome();
        }
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
        
        console.log(`Sync storage: ${bytesInUse}/${quotaBytes} bytes (${percentUsed.toFixed(2)}% used)`);
        
        if (percentUsed > 80) {
            console.warn('⚠️ Sync storage nearly full!');
        }
    });
}

// ============================================================================
// EXPORT FOR USE
// ============================================================================

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChromeSync);
} else {
    initializeChromeSync();
}
