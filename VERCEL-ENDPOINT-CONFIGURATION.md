# Vercel API Endpoint Configuration

**CRITICAL:** Forms will not work until the Vercel API endpoint is configured in `hugo.toml`.

## Problem

GitHub Pages (https://fblconnect.com) cannot POST to same-origin `/api/submit-form` because the API runs on Vercel, not GitHub Pages. Cross-origin API endpoint must be explicitly configured.

## Solution

After Vercel project is deployed, update `hugo.toml` with the actual Vercel production URL.

## Configuration Steps

### 1. Deploy Vercel Project

Parent creates Vercel project (likely named `fbl-forms`) and gets production URL.

**Expected URL patterns:**
- `https://fbl-forms.vercel.app` (Vercel default)
- `https://forms.fblconnect.com` (if custom subdomain added)
- `https://[project-name]-[team].vercel.app` (actual assigned URL)

### 2. Update hugo.toml

Edit `hugo.toml` line 13-14:

```toml
[params]
  # ... other params ...
  
  # BEFORE (placeholder - forms will fail):
  formApiEndpoint = ''
  
  # AFTER (real Vercel URL):
  formApiEndpoint = 'https://fbl-forms.vercel.app/api/submit-form'
```

**Important:** 
- Use HTTPS (required)
- Include full hostname
- Include `/api/submit-form` path
- No trailing slash

### 3. Rebuild and Deploy

```bash
hugo --minify
# GitHub Actions will auto-deploy on push to main
```

### 4. Verify Configuration

**Test in browser console:**
```javascript
// On https://fblconnect.com/apply/ or /partners/
const form = document.querySelector('.application-form') || document.querySelector('.partner-form');
console.log('API Endpoint:', form.dataset.apiEndpoint);
// Should show: https://fbl-forms.vercel.app/api/submit-form
```

**If empty or undefined:** Form submissions will fail with "endpoint not configured" error.

## Safe Failure Behavior

If `formApiEndpoint` is not configured (empty string), forms will show user-friendly error:

```
"Form submission endpoint not configured. Please contact site administrator."
```

**No silent failures. No data loss. User is informed.**

## Common Vercel URLs

| Scenario | Example URL |
|----------|-------------|
| Default Vercel domain | `https://fbl-forms.vercel.app/api/submit-form` |
| Custom subdomain | `https://forms.fblconnect.com/api/submit-form` |
| Team deployment | `https://fbl-forms-team.vercel.app/api/submit-form` |

**Do not guess.** Use actual URL from Vercel dashboard after deployment.

## Verification Checklist

After configuration:

- [ ] `hugo.toml` has real Vercel URL (not empty string)
- [ ] URL includes `/api/submit-form` path
- [ ] Site rebuilt and deployed to GitHub Pages
- [ ] Browser console shows configured endpoint
- [ ] Test form submission works
- [ ] Email arrives at member@fblconnect.com

## Rollback Procedure

If forms need to be disabled (e.g., before Vercel is ready):

**Option 1: Remove endpoint (graceful failure)**
```toml
formApiEndpoint = ''  # Forms show "not configured" message
```

**Option 2: Disable forms entirely**
Comment out or remove form sections from `apply.html` and `partners.html`.

**DO NOT revert to Formspree - user forbids this.**

## Need Help?

After Vercel deployment, if you have the production URL but forms still fail:

1. Check browser console for errors
2. Verify CORS headers in Vercel function
3. Check Vercel function logs
4. Verify environment variables set in Vercel

---

**Next Action:** Parent provides actual Vercel production URL after deployment, then update `hugo.toml` and rebuild.
