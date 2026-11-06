/**
 * FBL Form Handler - Client-side validation and submission
 * Handles both membership application and partner forms with accessible error handling
 */

(function() {
  'use strict';

  // Configuration - Vercel API endpoint must be configured
  // Get from data attribute on form or fail safely
  const MAX_RETRIES = 2;
  const RETRY_DELAY = 1000; // ms

  /**
   * Show loading state on submit button
   */
  function setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.textContent = 'Submitting...';
      button.disabled = true;
      button.style.cursor = 'wait';
      button.setAttribute('aria-busy', 'true');
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
      button.style.cursor = 'pointer';
      button.setAttribute('aria-busy', 'false');
    }
  }

  /**
   * Display form message (success or error)
   */
  function showMessage(form, message, type = 'error') {
    // Remove existing messages
    const existingMsg = form.querySelector('.form-message');
    if (existingMsg) {
      existingMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
    messageDiv.setAttribute('aria-live', 'polite');
    
    const icon = type === 'error' ? '⚠️' : '✅';
    messageDiv.innerHTML = `<span aria-hidden="true">${icon}</span> ${escapeHtml(message)}`;
    
    form.insertBefore(messageDiv, form.firstChild);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Focus for screen readers
    messageDiv.tabIndex = -1;
    messageDiv.focus();
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Client-side validation before submission
   */
  function validateForm(form) {
    const errors = [];
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (field.type === 'checkbox' || field.type === 'radio') {
        const name = field.name;
        const group = form.querySelectorAll(`[name="${name}"]`);
        const checked = Array.from(group).some(el => el.checked);
        if (!checked) {
          const label = form.querySelector(`label[for="${field.id}"]`)?.textContent || name;
          errors.push(`${label} is required`);
        }
      } else if (!field.value.trim()) {
        const label = form.querySelector(`label[for="${field.id}"]`)?.textContent || field.name;
        errors.push(`${label} is required`);
      }
    });

    // Validate email format
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
      if (field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        errors.push('Please enter a valid email address');
      }
    });

    // Check field length limits (10KB max per field)
    const textFields = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea');
    textFields.forEach(field => {
      if (field.value.length > 10000) {
        const label = form.querySelector(`label[for="${field.id}"]`)?.textContent || field.name;
        errors.push(`${label} is too long (maximum 10,000 characters)`);
      }
    });

    return errors;
  }

  /**
   * Submit form via fetch API with retry logic
   */
  async function submitForm(form, data, retryCount = 0) {
    // Get API endpoint from form data attribute
    const apiEndpoint = form.dataset.apiEndpoint;
    
    if (!apiEndpoint) {
      throw new Error('Form submission endpoint not configured. Please contact site administrator.');
    }
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle rate limiting with specific message
        if (response.status === 429) {
          const retryAfter = Math.ceil((result.retryAfter || 3600) / 60);
          throw new Error(`Too many submissions. Please try again in ${retryAfter} minutes.`);
        }
        
        // Handle validation errors
        if (response.status === 400) {
          throw new Error(result.message || 'Please check your form and try again.');
        }
        
        // Server error - retry if not exceeded max retries
        if (response.status >= 500 && retryCount < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
          return submitForm(form, data, retryCount + 1);
        }
        
        throw new Error(result.message || 'Submission failed. Please try again.');
      }

      return result;
    } catch (error) {
      // Network error - retry if not exceeded max retries
      if (retryCount < MAX_RETRIES && error.name === 'TypeError') {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        return submitForm(form, data, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Client-side validation
    const validationErrors = validateForm(form);
    if (validationErrors.length > 0) {
      showMessage(form, validationErrors[0], 'error');
      return;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      // Handle checkboxes (collect all checked values)
      if (form.querySelector(`input[name="${key}"][type="checkbox"]`)) {
        data[key] = value;
      } else {
        data[key] = value;
      }
    }
    
    // Show loading state
    setButtonLoading(submitButton, true);
    
    try {
      const result = await submitForm(form, data);
      
      if (result.success) {
        showMessage(form, result.message, 'success');
        
        // Redirect for membership applications
        if (result.redirectUrl) {
          setTimeout(() => {
            window.location.href = result.redirectUrl;
          }, 2000);
        } else {
          // Reset form for partner applications
          form.reset();
        }
      } else {
        showMessage(form, result.message || 'Submission failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage(
        form, 
        error.message || 'An error occurred. Please try again or contact us directly.',
        'error'
      );
    } finally {
      setButtonLoading(submitButton, false);
    }
  }

  /**
   * Initialize form handlers when DOM is ready
   */
  function init() {
    const applicationForm = document.querySelector('.application-form');
    const partnerForm = document.querySelector('.partner-form');
    
    if (applicationForm) {
      applicationForm.addEventListener('submit', handleSubmit);
    }
    
    if (partnerForm) {
      partnerForm.addEventListener('submit', handleSubmit);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
