/*
 * ATOMIC TASKER - SETUP WIZARD
 * Handles the first-time user onboarding experience
 * Now simplified with Chrome Sync Storage (no Google OAuth needed)
 */

// ============================================================================
// WIZARD STATE MANAGEMENT
// ============================================================================

let wizardState = {
    currentStep: 'step-welcome',
    completed: false,
};

// ============================================================================
// WIZARD NAVIGATION
// ============================================================================

/**
 * Navigate to a specific wizard step
 * @param {string} stepId - The step ID to navigate to
 */
function goToStep(stepId) {
    // Hide all steps
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach(step => step.classList.remove('active'));

    // Show target step
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.classList.add('active');
        wizardState.currentStep = stepId;
        updateProgressIndicator();
    }
}

/**
 * Update progress indicator based on current step
 */
function updateProgressIndicator() {
    const progressDots = document.querySelectorAll('.progress-dot');
    const stepMap = {
        'step-welcome': 0,
        'step-setup': 1,
    };

    progressDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === stepMap[wizardState.currentStep]) {
            dot.classList.add('active');
        }
    });
}

// ============================================================================
// WIZARD FLOW
// ============================================================================

/**
 * Start setup - transition from Welcome to Setup
 */
function startSetup() {
    logInfo('Starting setup wizard...');
    // Chrome Sync is automatically enabled - no setup needed!
    // Just show confirmation and complete
    goToStep('step-setup');
}

/**
 * Complete the wizard and show main extension
 */
function completeWizard() {
    // Mark wizard as completed
    chrome.storage.local.set({ wizardCompleted: true });

    // Initialize Chrome Sync
    if (typeof initializeChromeSync === 'function') {
        initializeChromeSync();
    }

    // Close the wizard and show main popup
    const wizardContainer = document.querySelector('.wizard-container');
    wizardContainer.classList.add('fade-out');
    wizardContainer.classList.add('scale-down');

    setTimeout(() => {
        window.location.href = 'popup.html';
    }, 300);
}

/**
 * Skip wizard and use extension
 */
function skipWizard() {
    // Mark wizard as completed and skip sync setup
    chrome.storage.local.set({ 
        wizardCompleted: true,
        skipWizard: true 
    });

    // Initialize Chrome Sync anyway (it's automatic)
    if (typeof initializeChromeSync === 'function') {
        initializeChromeSync();
    }

    // Redirect to main popup
    setTimeout(() => {
        window.location.href = 'popup.html';
    }, 300);
}

// ============================================================================
// WIZARD INITIALIZATION
// ============================================================================

/**
 * Initialize the wizard when page loads
 */
function initializeWizard() {
    logInfo('Initializing setup wizard...');

    // Show first step
    goToStep('step-welcome');
    
    setupEventListeners();

    logSuccess('Wizard ready - Chrome Sync enabled by default');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Welcome step
    const btnGetStarted = document.getElementById('btnGetStarted');
    if (btnGetStarted) {
        btnGetStarted.addEventListener('click', startSetup);
    } else {
        logError('Get Started button not found!');
    }

    const btnSkip = document.getElementById('btnSkip');
    if (btnSkip) {
        btnSkip.addEventListener('click', skipWizard);
    }

    // Setup step
    const btnComplete = document.getElementById('btnComplete');
    if (btnComplete) {
        btnComplete.addEventListener('click', completeWizard);
    }

    // Progress dots clickable
    const progressDots = document.querySelectorAll('.progress-dot');
    progressDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const steps = ['step-welcome', 'step-setup'];
            if (index < steps.length) {
                goToStep(steps[index]);
            }
        });
    });
}

// ============================================================================
// STARTUP
// ============================================================================

// Initialize wizard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWizard);
} else {
    initializeWizard();
}
