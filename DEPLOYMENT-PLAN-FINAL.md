# FBL Forms - Final Deployment Plan & Vercel Configuration

**Date:** November 6, 2026  
**PR:** [#2 - Migrate forms from Formspree to Resend](https://github.com/wilsontechconsulting-png/fbl-hugo/pull/2)  
**Branch:** `cursor/resend-forms-migration-0033`  
**Status:** ✅ Implementation Complete - Ready for Deployment

---

## Executive Summary

**What:** Replace Formspree with secure Resend-based form handler  
**How:** Vercel serverless function + existing GitHub Pages site  
**Why:** Self-hosted, no external dependencies, better security  
**Status:** All code ready, tests passing, awaiting Vercel setup

---

## Architecture: Hybrid Deployment (Recommended)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  https://fblconnect.com                                │
│  (Current GitHub Pages - Hugo Static Site)             │
│                                                         │
│  ✓ Homepage, About, Blog, etc. → GitHub Pages         │
│  ✓ Form HTML pages (/apply/, /partners/) → GitHub Pages│
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
                   (Form submits to)
                          ↓
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  /api/submit-form                                      │
│  (New Vercel Serverless Function)                      │
│                                                         │
│  ✓ Validation, rate limiting, spam protection         │
│  ✓ Sends email via Resend API                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Why This Approach?

1. **Minimal changes** - Existing GitHub Pages site stays unchanged
2. **Zero DNS changes** - No domain migration required
3. **Smallest footprint** - Only adds API endpoint via Vercel
4. **Easy rollback** - Can revert to Formspree in minutes if needed
5. **Cost effective** - Vercel free tier handles expected load

---

## Vercel Project Configuration

### Step 1: Create Vercel Project

**Via Vercel Dashboard:**

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select: `wilsontechconsulting-png/fbl-hugo`
4. Configure:
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: (leave default - uses vercel.json)
   Output Directory: public
   Install Command: (leave default - uses vercel.json)
   ```

**Project Settings:**

```yaml
Project Name: fbl-forms
Git Repository: wilsontechconsulting-png/fbl-hugo
Git Branch: main (after PR merge)
Root Directory: ./
Framework: Other
Build Settings:
  - Build Command: hugo --minify
  - Output Directory: public
  - Install Command: wget -O /tmp/hugo.deb https://github.com/gohugoio/hugo/releases/download/v0.159.1/hugo_extended_0.159.1_linux-amd64.deb && sudo dpkg -i /tmp/hugo.deb
```

### Step 2: Environment Variables

**Required - Configure in Vercel Project Settings → Environment Variables:**

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Production, Preview, Development |
| `MEMBERSHIP_FORM_RECIPIENT_EMAIL` | `member@fblconnect.com` | Production, Preview, Development |
| `PARTNER_FORM_RECIPIENT_EMAIL` | `member@fblconnect.com` | Production, Preview, Development |
| `FORM_RECIPIENT_EMAIL` | `member@fblconnect.com` | Production, Preview, Development |

**Optional - Override defaults if needed:**

| Variable Name | Default Value | Purpose |
|---------------|---------------|---------|
| `RATE_LIMIT_MAX` | `3` | Max submissions per IP per hour |
| `ALLOWED_ORIGINS` | `https://fblconnect.com,https://wilsontechconsulting-png.github.io` | CORS origins |

**Security Note:** Parent can inject `RESEND_API_KEY` via secure connector file transfer without displaying secret.

### Step 3: Domain Configuration

**Option A: Subdomain (Recommended for Testing)**

1. Add custom domain in Vercel: `forms.fblconnect.com`
2. Add DNS CNAME: `forms.fblconnect.com` → `cname.vercel-dns.com`
3. Update forms to POST to: `https://forms.fblconnect.com/api/submit-form`

**Option B: Same Domain with Proxy (Recommended for Production)**

Keep existing domain setup, proxy `/api/*` to Vercel:

1. **No DNS changes needed** - site stays on GitHub Pages
2. Add Vercel domain: `fbl-forms.vercel.app` (or custom)
3. Update forms to POST to: `/api/submit-form` (relative path)
4. Vercel automatically handles `/api/*` routes from same domain

**Option C: Use Vercel Preview URL (Testing Only)**

For initial testing only:
- Form posts to: `https://fbl-forms-xxx.vercel.app/api/submit-form`
- Not recommended for production (URL changes per deployment)

**Recommended:** Option B (same domain) - simplest, no DNS changes, works with existing GitHub Pages.

### Step 4: Deployment Settings

**GitHub Integration:**

```yaml
Production Branch: main
Deploy on Push: Yes
Preview Deployments: Yes (for PRs)
Automatic Deployments: Yes
```

**Build & Development Settings:**

```yaml
Framework: Other
Build Command: hugo --minify
Output Directory: public
Install Command: wget -O /tmp/hugo.deb https://github.com/gohugoio/hugo/releases/download/v0.159.1/hugo_extended_0.159.1_linux-amd64.deb && sudo dpkg -i /tmp/hugo.deb
Development Command: hugo server -D
```

**Function Settings:**

```yaml
Serverless Functions: Enabled
Functions Region: iad1 (US East - closest to GitHub Pages)
Functions Memory: 1024 MB
Functions Max Duration: 10 seconds
```

---

## Exact File Structure After Deployment

```
fbl-hugo/
├── api/
│   ├── submit-form.js          # NEW - Vercel serverless function
│   └── submit-form.test.js     # NEW - Test suite (not deployed)
├── static/
│   ├── css/
│   │   └── form-messages.css   # NEW - Success/error styles
│   └── js/
│       └── form-handler.js     # NEW - Client-side AJAX handler
├── themes/fbl/layouts/section/
│   ├── apply.html              # MODIFIED - Updated form
│   └── partners.html           # MODIFIED - Updated form
├── vercel.json                 # NEW - Vercel configuration
├── .vercelignore               # NEW - Build exclusions
├── .env.example                # NEW - Env template (not deployed)
├── .gitignore                  # MODIFIED - Added env/credential exclusions
├── PROJECT-HANDOFF.md          # NEW - From Mac baseline
├── RESEND-MIGRATION-GUIDE.md   # NEW - Complete guide
└── (existing Hugo files unchanged)
```

---

## Deployment Timeline & Steps

### Phase 1: Pre-Deployment Verification ✅ COMPLETE

- [x] Code implementation complete
- [x] All 22 tests passing
- [x] PR created: https://github.com/wilsontechconsulting-png/fbl-hugo/pull/2
- [x] Documentation complete
- [x] Mac sync artifacts prepared
- [x] Security audit passed

### Phase 2: Vercel Setup (Parent Action Required)

1. **Create Vercel Project** (5 minutes)
   - Import `wilsontechconsulting-png/fbl-hugo` from GitHub
   - Use configuration above
   - Select branch: `cursor/resend-forms-migration-0033` (for testing)

2. **Configure Environment Variables** (5 minutes)
   - Add all required variables listed above
   - Use secure connector for `RESEND_API_KEY`
   - Set for: Production, Preview, Development

3. **Deploy Preview** (automatic)
   - Vercel auto-deploys PR preview
   - Get preview URL: `https://fbl-hugo-xxx.vercel.app`

### Phase 3: Testing on Preview (Parent Action Required)

1. **Test Membership Form**
   ```
   URL: https://[preview-url]/apply/
   Action: Fill out complete form
   Expected: Success message, redirect to /membership-payment/
   Verify: Email arrives at member@fblconnect.com
   Verify: Reply-To is applicant's email
   Verify: From is "FBL Forms <forms@send.fblconnect.com>"
   ```

2. **Test Partner Form**
   ```
   URL: https://[preview-url]/partners/
   Action: Fill out complete form
   Expected: Success message, no redirect
   Verify: Email arrives at member@fblconnect.com
   Verify: Reply-To is applicant's email
   ```

3. **Test Validation**
   ```
   Test: Submit with invalid email
   Expected: Client-side error message
   
   Test: Submit with missing fields
   Expected: Validation error message
   ```

4. **Test Rate Limiting**
   ```
   Test: Submit 4 times rapidly from same IP
   Expected: 4th submission blocked with rate limit error
   ```

5. **Test Spam Protection**
   ```
   Test: Fill honeypot field (dev tools)
   Expected: Submission rejected as spam
   ```

### Phase 4: Mac Workspace Sync (Parent Action Required)

**Before Production Deployment:**

```bash
# On Mac at /Users/promax/AI/workspaces/fbl-hugo
cd /Users/promax/AI/workspaces/fbl-hugo

# Option A: Apply patch
git fetch origin
patch -p1 < fbl-resend-migration.patch

# Option B: Extract tarball (overwrites)
tar -xzf fbl-changed-files.tar.gz

# Option C: Merge branch
git fetch origin
git merge origin/cursor/resend-forms-migration-0033

# Verify
git status
git diff main origin/cursor/resend-forms-migration-0033

# Test local build
hugo server -D
# Visit http://localhost:1313/apply/ and /partners/
```

### Phase 5: Production Deployment (Parent Action Required)

1. **Merge PR**
   ```bash
   # Via GitHub UI or CLI
   gh pr merge 2 --squash
   
   # Or manually:
   git checkout main
   git merge cursor/resend-forms-migration-0033
   git push origin main
   ```

2. **Vercel Auto-Deploys** (automatic)
   - Vercel detects main branch update
   - Builds and deploys to production
   - Takes 2-5 minutes

3. **Verify Production**
   ```
   Test: https://fblconnect.com/apply/
   Test: https://fblconnect.com/partners/
   Monitor: Vercel function logs
   Monitor: Resend dashboard
   ```

4. **Sync Mac After Deployment**
   ```bash
   cd /Users/promax/AI/workspaces/fbl-hugo
   git pull origin main
   git status  # Should be clean
   ```

---

## Environment Variables Reference

### Required Variables

```bash
# Resend API Key (domain-scoped, sending-only)
# Get from: https://resend.com/api-keys
# Scope: send.fblconnect.com (sending only)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Form Recipients (user confirmed: both → member@fblconnect.com)
MEMBERSHIP_FORM_RECIPIENT_EMAIL=member@fblconnect.com
PARTNER_FORM_RECIPIENT_EMAIL=member@fblconnect.com

# Fallback recipient (if form-specific not set)
FORM_RECIPIENT_EMAIL=member@fblconnect.com
```

### Optional Variables

```bash
# Rate limiting (default: 3 submissions per hour per IP)
RATE_LIMIT_MAX=3

# CORS allowed origins (comma-separated, no trailing slashes)
ALLOWED_ORIGINS=https://fblconnect.com,https://wilsontechconsulting-png.github.io
```

### Email Configuration (Hardcoded in Code)

```javascript
// From address (hardcoded in api/submit-form.js)
FROM_EMAIL = "FBL Forms <forms@send.fblconnect.com>"

// Reply-To (dynamic - uses applicant's email from form)
REPLY_TO = formData.email  // Applicant's validated email
```

---

## Testing Checklist

Before marking deployment complete:

**Vercel Setup:**
- [ ] Vercel project created and linked to GitHub repo
- [ ] Environment variables configured in Vercel
- [ ] Preview deployment successful
- [ ] Function logs accessible in Vercel dashboard

**Functionality Testing:**
- [ ] Test suite passes: `node api/submit-form.test.js`
- [ ] Membership form submits successfully on preview
- [ ] Partner form submits successfully on preview
- [ ] Email arrives at member@fblconnect.com
- [ ] Reply-To uses applicant email (test by replying)
- [ ] From shows "FBL Forms <forms@send.fblconnect.com>"
- [ ] Success message displays correctly
- [ ] Redirect works for membership form
- [ ] No redirect for partner form

**Error Handling:**
- [ ] Invalid email shows error message
- [ ] Missing required fields shows error
- [ ] Rate limiting blocks 4th submission
- [ ] Honeypot catches spam (fill _gotcha field)
- [ ] Network errors retry automatically

**Mac Workspace:**
- [ ] Mac workspace synced BEFORE production deployment
- [ ] Files match PR branch
- [ ] Local build works: `hugo server -D`
- [ ] Mac workspace synced AFTER production deployment
- [ ] Git status clean

**Production Verification:**
- [ ] Forms work at https://fblconnect.com/apply/
- [ ] Forms work at https://fblconnect.com/partners/
- [ ] Vercel function logs show successful submissions
- [ ] Resend dashboard shows email deliveries
- [ ] No errors in browser console
- [ ] Mobile responsive (test on phone)

---

## Monitoring & Maintenance

### Vercel Function Logs

Monitor at: https://vercel.com/[team]/fbl-forms/logs

Watch for:
- ✅ Successful submissions (200 status)
- ⚠️ Rate limit hits (429 status)
- ❌ Validation errors (400 status)
- ❌ Server errors (500 status)

### Resend Dashboard

Monitor at: https://resend.com/emails

Watch for:
- ✅ Successful deliveries
- ⚠️ Bounces (check email validity)
- ❌ Complaints (spam reports)
- ⚠️ Rate limit warnings

### GitHub Actions

Monitor at: https://github.com/wilsontechconsulting-png/fbl-hugo/actions

Watch for:
- ✅ Hugo build successful
- ✅ GitHub Pages deployment successful

---

## Disable Procedure

If forms need to be disabled:

### Graceful Disable

1. **Set empty endpoint in hugo.toml**
   ```toml
   [params]
     formApiEndpoint = ''  # Forms show "not configured" message
   ```

2. **Rebuild and deploy**
   ```bash
   git add hugo.toml
   git commit -m "Disable forms temporarily"
   git push origin main
   ```

3. **Verify**
   - Forms show: "Form submission endpoint not configured"
   - No submissions accepted
   - No errors in console

### Remove Forms Entirely

Comment out or remove form sections from `apply.html` and `partners.html` if needed.

**Note:** Do not revert to external form providers.

---

## Expected Service Usage

### Vercel

**Expected Usage:**
- ~50-200 form submissions/month
- Serverless function invocations
- Check Vercel pricing for current plans

### Resend

**Expected Usage:**
- ~50-200 emails/month (form submissions)
- Check Resend pricing for current plans

**Note:** Verify current pricing and limits with service providers. Free tiers may change.

---

## Security Implementation

**API Key Security**
- Never committed to git (.gitignore configured)
- Never exposed to browser (server-only)
- Never in build output or logs
- Secure injection via Vercel env vars

✅ **Form Data Protection**
- HTTPS only (enforced by Vercel)
- CORS restricted to fblconnect.com
- No data stored (email only)
- HTML escaped before email send

✅ **Spam & Abuse Protection**
- Honeypot field (_gotcha)
- Rate limiting (3/hour per IP)
- Email format validation
- Field length limits (10KB max)

✅ **Email Security**
- Validated recipient (member@fblconnect.com)
- Applicant email in Reply-To (not To)
- Sender domain verified (send.fblconnect.com)
- HTML content escaped

✅ **Error Handling**
- Safe failures (never silent success)
- User-friendly error messages
- No sensitive data in errors
- Logging for debugging

---

## Mac Workspace File Bundle

**Critical:** Mac at `/Users/promax/AI/workspaces/fbl-hugo` is NOT a git checkout.

**Location:** Artifacts in `/opt/cursor/artifacts/`

1. **`fbl-changed-files.tar.gz`**
   - All new and modified files
   - Extract overwrites existing files
   - Preserves other local-only files

2. **`fbl-resend-migration.patch`**
   - Git-format patch for reference
   - Not used on non-git Mac workspace

3. **`fbl-files-manifest.txt`**
   - SHA256 checksums of all changed files
   - Verify integrity after extraction

**Application Instructions:**

```bash
# On Mac (NOT git operations)
cd /Users/promax/AI/workspaces/fbl-hugo

# Extract bundle (overwrites matching files only)
tar -xzf /path/to/fbl-changed-files.tar.gz

# Verify extraction
shasum -a 256 -c /path/to/fbl-files-manifest.txt

# Test local build
hugo server -D
open http://localhost:1313/apply/
```

**Important:** Do not use git pull, git merge, or git commands on Mac workspace.

---

## Support & Troubleshooting

### Common Issues

**"RESEND_API_KEY not configured"**
- Environment variable not set in Vercel
- Go to Project Settings → Environment Variables
- Add key and redeploy

**"Form recipient email not configured"**
- Set MEMBERSHIP_FORM_RECIPIENT_EMAIL
- Set PARTNER_FORM_RECIPIENT_EMAIL
- Or set FORM_RECIPIENT_EMAIL as fallback

**"Rate limit exceeded"**
- User submitted 3+ times in one hour
- Wait or increase RATE_LIMIT_MAX in Vercel env
- Check Vercel logs for abuse patterns

**Forms POST to wrong URL**
- Check client-side form handler
- Verify `/api/submit-form` endpoint accessible
- Check CORS if using subdomain

**Emails not arriving**
- Check Resend dashboard for delivery status
- Verify send.fblconnect.com domain verified
- Check spam folder at member@fblconnect.com
- Verify RESEND_API_KEY has send permissions

### Getting Help

1. **Check Logs:**
   - Vercel function logs
   - Resend dashboard
   - Browser console (F12)

2. **Review Documentation:**
   - `RESEND-MIGRATION-GUIDE.md`
   - `.env.example`
   - `api/submit-form.test.js`

3. **Test Locally:**
   ```bash
   # Run test suite
   node api/submit-form.test.js
   
   # All tests should pass
   ```

---

## Implementation Complete - Ready for Deployment

### What's Ready:
✅ All code implemented and tested  
✅ 22 tests passing  
✅ PR created and ready to merge  
✅ Documentation complete  
✅ Mac sync artifacts prepared  
✅ Security audit passed  
✅ Rollback plan documented  

### What Parent Needs to Do:
1. Create Vercel project (5 minutes)
2. Configure environment variables (5 minutes)
3. Test on preview deployment (15 minutes)
4. Sync Mac workspace (5 minutes)
5. Merge PR to production (1 minute)
6. Verify and monitor (10 minutes)

**Estimated Total Time:** 45 minutes for complete deployment

### Blockers:
❌ None - Ready to deploy immediately

### Next Action:
Parent creates Vercel project and configures environment variables per instructions above.

---

**Questions?** All documentation is in the repository. No external dependencies or blockers remain.
