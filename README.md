🌌 **Cosmos Gratitude App**
"Build habits, find clarity, and transform — one day at a time."

A fully offline, local-first web application for daily gratitude practice, manifestation, journaling, community growth, and personal transformation. No login. No server. No subscriptions. Everything lives in your browser.

**✨ About**
Cosmos Gratitude is a static web app built with pure HTML, CSS, and JavaScript — inspired by the Cosmos by EpicRecap platform. It brings together the most powerful tools for personal transformation into a beautiful, cosmic-themed daily practice hub that runs entirely offline on your local machine.

Built and designed with the assistance of Claude Sonnet 4.6 (Anthropic) via the Antigravity agentic coding environment by Google DeepMind.

**🚀 Getting Started**
Download or clone the repository
Open index.html in any modern browser (Edge, Chrome, Vivaldi, Firefox)
No installation, no server, no internet required (after first load for fonts)
All your data is saved automatically in your browser's localStorage / IndexedDB
Tip: Bookmark index.html or pin it to your browser's home page for easy daily access.

**🗺️ App Structure**

Cosmos Gratitude App/
│
├── index.html                     # Landing page & home
├── daily.html                     # Daily practice hub
├── journal.html                   # Gratitude journal
├── scripting.html                 # Gratitude scripting editor
├── vision-board.html              # Vision board (image gallery)
├── music.html                     # Ambient music library (30 tracks)
├── calendar.html                  # Activity calendar
├── challenges.html                # 30-Day challenge tracker
├── report.html                    # Weekly/Monthly reports
├── creator.html                   # Affirmation & Quote creator
├── categories.html                # Explore all life areas
├── community.html                 # Community hub
├── grow.html                      # Grow hub (Practices & Courses)
│
├── community/
│   ├── spaces/
│   │   ├── introduce.html         # Introduce Yourself
│   │   ├── intentions.html        # Intention Board
│   │   ├── announcements.html     # Announcements & Updates
│   │   ├── gratitude-wall.html    # Gratitude Wall
│   │   ├── the-circle.html        # Open Discussion
│   │   └── saved-posts.html       # Saved / Bookmarked Posts
│   ├── events.html                # Community Events & Challenges
│   └── tribe.html                 # Tribe Leaderboard
│
├── grow/
│   └── courses/
│       ├── life-transformation.html
│       ├── gratitude-mastery.html
│       └── vision-board-creation.html
│
├── pages/
│   ├── health.html
│   ├── career.html
│   ├── wealth.html
│   ├── inner-peace.html
│   ├── financial-freedom.html
│   ├── relationship.html
│   ├── self-love.html
│   └── stoic.html
│
├── css/
│   └── style.css                  # Full design system (~800 lines)
│
└── js/
    ├── app.js                     # Core: stars, theme, toast, streaks
    ├── coins.js                   # Gold coin wallet system
    ├── notifications.js           # Browser notification reminders
    ├── community.js               # Post/comment/like/save engine
    ├── grow.js                    # Practices & courses logic
    ├── daily.js                   # Daily practice & affirmations
    ├── journal.js                 # Journal CRUD & export
    ├── scripting.js               # Scripting editor & export
    ├── vision-board.js            # IndexedDB image management
    ├── calendar.js                # Activity calendar rendering
    ├── challenges.js              # 30-day challenge tracker
    ├── report.js                  # Report generator & export
    └── creator.js                 # Affirmation/quote creator
**🌟 Features**
**🌅 Daily Practice**
Morning & evening ritual checklists with coin rewards
8 affirmation categories — Health, Wealth, Career, Peace, Self-Love, Relationship, Power, Custom
4-7-8 Breathwork timer with animated breathing circle
Guided meditation timer (5 / 10 / 15 / 20 minutes)
Per-practice daily streaks (breaks if you miss a day)
**📖 Gratitude Journal**
Write gratitudes, reflections, and daily intentions
Mood tracker (1–10 scale)
Save, load, and browse all past entries
Export as TXT or Print/Save as PDF
Daily streak tracking
**✍️ Gratitude Scripting**
Full scripting editor with rotating inspiration prompts
Save titled scripts with timestamps
Live word count tracker
Browse all past scripts
Export as TXT or PDF
**🖼️ Vision Board**
Upload unlimited images in any format (JPG, PNG, GIF, WebP, SVG, HEIC, BMP)
Images stored securely in IndexedDB (bypasses 5MB localStorage limit)
Full-screen lightbox with keyboard navigation (← → Esc)
Slideshow mode with auto-advance
Daily streak for visiting your vision board (+2 coins/day)
**🎵 Ambient Music**
30 curated tracks across 6 categories:
🌧️ Rain & Water sounds
🧠 Binaural Beats (Alpha 10Hz, Theta 6Hz, Delta 2Hz, Gamma 40Hz, 528Hz, 432Hz)
🌿 Nature Sounds (birds, ocean, creek, forest, fire)
🪘 Tibetan Singing Bowls & Solfeggio Frequencies
🎵 Lo-Fi & Chill beats
✨ Gratitude & Meditation music
Tracks open directly in a new tab (works offline-first, no iframe issues)
Links to 6 free ambient music libraries (myNoise, Pixabay, Free Music Archive, Lofi Girl, Spotify)
**🪙 Gold Coin Wallet**
Earn animated gold coins for every practice completed

Floating wallet widget (bottom-right) visible on every page

Full coin history log with reasons

**Coin awards:**

Action	Coins
Daily checklist item	+1 🪙
Journal entry saved	+3 🪙
Script saved	+3 🪙
Vision board visit	+2 🪙
Challenge day completed	+10 🪙
Challenge fully completed	+50 🪙
Community post	+2 🪙
Community comment	+1 🪙
Course lesson completed	+5 🪙
Event created	+5 🪙
**🔔 Smart Daily Reminders**
Browser Notification API (works on Edge, Chrome, Vivaldi)
5 configurable daily reminders: Morning, Evening, Journal, Vision Board, Affirmation
Toggle each on/off with custom time settings
Fires once per day per type; checks every 60 seconds
Manage all reminders in Creator Studio
**📅 Activity Calendar**
Month-view calendar with color-coded activity dots
Journal (orange), Scripts (pink), Daily Practice (green), Vision Board (purple), Coins (gold)
Click any day to see detailed activity breakdown
Monthly stats with progress bars
Navigate across months
**📊 Gratitude Reports**
Weekly, Monthly, and All-Time summaries
Stats: journal entries, gratitudes written, scripts, coins earned, active streak
Journal highlights, script previews
Export as TXT (download) or Print/Save as PDF (browser print dialog)
**🏆 30-Day Challenges**
8 built-in challenges:
30 Days of Gratitude, The Morning Miracle, Affirmation Sprint
Daily Meditation, 30 Days of Scripting, Mindful Morning
Hydration Gratitude, Vision Board Daily
30-cell grid tracker — visualize your daily progress
+10 coins per completed day, +50 bonus on full completion
One active challenge at a time
**✨ Creator Studio**
Custom Affirmation Creator — create, categorize, copy, delete; show in Daily Practice Custom tab
Custom Quote Creator — write and attribute personal wisdom
Reminder Settings — configure all browser notifications in one place
**🌍 Life Area Pages (10 areas)**
Full guidance, journal prompts, affirmations, and scripting CTAs for:

🏃 Health & Vitality
💼 Career & Success
💰 Wealth & Abundance
💚 Inner Peace
🌟 Financial Freedom
❤️ Relationship & Love
🌸 Self-Love & Confidence
🏛️ Stoic Wisdom (20 rotating quotes from Marcus Aurelius, Seneca, Epictetus)
🏛️ Community Branch
A social layer — all data stored locally in your browser. No server needed.

**💬 Six Spaces**
Space	Purpose
👋 Introduce Yourself	Tell your tribe who you are
🎯 Intention Board	Share goals — Life / Today / Month / Year with timeframe filter
📢 Announcements	App updates and community news with pinnable posts
❤️ Gratitude Wall	Share gratitude by category (Health/Wealth/Love/Career/Family)
🔄 The Circle	Open discussions tagged as Question / Insight / Experience / Resource
🔖 Saved Posts	All bookmarked posts across every space in one view
Every post supports: ❤️ Like • 💬 Comment (threaded) • 🔖 Save • 🔗 Copy Link • 🗑️ Delete own post

**📅 Events & Challenges**
Create 30 / 60 / 90-day or custom-duration community challenges
Attach images (stored as base64) and article-style descriptions
Join/leave with participant counter
Mini calendar showing events by start date
Category tags: Challenge / Article / Workshop / Resource
🏆 Tribe Leaderboard
Auto-ranked by coin count, ties broken by streak
🥇🥈🥉 Medal badges for top 3 members
Add community members to simulate a tribe
Your own stats always live-synced from actual coin balance
Stats: Total Members, Total Community Coins, Top Streak
🌱 Grow Branch
📚 Practices (15 practices)
Manifestation Starter — 21-Day Bundle: The 6 foundation practices (Daily Affirmation, Vision Minute, Gratitude Writing Morning, Gratitude Writing Before Bed, Media Detox, People Detox) bundled into a 21-day program with full description and one-click start.

**Full Practice Library:**

Practice	Description
Gratitude Spark	Recollect 1–3 grateful moments to shift your mood
Vision Minute	60 seconds of vivid visualization
The 10-Breath Reset	Reset your state in under 2 minutes
Gratitude Writing — Morning	15–20 statements across 6 life areas
Gratitude Writing — Before Bed	3–5 statements on what went well
Daily Affirmation	Affirmation audio minimum 30 min/day
Water Manifestation	Charge your water with intention
Media Detox	Cleanse media not aligned with your goals
People Detox	Distance from negative energy during manifestation
333 Script	Same affirmation 33×/day for 3 days
777 Script	7× morning + 7× night for 7 days
Scriptwriting	Write desired reality in present tense
Mirror Work	5-minute eye-contact affirmations
Pillow Method	Affirmation paper under pillow each night
Two Cup Method	Intention-shifting water ritual
Search bar + 2-row category filter chips
Active practices tracker with "End Cycle" option
+3 coins for starting each practice
🎓 Courses (3 open + 2 locked)
Course	Lessons	Status
Life Transformation Foundation	5 lessons	✅ Free
Gratitude Mastery	5 lessons	✅ Free
Vision Board Creation	5 lessons	✅ Free
1% Club 2.0	—	🔒 Stardust
Monk Mode Reset	—	🔒 Stardust
Each open course has a lesson sidebar, progress bar, rich lesson content, practical exercises, and "Mark Complete" buttons — progress saved in localStorage.

**🎨 Design System**
Theme — Dark cosmic (default) + full Light mode (toggle top-right)
Fonts — Inter (body text) + Playfair Display (headings & italic quotes)
Palette — Purple #9b7dea + Pink #ec4899 + dark cosmic backgrounds
Effects — Animated star field background, glass morphism cards (backdrop-filter: blur(16px)), gradient accent buttons
Responsive — Single-column layout below 768px; desktop sidebar layouts on courses
Navigation — Dropdown menus for Community and Grow branches; mobile hamburger menu
**💾 Data & Privacy**
Storage	What it holds
localStorage	Journal entries, scripts, settings, coins, streaks, community posts, practices, courses, challenges, reminders, affirmations, quotes
IndexedDB	Vision board images (CosmosVisionBoard database)
100% private. Nothing ever leaves your device. Zero tracking, zero analytics, zero accounts.

**localStorage Key Reference**
Key	Purpose
cosmos-coins	Total coin balance
cosmos-coin-history	Coin transaction log
cosmos-streak	Overall daily streak
cosmos-streak-{name}	Per-practice streak
cosmos-streak-date-{name}	Last practice completion date
cosmos-journal-entries	All journal entries (JSON array)
cosmos-scripts	All gratitude scripts (JSON array)
cosmos-active-challenge	Current challenge state
cosmos-active-practices	Active grow practices (JSON array)
cosmos-custom-affirmations	User-created affirmations
cosmos-custom-quotes	User-created quotes
cosmos-reminders	Notification reminder settings
cosmos-events	Community events
cosmos-tribe-members	Tribe leaderboard members
cosmos-posts-{spaceId}	Posts for each community space
cosmos-saved-posts	Bookmarked post IDs
cosmos-my-username	Community display name
cosmos-course-progress-{id}	Course completion %
cosmos-lesson-{id}-{idx}	Individual lesson completion
cosmos-theme	'dark' or 'light'
**🛠️ Tech Stack**
Technology	Usage
HTML5	Semantic page structure, 46 pages
CSS3	Custom design system, CSS variables, animations, glass morphism
Vanilla JavaScript	All logic — no frameworks, no dependencies
localStorage API	All user data persistence
IndexedDB API	Vision board image storage
Web Notifications API	Daily reminder scheduling
FileReader API	Local image uploads
CSS Custom Properties	Dynamic dark/light theming
Google Fonts CDN	Inter + Playfair Display typefaces
**🤖 Built With AI**
This entire application — all 46 HTML/CSS/JS files, content, architecture, and design — was built using Claude Sonnet 4.6 by Anthropic, running inside the Antigravity agentic coding environment by Google DeepMind.

The app was built entirely through natural language conversation, with Claude writing, debugging, and refining all code across multiple sessions — no manual coding required.

"The future of software is a conversation."

**📋 Browser Compatibility**
Browser	Notifications	IndexedDB	All Features
✅ Microsoft Edge	✅	✅	✅ Full support
✅ Google Chrome	✅	✅	✅ Full support
✅ Vivaldi	✅	✅	✅ Full support
✅ Brave	✅	✅	✅ Full support
✅ Firefox	✅	✅	✅ Full support
⚠️ Safari	⚠️ Limited	✅	Mostly supported
📄 License
Personal-use software. Built for private, offline gratitude practice. Feel free to fork and customize for your own journey.

The universe is always responding to your gratitude. Keep showing up.

**✦ Cosmos Gratitude App — Built with Claude Sonnet 4.6 ✦**
