/**
 * Buttondown Newsletter Integration
 * 
 * This module handles newsletter subscriptions via the Buttondown API.
 * 
 * IMPORTANT: For production, you should proxy API calls through your own backend
 * to avoid exposing your API key in client-side code.
 * 
 * For now, this uses a serverless function approach or direct API call.
 */

// Configuration - Replace with your actual Buttondown API key
// In production, this should be handled server-side or via environment variables
const BUTTONDOWN_CONFIG = {
    // IMPORTANT: Replace this with your actual Buttondown API key
    // For security, you should use a serverless function to proxy these requests
    apiKey: 'YOUR_BUTTONDOWN_API_KEY',
    apiUrl: 'https://api.buttondown.com/v1/subscribers',
    // Set to 'regular' to skip double opt-in, or 'unactivated' for double opt-in
    subscriberType: 'regular',
    // Tags to apply to new subscribers
    tags: ['website-signup'],
    // UTM parameters for tracking
    utmSource: 'website',
    utmMedium: 'signup-form',
    utmCampaign: 'executive-algorithm'
};

/**
 * Form states for UI feedback
 */
export const FormState = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
};

/**
 * Error messages mapping from Buttondown error codes
 */
const ERROR_MESSAGES = {
    email_already_exists: 'You\'re already subscribed! Check your inbox.',
    email_blocked: 'This email address cannot be subscribed.',
    email_empty: 'Please enter your email address.',
    email_invalid: 'Please enter a valid email address.',
    ip_address_spammy: 'Unable to subscribe at this time. Please try again later.',
    rate_limited: 'Too many requests. Please wait a moment and try again.',
    subscriber_already_exists: 'You\'re already subscribed! Check your inbox.',
    subscriber_blocked: 'This email address cannot be subscribed.',
    subscriber_suppressed: 'This email address has been suppressed.',
    default: 'Something went wrong. Please try again.'
};

/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Get the user's IP address for spam prevention
 * Note: This requires a server-side endpoint or third-party service
 * For client-side, we'll skip this and let Buttondown use the request IP
 */
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
            const data = await response.json();
            return data.ip;
        }
    } catch (error) {
        console.warn('Could not fetch IP address:', error);
    }
    return null;
}

/**
 * Subscribe an email to the newsletter
 * @param {string} email - The email address to subscribe
 * @param {Object} options - Additional options
 * @param {string} options.referrerUrl - The URL where the subscription originated
 * @param {Object} options.metadata - Additional metadata to attach to the subscriber
 * @returns {Promise<{success: boolean, message: string, data?: Object}>}
 */
export async function subscribeToNewsletter(email, options = {}) {
    // Validate email
    if (!email || !validateEmail(email)) {
        return {
            success: false,
            message: ERROR_MESSAGES.email_invalid,
            errorCode: 'email_invalid'
        };
    }

    try {
        // Call our server proxy to avoid CORS issues
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.toLowerCase().trim(),
                referrer_url: options.referrerUrl || window.location.href,
                metadata: options.metadata || {}
            })
        });

        const data = await response.json();

        if (data.success) {
            return {
                success: true,
                message: data.message || "Welcome aboard! You're now subscribed."
            };
        }

        // Handle error responses
        const errorCode = data.code || 'default';
        return {
            success: false,
            message: data.message || ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.default,
            errorCode
        };

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection and try again.',
            errorCode: 'network_error'
        };
    }
}

/**
 * Initialize newsletter form handlers
 * This sets up all newsletter forms on the page to submit via Buttondown
 */
export function initNewsletterForms() {
    const forms = document.querySelectorAll('.hero-form');

    forms.forEach((form, index) => {
        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('button[type="submit"]');
        const formFooter = form.querySelector('.form-footer');

        if (!input || !button) return;

        // Store original button text
        const originalButtonText = button.textContent;

        // Create feedback element
        let feedbackEl = form.querySelector('.form-feedback');
        if (!feedbackEl) {
            feedbackEl = document.createElement('div');
            feedbackEl.className = 'form-feedback';
            feedbackEl.setAttribute('role', 'alert');
            feedbackEl.setAttribute('aria-live', 'polite');
            if (formFooter) {
                formFooter.insertAdjacentElement('beforebegin', feedbackEl);
            } else {
                form.appendChild(feedbackEl);
            }
        }

        // Update UI based on state
        const setState = (state, message = '') => {
            // Reset classes
            form.classList.remove('form-loading', 'form-success', 'form-error');
            feedbackEl.classList.remove('feedback-success', 'feedback-error');

            switch (state) {
                case FormState.LOADING:
                    form.classList.add('form-loading');
                    button.disabled = true;
                    button.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" width="18" height="18">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="32" stroke-linecap="round"/>
            </svg>
            <span>Subscribing...</span>
          `;
                    feedbackEl.textContent = '';
                    break;

                case FormState.SUCCESS:
                    form.classList.add('form-success');
                    button.disabled = true;
                    button.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
            </svg>
            <span>Subscribed!</span>
          `;
                    feedbackEl.classList.add('feedback-success');
                    feedbackEl.textContent = message;
                    input.value = '';

                    // Re-enable after 3 seconds
                    setTimeout(() => {
                        button.disabled = false;
                        button.textContent = originalButtonText;
                        form.classList.remove('form-success');
                    }, 3000);
                    break;

                case FormState.ERROR:
                    form.classList.add('form-error');
                    button.disabled = false;
                    button.textContent = originalButtonText;
                    feedbackEl.classList.add('feedback-error');
                    feedbackEl.textContent = message;

                    // Clear error after 5 seconds
                    setTimeout(() => {
                        form.classList.remove('form-error');
                        feedbackEl.textContent = '';
                    }, 5000);
                    break;

                default:
                    button.disabled = false;
                    button.textContent = originalButtonText;
                    feedbackEl.textContent = '';
            }
        };

        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = input.value.trim();

            // Quick validation before API call
            if (!email) {
                setState(FormState.ERROR, 'Please enter your email address.');
                input.focus();
                return;
            }

            if (!validateEmail(email)) {
                setState(FormState.ERROR, 'Please enter a valid email address.');
                input.focus();
                return;
            }

            // Set loading state
            setState(FormState.LOADING);

            // Call Buttondown API
            const result = await subscribeToNewsletter(email, {
                referrerUrl: window.location.href,
                metadata: {
                    form_id: `form-${index}`,
                    source: index === 0 ? 'hero' : 'footer-cta'
                }
            });

            // Update UI based on result
            if (result.success) {
                setState(FormState.SUCCESS, result.message);

                // Track successful subscription (for analytics)
                if (window.gtag) {
                    window.gtag('event', 'newsletter_signup', {
                        event_category: 'engagement',
                        event_label: index === 0 ? 'hero_form' : 'footer_form'
                    });
                }
            } else {
                setState(FormState.ERROR, result.message);
            }
        });

        // Clear error state when user starts typing
        input.addEventListener('input', () => {
            if (form.classList.contains('form-error')) {
                form.classList.remove('form-error');
                feedbackEl.textContent = '';
            }
        });
    });
}

// Export configuration update function for easy customization
export function updateConfig(newConfig) {
    Object.assign(BUTTONDOWN_CONFIG, newConfig);
}
