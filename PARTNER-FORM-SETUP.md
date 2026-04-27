# Partner Application Form Setup

## Current Status
Partner application form has been added to `/partners/` page with full styling and validation.

## Next Step Required: Create Formspree Form

### Option 1: Create New Formspree Form (Recommended)

1. **Log in to Formspree:** https://formspree.io/login
2. **Create New Form:**
   - Form Name: "FBL Partner Applications"
   - Notification Email: partnerships@fblconnect.com

3. **Get Form ID:**
   - After creating, you'll get a hashid like `mzdykbar`
   - The form action URL will be: `https://formspree.io/f/YOUR_HASHID`

4. **Update the Form:**
   - Edit `/content/partners/_index.md`
   - Find: `action="https://formspree.io/f/YOUR_FORM_ID"`
   - Replace `YOUR_FORM_ID` with your actual hashid
   - Rebuild and deploy

5. **Configure Form Settings:**
   - Notification email: partnerships@fblconnect.com
   - Auto-reply: Optional (can send confirmation to applicants)
   - Redirect: /partners/ (or create a success page)

### Option 2: Use Existing Form (Quick Fix)

If you want to use the existing form (mzdykbar) temporarily:

1. Edit `/content/partners/_index.md`
2. Change:
   ```
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   To:
   ```
   action="https://formspree.io/f/mzdykbar"
   ```
3. Rebuild and deploy

**Note:** This will send partner applications to the same inbox as membership applications, but they'll be labeled differently by field names.

### Option 3: Use Simple mailto (Fallback)

The form currently has `YOUR_FORM_ID` as a placeholder. If Formspree is not set up, you can temporarily use a mailto action:

1. Edit `/content/partners/_index.md`
2. Change form action to: `mailto:partnerships@fblconnect.com`
3. Note: This is less elegant but works

## Recommended Approach

**Best:** Option 1 - Create dedicated Formspree form for partner applications
- Clean separation from membership applications
- Better tracking and reporting
- Professional submission handling

## Form Fields Currently Included

**Company Information:**
- Company Name *
- Industry / Category *
- Website *
- Primary Contact Name *
- Email Address *
- Phone Number *

**Partnership Details:**
- Desired Tier * (dropdown: Founding / Growth / Strategic)
- Why do you want to partner with FBL? *
- What value will you provide FBL members? *
- Member Benefit You'll Offer *
- Expected ROI Timeline

**Commitment:**
- All communications must be FBL-approved (checkbox)
- Commit to providing real value (checkbox)
- Agree to communication limits (checkbox)
- Honor partner agreement terms (checkbox)

## After Form Setup

Once Formspree form is created and form ID is updated:

1. Test the form submission
2. Verify email notifications work
3. Check auto-reply if configured
4. Test on mobile devices
5. Monitor first submissions

---

**Current Status:** Form is styled and ready, just needs Formspree ID to be functional.
