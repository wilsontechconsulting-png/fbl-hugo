/**
 * FBL Form Submission Handler
 * Securely processes application and partner forms using Resend
 * 
 * Required Environment Variables:
 * - RESEND_API_KEY: Resend API key (server-only)
 * - MEMBERSHIP_FORM_RECIPIENT_EMAIL: Email for membership applications (e.g., member@fblconnect.com)
 * - PARTNER_FORM_RECIPIENT_EMAIL: Email for partner applications (e.g., partnerships@fblconnect.com)
 *   OR
 * - FORM_RECIPIENT_EMAIL: Fallback email for all form submissions
 * 
 * Optional Environment Variables:
 * - RATE_LIMIT_MAX: Maximum submissions per IP per hour (default: 3)
 * - ALLOWED_ORIGINS: Comma-separated list of allowed origins (default: fblconnect.com)
 */

// Simple in-memory rate limiter (resets on cold start)
const rateLimits = new Map();

// Configuration
const CONFIG = {
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '3', 10),
  RATE_LIMIT_WINDOW_MS: 60 * 60 * 1000, // 1 hour
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'https://fblconnect.com,https://wilsontechconsulting-png.github.io').split(','),
  MAX_FIELD_LENGTH: 10000,
  FROM_EMAIL: 'FBL Forms <forms@send.fblconnect.com>',
};

/**
 * Escape HTML to prevent XSS in email content
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Validate and sanitize form data
 */
function validateFormData(body) {
  const errors = [];
  
  // Check for honeypot (spam detection)
  if (body._gotcha) {
    errors.push('Spam detected');
  }
  
  // Validate required fields based on form type
  const isPartnerForm = body._subject === 'FBL Partner Application';
  
  if (isPartnerForm) {
    // Partner form required fields
    const requiredFields = ['company_name', 'industry', 'website', 'contact_name', 'email', 'phone', 'tier', 'why_fbl', 'member_value', 'member_benefit'];
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== 'string' || body[field].trim().length === 0) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  } else {
    // Application form required fields (sampling - all checkboxes and key text fields)
    const requiredFields = ['full_name', 'email', 'phone', 'city', 'state', 'company', 'industry', 'role'];
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== 'string' || body[field].trim().length === 0) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    // Validate covenant signature
    if (!body.covenant_signature || body.covenant_signature.trim().length === 0) {
      errors.push('Covenant signature is required');
    }
  }
  
  // Validate email format
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('Invalid email format');
  }
  
  // Check field length limits
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string' && value.length > CONFIG.MAX_FIELD_LENGTH) {
      errors.push(`Field ${key} exceeds maximum length`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const limit = rateLimits.get(ip);
  
  if (!limit) {
    rateLimits.set(ip, { count: 1, resetAt: now + CONFIG.RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: CONFIG.RATE_LIMIT_MAX - 1 };
  }
  
  // Reset if window has passed
  if (now > limit.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + CONFIG.RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: CONFIG.RATE_LIMIT_MAX - 1 };
  }
  
  // Check if limit exceeded
  if (limit.count >= CONFIG.RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: limit.resetAt };
  }
  
  // Increment count
  limit.count += 1;
  return { allowed: true, remaining: CONFIG.RATE_LIMIT_MAX - limit.count };
}

/**
 * Build email HTML for application form
 */
function buildApplicationEmailHtml(data) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: #0F111E; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; color: #22C55E; }
    .content { background: #f8f9fa; padding: 20px; }
    .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; border-left: 4px solid #22C55E; }
    .section h2 { color: #0F111E; margin-top: 0; font-size: 1.3em; }
    .field { margin: 15px 0; }
    .field-label { font-weight: 600; color: #0F111E; display: block; margin-bottom: 5px; }
    .field-value { color: #475569; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 0.9em; }
    .checkbox-list { list-style: none; padding-left: 0; }
    .checkbox-list li:before { content: "✓ "; color: #22C55E; font-weight: bold; margin-right: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New FBL Membership Application</h1>
      <p style="margin: 5px 0 0 0; color: #94a3b8;">Submitted: ${escapeHtml(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2>📋 Covenant Acknowledgment</h2>
        <ul class="checkbox-list">
          ${data.covenant_formation ? '<li>Formation over information</li>' : ''}
          ${data.covenant_confidentiality ? '<li>Confidentiality and direct communication</li>' : ''}
          ${data.covenant_integrity ? '<li>Integrity and accountability</li>' : ''}
          ${data.covenant_contribution ? '<li>Contribution over consumption</li>' : ''}
          ${data.covenant_agreement ? '<li>Covenant agreement accepted</li>' : ''}
        </ul>
        <div class="field">
          <span class="field-label">Covenant Signature:</span>
          <span class="field-value">${escapeHtml(data.covenant_signature || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Date:</span>
          <span class="field-value">${escapeHtml(data.covenant_date || '')}</span>
        </div>
      </div>
      
      <div class="section">
        <h2>👤 Personal Information</h2>
        <div class="field">
          <span class="field-label">Full Name:</span>
          <span class="field-value">${escapeHtml(data.full_name || '')}</span>
        </div>
        ${data.preferred_name ? `
        <div class="field">
          <span class="field-label">Preferred Name:</span>
          <span class="field-value">${escapeHtml(data.preferred_name)}</span>
        </div>
        ` : ''}
        <div class="field">
          <span class="field-label">Email:</span>
          <span class="field-value"><a href="mailto:${escapeHtml(data.email || '')}">${escapeHtml(data.email || '')}</a></span>
        </div>
        <div class="field">
          <span class="field-label">Phone:</span>
          <span class="field-value">${escapeHtml(data.phone || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Location:</span>
          <span class="field-value">${escapeHtml(data.city || '')}, ${escapeHtml(data.state || '')}</span>
        </div>
        ${data.linkedin ? `
        <div class="field">
          <span class="field-label">LinkedIn:</span>
          <span class="field-value"><a href="${escapeHtml(data.linkedin)}">${escapeHtml(data.linkedin)}</a></span>
        </div>
        ` : ''}
      </div>
      
      <div class="section">
        <h2>🏢 Business Information</h2>
        <div class="field">
          <span class="field-label">Company:</span>
          <span class="field-value">${escapeHtml(data.company || '')}</span>
        </div>
        ${data.website ? `
        <div class="field">
          <span class="field-label">Website:</span>
          <span class="field-value"><a href="${escapeHtml(data.website)}">${escapeHtml(data.website)}</a></span>
        </div>
        ` : ''}
        <div class="field">
          <span class="field-label">Industry:</span>
          <span class="field-value">${escapeHtml(data.industry || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Role:</span>
          <span class="field-value">${escapeHtml(data.role || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Years in Business:</span>
          <span class="field-value">${escapeHtml(data.years_in_business || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Employees:</span>
          <span class="field-value">${escapeHtml(data.employees || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Annual Revenue:</span>
          <span class="field-value">${escapeHtml(data.revenue || '')}</span>
        </div>
      </div>
      
      <div class="section">
        <h2>💪 Leadership Context</h2>
        <div class="field">
          <span class="field-label">People Depending Daily:</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.people_depending || '')}</div>
        </div>
        <div class="field">
          <span class="field-label">Primary Leadership Responsibility:</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.leadership_responsibility || '')}</div>
        </div>
        <div class="field">
          <span class="field-label">Biggest Leadership Challenge:</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.leadership_challenge || '')}</div>
        </div>
      </div>
      
      <div class="section">
        <h2>✝️ Spiritual Formation</h2>
        <div class="field">
          <span class="field-label">Current Spiritual Rhythm:</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.spiritual_rhythm || '')}</div>
        </div>
        <div class="field">
          <span class="field-label">Connected to Local Church:</span>
          <span class="field-value">${escapeHtml(data.church_connected || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Has Accountability:</span>
          <span class="field-value">${escapeHtml(data.accountability || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Areas Needing Strengthening:</span>
          <ul class="checkbox-list" style="margin-top: 5px;">
            ${data.strengthen_faith ? '<li>Faith</li>' : ''}
            ${data.strengthen_marriage ? '<li>Marriage / Family</li>' : ''}
            ${data.strengthen_leadership ? '<li>Leadership Development</li>' : ''}
            ${data.strengthen_growth ? '<li>Business Growth</li>' : ''}
            ${data.strengthen_integrity ? '<li>Integrity / Accountability</li>' : ''}
            ${data.strengthen_health ? '<li>Health</li>' : ''}
            ${data.strengthen_resilience ? '<li>Emotional Resilience</li>' : ''}
            ${data.strengthen_other ? '<li>Other</li>' : ''}
          </ul>
        </div>
      </div>
      
      <div class="section">
        <h2>🎯 Motivation & Contribution</h2>
        <div class="field">
          <span class="field-label">Why Join FBL:</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.why_join || '')}</div>
        </div>
        <div class="field">
          <span class="field-label">Hope to Gain:</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.hope_to_gain || '')}</div>
        </div>
        <div class="field">
          <span class="field-label">Willing to Contribute:</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.willing_to_contribute || '')}</div>
        </div>
      </div>
      
      <div class="section">
        <h2>💰 Payment Selection</h2>
        <div class="field">
          <span class="field-label">Assessment Fee Acknowledged:</span>
          <span class="field-value">${data.assessment_acknowledgment ? 'Yes - $195 one-time' : 'Not acknowledged'}</span>
        </div>
        <div class="field">
          <span class="field-label">Payment Option:</span>
          <span class="field-value">${escapeHtml(data.payment_option || '')}</span>
        </div>
        ${data.payment_notes ? `
        <div class="field">
          <span class="field-label">Payment Notes:</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.payment_notes)}</div>
        </div>
        ` : ''}
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Fellowship of Business Leaders</strong></p>
      <p>This submission was received via fblconnect.com</p>
      <p style="font-size: 0.85em; color: #94a3b8;">Reply directly to this email to contact the applicant at ${escapeHtml(data.email || '')}</p>
    </div>
  </div>
</body>
</html>
`;
  
  return html.trim();
}

/**
 * Build email HTML for partner form
 */
function buildPartnerEmailHtml(data) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: #0F111E; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; color: #22C55E; }
    .content { background: #f8f9fa; padding: 20px; }
    .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; border-left: 4px solid #22C55E; }
    .section h2 { color: #0F111E; margin-top: 0; font-size: 1.3em; }
    .field { margin: 15px 0; }
    .field-label { font-weight: 600; color: #0F111E; display: block; margin-bottom: 5px; }
    .field-value { color: #475569; }
    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 0.9em; }
    .tier-badge { display: inline-block; background: #22C55E; color: white; padding: 5px 15px; border-radius: 20px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New FBL Partner Application</h1>
      <p style="margin: 5px 0 0 0; color: #94a3b8;">Submitted: ${escapeHtml(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2>🏢 Company Information</h2>
        <div class="field">
          <span class="field-label">Company Name:</span>
          <span class="field-value">${escapeHtml(data.company_name || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Industry / Category:</span>
          <span class="field-value">${escapeHtml(data.industry || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Website:</span>
          <span class="field-value"><a href="${escapeHtml(data.website || '')}">${escapeHtml(data.website || '')}</a></span>
        </div>
      </div>
      
      <div class="section">
        <h2>👤 Primary Contact</h2>
        <div class="field">
          <span class="field-label">Name:</span>
          <span class="field-value">${escapeHtml(data.contact_name || '')}</span>
        </div>
        <div class="field">
          <span class="field-label">Email:</span>
          <span class="field-value"><a href="mailto:${escapeHtml(data.email || '')}">${escapeHtml(data.email || '')}</a></span>
        </div>
        <div class="field">
          <span class="field-label">Phone:</span>
          <span class="field-value">${escapeHtml(data.phone || '')}</span>
        </div>
      </div>
      
      <div class="section">
        <h2>🤝 Partnership Details</h2>
        <div class="field">
          <span class="field-label">Desired Tier:</span>
          <span class="tier-badge">${escapeHtml(data.tier || '').toUpperCase()}</span>
        </div>
        <div class="field">
          <span class="field-label">Why Partner with FBL:</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.why_fbl || '')}</div>
        </div>
        <div class="field">
          <span class="field-label">Value for FBL Members:</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.member_value || '')}</div>
        </div>
        <div class="field">
          <span class="field-label">Member Benefit (15%+ discount):</span>
          <div class="field-value" style="white-space: pre-wrap;">${escapeHtml(data.member_benefit || '')}</div>
        </div>
        ${data.roi_timeline ? `
        <div class="field">
          <span class="field-label">Expected ROI Timeline:</span>
          <span class="field-value">${escapeHtml(data.roi_timeline)}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="section">
        <h2>✅ Commitments Acknowledged</h2>
        <ul style="list-style: none; padding-left: 0;">
          ${data.commitment_communications ? '<li style="margin: 8px 0;">✓ All communications must be FBL-approved</li>' : ''}
          ${data.commitment_value ? '<li style="margin: 8px 0;">✓ Commit to providing real value to members</li>' : ''}
          ${data.commitment_limits ? '<li style="margin: 8px 0;">✓ Agree to communication limits for tier</li>' : ''}
          ${data.commitment_agreement ? '<li style="margin: 8px 0;">✓ Will honor partner agreement terms</li>' : ''}
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Fellowship of Business Leaders</strong></p>
      <p>This submission was received via fblconnect.com/partners/</p>
      <p style="font-size: 0.85em; color: #94a3b8;">Reply directly to this email to contact the applicant at ${escapeHtml(data.email || '')}</p>
    </div>
  </div>
</body>
</html>
`;
  
  return html.trim();
}

/**
 * Send email via Resend
 */
async function sendEmail(formData, isPartnerForm) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  // Use form-specific recipient or fall back to general recipient
  const RECIPIENT = isPartnerForm
    ? (process.env.PARTNER_FORM_RECIPIENT_EMAIL || process.env.FORM_RECIPIENT_EMAIL)
    : (process.env.MEMBERSHIP_FORM_RECIPIENT_EMAIL || process.env.FORM_RECIPIENT_EMAIL);
  
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured');
  }
  
  if (!RECIPIENT) {
    throw new Error('Form recipient email not configured. Set MEMBERSHIP_FORM_RECIPIENT_EMAIL and PARTNER_FORM_RECIPIENT_EMAIL or FORM_RECIPIENT_EMAIL.');
  }
  
  const subject = isPartnerForm 
    ? `FBL Partner Application: ${formData.company_name || 'New Application'}`
    : `FBL Membership Application: ${formData.full_name || 'New Application'}`;
  
  const html = isPartnerForm 
    ? buildPartnerEmailHtml(formData)
    : buildApplicationEmailHtml(formData);
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONFIG.FROM_EMAIL,
      to: RECIPIENT,
      subject: subject,
      html: html,
      reply_to: formData.email || RECIPIENT,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
}

/**
 * Main handler
 */
export default async function handler(req, res) {
  // CORS headers
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigin = CONFIG.ALLOWED_ORIGINS.find(o => origin?.startsWith(o));
  
  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }
  
  try {
    // Rate limiting
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.socket?.remoteAddress || 
                     'unknown';
    
    const rateLimit = checkRateLimit(clientIp);
    
    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000 / 60);
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: `Too many submissions. Please try again in ${resetIn} minutes.`,
        retryAfter: resetIn * 60,
      });
    }
    
    // Validate form data
    const validation = validateFormData(req.body);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please check your form and try again.',
        details: validation.errors,
      });
    }
    
    // Determine form type
    const isPartnerForm = req.body._subject === 'FBL Partner Application';
    
    // Send email
    const emailResult = await sendEmail(req.body, isPartnerForm);
    
    // Return success
    return res.status(200).json({
      success: true,
      message: isPartnerForm 
        ? 'Partner application submitted successfully. We\'ll review and contact you within 5 business days.'
        : 'Application submitted successfully. Please proceed to complete your payment.',
      emailId: emailResult.id,
      redirectUrl: isPartnerForm ? null : '/membership-payment/',
    });
    
  } catch (error) {
    console.error('Form submission error:', error);
    
    // Don't expose internal errors to client
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return res.status(500).json({
      success: false,
      error: 'Submission failed',
      message: 'An error occurred while processing your submission. Please try again or contact us directly.',
      ...(isDevelopment && { details: error.message }),
    });
  }
}
