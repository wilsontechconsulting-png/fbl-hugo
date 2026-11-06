# FBL Forms - Resend Migration Guide

**Migration Date:** November 6, 2026  
**Status:** Implementation Complete - Awaiting Production Deployment  
**Branch:** `cursor/resend-forms-migration-0033`

---

## Overview

This migration replaces Formspree with a secure, self-hosted form handler using Resend for email delivery. All form submissions now flow through a Vercel serverless function with proper validation, rate limiting, and spam protection.

## What Changed

### ✅ Removed
- ❌ Formspree endpoint (`https://formspree.io/f/mzdykbar`)
- ❌ External form service dependency
- ❌ Third-party data handling

### ✅ Added
- ✅ Vercel serverless function (`/api/submit-form.js`)
- ✅ Resend email integration (send.fblconnect.com)
- ✅ Client-side validation and AJAX submission
- ✅ Rate limiting (3 submissions/hour per IP)
- ✅ Honeypot spam protection
- ✅ Accessible error/success handling
- ✅ Comprehensive test suite

## Email Routing Configuration

**User Confirmed:** All form submissions → `member@fblconnect.com`

| Form Type | Recipient | Reply-To | From |
|-----------|-----------|----------|------|
| Membership Application | member@fblconnect.com | Applicant's validated email | FBL Forms <forms@send.fblconnect.com> |
| Partner Application | member@fblconnect.com | Applicant's validated email | FBL Forms <forms@send.fblconnect.com> |

## Files Modified

### Core Implementation
- `api/submit-form.js` - New serverless function handler
- `static/js/form-handler.js` - Client-side form handling
- `static/css/form-messages.css` - Success/error message styles
- `themes/fbl/layouts/section/apply.html` - Updated membership form
- `themes/fbl/layouts/section/partners.html` - Updated partner form

### Configuration
- `vercel.json` - New Vercel configuration
- `.vercelignore` - Build exclusions
- `.env.example` - Environment variable template
- `PROJECT-HANDOFF.md` - Preserved from Mac baseline

### Documentation & Testing
- `RESEND-MIGRATION-GUIDE.md` - This file
- `api/submit-form.test.js` - Test suite with mock Resend

## Required Environment Variables

Configure these in Vercel project settings (NOT in code):

```bash
# Required - Get from Resend dashboard
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Required - Form recipients (user confirmed: both → member@fblconnect.com)
MEMBERSHIP_FORM_RECIPIENT_EMAIL=member@fblconnect.com
PARTNER_FORM_RECIPIENT_EMAIL=member@fblconnect.com
FORM_RECIPIENT_EMAIL=member@fblconnect.com

# Optional - Rate limiting (default: 3)
RATE_LIMIT_MAX=3

# Optional - CORS origins (default: fblconnect.com)
ALLOWED_ORIGINS=https://fblconnect.com,https://wilsontechconsulting-png.github.io
```

## Deployment Steps

### Phase 1: Vercel Project Setup (Parent Coordinates)

1. **Create Vercel Project**
   ```bash
   # Connect GitHub repo: wilsontechconsulting-png/fbl-hugo
   # Framework Preset: Other
   # Root Directory: ./
   # Build Command: (specified in vercel.json)
   # Output Directory: public
   ```

2. **Configure Environment Variables**
   - Go to Vercel Project Settings → Environment Variables
   - Add all required variables above
   - Set to: Production, Preview, Development
   - **DO NOT** commit `.env` files to git

3. **Domain Configuration**
   - Option A: Deploy to separate subdomain (e.g., `forms.fblconnect.com`)
   - Option B: Deploy alongside existing site (requires coordination)
   - **DO NOT** change DNS without parent approval

### Phase 2: Testing (Before Production)

1. **Run Test Suite**
   ```bash
   cd /workspace
   node api/submit-form.test.js
   ```
   Expected: All tests pass ✓

2. **Deploy to Preview**
   - Push branch to GitHub
   - Vercel auto-creates preview deployment
   - Test both forms on preview URL
   - Verify emails arrive at member@fblconnect.com

3. **Parent Verification**
   - Parent confirms test emails received
   - Parent verifies Reply-To works correctly
   - Parent approves production deployment

### Phase 3: Production Deployment

1. **Merge PR**
   ```bash
   git checkout main
   git merge cursor/resend-forms-migration-0033
   git push origin main
   ```

2. **Verify Production**
   - Forms at https://fblconnect.com/apply/
   - Forms at https://fblconnect.com/partners/
   - Submit test applications
   - Confirm emails received

3. **Monitor**
   - Check Vercel function logs
   - Check Resend dashboard for delivery
   - Monitor for errors or spam

## Security Features

### Server-Side Protection
- ✅ API key never exposed to browser
- ✅ Rate limiting per IP (3/hour)
- ✅ Field length validation (10KB max)
- ✅ Email format validation
- ✅ Honeypot spam detection
- ✅ HTML escaping in email content
- ✅ CORS origin validation

### Client-Side Enhancements
- ✅ Client-side validation before submission
- ✅ AJAX submission (no page reload)
- ✅ Retry logic for network failures
- ✅ Accessible error messages (ARIA)
- ✅ Loading states and UX feedback

## Testing Checklist

Before production deployment, verify:

- [ ] Test suite passes (`node api/submit-form.test.js`)
- [ ] Membership form submits successfully
- [ ] Partner form submits successfully
- [ ] Email arrives at member@fblconnect.com
- [ ] Reply-To uses applicant email
- [ ] From shows "FBL Forms <forms@send.fblconnect.com>"
- [ ] Success message displays correctly
- [ ] Error handling works (try invalid email)
- [ ] Rate limiting works (4th submission blocked)
- [ ] Honeypot catches spam (fill hidden field)
- [ ] Mobile responsive (test on phone)
- [ ] Accessible (test with screen reader)

## Rollback Plan

If forms need to be disabled:

### Graceful Disable
Set `formApiEndpoint = ''` in `hugo.toml`:
```toml
[params]
  formApiEndpoint = ''  # Forms show "not configured" message
```

Rebuild and deploy. Forms will show user-friendly error without submitting.

### Remove Forms Entirely
Comment out or remove form sections from layout files if needed.

**Note:** Do not revert to Formspree or other external providers.

## Support & Troubleshooting

### Common Issues

**"RESEND_API_KEY not configured"**
- Environment variable not set in Vercel
- Go to Project Settings → Environment Variables
- Add RESEND_API_KEY with valid key from Resend dashboard

**"Form recipient email not configured"**
- Set MEMBERSHIP_FORM_RECIPIENT_EMAIL and PARTNER_FORM_RECIPIENT_EMAIL
- Or set FORM_RECIPIENT_EMAIL as fallback

**"Rate limit exceeded"**
- User submitted 3+ times in one hour
- Wait 60 minutes or increase RATE_LIMIT_MAX
- Check for malicious activity in Vercel logs

**"Submission failed"**
- Check Vercel function logs
- Check Resend dashboard for delivery status
- Verify API key is valid and not rate limited

### Logs & Monitoring

**Vercel Function Logs:**
- https://vercel.com/[team]/[project]/logs

**Resend Dashboard:**
- https://resend.com/emails
- Monitor deliveries, bounces, complaints

**GitHub Actions:**
- https://github.com/wilsontechconsulting-png/fbl-hugo/actions
- Monitor Hugo build and deployment

## Mac Sync Instructions

**Critical:** Mac at `/Users/promax/AI/workspaces/fbl-hugo` MUST match production

### Before Live Deployment
```bash
# On Mac (parent coordinates)
cd /Users/promax/AI/workspaces/fbl-hugo

# Pull from this PR's source files or apply patch
# (See attached source artifacts in PR)

# Verify files match
git diff HEAD origin/cursor/resend-forms-migration-0033

# Build locally to test
hugo server -D

# Verify forms work at http://localhost:1313/apply/
```

### After Live Deployment
```bash
# Sync from production
git pull origin main

# Verify parity
git status  # Should be clean

# Test build
hugo server -D
```

## Production Checklist

Before marking this complete:

- [ ] PR reviewed and approved
- [ ] Vercel project created and configured
- [ ] Environment variables set in Vercel
- [ ] Preview deployment tested successfully
- [ ] Parent verified test email delivery
- [ ] Mac workspace synced with PR changes
- [ ] PR merged to main
- [ ] Production deployment verified
- [ ] Live form submissions tested
- [ ] Email delivery confirmed
- [ ] Mac workspace synced with production
- [ ] Documentation updated
- [ ] Team notified of changes

## Next Steps

1. **This PR** provides:
   - Complete implementation
   - Test suite
   - Configuration files
   - Documentation
   - Source artifacts for Mac sync

2. **Parent coordinates**:
   - Vercel account/project setup
   - Environment variable configuration
   - Preview testing and email verification
   - Production deployment approval
   - Mac workspace sync before/after

3. **Post-deployment**:
   - Monitor for 48 hours
   - Verify email delivery rates
   - Check for spam/abuse
   - Optimize if needed

---

## Questions or Issues?

Contact the implementation agent or refer to:
- `.env.example` for configuration
- `api/submit-form.test.js` for usage examples
- Vercel documentation for deployment help
- Resend documentation for email delivery issues

**Implementation Complete:** All code ready for deployment  
**Waiting For:** Parent Vercel setup and production approval  
**Blocked By:** Nothing - ready to deploy when approved
