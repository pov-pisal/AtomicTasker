/*
 * ATOMIC TASKER - MODAL UTILITIES
 * Reusable modal and dialog management system
 */

/**
 * Modal Manager - handles all modal and dialog interactions
 */
class ModalManager {
    constructor() {
        this.currentModal = null;
        this.callbacks = {};
    }

    /**
     * Initialize modal manager with modal element
     * @param {string} modalSelector - CSS selector for modal element
     */
    init(modalSelector = '#confirmModal') {
        this.modalElement = document.querySelector(modalSelector);
        if (!this.modalElement) {
            console.warn('Modal element not found:', modalSelector);
            return false;
        }
        return true;
    }

    /**
     * Show confirmation dialog
     * @param {Object} options - Dialog options
     * @param {string} options.title - Dialog title
     * @param {string} options.message - Dialog message
     * @param {Function} options.onConfirm - Callback on confirm
     * @param {Function} options.onCancel - Callback on cancel (optional)
     * @param {string} options.confirmText - Confirm button text (default: "OK")
     * @param {string} options.cancelText - Cancel button text (default: "Cancel")
     * @param {string} options.type - Dialog type: 'confirm', 'alert', 'warning' (default: 'confirm')
     */
    showDialog(options = {}) {
        const {
            title = 'Confirm',
            message = '',
            onConfirm = () => {},
            onCancel = () => {},
            confirmText = 'OK',
            cancelText = 'Cancel',
            type = 'confirm'
        } = options;

        const titleEl = this.modalElement.querySelector('[data-role="title"]') || 
                       this.modalElement.querySelector('.modal-title');
        const messageEl = this.modalElement.querySelector('[data-role="message"]') || 
                         this.modalElement.querySelector('.modal-message');
        const confirmBtn = this.modalElement.querySelector('[data-role="confirm"]') || 
                          this.modalElement.querySelector('.btn-confirm');
        const cancelBtn = this.modalElement.querySelector('[data-role="cancel"]') || 
                         this.modalElement.querySelector('.btn-cancel');

        // Set content
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;

        // Set button text
        if (confirmBtn) confirmBtn.textContent = confirmText;
        if (cancelBtn) cancelBtn.textContent = cancelText;

        // Set dialog type styling
        this.modalElement.setAttribute('data-type', type);
        if (type === 'alert') {
            if (cancelBtn) cancelBtn.style.display = 'none';
            if (confirmBtn) confirmBtn.className = 'btn btn-primary';
        } else {
            if (cancelBtn) cancelBtn.style.display = '';
            if (confirmBtn) confirmBtn.className = 'btn btn-danger';
        }

        // Remove old event listeners by cloning buttons
        if (confirmBtn) {
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            newConfirmBtn.addEventListener('click', () => {
                onConfirm();
                this.close();
            });
        }

        if (cancelBtn && type !== 'alert') {
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            newCancelBtn.addEventListener('click', () => {
                onCancel();
                this.close();
            });
        }

        // Close on backdrop click for alerts
        if (type === 'alert') {
            this.modalElement.onclick = (e) => {
                if (e.target === this.modalElement) {
                    this.close();
                }
            };
        }

        this.open();
    }

    /**
     * Show alert dialog
     * @param {string} message - Alert message
     * @param {Function} onClose - Callback on close
     */
    alert(message, onClose = () => {}) {
        this.showDialog({
            title: 'Alert',
            message,
            onConfirm: onClose,
            type: 'alert'
        });
    }

    /**
     * Show confirmation dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {Function} onConfirm - Callback on confirm
     * @param {Function} onCancel - Callback on cancel
     */
    confirm(title, message, onConfirm, onCancel = () => {}) {
        this.showDialog({
            title,
            message,
            onConfirm,
            onCancel,
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            type: 'confirm'
        });
    }

    /**
     * Show warning dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {Function} onConfirm - Callback on confirm
     */
    warning(title, message, onConfirm) {
        this.showDialog({
            title,
            message,
            onConfirm,
            confirmText: 'Proceed',
            type: 'warning'
        });
    }

    /**
     * Open modal
     */
    open() {
        if (this.modalElement) {
            this.modalElement.style.display = 'flex';
            this.currentModal = this;
        }
    }

    /**
     * Close modal
     */
    close() {
        if (this.modalElement) {
            this.modalElement.style.display = 'none';
            this.currentModal = null;
        }
    }

    /**
     * Toggle modal visibility
     */
    toggle() {
        if (this.modalElement) {
            if (this.modalElement.style.display === 'none') {
                this.open();
            } else {
                this.close();
            }
        }
    }

    /**
     * Check if modal is open
     * @returns {boolean} True if modal is open
     */
    isOpen() {
        return this.modalElement && this.modalElement.style.display !== 'none';
    }
}

/**
 * Generic Modal Handler - for any modal with open/close
 */
class Modal {
    constructor(modalSelector) {
        this.element = document.querySelector(modalSelector);
        if (!this.element) {
            logWarn(`Modal not found: ${modalSelector}`);
        }
    }

    /**
     * Open the modal
     */
    open() {
        if (this.element) {
            this.element.style.display = 'flex';
            this.element.classList.add('open');
        }
    }

    /**
     * Close the modal
     */
    close() {
        if (this.element) {
            this.element.style.display = 'none';
            this.element.classList.remove('open');
        }
    }

    /**
     * Toggle modal visibility
     */
    toggle() {
        if (this.element) {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
        }
    }

    /**
     * Check if modal is open
     * @returns {boolean} True if modal is open
     */
    isOpen() {
        return this.element && this.element.style.display !== 'none';
    }

    /**
     * Get modal element
     * @returns {Element} Modal DOM element
     */
    getElement() {
        return this.element;
    }

    /**
     * Set modal content
     * @param {Object} content - Content to set
     * @param {string} content.title - Modal title
     * @param {string} content.body - Modal body content
     */
    setContent(content) {
        if (this.element) {
            const titleEl = this.element.querySelector('[data-role="title"]') || 
                           this.element.querySelector('.modal-title');
            const bodyEl = this.element.querySelector('[data-role="body"]') || 
                          this.element.querySelector('.modal-body');

            if (titleEl && content.title) titleEl.textContent = content.title;
            if (bodyEl && content.body) bodyEl.textContent = content.body;
        }
    }

    /**
     * Add event listener to element within modal
     * @param {string} selector - CSS selector within modal
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    on(selector, event, handler) {
        const element = this.element.querySelector(selector);
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    /**
     * Get form data from modal
     * @returns {FormData} Form data
     */
    getFormData() {
        const form = this.element.querySelector('form');
        if (form) {
            return new FormData(form);
        }
        return new FormData();
    }
}

// ============================================================================
// GLOBAL INSTANCES
// ============================================================================

// Create global modal manager instance
const modals = {
    confirmation: new ModalManager(),
    alert: new ModalManager(),
    
    /**
     * Create a new modal instance
     * @param {string} selector - Modal CSS selector
     * @returns {Modal} Modal instance
     */
    create(selector) {
        return new Modal(selector);
    }
};

// Initialize confirmation modal on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        modals.confirmation.init('#confirmModal');
        modals.alert.init('#confirmModal');
    });
} else {
    modals.confirmation.init('#confirmModal');
    modals.alert.init('#confirmModal');
}

// ============================================================================
// BACKWARD COMPATIBILITY FUNCTIONS
// ============================================================================

/**
 * Legacy function for backward compatibility
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Function} onConfirm - Confirm callback
 */
function showConfirmation(title, message, onConfirm) {
    modals.confirmation.confirm(title, message, onConfirm);
}

/**
 * Legacy function for backward compatibility
 * @param {string} message - Alert message
 */
function showAlert(message) {
    modals.alert.alert(message);
}
