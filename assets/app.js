// Import CSS files
import './app.css';
import './styles/dropdown.css';
import 'mdb-ui-kit/css/mdb.min.css';

// Import MDB UI Kit
import * as mdb from 'mdb-ui-kit';
import '@popperjs/core';

// Make MDB available globally
window.mdb = mdb;

/**
 * Initialize all MDB components
 */
function initializeMDBComponents() {
    console.log('Initializing MDB components...');

    // Initialize floating labels
    const floatingInputs = document.querySelectorAll('.form-outline');
    floatingInputs.forEach(input => {
        new mdb.Input(input).init();
        
        // Auto-activate label if input has value
        const formInput = input.querySelector('input, textarea');
        if (formInput && formInput.value) {
            input.classList.add('active');
        }
        
        // Keep label active on input
        formInput?.addEventListener('input', () => {
            input.classList.toggle('active', formInput.value.length > 0);
        });
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-mdb-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new mdb.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-mdb-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new mdb.Popover(popoverTriggerEl);
    });

    // Initialize collapses (for navbar toggler and accordions)
    const collapseElementList = [].slice.call(document.querySelectorAll('[data-mdb-toggle="collapse"]'));
    collapseElementList.map(function (collapseEl) {
        return new mdb.Collapse(collapseEl, { toggle: false });
    });

    // Initialize accordions specifically
    const accordionElements = [].slice.call(document.querySelectorAll('.accordion'));
    accordionElements.forEach(function (accordionEl) {
        const accordionButtons = accordionEl.querySelectorAll('.accordion-button');
        accordionButtons.forEach(function (button) {
            // Ensure accordion behavior works correctly
            button.addEventListener('click', function () {
                const target = this.getAttribute('data-mdb-target');
                if (target) {
                    const collapseElement = document.querySelector(target);
                    if (collapseElement) {
                        const bsCollapse = mdb.Collapse.getInstance(collapseElement) || new mdb.Collapse(collapseElement, {
                            toggle: false,
                            parent: accordionEl
                        });

                        // Toggle the collapse
                        if (collapseElement.classList.contains('show')) {
                            bsCollapse.hide();
                            this.classList.add('collapsed');
                            this.setAttribute('aria-expanded', 'false');
                        } else {
                            bsCollapse.show();
                            this.classList.remove('collapsed');
                            this.setAttribute('aria-expanded', 'true');
                        }

                        // Rotate arrow for all other buttons in the accordion
                        accordionButtons.forEach(otherButton => {
                            if (otherButton !== this && otherButton.getAttribute('data-mdb-target') !== target) {
                                otherButton.classList.add('collapsed');
                                otherButton.setAttribute('aria-expanded', 'false');
                            }
                        });
                    }
                }
            });

            // Add transition class for smooth rotation
            button.style.transition = 'transform 0.2s ease-in-out';
        });
    });

    // Initialize tabs
    const tabElementList = [].slice.call(document.querySelectorAll('[data-mdb-toggle="tab"]'));
    tabElementList.map(function (tabEl) {
        return new mdb.Tab(tabEl);
    });

    // Initialize pills
    const pillElementList = [].slice.call(document.querySelectorAll('[data-mdb-toggle="pill"]'));
    pillElementList.map(function (pillEl) {
        return new mdb.Tab(pillEl);
    });

    // Initialize modals with force update
    const modalElementList = [].slice.call(document.querySelectorAll('[data-mdb-toggle="modal"]'));
    modalElementList.forEach(function (modalTrigger) {
        const targetId = modalTrigger.getAttribute('data-mdb-target');
        const modalElement = document.querySelector(targetId);
        
        if (modalElement) {
            // Force destroy any existing modal instance
            let existingModal = mdb.Modal.getInstance(modalElement);
            if (existingModal) {
                existingModal.dispose();
            }

            // Create new modal instance
            const modal = new mdb.Modal(modalElement, {
                backdrop: true,
                keyboard: true,
                focus: true
            });

            // Add click handler to trigger
            modalTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.show();
            });

            // Setup modal events
            modalElement.addEventListener('show.mdb.modal', () => {
                console.log('Modal opening:', targetId);
            });

            modalElement.addEventListener('shown.mdb.modal', () => {
                // Reinitialize floating labels in the modal
                const floatingInputs = modalElement.querySelectorAll('.form-outline');
                floatingInputs.forEach(input => {
                    // Dispose existing instance if any
                    const existingInput = mdb.Input.getInstance(input);
                    if (existingInput) {
                        existingInput.dispose();
                    }
                    
                    // Initialize new input instance
                    const newInput = new mdb.Input(input);
                    newInput.init();
                    
                    // Check if input has value and activate label
                    const formInput = input.querySelector('input, textarea');
                    if (formInput && formInput.value) {
                        input.classList.add('active');
                    }
                });

                // Focus first input if exists
                const firstInput = modalElement.querySelector('input, textarea, select');
                if (firstInput) {
                    firstInput.focus();
                }
            });
        }
    });

    // Add global modal utilities
    window.modalUtils = {
        show: function(modalId) {
            const modalEl = document.querySelector(modalId);
            if (modalEl) {
                const modal = mdb.Modal.getInstance(modalEl) || new mdb.Modal(modalEl);
                modal.show();
            }
        },
        hide: function(modalId) {
            const modalEl = document.querySelector(modalId);
            if (modalEl) {
                const modal = mdb.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }
        },
        hideAll: function() {
            document.querySelectorAll('.modal.show').forEach(modalEl => {
                const modal = mdb.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            });
        },
        createDynamic: function(options = {}) {
            const modalId = options.id || 'dynamicModal-' + Date.now();
            const modalHtml = `
                <div class="modal fade" id="${modalId}" tabindex="-1">
                    <div class="modal-dialog ${options.size || ''}">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${options.title || ''}</h5>
                                <button type="button" class="btn-close" data-mdb-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">${options.content || ''}</div>
                            ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
                        </div>
                    </div>
                </div>`;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const modalEl = document.getElementById(modalId);
            const modal = new mdb.Modal(modalEl);
            
            // Auto cleanup on hide
            modalEl.addEventListener('hidden.mdb.modal', () => {
                if (options.autoDestroy !== false) {
                    modalEl.remove();
                }
            });
            
            modal.show();
            return modal;
        }
    };

    // Initialize offcanvas
    const offcanvasElementList = [].slice.call(document.querySelectorAll('[data-mdb-toggle="offcanvas"]'));
    offcanvasElementList.map(function (offcanvasEl) {
        return new mdb.Offcanvas(offcanvasEl);
    });

    // Toast button handler
    const toastBtn = document.getElementById('showToast');
    const toastEl = document.getElementById('liveToast');
    if (toastBtn && toastEl) {
        toastBtn.addEventListener('click', function() {
            const toast = new mdb.Toast(toastEl);
            toast.show();
        });
    }

    // Initialize dropdowns with animation
    const dropdownElementList = [].slice.call(document.querySelectorAll('[data-mdb-toggle="dropdown"]'));
    dropdownElementList.forEach(function (dropdownToggleEl) {
        // Force destroy existing instance
        const existingDropdown = mdb.Dropdown.getInstance(dropdownToggleEl);
        if (existingDropdown) {
            existingDropdown.dispose();
        }

        // Create new dropdown instance with options
        const dropdown = new mdb.Dropdown(dropdownToggleEl, {
            offset: [0, 8],
            flip: true,
            boundary: 'clippingParents',
            reference: 'toggle',
            display: 'dynamic'
        });

        // Get dropdown menu
        const menu = dropdownToggleEl.nextElementSibling;
        if (menu && menu.classList.contains('dropdown-menu')) {
            dropdownToggleEl.addEventListener('show.mdb.dropdown', () => {
                requestAnimationFrame(() => menu.classList.add('show'));
            });

            dropdownToggleEl.addEventListener('hide.mdb.dropdown', () => {
                menu.classList.remove('show');
            });
        }

        return dropdown;
    });

    console.log('MDB components initialized successfully');
}

/**
 * Smooth scroll for anchor links
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target && !this.hasAttribute('data-mdb-toggle')) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Theme Management
 */
function initializeTheme() {
    // Get saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    console.log(`Theme initialized: ${savedTheme}`);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    console.log(`Theme changed to: ${newTheme}`);

    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
}

function createThemeToggle() {
    // Check if toggle already exists
    if (document.querySelector('.theme-toggle')) {
        return;
    }

    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    button.setAttribute('title', 'Toggle theme');

    // Sun icon (for light mode) - using heroicons
    const sunIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="sun-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
    `;

    // Moon icon (for dark mode) - using heroicons
    const moonIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="moon-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
    `;

    function updateIcon() {
        const theme = document.documentElement.getAttribute('data-theme');
        button.innerHTML = theme === 'light' ? moonIcon : sunIcon;
    }

    updateIcon();
    button.addEventListener('click', () => {
        toggleTheme();
        updateIcon();
    });

    document.body.appendChild(button);
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Assets loaded successfully');

    // Initialize theme first (before components to avoid flicker)
    initializeTheme();

    // Initialize all MDB components
    initializeMDBComponents();

    // Setup additional behaviors
    setupSmoothScroll();

    // Create theme toggle button
    createThemeToggle();
});

/**
 * Re-initialize components after dynamic content load
 * Usage: window.reinitializeMDB();
 */
window.reinitializeMDB = function() {
    initializeMDBComponents();
};

/**
 * Global theme functions
 */
window.setTheme = function(theme) {
    if (theme === 'light' || theme === 'dark') {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        console.log(`Theme set to: ${theme}`);
    }
};

window.getTheme = function() {
    return document.documentElement.getAttribute('data-theme');
};
