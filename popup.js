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
    '💻', '📚', '🧘', '💪', '🎯', '🏆', '⭐', '🔥', '🎨', '🎵', '🏃', '🍎', '😴', '🧠', '📞'
];

// ============================================================================
// DOM ELEMENTS
// ============================================================================

let taskInput, categoryInput, emojiInput, categorySelect, categoryFilter, quickAddBtn, advancedAddBtn, addCategoryBtn, tasksList, categoriesList, motivationQuote, newQuoteBtn, emptyState, emojiPickerBtn, emojiPicker, editModal, editTaskInput, editCategorySelect, editTaskNotes, editTaskLink, editTaskDate, saveEditBtn, advancedAddModal, advTaskInput, advCategorySelect, advTaskNotes, advTaskLink, advTaskDate, advAddBtn, advCancelBtn, completedTasksList, completedEmptyState, signInBtn, signOutBtn, userInfo, userEmail, syncStatus, syncStatusText, syncNowBtn;

function initializeDOMElements() {
    taskInput = document.getElementById('taskInput');
    categoryInput = document.getElementById('categoryInput');
    emojiInput = document.getElementById('emojiInput');
    categorySelect = document.getElementById('categorySelect');
    categoryFilter = document.getElementById('categoryFilter');
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
    editTaskNotes = document.getElementById('editTaskNotes');
    editTaskLink = document.getElementById('editTaskLink');
    editTaskDate = document.getElementById('editTaskDate');
    saveEditBtn = document.getElementById('saveEditBtn');
    advancedAddModal = document.getElementById('advancedAddModal');
    advTaskInput = document.getElementById('advTaskInput');
    advCategorySelect = document.getElementById('advCategorySelect');
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

    confirmModal.style.display = 'flex';

    // Clear previous listeners by cloning buttons
    const newOkBtn = confirmOkBtn.cloneNode(true);
    const newCancelBtn = confirmCancelBtn.cloneNode(true);
    confirmOkBtn.parentNode.replaceChild(newOkBtn, confirmOkBtn);
    confirmCancelBtn.parentNode.replaceChild(newCancelBtn, confirmCancelBtn);

    // Add new listeners
    newOkBtn.addEventListener('click', () => {
        confirmCallback();
        confirmModal.style.display = 'none';
    });

    newCancelBtn.addEventListener('click', () => {
        confirmModal.style.display = 'none';
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
function addTask(text, categoryId, notes = '', link = '', dueDate = '') {
    // Validate that task name is not empty
    if (!text) {
        alert('Please enter a task name');
        return;
    }

    // Create task object with all required properties
    const task = {
        id: Date.now(), // Unique ID based on timestamp
        text: text,
        completed: false,
        categoryId: categoryId || null,
        notes: notes,
        link: link,
        dueDate: dueDate,
        createdAt: new Date().toISOString(),
        isFavorite: false,
    };

    // Add task to state and save to storage
    state.tasks.push(task);
    saveTasksToStorage();

    // Sync with Google if authenticated
    if (googleSyncState.isAuthenticated && navigator.onLine) {
        createGoogleTask(task).catch(error => {
            console.error('Failed to sync task to Google:', error);
            queueOfflineChange({ type: 'create', task });
        });
    } else if (!navigator.onLine) {
        // Queue for later if offline
        queueOfflineChange({ type: 'create', task });
    }

    // Update UI
    renderTasks();
}

/**
 * Quick add task from the main input
 * Simple task without notes, link, or date
 */
function quickAddTask() {
    const taskText = taskInput.value.trim();
    const categoryId = categorySelect.value;

    addTask(taskText, categoryId);

    // Clear inputs
    taskInput.value = '';
    categorySelect.value = '';
}

/**
 * Open advanced add task modal
 */
function openAdvancedAddModal() {
    advTaskInput.value = '';
    advCategorySelect.value = '';
    advTaskNotes.value = '';
    advTaskLink.value = '';
    advTaskDate.value = '';
    advancedAddModal.style.display = 'flex';
    advTaskInput.focus();
}

/**
 * Close advanced add task modal
 */
function closeAdvancedAddModal() {
    advancedAddModal.style.display = 'none';
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

    if (!taskText) {
        alert('Please enter a task name');
        return;
    }

    addTask(taskText, categoryId, notes, link, dueDate);
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
    editTaskNotes.value = task.notes || '';
    editTaskLink.value = task.link || '';
    editTaskDate.value = task.dueDate || '';
    editModal.style.display = 'flex';
    editTaskInput.focus();
}

/**
 * Close the edit modal
 */
function closeEditModal() {
    editModal.style.display = 'none';
    state.editingTaskId = null;
    editTaskInput.value = '';
    editCategorySelect.value = '';
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

    if (!newText) {
        alert('Please enter a task name');
        return;
    }

    const task = state.tasks.find((t) => t.id === taskId);
    if (task) {
        task.text = newText;
        task.categoryId = newCategoryId || null;
        task.notes = newNotes;
        task.link = newLink;
        task.dueDate = newDueDate;
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
    return category.emoji ? `${category.emoji} ${category.name}` : category.name;
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
        alert('Please enter a category name');
        return;
    }
    if (emoji && emoji.length > 2) {
        alert('Emoji must be a single character');
        return;
    }

    // Check for duplicate category names
    if (state.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
        alert('This category already exists');
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
    let filteredTasks = state.tasks.filter((task) => !task.completed);
    if (state.selectedCategoryFilter) {
        filteredTasks = filteredTasks.filter(
            (task) => task.categoryId === state.selectedCategoryFilter
        );
    }

    // Clear task list
    tasksList.innerHTML = '';

    // Show empty state or render tasks
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Render each task
    filteredTasks.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        
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
            linkDisplay = `<a href="${task.link}" class="task-link" target="_blank" rel="noopener noreferrer" ${isValidUrl ? '' : 'disabled'}>🔗 Link</a>`;
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
            <div class="task-content">
                <span class="task-text">${escapeHtml(task.text)}</span>
                ${task.categoryId ? `<span class="task-category">${getCategoryLabel(task.categoryId)}</span>` : ''}
                <div class="task-metadata">
                    ${dueDateDisplay}
                    ${linkDisplay}
                </div>
                ${notesDisplay}
            </div>

            <!-- Task Actions -->
            <div class="task-actions">
                ${task.completed ? `
                    <button 
                        class="favorite-btn" 
                        data-favorite-id="${task.id}"
                        title="${task.isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
                    >
                        ${task.isFavorite ? '⭐' : '☆'}
                    </button>
                ` : ''}
                ${task.completed ? `
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
                ` : ''}
            </div>
        `;
        tasksList.appendChild(taskElement);
    });
}

/**
 * Render all categories in the category management section
 * Displays category tags with delete buttons
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
        categoryTag.innerHTML = `
            <span>${category.emoji} ${escapeHtml(category.name)}</span>
            <button 
                class="delete-category-btn" 
                data-category-id="${category.id}"
                title="Delete category"
            >
                ✕
            </button>
        `;
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
    const completedTasks = state.tasks.filter((task) => task.completed);

    // Clear completed tasks list
    completedTasksList.innerHTML = '';

    // Show empty state or render tasks
    if (completedTasks.length === 0) {
        completedEmptyState.style.display = 'block';
        return;
    }

    completedEmptyState.style.display = 'none';

    // Render each completed task
    completedTasks.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'completed-task-item';
        
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
            linkDisplay = `<a href="${task.link}" class="task-link" target="_blank" rel="noopener noreferrer" ${isValidUrl ? '' : 'disabled'}>🔗 Link</a>`;
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
                ${task.categoryId ? `<span class="task-category">${getCategoryLabel(task.categoryId)}</span>` : ''}
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
    signInBtn.addEventListener('click', async () => {
        const success = await signInWithGoogle();
        if (success) {
            updateAuthUI();
            syncStatus.style.display = 'flex';
        }
    });

    // Google Sign Out
    signOutBtn.addEventListener('click', async () => {
        await signOutFromGoogle();
        updateAuthUI();
        syncStatus.style.display = 'none';
    });

    // Manual Sync
    syncNowBtn.addEventListener('click', async () => {
        await syncTasksToGoogle(state.tasks);
    });

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
    });

    // Focus on task input when popup opens
    taskInput.focus();
}

/**
 * Set up emoji picker functionality
 */
function setupEmojiPicker() {
    // Toggle emoji picker visibility
    emojiPickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
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
            emojiPicker.style.display = 'none';
        });
        emojiGrid.appendChild(button);
    });

    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.emoji-picker-container')) {
            emojiPicker.style.display = 'none';
        }
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Update authentication UI based on google auth state
 */
function updateAuthUI() {
    if (googleSyncState.isAuthenticated) {
        signInBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        userEmail.textContent = googleSyncState.userEmail;
    } else {
        signInBtn.style.display = 'block';
        userInfo.style.display = 'none';
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

