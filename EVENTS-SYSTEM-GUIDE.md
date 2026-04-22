# FBL Events System - Complete Guide

## ✅ What Was Built

### 1. **Events Page** (`/events/`)
- **URL:** https://fblconnect.com/events/
- **Design:** FBL-branded with midnight blue and green accents
- **Layout:** Organized by month (May-December 2026)
- **Total Events:** 16 cohort meetings (2nd and 4th Tuesday each month)

### 2. **Event Cards**
Each event card displays:
- **Date box:** Large day number + month abbreviation (midnight blue background)
- **Event title:** "FBL Cohort" or "FBL Cohort 4th Tuesday"
- **Time:** 7:00-8:30 AM EDT/EST (December 22 is special: 6:00-7:30 AM)
- **Location:** "In person" with location icon
- **Three action buttons:**
  - **RSVP** (green button) → Links to Circle: https://fbl.circle.so
  - **View in Circle** (white button) → Links to Circle
  - **How to Attend** (white button) → Links to `/membership/`

### 3. **Blog Posts** (16 total)
- **Auto-scheduled:** Each blog post publishes **1 week before** its event
- **Category:** All tagged as "Events"
- **Format:** Consistent structure with event details, RSVP links, and membership info
- **Future posts:** Hugo will automatically publish them on their scheduled dates

### 4. **Navigation**
- **Events** added to main navigation (between Chapters and Insights)
- Available site-wide in header menu

---

## 📅 Complete Event Schedule

### May 2026
- **May 12** (2nd Tuesday) - Blog publishes: May 5
- **May 26** (4th Tuesday) - Blog publishes: May 19

### June 2026
- **June 9** (2nd Tuesday) - Blog publishes: June 2
- **June 23** (4th Tuesday) - Blog publishes: June 16

### July 2026
- **July 14** (2nd Tuesday) - Blog publishes: July 7
- **July 28** (4th Tuesday) - Blog publishes: July 21

### August 2026
- **August 11** (2nd Tuesday) - Blog publishes: August 4
- **August 25** (4th Tuesday) - Blog publishes: August 18

### September 2026
- **September 8** (2nd Tuesday) - Blog publishes: September 1
- **September 22** (4th Tuesday) - Blog publishes: September 15

### October 2026
- **October 13** (2nd Tuesday) - Blog publishes: October 6
- **October 27** (4th Tuesday) - Blog publishes: October 20

### November 2026 (EST timezone begins)
- **November 10** (2nd Tuesday) - Blog publishes: November 3
- **November 24** (4th Tuesday) - Blog publishes: November 17

### December 2026
- **December 8** (2nd Tuesday) - Blog publishes: December 1
- **December 22** (4th Tuesday) - **Special time: 6:00-7:30 AM EST** - Blog publishes: December 15

---

## 🎨 Design Features

### **Event Card Layout:**
```
┌────────────────────────────────────────────────────────┐
│  ┌──────┐                                              │
│  │  12  │  FBL Cohort                                  │
│  │ MAY  │  ⏰ Tuesday, 7:00-8:30 AM EDT                │
│  └──────┘  📍 In person                                │
│                                                         │
│         [RSVP] [View in Circle] [How to Attend]        │
└────────────────────────────────────────────────────────┘
```

### **Colors:**
- Date box: Midnight blue (#0F111E)
- Primary button (RSVP): FBL green (#22c55e)
- Secondary buttons: White with border
- Hover states: Green highlight

### **Mobile Responsive:**
- Date boxes stack vertically
- Buttons expand to full width
- Event cards optimize for touch targets

---

## 🔗 Key Links

**Circle Community:** https://fbl.circle.so

**Event Buttons:**
- **RSVP** → Opens Circle community
- **View in Circle** → Opens Circle community
- **How to Attend** → Opens `/membership/` page (explains membership process)

---

## 📝 Blog Post Format

Each blog post follows this structure:

1. **Hero section:**
   - Event date, time, location
   - Visual separation

2. **What to Expect:**
   - Description of FBL cohort meetings
   - Value proposition

3. **Who Should Attend:**
   - Current members: RSVP instructions
   - Prospective members: Application link

4. **Call to Action:**
   - Links to Circle (members)
   - Links to membership/apply pages (prospects)

---

## 🚀 How It Works

### **For Current Members:**
1. See upcoming event on Events page
2. Click "RSVP" button
3. Taken to Circle community to confirm attendance

### **For Prospective Members:**
1. See events listed on Events page
2. Click "How to Attend" button
3. Learn about membership process
4. Apply via `/apply/` page

### **Automated Blog Publishing:**
- Hugo's `buildFuture = false` setting means future-dated posts won't show until their publish date
- Each blog post is dated **7 days before** its event
- GitHub Actions rebuilds the site daily, so posts auto-publish on schedule

---

## 📂 File Structure

```
fbl-hugo/
├── content/
│   ├── events/_index.md (Events page content)
│   └── blog/
│       ├── 2026-05-05-fbl-cohort-may-12.md
│       ├── 2026-05-19-fbl-cohort-may-26.md
│       └── ... (14 more event blog posts)
├── themes/fbl/
│   ├── layouts/section/events.html (Events page template)
│   └── static/css/style.css (includes event styling)
├── hugo.toml (Events added to main menu)
└── FBL-EVENTS-2026.md (reference document)
```

---

## 🎯 Success Metrics to Track

1. **Events page views** (how many people are checking the schedule)
2. **RSVP click-through rate** (% who click "RSVP" button)
3. **Membership page traffic** (prospects clicking "How to Attend")
4. **Blog engagement** (views on event announcement posts)
5. **Circle community signups** (new members joining from event announcements)

---

## 🔧 Future Enhancements

### **Potential Additions:**
- **Google Calendar integration** (auto-add events to members' calendars)
- **Email reminders** (automated 24-hour reminders via Formspree)
- **Past events archive** (move completed events to a separate section)
- **Event photos** (add gallery from past cohort meetings)
- **Attendance tracking** (integrate with Circle to show RSVPs publicly)

### **2027 Events:**
- Use the same format to create 2027 event schedule
- Blog posts can be batch-created using the same pattern

---

## ✅ What's Live Now

**Live on https://fblconnect.com:**
- ✅ Events page with all 16 events
- ✅ Events link in main navigation
- ✅ Mobile-responsive event cards
- ✅ All buttons functional and linking correctly
- ✅ 16 blog posts scheduled (will auto-publish 1 week before each event)

**Next event blog post publish date:** May 5, 2026 (for May 12 event)

---

## 📞 Support

**Questions?**
- Email: member@fblconnect.com
- Phone: (513) 518-4955

---

**Built:** April 22, 2026  
**Total Events:** 16  
**Total Blog Posts:** 16  
**Total Development Time:** ~45 minutes
