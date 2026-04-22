# FBL Website Deployment Guide
## GitHub Pages + Custom Domain (fblconnect.com)

---

## ✅ **Current Status**

- ✅ Code pushed to GitHub: `wilsontechconsulting-png/fbl-hugo`
- ✅ GitHub Actions workflow configured (`.github/workflows/hugo.yml`)
- ✅ Site ready to deploy

---

## 🚀 **Step 1: Enable GitHub Pages**

1. Go to your GitHub repository:
   - https://github.com/wilsontechconsulting-png/fbl-hugo

2. Click **Settings** (top menu)

3. Scroll down to **Pages** (left sidebar)

4. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: `gh-pages`
   - Folder: `/ (root)`

5. Click **Save**

6. GitHub will show: **"Your site is ready to be published at..."**

---

## 🌐 **Step 2: Add Custom Domain**

While still in **Settings > Pages**:

1. Under **Custom domain**, enter:
   ```
   fblconnect.com
   ```

2. Click **Save**

3. ✅ Check the box: **"Enforce HTTPS"** (after DNS propagates)

GitHub will create a `CNAME` file in your repository.

---

## 📡 **Step 3: Configure DNS Records**

Go to your domain registrar (wherever you bought fblconnect.com) and add these DNS records:

### **Option A: Use www subdomain (Recommended)**

| Type  | Name | Value                                      | TTL  |
|-------|------|--------------------------------------------|------|
| CNAME | www  | wilsontechconsulting-png.github.io         | 3600 |
| A     | @    | 185.199.108.153                            | 3600 |
| A     | @    | 185.199.109.153                            | 3600 |
| A     | @    | 185.199.110.153                            | 3600 |
| A     | @    | 185.199.111.153                            | 3600 |

**Result:** Both `fblconnect.com` and `www.fblconnect.com` will work.

---

### **Option B: Apex domain only (fblconnect.com)**

| Type  | Name | Value                                      | TTL  |
|-------|------|--------------------------------------------|------|
| A     | @    | 185.199.108.153                            | 3600 |
| A     | @    | 185.199.109.153                            | 3600 |
| A     | @    | 185.199.110.153                            | 3600 |
| A     | @    | 185.199.111.153                            | 3600 |

**Result:** Only `fblconnect.com` (no www).

---

## 🔍 **What Each Record Means**

- **A Record**: Points your domain (`@` = root domain) to GitHub's servers
- **CNAME Record**: Alias for `www` subdomain pointing to your GitHub Pages URL
- **TTL**: Time to live (3600 = 1 hour, how long DNS caches the record)

---

## ⏱️ **Step 4: Wait for DNS Propagation**

DNS changes can take **15 minutes to 48 hours** to propagate worldwide.

**Check DNS propagation:**
- https://www.whatsmydns.net/
- Enter `fblconnect.com` and check A records
- Should show GitHub's IP addresses (185.199.108.153, etc.)

---

## ✅ **Step 5: Verify Deployment**

1. **Check GitHub Actions:**
   - Go to: https://github.com/wilsontechconsulting-png/fbl-hugo/actions
   - Look for green checkmarks (successful builds)
   - Latest commit should show: "Deploy Hugo site to Pages"

2. **Visit your site:**
   - Temporary URL: https://wilsontechconsulting-png.github.io/fbl-hugo/
   - Custom domain (after DNS): https://fblconnect.com

3. **Test the form:**
   - Go to /apply/
   - Submit a test application
   - Should redirect to /membership-payment/
   - Check email at member@fblconnect.com

---

## 🔐 **Step 6: Enable HTTPS (Free SSL)**

After DNS propagates (24-48 hours):

1. Go back to **Settings > Pages**
2. ✅ Check: **"Enforce HTTPS"**
3. GitHub will automatically provision a free SSL certificate

**Your site will be secure:** `https://fblconnect.com` 🔒

---

## 📋 **Quick Reference**

| Item | Value |
|------|-------|
| **GitHub Repo** | wilsontechconsulting-png/fbl-hugo |
| **Temporary URL** | https://wilsontechconsulting-png.github.io/fbl-hugo/ |
| **Custom Domain** | fblconnect.com |
| **GitHub IPs** | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| **Form Endpoint** | https://formspree.io/f/mzdykbar |
| **Notification Email** | member@fblconnect.com |

---

## 🛠️ **Updating the Site**

Anytime you want to update the site:

1. Make changes locally (I can do this for you)
2. Push to GitHub:
   ```bash
   git add -A
   git commit -m "Your update message"
   git push origin main
   ```
3. GitHub Actions will automatically rebuild and deploy (1-2 minutes)
4. Changes appear live at fblconnect.com

---

## 🚨 **Troubleshooting**

### **Site not loading after DNS setup:**
- Wait 24-48 hours for full DNS propagation
- Clear browser cache (Cmd + Shift + R)
- Try incognito/private browsing mode

### **Form not working:**
- Check Formspree dashboard: https://formspree.io/forms/mzdykbar
- Verify email notifications are enabled
- Test with a different email address

### **GitHub Actions failing:**
- Check: https://github.com/wilsontechconsulting-png/fbl-hugo/actions
- Look for error messages in failed builds
- Most common: Hugo version mismatch (we use 0.159.1)

---

## 📞 **Need Help?**

If you run into any issues:
1. Check GitHub Actions logs (link above)
2. Verify DNS records at your registrar
3. Ask me for help (I can troubleshoot)

---

**Last Updated:** April 22, 2026  
**Site Version:** Production-ready Hugo static site with Formspree integration
