# Adding Images to FBL Blog Posts

## 📸 **How to Add Featured Images**

Every blog post can have a featured image that displays:
- On the homepage "Latest Insights" section
- At the top of the individual blog post page
- In social media previews when shared

---

## ✅ **Step 1: Add Image to Your Blog Post**

In your blog post's front matter, add the `image` field:

```markdown
---
title: "Your Blog Post Title"
date: 2026-04-22
author: "FBL Team"
summary: "Your post summary here..."
image: "/images/blog/your-image.jpg"
---

Your content here...
```

---

## 📁 **Step 2: Add the Image File**

Place your image in: `/static/images/blog/`

**Example:**
```
/static/images/blog/leadership-isolation.jpg
/static/images/blog/team-building.jpg
/static/images/blog/faith-and-business.jpg
```

---

## 🎨 **Image Guidelines**

### **Recommended Specs:**
- **Aspect Ratio:** 16:9 (e.g., 1200x675px)
- **File Size:** Under 500KB
- **Format:** JPG or PNG
- **Resolution:** 1200px wide minimum

### **Image Style for FBL:**
- Professional, high-quality
- Business/leadership themed
- Clean, minimal compositions
- Avoid cheesy stock photos
- Dark/moody tones work well with the dark blog section

---

## 🔍 **Where to Find Images**

### **Free Stock Photos:**
- **Unsplash:** https://unsplash.com (high-quality, free)
- **Pexels:** https://pexels.com (free, no attribution required)
- **Pixabay:** https://pixabay.com (free images)

### **Search Terms for FBL:**
- "executive leadership"
- "business meeting"
- "office desk professional"
- "mountain leadership"
- "corporate team"
- "professional handshake"
- "business strategy"

---

## 📋 **Blog Post Template with Image**

```markdown
---
title: "Why Accountability Beats Affirmation in Leadership"
date: 2026-04-23
author: "John Heater"
summary: "Most leaders surround themselves with people who affirm their decisions. The best leaders surround themselves with people who challenge them."
image: "/images/blog/accountability-leadership.jpg"
---

Your blog post content starts here...

## First Section

Content...
```

---

## 🎯 **How Images Display**

### **On Homepage:**
- Image appears at top of card (16:9 ratio)
- Slight zoom effect on hover
- Rounded corners match card design
- Dark overlay for contrast

### **On Blog Post Page:**
- Could appear as hero image (can add this feature)
- Full-width banner above title
- Professional presentation

### **Without Image:**
- Post still displays normally
- Just no image section
- Cards look clean either way

---

## ✨ **Example: Adding Image to Current Post**

For "The Hidden Risk in Leadership: Isolation at the Top":

1. **Find or create an image:**
   - Search Unsplash for "executive alone office"
   - Download high-quality image
   - Resize to 1200x675px if needed

2. **Save image:**
   - `/static/images/blog/leadership-isolation.jpg`

3. **Already added to post:**
   ```markdown
   image: "/images/blog/leadership-isolation.jpg"
   ```

4. **Upload to server:**
   - Git add, commit, push
   - Image appears automatically

---

## 🚀 **Quick Add Process**

**For me to add images:**
1. Tell me the blog post
2. Give me the image URL (Unsplash link, etc.)
3. I'll download, optimize, and add it

**For you to add images:**
1. Download image from Unsplash/Pexels
2. Save to `/static/images/blog/filename.jpg`
3. Add `image: "/images/blog/filename.jpg"` to front matter
4. Push to GitHub

---

## 🎨 **Image Optimization Tips**

### **Before Uploading:**
- Resize to 1200px wide
- Compress (use TinyPNG.com or similar)
- Keep under 500KB for fast loading
- Use descriptive filenames (no spaces)

### **Good Filenames:**
- `leadership-isolation.jpg` ✅
- `team-accountability.jpg` ✅
- `faith-driven-business.jpg` ✅

### **Bad Filenames:**
- `IMG_1234.jpg` ❌
- `Screen Shot 2026-04-22.png` ❌
- `my photo with spaces.jpg` ❌

---

## 🔥 **Pro Tips**

1. **Consistent Style:** Use similar image styles for brand consistency
2. **Text Overlay:** Images work with or without text overlay
3. **Dark Images:** Dark/moody images work best with white text
4. **People:** Images with people feel more engaging
5. **Composition:** Leave space at top for text overlay if adding later

---

## 📊 **Current Status**

✅ Image support added to blog system  
✅ Homepage displays featured images  
✅ Hover effects on image cards  
✅ Responsive design (mobile-friendly)  
⏳ Need to add actual images to posts  

---

**Want me to add images to your blog posts? Just send me:**
- Post title
- Unsplash/Pexels link to image you like

And I'll handle the rest!

---

**Last Updated:** April 22, 2026
