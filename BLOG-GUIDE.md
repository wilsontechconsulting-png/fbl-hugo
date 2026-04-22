# FBL Blog Guide
## How to Write and Publish Blog Posts

---

## ✅ **Blog System is Live!**

Your FBL website now has a complete blog system at:
- **Blog Homepage:** http://localhost:1313/blog/ (or https://fblconnect.com/blog/ when live)
- **Navigation:** "Insights" link in the main menu

---

## 📝 **How to Write a New Blog Post**

### **Step 1: Create a New Markdown File**

Create a new file in `/content/blog/` with this format:
```
/content/blog/your-post-slug.md
```

**Example:**
```
/content/blog/leadership-under-pressure.md
```

---

### **Step 2: Add Front Matter**

Every blog post needs "front matter" at the top. Copy this template:

```markdown
---
title: "Your Blog Post Title Here"
date: 2026-04-22
author: "Your Name"
summary: "A one-sentence summary that appears on the blog listing page."
---

Your blog post content starts here...
```

---

### **Step 3: Write Your Post**

Write your content using **Markdown** syntax:

```markdown
## Heading 2

Regular paragraph text goes here.

### Heading 3

- Bullet point one
- Bullet point two
- Bullet point three

**Bold text** and *italic text*

[Link text](/apply/)
```

---

## 📋 **Blog Post Template**

Copy this template for new posts:

```markdown
---
title: "Your Post Title"
date: 2026-04-22
author: "FBL Team"
summary: "A compelling one-sentence description of what this post is about."
---

Opening paragraph that hooks the reader...

## First Major Section

Content here...

## Second Major Section

More content...

## Conclusion

Wrap up with a clear takeaway or call to action.

[Apply for Membership](/apply/)
```

---

## 🎨 **Blog Post Ideas for FBL**

### **Leadership Topics:**
- "Why Accountability Beats Affirmation in Leadership"
- "The Cost of Convenience: Leading with Conviction"
- "How to Build a High-Trust Team"
- "Decision-Making Under Pressure"

### **Faith & Business:**
- "Integrating Faith into Business Without Compartmentalizing"
- "Stewardship vs. Ownership: A Leadership Mindset Shift"
- "When Your Values Cost You Business (And Why That's Good)"

### **Member Stories:**
- "Member Spotlight: [Name]'s Journey from Startup to Scale"
- "How [Company] Navigated Crisis with Conviction"
- "Lessons from 20 Years in [Industry]"

### **FBL Updates:**
- "Announcing the [City] Chapter"
- "What We're Learning After Year One"
- "Behind the Scenes: How FBL Meetings Work"

---

## 🚀 **Publishing a Blog Post**

### **Option 1: I Write It For You**
Just tell me:
1. The topic you want to write about
2. Key points to cover
3. Tone (professional, conversational, story-driven, etc.)

I'll write the full blog post and add it to the site!

---

### **Option 2: You Write, I Publish**
1. Write your post in a Google Doc or text editor
2. Send it to me
3. I'll format it as markdown and add it to the blog

---

### **Option 3: You Do It All**
1. Create a new file: `/content/blog/your-slug.md`
2. Add front matter (title, date, author, summary)
3. Write your content in Markdown
4. Save the file
5. Push to GitHub:
   ```bash
   cd /Users/productivebot/productivebot/projects/fbl-hugo
   git add content/blog/your-slug.md
   git commit -m "Add new blog post: [title]"
   git push origin main
   ```
6. GitHub Actions will auto-deploy in 1-2 minutes

---

## 📁 **File Structure**

```
fbl-hugo/
├── content/
│   └── blog/
│       ├── _index.md (blog homepage)
│       ├── welcome-to-fbl.md (sample post)
│       └── your-new-post.md (add new posts here)
```

---

## 🎯 **Styling & Design**

Blog posts are automatically styled to match the FBL brand:
- ✅ FBL green accents
- ✅ Clean, readable typography
- ✅ Dark hero section for post titles
- ✅ Mobile responsive
- ✅ Professional layout

---

## 📊 **Blog Homepage Features**

The blog listing page (`/blog/`) shows:
- Post title (linked to full post)
- Publish date
- Author name
- Summary
- "Read More →" link

---

## 🔗 **Adding Links in Posts**

**Internal links (to other pages on your site):**
```markdown
[Apply for Membership](/apply/)
[Learn More About FBL](/about/)
```

**External links:**
```markdown
[Visit Example](https://example.com)
```

**Email links:**
```markdown
[Contact Us](mailto:member@fblconnect.com)
```

---

## ✅ **What's Already Done**

- ✅ Blog system built and integrated
- ✅ "Insights" link in main navigation
- ✅ Sample post created ("Welcome to FBL")
- ✅ Styled to match FBL brand
- ✅ Mobile responsive
- ✅ SEO-friendly URLs

---

## 🎉 **Ready to Start?**

**Want me to write your first blog post?**

Just tell me:
- Topic
- Key points
- Tone/style

And I'll have it written, formatted, and published on the site in minutes!

---

**Last Updated:** April 22, 2026  
**Blog URL:** /blog/ (Insights)
