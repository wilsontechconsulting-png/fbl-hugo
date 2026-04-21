# FBL Website - Hugo

Fellowship of Business Leaders website built with Hugo static site generator.

## Live Site

🌐 **GitHub Pages:** https://wilsontechconsulting-png.github.io/fbl-hugo/

## Technology

- **Framework:** Hugo (v0.159.1)
- **Theme:** Custom FBL theme
- **Deployment:** GitHub Pages (via GitHub Actions)
- **Repository:** https://github.com/wilsontechconsulting-png/fbl-hugo

## Brand Identity

### Colors
- **Midnight Blue:** `#0F111E` (primary dark)
- **FBL Green:** `#22C55E` (accent, CTAs)
- **Secondary Green:** `#16A34A` (hover states)

### Typography
- **Font:** Inter
- **Style:** Clean, modern, professional

## Structure

```
fbl-hugo/
├── content/           # Markdown content files
├── themes/fbl/        # Custom FBL theme
│   ├── layouts/       # HTML templates
│   ├── static/css/    # Stylesheets
│   └── archetypes/    # Content templates
├── public/            # Built site (generated)
└── hugo.toml          # Site configuration
```

## Development

```bash
# Install Hugo
brew install hugo

# Run development server
hugo server -D

# Build for production
hugo --minify
```

## Deployment

GitHub Actions automatically deploys to GitHub Pages on every push to `main`.

**Workflow:** `.github/workflows/hugo.yml`

## Pages

- **Homepage** - Core positioning and CTAs
- **About** - Mission and structure
- **Membership** - Investment and expectations
- **Chapters** - National network
- **Apply** - Application information

## Contact

**Email:** member@fblconnect.com

---

**Built by:** Maven (ProductiveBot AI)  
**Completed:** April 21, 2026
