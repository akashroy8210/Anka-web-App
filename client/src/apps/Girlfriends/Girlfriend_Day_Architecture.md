# Girlfriend's Day Surprise Website Architecture

> Premium one-off product. This theme system is **only** for the Girlfriend's Day experience and is **not shared** with other occasions.

# 1. Goals

- Three fixed themes:
  1. Dark Luxury
  2. Baby Pink + Brown + Light Purple
  3. Soft Pink
- No Tailwind CSS.
- Plain CSS only.
- Customer selects theme during purchase.
- Entire surprise uses the selected theme.
- Three separate occasion registry entries.

# 2. Folder Structure

```text
girlfriend-day/
 ├── pages/
 ├── components/
 ├── assets/
 ├── styles/
 │   ├── dark-theme.css
 │   ├── pastel-theme.css
 │   ├── pink-theme.css
 │   ├── typography.css
 │   └── globals.css
 ├── data/
 ├── hooks/
 ├── utils/
 ├── animations/
 └── registry/
```

# 3. Theme CSS

## dark-theme.css
Hero: #0B0B0B
Cards: #161616
Accent: #D4AF37
Primary Text: #FFFFFF
Secondary: #CFCFCF
Buttons: Gold
Letter: Cream

## pastel-theme.css
Background: #FDF6F8
Primary: #F6C9D6
Brown: #8B5E3C
Lavender: #DCCEF9
Text: #47342E
Cards: White

## pink-theme.css
Background: #FFF5F9
Primary: #FFC1D6
Secondary: #FFE7EF
Accent: #FF77AA
Text: #4B2E39

Each page imports only one theme css.

# 4. Registry

Create three entries:

- girlfriend-day-dark
- girlfriend-day-pastel
- girlfriend-day-pink

Purchase selection decides which registry renders.

# 5. Experience Flow

Phase 1
Identity Check

Phase 2
Welcome

Phase 3
Love Question

Phase 4
Mission Intro

Phase 5
Rules

Phase 6
Love Quiz

Phase 7
Fake Crash

Phase 8
Memory Book

Phase 9
Gift Reveal

Phase 10
Love Letter

Ending
Restart Journey

Each phase should be an isolated React component controlled by one flow controller.

# 6. Suggested Components

IdentityCheck.jsx
Welcome.jsx
LoveQuestion.jsx
MissionIntro.jsx
WaterReminder.jsx
Rules.jsx
Quiz.jsx
Crash.jsx
MemoryBook.jsx
GiftReveal.jsx
LoveLetter.jsx
Ending.jsx

FlowController.jsx determines next screen.

# 7. State

Store:

theme

quiz answers

kiss count

wish earned

memory progress

book page

gift unlocked

restart status

# 8. Quiz

Wrong answer:
+10 kisses.

Correct:
Confetti.
Heart rain.

All correct:
Wish textbox.
Send instantly to live control.

Otherwise:
Send Kiss screen.
Increment until required count reached.

# 9. Live Control

Sync:

Wish

Kiss count

Progress

Completion

# 10. Performance

Lazy load chapters.

Preload next phase.

Images optimized.

Audio preloaded.

# 11. Responsive

Desktop
Tablet
Mobile

Animations adapt.

# 12. Development Phases

Phase 1
Project setup
Theme system
Registry

Phase 2
Identity check

Phase 3
Welcome

Phase 4
Question popup

Phase 5
Mission

Phase 6
Rules

Phase 7
Quiz engine

Phase 8
Crash

Phase 9
Memory book

Phase 10
Gift reveal

Phase 11
Letter

Phase 12
Testing
Optimization
Production

# AI Build Prompt

Build this project strictly phase by phase.

Do not skip ahead.

Complete one phase, fully test it, then continue.

Requirements:

- Use React.
- Use normal CSS only.
- Do not use Tailwind.
- Create three independent CSS theme files.
- Every section must consume theme variables from the selected CSS.
- Theme selection happens during purchase and determines the registry entry.
- Build one FlowController that renders the experience sequentially.
- Every act must be modular.
- Reuse shared utilities where appropriate.
- Implement all interactions exactly as specified:
  - moving buttons
  - fake crash
  - page turning
  - quiz
  - kiss tracker
  - live wish submission
  - restart flow
- Keep animations premium, smooth, and responsive.
- After each phase, verify functionality before starting the next phase.
- Produce clean production-ready code with no placeholders or mock UI remaining.
