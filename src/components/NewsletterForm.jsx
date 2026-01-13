'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { subscribeToNewsletter, validateEmail } from '../newsletter.js';

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export default function NewsletterForm({ buttonLabel, footer, source }) {
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(STATUS.IDLE);
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef(null);
  const timeoutRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  useEffect(() => {
    window.clearTimeout(timeoutRef.current);
    if (status === STATUS.SUCCESS) {
      timeoutRef.current = window.setTimeout(() => {
        setStatus(STATUS.IDLE);
        setFeedback('');
      }, 3000);
    }

    if (status === STATUS.ERROR) {
      timeoutRef.current = window.setTimeout(() => {
        setStatus(STATUS.IDLE);
        setFeedback('');
      }, 5000);
    }
  }, [status]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus(STATUS.ERROR);
      setFeedback('Please enter your email address.');
      inputRef.current?.focus();
      return;
    }

    if (!validateEmail(trimmed)) {
      setStatus(STATUS.ERROR);
      setFeedback('Please enter a valid email address.');
      inputRef.current?.focus();
      return;
    }

    setStatus(STATUS.LOADING);
    setFeedback('');

    const result = await subscribeToNewsletter(trimmed, {
      referrerUrl: window.location.href,
      metadata: {
        form_id: `form-${source}`,
        source
      }
    });

    if (result.success) {
      setStatus(STATUS.SUCCESS);
      setFeedback(result.message);
      setEmail('');

      if (window.gtag) {
        const label = source === 'hero' ? 'hero_form' : 'footer_form';
        window.gtag('event', 'newsletter_signup', {
          event_category: 'engagement',
          event_label: label
        });
      }
    } else {
      setStatus(STATUS.ERROR);
      setFeedback(result.message);
    }
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
    if (status === STATUS.ERROR) {
      setStatus(STATUS.IDLE);
      setFeedback('');
    }
  };

  const formClass = `hero-form${status === STATUS.LOADING ? ' form-loading' : ''}${
    status === STATUS.SUCCESS ? ' form-success' : ''
  }${status === STATUS.ERROR ? ' form-error' : ''}`;

  const isDisabled = status === STATUS.LOADING || status === STATUS.SUCCESS;

  const renderButtonContent = () => {
    if (status === STATUS.LOADING) {
      return (
        <>
          <svg className="spinner" viewBox="0 0 24 24" width="18" height="18">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeLinecap="round" />
          </svg>
          <span>Subscribing...</span>
        </>
      );
    }

    if (status === STATUS.SUCCESS) {
      return (
        <>
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
          </svg>
          <span>Subscribed!</span>
        </>
      );
    }

    return buttonLabel;
  };

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          ref={inputRef}
          type="email"
          placeholder="Enter your email"
          required
          aria-label="Email address"
          value={email}
          onChange={handleChange}
        />
        <motion.button
          type="submit"
          disabled={isDisabled}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
        >
          {renderButtonContent()}
        </motion.button>
      </div>
      <div
        className={`form-feedback${status === STATUS.SUCCESS ? ' feedback-success' : ''}${
          status === STATUS.ERROR ? ' feedback-error' : ''
        }`}
        role="alert"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {feedback ? (
            <motion.span
              key={feedback}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
              transition={{ duration: 0.2 }}
            >
              {feedback}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
      {footer ? <p className="form-footer">{footer}</p> : null}
    </form>
  );
}
