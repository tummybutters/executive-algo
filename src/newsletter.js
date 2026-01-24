/**
 * Mailchimp Newsletter Integration
 *
 * This module submits newsletter signups through the server proxy at /api/subscribe.
 * The server owns the Mailchimp credentials to avoid exposing them client-side.
 */

/**
 * Error messages mapping from server error codes
 */
const ERROR_MESSAGES = {
  member_exists: "You're already subscribed! Check your inbox.",
  email_blocked: 'This email address cannot be subscribed.',
  email_empty: 'Please enter your email address.',
  email_invalid: 'Please enter a valid email address.',
  rate_limited: 'Too many requests. Please wait a moment and try again.',
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
 * Subscribe an email to the newsletter
 * @param {string} email - The email address to subscribe
 * @param {Object} options - Additional options
 * @param {string} options.referrerUrl - The URL where the subscription originated
 * @param {Object} options.metadata - Additional metadata to attach to the subscriber
 * @returns {Promise<{success: boolean, message: string, data?: Object}>}
 */
export async function subscribeToNewsletter(email, options = {}) {
  if (!email || !validateEmail(email)) {
    return {
      success: false,
      message: ERROR_MESSAGES.email_invalid,
      errorCode: 'email_invalid'
    };
  }

  try {
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
