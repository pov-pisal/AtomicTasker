/*
 * ATOMIC TASKER - UTILITIES
 * Shared utility functions for storage, DOM, validation, and formatting
 */

// ============================================================================
// DOM UTILITIES
// ============================================================================

/**
 * Query selector with fallback to null
 * @param {string} selector - CSS selector
 * @returns {Element|null} DOM element or null
 */
function $(selector) {
    return document.querySelector(selector);
}

/**
 * Query selector all
 * @param {string} selector - CSS selector
 * @returns {NodeList} DOM elements
 */
function $$(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Cache DOM elements for better performance
 * @param {Object} selectors - Map of element names to selectors
 * @returns {Object} Cached DOM elements
 */
function cacheElements(selectors) {
    const cached = {};
    for (const [key, selector] of Object.entries(selectors)) {
        cached[key] = document.getElementById(selector) || document.querySelector(selector);
    }
    return cached;
}

/**
 * Show/hide DOM element
 * @param {Element} element - DOM element
 * @param {boolean} show - Whether to show or hide
 */
function toggleDisplay(element, show = true) {
    if (element) {
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    }
}

/**
 * Add/remove class from element
 * @param {Element} element - DOM element
 * @param {string} className - Class name
 * @param {boolean} add - Whether to add or remove
 */
function toggleClass(element, className, add = true) {
    if (element) {
        if (add) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }
}

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

/**
 * Get data from Chrome local storage
 * @param {string|Array} keys - Key(s) to retrieve
 * @returns {Promise<Object>} Data from storage
 */
function storageGet(keys) {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, resolve);
    });
}

/**
 * Set data in Chrome local storage
 * @param {Object} data - Data to store
 * @returns {Promise<void>}
 */
function storageSet(data) {
    return new Promise((resolve) => {
        chrome.storage.local.set(data, resolve);
    });
}

/**
 * Get data from Chrome sync storage
 * @param {string|Array} keys - Key(s) to retrieve
 * @returns {Promise<Object>} Data from sync storage
 */
function storageSyncGet(keys) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(keys, resolve);
    });
}

/**
 * Set data in Chrome sync storage
 * @param {Object} data - Data to store
 * @returns {Promise<void>}
 */
function storageSyncSet(data) {
    return new Promise((resolve) => {
        chrome.storage.sync.set(data, resolve);
    });
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Check if string is empty or whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if empty
 */
function isEmpty(str) {
    return !str || str.trim().length === 0;
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
function isValidURL(url) {
    if (isEmpty(url)) return true; // Optional field
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate date format
 * @param {string} dateStr - Date string
 * @returns {boolean} True if valid date
 */
function isValidDate(dateStr) {
    if (isEmpty(dateStr)) return true; // Optional field
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
}

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
}

/**
 * Format time since event
 * @param {string|Date} date - Date of event
 * @returns {string} Human-readable time difference
 */
function formatTimeAgo(date) {
    if (!date) return '';
    
    const now = new Date();
    const eventDate = new Date(date);
    const secondsAgo = Math.floor((now - eventDate) / 1000);

    if (secondsAgo < 60) return 'just now';
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
    if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d ago`;
    
    return formatDate(date);
}

/**
 * Get current ISO timestamp
 * @returns {string} Current timestamp in ISO format
 */
function getCurrentTimestamp() {
    return new Date().toISOString();
}

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generate unique ID
 * @param {string} prefix - Prefix for ID
 * @returns {string} Unique ID
 */
function generateId(prefix = 'item') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Find item in array by property
 * @param {Array} array - Array to search
 * @param {string} property - Property name
 * @param {*} value - Value to match
 * @returns {Object|null} Found item or null
 */
function findBy(array, property, value) {
    return array.find(item => item[property] === value) || null;
}

/**
 * Filter array by property
 * @param {Array} array - Array to filter
 * @param {string} property - Property name
 * @param {*} value - Value to match
 * @returns {Array} Filtered array
 */
function filterBy(array, property, value) {
    return array.filter(item => item[property] === value);
}

/**
 * Map array values by property
 * @param {Array} array - Array to map
 * @param {string} property - Property name
 * @returns {Array} Array of property values
 */
function mapBy(array, property) {
    return array.map(item => item[property]);
}

// ============================================================================
// CONSOLE LOGGING UTILITIES
// ============================================================================

/**
 * Log success message
 * @param {string} message - Message to log
 */
function logSuccess(message) {
    console.log(`✅ ${message}`);
}

/**
 * Log error message
 * @param {string} message - Message to log
 * @param {Error} error - Error object (optional)
 */
function logError(message, error = null) {
    console.error(`❌ ${message}`, error || '');
}

/**
 * Log info message
 * @param {string} message - Message to log
 */
function logInfo(message) {
    console.log(`ℹ️  ${message}`);
}

/**
 * Log warning message
 * @param {string} message - Message to log
 */
function logWarn(message) {
    console.warn(`⚠️  ${message}`);
}

// ============================================================================
// MERGE UTILITIES (shared by popup.js and chrome-sync.js)
// ============================================================================

/**
 * Intelligently merge two arrays based on timestamps
 * @param {Array} local - Local items
 * @param {Array} remote - Remote items
 * @returns {Array} Merged items (newer versions preferred)
 */
function mergeByTimestamp(local, remote) {
    if (!remote || remote.length === 0) return local;

    const remoteMap = new Map(remote.map(item => [item.id, item]));
    const merged = new Map(remoteMap);

    local.forEach(localItem => {
        const remoteItem = remoteMap.get(localItem.id);

        if (!remoteItem) {
            // Item only in local - add it
            merged.set(localItem.id, localItem);
        } else {
            // Item in both - use newer based on modifiedAt
            const localTime = new Date(localItem.modifiedAt || localItem.createdAt || 0);
            const remoteTime = new Date(remoteItem.modifiedAt || remoteItem.createdAt || 0);
            
            if (localTime > remoteTime) {
                merged.set(localItem.id, localItem);
            }
        }
    });

    return Array.from(merged.values());
}

// ============================================================================
// EXPORT FOR USE IN MODULES
// ============================================================================

// Note: These utilities are globally available in the extension context
