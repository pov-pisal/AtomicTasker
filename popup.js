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

let taskInput, categoryInput, emojiInput, categorySelect, categoryFilter, addTaskBtn, addCategoryBtn, tasksList, categoriesList, motivationQuote, newQuoteBtn, emptyState, emojiPickerBtn, emojiPicker, editModal, editTaskInput, editCategorySelect, saveEditBtn;

function initializeDOMElements() {
    taskInput = document.getElementById('taskInput');
    categoryInput = document.getElementById('categoryInput');
    emojiInput = document.getElementById('emojiInput');
    categorySelect = document.getElementById('categorySelect');
    categoryFilter = document.getElementById('categoryFilter');
    addTaskBtn = document.getElementById('addTaskBtn');
    addCategoryBtn = document.getElementById('addCategoryBtn');
    tasksList = document.getElementById('tasksList');
    categoriesList = document.getElementById('categoriesList');
    motivationQuote = document.getElementById('motivationQuote');
    newQuoteBtn = document.getElementById('newQuoteBtn');
    emptyState = document.getElementById('emptyState');
    emojiPickerBtn = document.getElementById('emojiPickerBtn');
    emojiPicker = document.getElementById('emojiPicker');
    editModal = document.getElementById('editModal');
    editTaskInput = document.getElementById('editTaskInput');
    editCategorySelect = document.getElementById('editCategorySelect');
    saveEditBtn = document.getElementById('saveEditBtn');
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
 * Initialize the extension when the popup loads
 * Loads data from storage, renders UI, and sets up event listeners
 */
function init() {
    initializeDOMElements();
    loadDataFromStorage();
    renderCategories();
    renderCategoryFilter();
    renderCategorySelect();
    renderTasks();
    displayRandomQuote();
    setupEventListeners();
    setupEmojiPicker();
}

// ============================================================================
// CHROME STORAGE OPERATIONS
// ============================================================================

/**
 * Load tasks and categories from chrome.storage.local
 * If no data exists, initialize with empty arrays
 */
function loadDataFromStorage() {
    chrome.storage.local.get(['tasks', 'categories'], (result) => {
        state.tasks = result.tasks || [];
        state.categories = result.categories || [];
        
        // Refresh UI after loading data
        renderCategories();
        renderCategoryFilter();
        renderCategorySelect();
        renderTasks();
    });
}

/**
 * Save tasks to chrome.storage.local
 * Called after any task modification
 */
function saveTasksToStorage() {
    chrome.storage.local.set({ tasks: state.tasks }, () => {
        // Data saved successfully
    });
}

/**
 * Save categories to chrome.storage.local
 * Called after any category modification
 */
function saveCategoriesToStorage() {
    chrome.storage.local.set({ categories: state.categories }, () => {
        // Data saved successfully
    });
}

// ============================================================================
// TASK MANAGEMENT
// ============================================================================

/**
 * Add a new task to the task list
 * Validates input and creates task object with unique ID
 */
function addTask() {
    const taskText = taskInput.value.trim();
    const categoryId = categorySelect.value;

    // Validate that task name is not empty
    if (!taskText) {
        alert('Please enter a task name');
        return;
    }

    // Create task object with all required properties
    const task = {
        id: Date.now(), // Unique ID based on timestamp
        text: taskText,
        completed: false,
        categoryId: categoryId || null,
        createdAt: new Date().toISOString(),
    };

    // Add task to state and save to storage
    state.tasks.push(task);
    saveTasksToStorage();

    // Clear inputs and update UI
    taskInput.value = '';
    categorySelect.value = '';
    renderTasks();
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
}

/**
 * Save changes to an edited task
 */
function saveTaskEdits() {
    const taskId = state.editingTaskId;
    const newText = editTaskInput.value.trim();
    const newCategoryId = editCategorySelect.value;

    if (!newText) {
        alert('Please enter a task name');
        return;
    }

    const task = state.tasks.find((t) => t.id === taskId);
    if (task) {
        task.text = newText;
        task.categoryId = newCategoryId || null;
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
    // Filter tasks based on selected category
    let filteredTasks = state.tasks;
    if (state.selectedCategoryFilter) {
        filteredTasks = state.tasks.filter(
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
    // Add task button
    addTaskBtn.addEventListener('click', addTask);

    // Add task on Enter key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
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

    // Event delegation for task actions
    tasksList.addEventListener('click', (e) => {
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

// Initialize the extension when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
