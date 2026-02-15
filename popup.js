/*
 * ATOMIC TASKER - Popup JavaScript
 * 
 * Handles all core functionality:
 * - Task management (add, edit, delete, complete)
 * - Category management (create, delete, assign)
 * - Data persistence using chrome.storage.local
 * - Motivational quotes display
 * - Real-time UI updates and event handling
 */

// ============================================================================
// MOTIVATIONAL QUOTES DATABASE
// ============================================================================

const motivationalQuotes = [
    "Tiny progress still counts. Keep going! 🎯",
    "Done is better than perfect. Take the next step. 💪",
    "Small wins compound into big victories. 🚀",
    "Consistency beats intensity. Show up today. 📅",
    "One task at a time. You've got this! ⚛",
    "Progress over perfection. Every step matters. 📈",
    "Build your future habit by habit. 🏗️",
    "The best time is now. Let's start! ⏰",
    "You don't need to be great to start, but you need to start to be great. 🌟",
    "Success is the sum of small efforts. 💎",
    "Your future self will thank you for today's work. 🙏",
    "Focus on what you can control today. 🎪",
    "Small actions, big results over time. 📊",
    "Make it so easy you can't say no. ✨",
    "Today is a chance to be better. 💫",
];

// Popular emoji list for quick selection
const popularEmojis = [
    '💻', '📚', '🧘', '💪', '🎯', '🏆', '⭐', '🔥', '🎨', '🎵', '🏃', '🍎', '😴', '🧠', '📞',
    '✈️', '🎬', '🎮', '📱', '🎓', '📊', '💼', '🌟', '🚀', '🎁', '🏥', '⚽', '🎪', '🍕', '🏠',
    '📝', '🔐', '⏰', '🌍', '💡', '🎤', '📸', '🎸', '🏋️', '🌈', '🍎', '🔔', '📌', '🎯', '✅'
];

// ============================================================================
// DOM ELEMENTS
// ============================================================================

let taskInput, categoryInput, emojiInput, categorySelect, prioritySelect, categoryFilter, taskSearchInput, sortSelect, quickAddBtn, advancedAddBtn, addCategoryBtn, tasksList, categoriesList, motivationQuote, newQuoteBtn, emptyState, emojiPickerBtn, emojiPicker, editModal, editTaskInput, editCategorySelect, editPrioritySelect, editTaskNotes, editTaskLink, editTaskDate, saveEditBtn, advancedAddModal, advTaskInput, advCategorySelect, advPrioritySelect, advTaskNotes, advTaskLink, advTaskDate, advAddBtn, advCancelBtn, completedTasksList, completedEmptyState, signInBtn, signOutBtn, userInfo, userEmail, syncStatus, syncStatusText, syncNowBtn, editCategoryModal, editCategoryEmojiPickerBtn, editCategoryEmojiPicker, editCategoryNameInput, saveEditCategoryBtn, editCategoryModalCloseBtn, editCategoryCancelBtn, tasksCount, completedCount, clearCompletedBtn;

function initializeDOMElements() {
    taskInput = document.getElementById('taskInput');
    categoryInput = document.getElementById('categoryInput');
    emojiInput = document.getElementById('emojiInput');
    categorySelect = document.getElementById('categorySelect');
    categoryFilter = document.getElementById('categoryFilter');
    prioritySelect = document.getElementById('prioritySelect');
    sortSelect = document.getElementById('sortSelect');
    taskSearchInput = document.getElementById('taskSearchInput');
    quickAddBtn = document.getElementById('quickAddBtn');
    advancedAddBtn = document.getElementById('advancedAddBtn');
    addCategoryBtn = document.getElementById('addCategoryBtn');
    tasksList = document.getElementById('tasksList');
    completedTasksList = document.getElementById('completedTasksList');
    completedEmptyState = document.getElementById('completedEmptyState');
    categoriesList = document.getElementById('categoriesList');
    motivationQuote = document.getElementById('motivationQuote');
    newQuoteBtn = document.getElementById('newQuoteBtn');
    emptyState = document.getElementById('emptyState');
    emojiPickerBtn = document.getElementById('emojiPickerBtn');
    emojiPicker = document.getElementById('emojiPicker');
    editModal = document.getElementById('editModal');
    editTaskInput = document.getElementById('editTaskInput');
    editCategorySelect = document.getElementById('editCategorySelect');
    editPrioritySelect = document.getElementById('editPrioritySelect');
    editTaskNotes = document.getElementById('editTaskNotes');
    editTaskLink = document.getElementById('editTaskLink');
    editTaskDate = document.getElementById('editTaskDate');
    saveEditBtn = document.getElementById('saveEditBtn');
    advancedAddModal = document.getElementById('advancedAddModal');
    advTaskInput = document.getElementById('advTaskInput');
    advCategorySelect = document.getElementById('advCategorySelect');
    advPrioritySelect = document.getElementById('advPrioritySelect');
    advTaskNotes = document.getElementById('advTaskNotes');
    advTaskLink = document.getElementById('advTaskLink');
    advTaskDate = document.getElementById('advTaskDate');
    advAddBtn = document.getElementById('advAddBtn');
    advCancelBtn = document.getElementById('advCancelBtn');
    signInBtn = document.getElementById('signInBtn');
    signOutBtn = document.getElementById('signOutBtn');
    userInfo = document.getElementById('userInfo');
    userEmail = document.getElementById('userEmail');
    syncStatus = document.getElementById('syncStatus');
    syncStatusText = document.getElementById('syncStatusText');
    syncNowBtn = document.getElementById('syncNowBtn');
    editCategoryModal = document.getElementById('editCategoryModal');
    editCategoryEmojiPickerBtn = document.getElementById('editCategoryEmojiPickerBtn');
    editCategoryEmojiPicker = document.getElementById('editCategoryEmojiPicker');
    editCategoryNameInput = document.getElementById('editCategoryNameInput');
    saveEditCategoryBtn = document.getElementById('saveEditCategoryBtn');
    editCategoryModalCloseBtn = document.getElementById('editCategoryModalCloseBtn');
    editCategoryCancelBtn = document.getElementById('editCategoryCancelBtn');
    tasksCount = document.getElementById('tasksCount');
    completedCount = document.getElementById('completedCount');
    clearCompletedBtn = document.getElementById('clearCompletedBtn');
}

// ============================================================================
// CONFIRMATION DIALOG
// ============================================================================

let confirmCallback = null;

/**
 * Show a custom confirmation dialog
 * @param {string} title - The title of the confirmation
 * @param {string} message - The confirmation message
 * @param {Function} onConfirm - Callback function when user confirms
 */
function showConfirmation(title, message, onConfirm) {
    const confirmModal = document.getElementById('confirmModal');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmOkBtn = document.getElementById('confirmOkBtn');
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');

    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmCallback = onConfirm;

    confirmModal.classList.remove('hidden');

    // Clear previous listeners by cloning buttons
    const newOkBtn = confirmOkBtn.cloneNode(true);
    const newCancelBtn = confirmCancelBtn.cloneNode(true);
    confirmOkBtn.parentNode.replaceChild(newOkBtn, confirmOkBtn);
    confirmCancelBtn.parentNode.replaceChild(newCancelBtn, confirmCancelBtn);

    // Add new listeners
    newOkBtn.addEventListener('click', () => {
        confirmCallback();
        confirmModal.classList.add('hidden');
    });

    newCancelBtn.addEventListener('click', () => {
        confirmModal.classList.add('hidden');
    });
}

/**
 * Show a custom alert dialog
 * @param {string} message - The alert message
 */
function showAlert(message) {
    const confirmModal = document.getElementById('confirmModal');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmOkBtn = document.getElementById('confirmOkBtn');
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    const confirmFooter = document.querySelector('.confirm-footer');

    confirmTitle.textContent = 'Alert';
    confirmMessage.textContent = message;
    confirmOkBtn.textContent = 'OK';
    confirmOkBtn.className = 'btn-primary'; // Change button style from danger to primary

    confirmModal.classList.remove('hidden');

    // Center the footer for alerts
    confirmFooter.style.justifyContent = 'center';

    // Clear previous listeners by cloning buttons
    const newOkBtn = confirmOkBtn.cloneNode(true);
    confirmOkBtn.parentNode.replaceChild(newOkBtn, confirmOkBtn);

    // Hide cancel button for alerts
    confirmCancelBtn.classList.add('hidden');

    // Add new listener
    newOkBtn.addEventListener('click', () => {
        confirmModal.classList.add('hidden');
        confirmCancelBtn.classList.remove('hidden'); // Show it again for next use
        confirmFooter.style.justifyContent = ''; // Reset for next use
    });

    // Show cancel button again when modal is closed
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            confirmModal.classList.add('hidden');
            confirmCancelBtn.classList.remove('hidden');
        }
    });
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

// Global state object to track tasks, categories, and app state
let state = {
    tasks: [],
    categories: [],
    selectedCategoryFilter: '',
    searchQuery: '',
    sortBy: 'dueDate',
    editingTaskId: null,
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Check if wizard should be shown
 */
function checkAndShowWizard() {
    chrome.storage.local.get(['wizardCompleted'], (result) => {
        if (!result.wizardCompleted) {
            // First time user - show wizard
            window.location.href = 'setup-wizard.html';
        } else {
            // Wizard already completed - show main extension
            init();
        }
    });
}

/**
 * Initialize the extension when the popup loads
 * Loads data from storage, renders UI, and sets up event listeners
 */
function init() {
    initializeDOMElements();
    loadDataFromStorage();
    displayRandomQuote();
    setupEventListeners();
    setupEmojiPicker();
}

// ============================================================================
// CHROME STORAGE OPERATIONS
// ============================================================================

/**
 * Load tasks and categories from chrome.storage
 * Uses chrome.storage.sync for cross-device sync when available,
 * falls back to chrome.storage.local for offline access
 */
function loadDataFromStorage() {
    // First load from local storage (fast, always available)
    chrome.storage.local.get(['tasks', 'categories'], (localResult) => {
        state.tasks = localResult.tasks || [];
        state.categories = localResult.categories || [];
        
        // Then try to sync with cloud storage
        chrome.storage.sync.get(['tasks', 'categories'], (cloudResult) => {
            if (cloudResult.tasks || cloudResult.categories) {
                // Cloud has data - merge intelligently
                const cloudTasks = cloudResult.tasks || [];
                const cloudCategories = cloudResult.categories || [];
                
                // Merge tasks (keep newer versions)
                state.tasks = mergeTasks(state.tasks, cloudTasks);
                state.categories = mergeCategories(state.categories, cloudCategories);
                
                // Update local storage with merged data
                chrome.storage.local.set({
                    tasks: state.tasks,
                    categories: state.categories
                });
            }
        });
        
        // Refresh UI after loading data
        renderCategories();
        renderCategoryFilter();
        renderCategorySelect();
        renderTasks();
        renderCompletedTasks();
    });
}

/**
 * Merge tasks from local and cloud storage intelligently
 */
function mergeTasks(localTasks, cloudTasks) {
    if (!cloudTasks || cloudTasks.length === 0) return localTasks;
    
    const cloudMap = new Map(cloudTasks.map(t => [t.id, t]));
    const merged = new Map(localTasks.map(t => [t.id, t]));
    
    cloudTasks.forEach(cloudTask => {
        const localTask = merged.get(cloudTask.id);
        if (!localTask) {
            merged.set(cloudTask.id, cloudTask);
        } else {
            // Keep newer version based on modifiedAt
            const localTime = new Date(localTask.modifiedAt || localTask.createdAt || 0);
            const cloudTime = new Date(cloudTask.modifiedAt || cloudTask.createdAt || 0);
            if (cloudTime > localTime) {
                merged.set(cloudTask.id, cloudTask);
            }
        }
    });
    
    return Array.from(merged.values());
}

/**
 * Merge categories from local and cloud storage
 */
function mergeCategories(localCategories, cloudCategories) {
    if (!cloudCategories || cloudCategories.length === 0) return localCategories;
    
    const merged = new Map(localCategories.map(c => [c.id, c]));
    
    cloudCategories.forEach(cloudCat => {
        if (!merged.has(cloudCat.id)) {
            merged.set(cloudCat.id, cloudCat);
        }
    });
    
    return Array.from(merged.values());
}

/**
 * Save tasks to chrome.storage.local AND chrome.storage.sync
 * Called after any task modification
 */
function saveTasksToStorage() {
    // Save to local storage (fast, immediate)
    chrome.storage.local.set({ tasks: state.tasks });
    
    // Sync to cloud storage (for cross-device sync)
    // Add modifiedAt timestamp for conflict resolution
    const tasksForSync = state.tasks.map(t => ({
        ...t,
        modifiedAt: new Date().toISOString()
    }));
    
    chrome.storage.sync.set({ 
        tasks: tasksForSync,
        lastModified: new Date().toISOString()
    });
}

/**
 * Save categories to chrome.storage.local AND chrome.storage.sync
 * Called after any category modification
 */
function saveCategoriesToStorage() {
    // Save to local storage (fast, immediate)
    chrome.storage.local.set({ categories: state.categories });
    
    // Sync to cloud storage (for cross-device sync)
    chrome.storage.sync.set({ categories: state.categories });
}

// ============================================================================
// TASK MANAGEMENT
// ============================================================================

/**
 * Add a new task to the task list
 * Validates input and creates task object with unique ID
 */
function addTask(text, categoryId, notes = '', link = '', dueDate = '', priority = 'medium') {
    // Validate that task name is not empty
    if (!text) {
        showAlert('Please enter a task name');
        return;
    }

    // Sanitize URL to prevent security vulnerabilities
    const sanitizedLink = validateAndSanitizeUrl(link);

    // Create task object with all required properties
    const task = {
        id: Date.now(), // Unique ID based on timestamp
        text: text,
        completed: false,
        categoryId: categoryId || null,
        notes: notes,
        link: sanitizedLink,
        dueDate: dueDate,
        priority: priority || 'medium',
        completedAt: null,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        isFavorite: false,
    };

    // Add task to state and save to storage
    state.tasks.push(task);
    saveTasksToStorage();

    // Update UI
    renderTasks();
}

/**
 * Quick add task from the main input
 * Simple task without notes, link, or date
 */
function quickAddTask() {
    if (!taskInput || !categorySelect) {
        console.error('Task input or category select not initialized');
        return;
    }
    
    const taskText = taskInput.value.trim();
    const categoryId = categorySelect.value;
    const priority = prioritySelect ? prioritySelect.value : 'medium';

    if (taskText) {
        addTask(taskText, categoryId, '', '', '', priority);
        
        // Clear inputs
        taskInput.value = '';
        categorySelect.value = '';
    }
}

/**
 * Open advanced add task modal
 */
function openAdvancedAddModal() {
    if (!advancedAddModal || !advTaskInput) {
        console.error('Advanced add modal elements not initialized');
        return;
    }
    
    // Fetch data from quick add section if available
    advTaskInput.value = taskInput.value.trim();
    advCategorySelect.value = categorySelect.value;
    if (advPrioritySelect) {
        advPrioritySelect.value = prioritySelect ? prioritySelect.value : 'medium';
    }
    
    // Clear other fields
    advTaskNotes.value = '';
    advTaskLink.value = '';
    advTaskDate.value = '';
    
    advancedAddModal.classList.remove('hidden');
    advTaskInput.focus();
}

/**
 * Close advanced add task modal
 */
function closeAdvancedAddModal() {
    advancedAddModal.classList.add('hidden');
}

/**
 * Add task from advanced modal
 */
function addAdvancedTask() {
    const taskText = advTaskInput.value.trim();
    const categoryId = advCategorySelect.value;
    const notes = advTaskNotes.value.trim();
    const link = advTaskLink.value.trim();
    const dueDate = advTaskDate.value;
    const priority = advPrioritySelect ? advPrioritySelect.value : 'medium';

    if (!taskText) {
        showAlert('Please enter a task name');
        return;
    }

    addTask(taskText, categoryId, notes, link, dueDate, priority);
    
    // Clear all inputs
    taskInput.value = '';
    categorySelect.value = '';
    advTaskInput.value = '';
    advCategorySelect.value = '';
    if (advPrioritySelect) {
        advPrioritySelect.value = 'medium';
    }
    advTaskNotes.value = '';
    advTaskLink.value = '';
    advTaskDate.value = '';
    
    closeAdvancedAddModal();
}

/**
 * Delete a task by its ID
 * @param {number} taskId - The ID of the task to delete
 */
function deleteTask(taskId) {
    // Show custom confirmation dialog
    showConfirmation(
        'Delete Task?',
        'This task will be permanently removed.',
        () => {
            state.tasks = state.tasks.filter((task) => task.id !== taskId);
            saveTasksToStorage();
            renderTasks();
            renderCompletedTasks();
        }
    );
}

/**
 * Open the edit modal for a task
 * Populates the modal with current task data
 * @param {number} taskId - The ID of the task to edit
 */
function openEditModal(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    state.editingTaskId = taskId;
    editTaskInput.value = task.text;
    editCategorySelect.value = task.categoryId || '';
    if (editPrioritySelect) {
        editPrioritySelect.value = task.priority || 'medium';
    }
    editTaskNotes.value = task.notes || '';
    editTaskLink.value = task.link || '';
    editTaskDate.value = task.dueDate || '';
    editModal.classList.remove('hidden');
    editTaskInput.focus();
}

/**
 * Close the edit modal
 */
function closeEditModal() {
    editModal.classList.add('hidden');
    state.editingTaskId = null;
    editTaskInput.value = '';
    editCategorySelect.value = '';
    if (editPrioritySelect) {
        editPrioritySelect.value = 'medium';
    }
    editTaskNotes.value = '';
    editTaskLink.value = '';
    editTaskDate.value = '';
}

/**
 * Save changes to an edited task
 */
function saveTaskEdits() {
    const taskId = state.editingTaskId;
    const newText = editTaskInput.value.trim();
    const newCategoryId = editCategorySelect.value;
    const newNotes = editTaskNotes.value.trim();
    const newLink = editTaskLink.value.trim();
    const newDueDate = editTaskDate.value;
    const newPriority = editPrioritySelect ? editPrioritySelect.value : 'medium';

    if (!newText) {
        showAlert('Please enter a task name');
        return;
    }

    const task = state.tasks.find((t) => t.id === taskId);
    if (task) {
        task.text = newText;
        task.categoryId = newCategoryId || null;
        task.notes = newNotes;
        task.link = validateAndSanitizeUrl(newLink);
        task.dueDate = newDueDate;
        task.priority = newPriority;
        task.modifiedAt = new Date().toISOString();
        saveTasksToStorage();
        closeEditModal();
        renderTasks();
    }
}

/**
 * Toggle task completion status
 * When completed, task text gets strike-through and fades
 * @param {number} taskId - The ID of the task to toggle
 */
function toggleTaskCompletion(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        task.modifiedAt = new Date().toISOString();
        saveTasksToStorage();
        renderTasks();
        renderCompletedTasks();
    }
}

/**
 * Toggle task favorite status (only for completed tasks)
 * @param {number} taskId - The ID of the task to toggle
 */
function toggleTaskFavorite(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (task && task.completed) {
        task.isFavorite = !task.isFavorite;
        task.modifiedAt = new Date().toISOString();
        saveTasksToStorage();
        renderTasks();
        renderCompletedTasks();
    }
}

/**
 * Get the category name for a task
 * Used to display category emoji and name next to task
 * @param {string} categoryId - The category ID
 * @returns {string} - The formatted category display string
 */
function getCategoryLabel(categoryId) {
    if (!categoryId) return '';
    const category = state.categories.find((c) => c.id === categoryId);
    if (!category) return '';
    return category.emoji ? `${category.emoji} ${escapeHtml(category.name)}` : escapeHtml(category.name);
}

/**
 * Get priority styling info
 * @param {string} priority
 * @returns {{label: string, className: string}}
 */
function getPriorityMeta(priority) {
    const normalized = (priority || 'medium').toLowerCase();
    if (normalized === 'high') {
        return { label: 'High', className: 'priority-high' };
    }
    if (normalized === 'low') {
        return { label: 'Low', className: 'priority-low' };
    }
    return { label: 'Medium', className: 'priority-medium' };
}

/**
 * Sort tasks based on current sort selection
 * @param {Array} tasks
 * @returns {Array}
 */
function sortTasks(tasks) {
    const sortBy = state.sortBy || 'dueDate';
    const priorityRank = { high: 3, medium: 2, low: 1 };

    const sorted = [...tasks];
    sorted.sort((a, b) => {
        if (sortBy === 'title') {
            return a.text.localeCompare(b.text);
        }
        if (sortBy === 'createdAt') {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'priority') {
            const aRank = priorityRank[(a.priority || 'medium').toLowerCase()] || 2;
            const bRank = priorityRank[(b.priority || 'medium').toLowerCase()] || 2;
            if (bRank !== aRank) return bRank - aRank;
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }

        const aDate = a.dueDate ? new Date(a.dueDate) : null;
        const bDate = b.dueDate ? new Date(b.dueDate) : null;
        if (aDate && bDate) return aDate - bDate;
        if (aDate) return -1;
        if (bDate) return 1;
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    });

    return sorted;
}

// ============================================================================
// CATEGORY MANAGEMENT
// ============================================================================

/**
 * Add a new category with emoji and name
 * Validates inputs and creates category object with unique ID
 */
function addCategory() {
    const emoji = emojiInput.value.trim();
    const name = categoryInput.value.trim();

    // Validate inputs
    if (!name) {
        showAlert('Please enter a category name');
        return;
    }
    if (emoji && emoji.length > 2) {
        showAlert('Emoji must be a single character');
        return;
    }

    // Check for duplicate category names
    if (state.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
        showAlert('This category already exists');
        return;
    }

    // Create category object
    const category = {
        id: Date.now().toString(), // Unique ID based on timestamp
        emoji: emoji || '', // Emoji is optional
        name: name,
    };

    // Add to state and save to storage
    state.categories.push(category);
    saveCategoriesToStorage();

    // Clear inputs and update UI
    emojiInput.value = '';
    categoryInput.value = '';
    renderCategories();
    renderCategoryFilter();
    renderCategorySelect();
}

/**
 * Delete a category by its ID
 * Tasks in this category are reassigned to "No Category"
 * @param {string} categoryId - The ID of the category to delete
 */
function deleteCategory(categoryId) {
    // Show custom confirmation dialog
    showConfirmation(
        'Delete Category?',
        'Tasks will remain but lose their category.',
        () => {
            // Remove category from state
            state.categories = state.categories.filter((c) => c.id !== categoryId);

            // Reassign tasks in this category to no category
            state.tasks.forEach((task) => {
                if (task.categoryId === categoryId) {
                    task.categoryId = null;
                }
            });

            // Save changes to storage
            saveCategoriesToStorage();
            saveTasksToStorage();

            // Update UI
            renderCategories();
            renderCategoryFilter();
            renderCategorySelect();
            renderTasks();
        }
    );
}

/**
 * Open edit category modal and populate with current category data
 * @param {string} categoryId - The ID of the category to edit
 */
function openEditCategoryModal(categoryId) {
    const category = state.categories.find((c) => c.id === categoryId);
    if (!category) return;

    // Store the category ID for use in save function
    editCategoryModal.dataset.categoryId = categoryId;

    // Populate the modal with current category data
    editCategoryNameInput.value = category.name;
    editCategoryEmojiPickerBtn.textContent = category.emoji || '😀';
    editCategoryEmojiPickerBtn.textContent = category.emoji || '😀';

    // Show the modal
    editCategoryModal.classList.remove('hidden');
    editCategoryNameInput.focus();
}

/**
 * Save edited category changes
 */
function saveEditCategory() {
    const categoryId = editCategoryModal.dataset.categoryId;
    const category = state.categories.find((c) => c.id === categoryId);
    
    if (!category) return;

    const emoji = editCategoryEmojiPickerBtn.textContent.trim();
    const name = editCategoryNameInput.value.trim();

    // Validate inputs
    if (!name) {
        showAlert('Please enter a category name');
        return;
    }
    if (emoji && emoji.length > 2) {
        showAlert('Emoji must be a single character');
        return;
    }

    // Check for duplicate category names (excluding current category)
    if (state.categories.some((c) => c.id !== categoryId && c.name.toLowerCase() === name.toLowerCase())) {
        showAlert('This category name already exists');
        return;
    }

    // Update category
    category.name = name;
    category.emoji = emoji || '';

    // Save to storage and update UI
    saveCategoriesToStorage();
    renderCategories();
    renderCategoryFilter();
    renderCategorySelect();
    renderTasks();

    // Close modal
    editCategoryModal.classList.add('hidden');
    showAlert('Category updated successfully! ✓');
}

// ============================================================================
// UI RENDERING
// ============================================================================

/**
 * Render all tasks in the task list
 * Filters tasks based on selected category filter
 * Shows empty state message if no tasks exist
 */
function renderTasks() {
    // Filter tasks based on selected category and exclude completed tasks
    const pendingTasks = state.tasks.filter((task) => !task.completed);
    let filteredTasks = pendingTasks;
    if (state.selectedCategoryFilter) {
        filteredTasks = filteredTasks.filter(
            (task) => task.categoryId === state.selectedCategoryFilter
        );
    }

    const query = state.searchQuery.trim().toLowerCase();
    if (query) {
        filteredTasks = filteredTasks.filter((task) => {
            const categoryLabel = getCategoryLabel(task.categoryId).toLowerCase();
            return (
                task.text.toLowerCase().includes(query) ||
                (task.notes || '').toLowerCase().includes(query) ||
                (task.link || '').toLowerCase().includes(query) ||
                categoryLabel.includes(query)
            );
        });
    }

    if (tasksCount) {
        const displayCount = filteredTasks.length;
        const totalCount = pendingTasks.length;
        tasksCount.textContent = (state.selectedCategoryFilter || query)
            ? `${displayCount}/${totalCount}`
            : `${totalCount}`;
    }

    // Clear task list
    tasksList.innerHTML = '';

    // Show empty state or render tasks
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    const sortedTasks = sortTasks(filteredTasks);

    // Render each task
    sortedTasks.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;

        const priorityMeta = getPriorityMeta(task.priority);
        
        // Format due date if exists
        let dueDateDisplay = '';
        if (task.dueDate) {
            const date = new Date(task.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            
            const isOverdue = taskDate < today && !task.completed;
            const dateClass = isOverdue ? 'date-overdue' : '';
            dueDateDisplay = `<span class="task-date ${dateClass}">📅 ${date.toLocaleDateString()}</span>`;
        }
        
        // Link preview if exists
        let linkDisplay = '';
        if (task.link) {
            const isValidUrl = task.link.startsWith('http://') || task.link.startsWith('https://');
            const escapedUrl = escapeHtml(task.link);
            linkDisplay = `<a href="${escapedUrl}" class="task-link" target="_blank" rel="noopener noreferrer" ${isValidUrl ? '' : 'disabled'}>🔗 Link</a>`;
        }
        
        // Notes preview if exists
        let notesDisplay = '';
        if (task.notes) {
            const preview = task.notes.substring(0, 50) + (task.notes.length > 50 ? '...' : '');
            notesDisplay = `<div class="task-notes-preview">📝 ${escapeHtml(preview)}</div>`;
        }
        
        taskElement.innerHTML = `
            <!-- Task Checkbox -->
            <input 
                type="checkbox" 
                class="task-checkbox" 
                data-task-id="${task.id}"
                ${task.completed ? 'checked' : ''}
            >

            <!-- Task Content -->
            <div class="task-content" data-edit-id="${task.id}">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <div class="task-badges">
                    ${task.categoryId ? `<span class="task-category">${getCategoryLabel(task.categoryId)}</span>` : ''}
                    <span class="priority-badge ${priorityMeta.className}">${priorityMeta.label}</span>
                </div>
                <div class="task-metadata">
                    ${dueDateDisplay}
                    ${linkDisplay}
                </div>
                ${notesDisplay}
            </div>

            <!-- Task Actions -->
            <div class="task-actions">
                <button 
                    class="edit-btn" 
                    data-edit-id="${task.id}"
                    title="Edit task"
                >
                    ✏️
                </button>
                <button 
                    class="delete-btn" 
                    data-delete-id="${task.id}"
                    title="Delete task"
                >
                    🗑️
                </button>
            </div>
        `;
        tasksList.appendChild(taskElement);
    });
}

/**
 * Render all categories in the category management section
 * Displays category tags with edit and delete buttons
 */
function renderCategories() {
    categoriesList.innerHTML = '';

    if (state.categories.length === 0) {
        categoriesList.innerHTML = '<p style="font-size: 12px; color: var(--text-secondary); margin-top: 8px;">No categories yet. Create one to organize your tasks!</p>';
        return;
    }

    state.categories.forEach((category) => {
        const categoryTag = document.createElement('div');
        categoryTag.className = 'category-tag';
        
        const categorySpan = document.createElement('span');
        categorySpan.textContent = category.emoji ? `${category.emoji} ${category.name}` : category.name;
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-category-btn';
        editBtn.dataset.categoryId = category.id;
        editBtn.title = 'Edit category';
        editBtn.textContent = '✏️';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-category-btn';
        deleteBtn.dataset.categoryId = category.id;
        deleteBtn.title = 'Delete category';
        deleteBtn.textContent = '🗑️';
        
        categoryTag.appendChild(categorySpan);
        categoryTag.appendChild(editBtn);
        categoryTag.appendChild(deleteBtn);
        categoriesList.appendChild(categoryTag);
    });
}

/**
 * Render category filter dropdown
 * Allows users to filter tasks by category
 */
function renderCategoryFilter() {
    // Keep "All Tasks" option
    categoryFilter.innerHTML = '<option value="">All Tasks</option>';

    state.categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.emoji ? `${category.emoji} ${category.name}` : category.name;
        categoryFilter.appendChild(option);
    });
}

/**
 * Render category selection dropdown for adding tasks
 * Allows users to assign tasks to categories
 */
function renderCategorySelect() {
    // Keep "No Category" option
    categorySelect.innerHTML = '<option value="">No Category</option>';
    editCategorySelect.innerHTML = '<option value="">No Category</option>';
    advCategorySelect.innerHTML = '<option value="">No Category</option>';

    state.categories.forEach((category) => {
        const displayText = category.emoji ? `${category.emoji} ${category.name}` : category.name;
        
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = displayText;
        categorySelect.appendChild(option);

        // Also add to edit modal
        const editOption = document.createElement('option');
        editOption.value = category.id;
        editOption.textContent = displayText;
        editCategorySelect.appendChild(editOption);

        // Also add to advanced add modal
        const advOption = document.createElement('option');
        advOption.value = category.id;
        advOption.textContent = displayText;
        advCategorySelect.appendChild(advOption);
    });
}

// ============================================================================
// MOTIVATIONAL QUOTE FUNCTIONALITY
// ============================================================================

/**
 * Render all completed tasks in a collapsible section
 * Shows completed tasks with their favorite status and option to mark as incomplete
 */
function renderCompletedTasks() {
    // Get all completed tasks
    let completedTasks = state.tasks.filter((task) => task.completed);

    const query = state.searchQuery.trim().toLowerCase();
    if (query) {
        completedTasks = completedTasks.filter((task) => {
            const categoryLabel = getCategoryLabel(task.categoryId).toLowerCase();
            return (
                task.text.toLowerCase().includes(query) ||
                (task.notes || '').toLowerCase().includes(query) ||
                (task.link || '').toLowerCase().includes(query) ||
                categoryLabel.includes(query)
            );
        });
    }

    if (completedCount) {
        const totalCompleted = state.tasks.filter((task) => task.completed).length;
        completedCount.textContent = query ? `${completedTasks.length}/${totalCompleted}` : `${totalCompleted}`;
    }

    // Clear completed tasks list
    completedTasksList.innerHTML = '';

    // Show empty state or render tasks
    if (completedTasks.length === 0) {
        completedEmptyState.classList.remove('hidden');
        return;
    }

    completedEmptyState.classList.add('hidden');

    const sortedCompleted = sortTasks(completedTasks);

    // Render each completed task
    sortedCompleted.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'completed-task-item';

        const priorityMeta = getPriorityMeta(task.priority);
        
        // Format due date if exists
        let dueDateDisplay = '';
        if (task.dueDate) {
            const date = new Date(task.dueDate);
            dueDateDisplay = `<span class="task-date">📅 ${date.toLocaleDateString()}</span>`;
        }
        
        // Link preview if exists
        let linkDisplay = '';
        if (task.link) {
            const isValidUrl = task.link.startsWith('http://') || task.link.startsWith('https://');
            const escapedUrl = escapeHtml(task.link);
            linkDisplay = `<a href="${escapedUrl}" class="task-link" target="_blank" rel="noopener noreferrer" ${isValidUrl ? '' : 'disabled'}>🔗 Link</a>`;
        }
        
        // Notes preview if exists
        let notesDisplay = '';
        if (task.notes) {
            const preview = task.notes.substring(0, 50) + (task.notes.length > 50 ? '...' : '');
            notesDisplay = `<div class="task-notes-preview">📝 ${escapeHtml(preview)}</div>`;
        }
        
        taskElement.innerHTML = `
            <!-- Favorite Status -->
            <div class="completed-status">
                ${task.isFavorite ? '⭐' : '✓'}
            </div>

            <!-- Task Content -->
            <div class="task-content">
                <span class="task-text completed-text">${escapeHtml(task.text)}</span>
                <div class="task-badges">
                    ${task.categoryId ? `<span class="task-category">${getCategoryLabel(task.categoryId)}</span>` : ''}
                    <span class="priority-badge ${priorityMeta.className}">${priorityMeta.label}</span>
                </div>
                <div class="task-metadata">
                    ${dueDateDisplay}
                    ${linkDisplay}
                </div>
                ${notesDisplay}
            </div>

            <!-- Task Actions -->
            <div class="task-actions">
                <button 
                    class="undo-btn" 
                    data-undo-id="${task.id}"
                    title="Mark as incomplete"
                >
                    ↶
                </button>
                <button 
                    class="delete-btn" 
                    data-delete-id="${task.id}"
                    title="Delete task"
                >
                    🗑️
                </button>
            </div>
        `;
        completedTasksList.appendChild(taskElement);
    });
}

/**
 * Display a random motivational quote from the quotes database
 * Called when popup opens or when user requests a new quote
 */
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    motivationQuote.textContent = motivationalQuotes[randomIndex];
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

/**
 * Set up all event listeners for user interactions
 */
function setupEventListeners() {
    // Google Sign In
    if (signInBtn) {
        signInBtn.addEventListener('click', async () => {
            const success = await signInWithGoogle();
            if (success) {
                updateAuthUI();
                syncStatus.classList.remove('hidden');
            }
        });
    }

    // Google Sign Out
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            await signOutFromGoogle();
            updateAuthUI();
            syncStatus.classList.add('hidden');
        });
    }

    // Manual Sync
    if (syncNowBtn) {
        syncNowBtn.addEventListener('click', async () => {
            await syncTasksToGoogle(state.tasks);
        });
    }

    // Listen for sync status changes
    window.addEventListener('syncStatusChanged', (e) => {
        updateSyncStatusUI(e.detail.status);
    });

    // Quick add task button
    quickAddBtn.addEventListener('click', quickAddTask);

    // Advanced add task button
    advancedAddBtn.addEventListener('click', openAdvancedAddModal);

    // Add task on Enter key (quick add)
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            quickAddTask();
        }
    });

    // Add category button
    addCategoryBtn.addEventListener('click', addCategory);

    // Add category on Enter key (from either input)
    categoryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCategory();
        }
    });

    // Category filter change
    categoryFilter.addEventListener('change', (e) => {
        state.selectedCategoryFilter = e.target.value;
        renderTasks();
    });

    // Sort change
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderTasks();
            renderCompletedTasks();
        });
    }

    // Search tasks
    if (taskSearchInput) {
        taskSearchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderTasks();
            renderCompletedTasks();
        });
    }

    // New quote button
    newQuoteBtn.addEventListener('click', displayRandomQuote);

    // Edit modal events
    saveEditBtn.addEventListener('click', saveTaskEdits);
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeEditModal);
    }
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditModal);
    }
    
    editTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTaskEdits();
        }
    });

    // Close modal on background click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // Advanced add modal events
    advAddBtn.addEventListener('click', addAdvancedTask);
    advCancelBtn.addEventListener('click', closeAdvancedAddModal);
    const advancedModalCloseBtn = document.getElementById('advancedModalCloseBtn');
    
    if (advancedModalCloseBtn) {
        advancedModalCloseBtn.addEventListener('click', closeAdvancedAddModal);
    }

    advTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addAdvancedTask();
        }
    });

    // Close advanced modal on background click
    advancedAddModal.addEventListener('click', (e) => {
        if (e.target === advancedAddModal) {
            closeAdvancedAddModal();
        }
    });

    // Event delegation for task actions
    tasksList.addEventListener('click', (e) => {
        // Mark task as favorite
        if (e.target.classList.contains('favorite-btn')) {
            const taskId = parseInt(e.target.dataset.favoriteId);
            toggleTaskFavorite(taskId);
        }
        // Edit task
        if (e.target.classList.contains('edit-btn')) {
            const taskId = parseInt(e.target.dataset.editId);
            openEditModal(taskId);
        }
        // Delete task
        if (e.target.classList.contains('delete-btn')) {
            const taskId = parseInt(e.target.dataset.deleteId);
            deleteTask(taskId);
        }
        // Handle link clicks
        if (e.target.classList.contains('task-link')) {
            const href = e.target.getAttribute('href');
            if (href.startsWith('http://') || href.startsWith('https://')) {
                window.open(href, '_blank');
            }
            e.preventDefault();
            return;
        }

        const taskContent = e.target.closest('.task-content');
        if (taskContent && taskContent.dataset.editId) {
            const taskId = parseInt(taskContent.dataset.editId);
            openEditModal(taskId);
        }
    });

    // Event delegation for completed tasks
    completedTasksList.addEventListener('click', (e) => {
        // Mark completed task as incomplete
        if (e.target.classList.contains('undo-btn')) {
            const taskId = parseInt(e.target.dataset.undoId);
            toggleTaskCompletion(taskId);
        }
        // Delete completed task
        if (e.target.classList.contains('delete-btn')) {
            const taskId = parseInt(e.target.dataset.deleteId);
            deleteTask(taskId);
        }
        // Handle link clicks
        if (e.target.classList.contains('task-link')) {
            const href = e.target.getAttribute('href');
            if (href.startsWith('http://') || href.startsWith('https://')) {
                window.open(href, '_blank');
            }
            e.preventDefault();
            return;
        }

        const taskContent = e.target.closest('.task-content');
        if (taskContent && taskContent.dataset.editId) {
            const taskId = parseInt(taskContent.dataset.editId);
            openEditModal(taskId);
        }
    });

    // Event delegation for task checkboxes
    tasksList.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
            const taskId = parseInt(e.target.dataset.taskId);
            toggleTaskCompletion(taskId);
        }
    });

    // Event delegation for category delete buttons
    categoriesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-category-btn')) {
            const categoryId = e.target.dataset.categoryId;
            deleteCategory(categoryId);
        }
        if (e.target.classList.contains('edit-category-btn')) {
            const categoryId = e.target.dataset.categoryId;
            openEditCategoryModal(categoryId);
        }
    });

    // Edit category modal events
    saveEditCategoryBtn.addEventListener('click', saveEditCategory);
    editCategoryModalCloseBtn.addEventListener('click', closeEditCategoryModal);
    editCategoryCancelBtn.addEventListener('click', closeEditCategoryModal);

    // Clear completed tasks
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    }

    // Clear completed tasks
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    }

    // Edit category name on Enter key
    editCategoryNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEditCategory();
        }
    });

    // Close edit category modal on background click
    editCategoryModal.addEventListener('click', (e) => {
        if (e.target === editCategoryModal) {
            closeEditCategoryModal();
        }
    });

    // Focus on task input when popup opens
    taskInput.focus();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (taskSearchInput) taskSearchInput.focus();
        }
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            quickAddTask();
        }
    });
}

/**
 * Clear all completed tasks
 */
function clearCompletedTasks() {
    const completedTotal = state.tasks.filter((task) => task.completed).length;
    if (completedTotal === 0) {
        showAlert('No completed tasks to clear.');
        return;
    }

    showConfirmation(
        'Clear Completed Tasks?',
        'This will permanently remove all completed tasks.',
        () => {
            state.tasks = state.tasks.filter((task) => !task.completed);
            saveTasksToStorage();
            renderTasks();
            renderCompletedTasks();
        }
    );
}

/**
 * Clear all completed tasks
 */
function clearCompletedTasks() {
    const completedCount = state.tasks.filter((task) => task.completed).length;
    if (completedCount === 0) {
        showAlert('No completed tasks to clear.');
        return;
    }

    showConfirmation(
        'Clear Completed Tasks?',
        'This will permanently remove all completed tasks.',
        () => {
            state.tasks = state.tasks.filter((task) => !task.completed);
            saveTasksToStorage();
            renderTasks();
            renderCompletedTasks();
        }
    );
}

/**
 * Set up emoji picker functionality
 */
function setupEmojiPicker() {
    // Toggle emoji picker visibility
    emojiPickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        emojiPicker.classList.toggle('hidden');
    });

    // Populate emoji picker with popular emojis
    const emojiGrid = emojiPicker.querySelector('.emoji-picker-grid');
    emojiGrid.innerHTML = '';
    popularEmojis.forEach((emoji) => {
        const button = document.createElement('button');
        button.className = 'emoji-option';
        button.textContent = emoji;
        button.addEventListener('click', () => {
            emojiInput.value = emoji;
            emojiPickerBtn.textContent = emoji;
            emojiPicker.classList.add('hidden');
        });
        emojiGrid.appendChild(button);
    });

    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.emoji-picker-container')) {
            emojiPicker.classList.add('hidden');
        }
    });

    // Setup edit category emoji picker
    editCategoryEmojiPickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editCategoryEmojiPicker.classList.toggle('hidden');
    });

    // Populate edit category emoji picker with popular emojis
    const editCategoryEmojiGrid = editCategoryEmojiPicker.querySelector('.emoji-picker-grid');
    editCategoryEmojiGrid.innerHTML = '';
    popularEmojis.forEach((emoji) => {
        const button = document.createElement('button');
        button.className = 'emoji-option';
        button.textContent = emoji;
        button.addEventListener('click', () => {
            editCategoryEmojiPickerBtn.textContent = emoji;
            editCategoryEmojiPicker.classList.add('hidden');
        });
        editCategoryEmojiGrid.appendChild(button);
    });

    // Close edit category emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.emoji-picker-container')) {
            editCategoryEmojiPicker.classList.add('hidden');
        }
    });
}

/**
 * Close edit category modal
 */
function closeEditCategoryModal() {
    editCategoryModal.classList.add('hidden');
    editCategoryNameInput.value = '';
    editCategoryEmojiPickerBtn.textContent = '😀';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Update authentication UI based on google auth state
 */
function updateAuthUI() {
    if (googleSyncState.isAuthenticated) {
        signInBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        userEmail.textContent = googleSyncState.userEmail;
    } else {
        signInBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
}

/**
 * Update sync status UI
 * @param {string} status - Sync status
 */
function updateSyncStatusUI(status) {
    const statusMessages = {
        'idle': 'Ready to sync',
        'syncing': '⏳ Syncing...',
        'synced': '✓ Synced',
        'error': '✕ Sync failed',
        'offline': '⚠ Offline'
    };

    syncStatusText.textContent = statusMessages[status] || status;
}

/**
 * Validate and sanitize URLs to prevent javascript: and data: protocol attacks
 * @param {string} url - The URL to validate
 * @returns {string} - Sanitized URL or empty string if invalid
 */
function validateAndSanitizeUrl(url) {
    if (!url) return '';
    
    const trimmed = url.trim();
    
    // Block dangerous protocols
    if (trimmed.toLowerCase().startsWith('javascript:') || 
        trimmed.toLowerCase().startsWith('data:') ||
        trimmed.toLowerCase().startsWith('vbscript:')) {
        console.warn('Blocked potentially dangerous URL protocol');
        return '';
    }
    
    // Only allow http and https protocols
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        // If it looks like a URL without protocol, add https://
        if (trimmed.includes('.') && !trimmed.includes(' ')) {
            return 'https://' + trimmed;
        }
        // Otherwise reject
        return '';
    }
    
    // Additional check: try to parse as URL to ensure it's valid
    try {
        new URL(trimmed);
        return trimmed;
    } catch (e) {
        console.warn('Invalid URL format:', trimmed);
        return '';
    }
}

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} - Escaped text safe for HTML
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ============================================================================
// APPLICATION START
// ============================================================================

// Check if wizard should be shown, otherwise initialize the extension
document.addEventListener('DOMContentLoaded', checkAndShowWizard);

