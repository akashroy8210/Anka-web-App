# AnKa Surprise — Apology Surprise Complete Design & Build Specification

## 0. Product Vision

Build a premium, interactive apology experience for couples.

This is NOT a static apology website and must NOT feel like a collection of cards with paragraphs.

The experience should feel like a small emotional journey:

**Emotion → Interaction → Discovery → Playfulness → Sincerity → Choice**

The recipient should gradually discover:
- what happened,
- what the creator understands,
- what they promise to change,
- memories they value,
- a playful cuteness surprise,
- a personal voice/video message on Premium,
- an opportunity to respond,
- and a final apology.

The product must support two plans:

### Basic
A complete emotional experience with:
- Interactive apology journey
- Scratch-to-reveal promises
- Memories
- Cuteness Meter without image upload
- Interactive chance section
- Final apology
- Recipient response

### Premium
Everything in Basic plus:
- Cuteness Meter image upload
- Voice apology
- Video apology
- Live Control Panel
- Real-time recipient response
- Higher content limits
- Premium interactions/animations
- Advanced customization

---

# 1. THREE DEDICATED THEMES

The creator chooses one theme when purchasing/configuring the product.

The selected theme becomes part of the surprise configuration.

The recipient MUST see the exact theme purchased.

Never silently substitute another theme.

The three themes are:

1. **Midnight Romance**
2. **Blush Pink**
3. **Lavender Dream**

These themes are specific to this Apology Surprise experience and do not need to become a global theme system for other applications.

---

# 2. THEME RULE

A theme is not simply a different background color.

Every visual layer must inherit the selected theme:

- Background
- Typography
- Cards
- Buttons
- Scratch cards
- Memory frames
- Cuteness Meter
- Progress indicators
- Upload zones
- Audio player
- Video player
- Popups
- Modals
- Final letter
- Decorations
- Particles
- Icons
- Borders
- Shadows
- Glows
- Focus states
- Hover states
- Loading states
- Page transitions

The same functionality may be shared, but its visual treatment must be theme-aware.

---

# 3. THEME 1 — MIDNIGHT ROMANCE

## Personality

Dark, intimate, cinematic, elegant and luxurious.

Think:
- Midnight
- Candlelight
- Velvet
- Deep romance
- Rose glow
- Private late-night conversation

## Colors

```text
Background:       #0B0710
Secondary BG:     #160C18
Card:             #1B101F
Primary Accent:   #D94F83
Soft Rose:        #F28BAE
Deep Rose:        #8E234F
Primary Text:     #FFF5F8
Secondary Text:   #D8C3CC
Gold Accent:      #D6A85F
```

## Visual treatment

Background:
- Deep cinematic gradients
- Soft rose ambient glow
- Tiny stars
- Subtle hearts
- Candle-like lighting
- Slow bokeh

Cards:
- Dark translucent velvet glass
- Rose border
- Soft blur
- Rose glow
- Large rounded corners

Buttons:
- Deep rose/crimson
- Soft glow
- Slight lift on hover
- Compression on press

Scratch cards:
- Dark velvet scratch surface
- Rose-gold reveal
- Rose particles after reveal

Memory gallery:
- Dark glass frames
- Rose-gold accents
- Cinematic shadows

Cuteness Meter:
- Dark glass
- Rose → pink → gold progress
- Glowing overload state
- Cracked/glass-like final break

Final letter:
- Warm paper illuminated by candlelight
- Rose/gold details
- Dark surroundings

---

# 4. THEME 2 — BLUSH PINK

## Personality

Soft, warm, romantic, elegant and playful.

Think:
- Baby pink
- Warm cream
- Flowers
- Rose petals
- Romantic stationery
- Soft sunlight

## Colors

```text
Background:       #FFF5F8
Secondary BG:     #FFE7EF
Card:             #FFFFFF
Primary Pink:     #F06F9B
Deep Pink:        #D94B78
Soft Pink:        #FFD1DF
Warm Brown:       #7A514F
Cream:            #FFF9F3
Primary Text:     #4A3038
Secondary Text:   #85656D
Accent:           #E8A1B5
```

## Visual treatment

Background:
- Soft pink gradients
- Flower silhouettes
- Rose petals
- Warm cream lighting
- Soft bokeh

Cards:
- Warm white stationery
- Pink shadows
- Thin pink borders
- Subtle paper texture

Buttons:
- Soft pink gradient
- Gentle spring interaction
- Premium highlight

Scratch cards:
- Pink paper texture
- Cream/rose-gold reveal
- Petals and sparkles

Memory gallery:
- Printed-photo/card aesthetic
- White frames
- Pink borders
- Small flowers

Cuteness Meter:
- Light pink → rose → deep pink
- Hearts and petals
- Meter cracks after overload

Final letter:
- Warm cream paper
- Pink flowers
- Handwritten signature
- Small hearts

---

# 5. THEME 3 — LAVENDER DREAM

## Personality

Dreamy, magical, gentle and whimsical.

This must feel visually different from the pink themes.

Think:
- Lavender
- Lilac
- Purple
- Soft blue
- Fireflies
- Stars
- Dreamy evening

## Colors

```text
Background:       #F7F2FF
Secondary BG:     #EDE3FF
Card:             #FFFFFF
Primary Purple:   #9B78D4
Deep Purple:      #69449A
Lavender:         #CDB7F6
Soft Blue:        #BFD8FF
Accent Pink:      #F2A7D1
Warm Cream:       #FFF8EE
Primary Text:     #382C49
Secondary Text:   #756985
```

## Visual treatment

Background:
- Lavender gradients
- Purple clouds
- Fireflies
- Tiny stars
- Floating flowers
- Blue bokeh

Cards:
- White/lavender glass
- Purple-blue glow
- Large rounded corners
- Soft shadows

Buttons:
- Lavender → purple gradient
- Purple glow
- Soft spring movement

Scratch cards:
- Lavender paper texture
- Purple-blue reveal
- Fireflies and stars

Memory gallery:
- Lavender glass frames
- Soft glow
- Flower/star decorations

Cuteness Meter:
- Lavender → purple → pink → blue
- Stars and fireflies
- Purple glass break effect

Final letter:
- Warm cream paper
- Lavender border
- Purple ink
- Fireflies

---

# 6. COMPLETE USER JOURNEY

The experience should follow this exact emotional structure:

1. Before You Leave
2. I Know What I Did
3. What I Should Have Done
4. No Excuses
5. Things I Should Have Said
6. My Promises
7. Memories I Don't Want To Lose
8. Cuteness Meter
9. Hear Me Out
10. Can I Make It Right?
11. Tell Me How You Feel
12. Things I'll Do Differently
13. Final Apology
14. What Happens Next

Premium-only screens should be gracefully omitted from Basic rather than showing empty placeholders.

---

# 7. OPENING — BEFORE YOU LEAVE

The page starts quietly.

Do not immediately display a giant apology paragraph.

Reveal short lines:

> I know you're upset with me.

Then:

> And honestly...

Then:

> You have every right to be.

Primary button:

**Give Me One Minute**

Interaction:
- Button hover
- Soft ambient animation
- Theme-specific glow
- Cinematic transition to the next section

The copy must be editable.

---

# 8. I KNOW WHAT I DID

Show a creator-written acknowledgement.

Heading:

**What I Did**

Editable text example:

> I ignored your messages when you needed me.

Then transition to:

**What I Should Have Done**

Example:

> I should have listened, understood you, and been there.

Do not hardcode these example messages.

---

# 9. NO EXCUSES

Create three interactive cards.

### Card 1
“I could explain it.”

Click:
- Fold away
- Move to the next state

### Card 2
“I could blame the situation.”

Click:
- Disappear

### Card 3
“I could make excuses.”

Click:
- Fade

After all three:

> But none of that changes the fact that I hurt you.

Button:

**I Understand ❤️**

Theme-specific animation should be used.

---

# 10. THINGS I SHOULD HAVE SAID

Display handwritten notes.

Initially each note is closed.

Click/tap:
- Note unfolds
- Message becomes visible
- Small theme-specific decorative animation plays

Examples:

> I should have listened.

> I should have understood.

> I should have communicated.

> I should never have made you feel alone.

All content editable.

---

# 11. MY PROMISES — SCRATCH REVEAL

This is a major interactive feature.

Do NOT use an envelope.

Each promise is hidden under a scratch surface.

Initial state:

> Scratch to discover my promise ❤️

Support:
- Mouse
- Trackpad
- Touch
- Stylus

As scratching happens:
- Scratch pixels/texture disappear
- Promise appears underneath
- Progress is visible subtly
- Small particles appear
- Card lighting changes

Once the reveal threshold is reached:
- Automatically finish reveal
- Disable further scratching
- Show complete promise
- Play a small success animation

Example promises:

> I promise to listen before reacting.

> I promise not to repeat this mistake.

> I promise to communicate instead of disappearing.

> I promise to think about how my actions affect you.

> I promise to do better, not just say better.

Creator controls:
- Add
- Edit
- Delete
- Reorder
- Choose scratch texture
- Choose reveal animation

Plan limits must be enforced.

---

# 12. MEMORIES I DON'T WANT TO LOSE

Create an interactive memory gallery.

Each memory contains:
- Image
- Title
- Date
- Personal message

Example:

### That Day

> I don't want one mistake to erase everything beautiful we've built.

Click/tap:
- Expand memory
- Cinematic background transition
- Display image
- Display message
- Provide close/back interaction

Basic:
- Limited number of memories

Premium:
- Higher configurable limit

Do not make the page depend on image dimensions.

All images must fit inside a consistent visual frame using object-fit/contain/cover rules as appropriate.

---

# 13. CUTENESS METER — BASIC

Basic includes the Cuteness Meter.

Basic does NOT include image upload.

Opening:

> Before we continue...

> We need to settle something important.

Heading:

# How Cute Are You?

The interaction can involve:
- Tap hearts
- Hold button
- Drag meter
- Collect floating hearts

The creator can choose the interaction style.

---

# 14. CUTENESS METER — IMPORTANT OVERFLOW BEHAVIOR

The meter must NOT stop at 100%.

After reaching 100%, continue:

```text
100%
125%
150%
175%
200%
250%
300%
```

The meter should visibly exceed its normal limit.

At each stage, increase the visual overload.

Example:

125%:
> That's definitely above average.

175%:
> Something is wrong here.

225%:
> Cuteness overload detected.

300%:
> SYSTEM LIMIT EXCEEDED

Then the meter breaks.

The break should feel like a designed animation, not an abrupt error.

Possible effects:
- Cracks
- Shards
- Glow burst
- Hearts
- Particles
- Screen shake
- Audio cue

Respect reduced-motion settings.

---

# 15. PREMIUM CUTENESS METER

Premium includes everything in Basic plus image upload.

Before upload:

> Drop your cutest picture here.

The uploaded image becomes part of the experience.

Important:
This is a playful entertainment feature, not a real measurement or objective assessment of appearance.

After upload:
- Show image in theme-specific frame
- Begin meter
- Progress beyond 100%
- Continue to 300%+
- Trigger overload
- Break meter

Premium progression:

```text
0
50
100
125
150
175
200
250
300
OVERLOAD
```

As the meter rises:
- Hearts multiply
- Sparkles increase
- Glow increases
- Frame becomes more animated
- Meter shakes
- UI begins overflowing

Final state:

**SYSTEM FAILURE**

Then:

**BREAK**

---

# 16. CUTENESS FINAL POPUP

After the meter breaks:

Pause briefly.

Show a premium theme-specific popup:

> **Your cuteness can't be measured.**

Then:

> **Even my cuteness meter gave up. ❤️**

Button:

**Okay, I Get It 😂**

Popup must look different in all three themes.

---

# 17. HEAR ME OUT — PREMIUM

Premium only.

Creator can:
- Upload voice
- Record voice
- Replace voice
- Delete voice

Recipient sees:

> I wanted to say this properly.

Button:

**Hear Me Out**

Audio player:
- Play/pause
- Waveform
- Duration
- Creator name
- Progress
- Theme styling

While playing:
- Animate waveform
- Use subtle background movement
- Avoid excessive animation

---

# 18. VIDEO APOLOGY — PREMIUM

Premium only.

Creator can upload a short video.

Opening:

> There are some things that are easier to say than type.

Button:

**Watch What I Couldn't Say**

Open cinematic video player.

The video container must be responsive and preserve aspect ratio.

Video uploads must have appropriate size/duration validation.

---

# 19. CAN I MAKE IT RIGHT?

Create a major emotional interaction.

Display:

> I have one question for you.

Then reveal:

# Can I try to make this right?

Buttons:

**❤️ Yes**

**I Need Some Time**

Do NOT make “I Need Some Time” run away.

Do NOT trick the recipient.

If selected:

> I understand.

> Take the time you need.

The Yes option remains available.

---

# 20. DYNAMIC YES BUTTON

The Yes button can change wording dynamically after interaction.

Examples:

1. I'll Give You A Chance ❤️
2. Let Me Make It Right
3. One More Chance?
4. I'll Do Better
5. Let's Try Again ❤️

Use short, smooth transitions.

Do not make this feel like a game designed to pressure the user.

---

# 21. TELL ME HOW YOU FEEL

Create a private response section.

Heading:

# You Can Tell Me Anything.

Subtitle:

> You don't have to pretend you're okay.

Quick choices:

- I'm still upset
- I need some time
- I want to talk
- I want you to listen
- I'm ready to forgive you

Then a textarea:

> Write what you really want to say...

Button:

**Send ❤️**

Basic:
- Store response through normal backend flow
- No Live Control Panel

Premium:
- Response also appears in Live Control Panel in real time

---

# 22. LIVE CONTROL PANEL — PREMIUM ONLY

This feature must NOT exist for Basic users.

Premium creator panel displays:

### Surprise Status

Opened

### Journey Progress

- Apology opened
- Promises discovered
- Memories viewed
- Cuteness Meter completed
- Final question answered

### Recipient Response

Show:
- Selected response
- Custom message
- Relevant event status

Use the existing Socket.io architecture if available.

Maintain secure authorization.

Do not expose private control-panel APIs to the recipient.

---

# 23. THINGS I'LL DO DIFFERENTLY

This section is separate from promises.

Promises:
- Emotional commitment

This section:
- Specific future behavior

Heading:

### Next Time...

Examples:

> I'll communicate instead of disappearing.

> I'll listen before getting defensive.

> I'll give you the attention you deserve.

> I'll think about how my actions affect you.

Everything editable.

---

# 24. FINAL APOLOGY

Slow the experience down.

Music becomes softer.

Background becomes calmer.

Show a premium handwritten letter.

Heading:

**I'm Sorry. Truly.**

Creator-written message.

Final lines:

> I'm not asking you to forget what happened.

> I'm asking for the chance to show you that I can do better.

Signature:

**— [Creator Name]**

Use theme-specific letter styling.

---

# 25. FINAL CHOICE

Heading:

# What Happens Next Is Up To You.

Buttons:

**❤️ Let's Start Again**

**💌 I Want To Talk**

Basic:
- Store selection normally
- No live creator dashboard

Premium:
- Send selection to Live Control Panel in real time

---

# 26. CUSTOMIZER — COMPLETE EDITABLE EXPERIENCE

The Mini Customizer must be redesigned specifically for this product.

Do not expose technical names such as:
- Act 1
- Act 2
- Section 7

Use real titles:

- Opening Message
- What I Did
- What I Should Have Done
- No Excuses
- Things I Should Have Said
- My Promises
- Our Memories
- Cuteness Meter
- My Voice
- My Video
- Can I Make It Right?
- Your Response
- Things I'll Do Differently
- Final Apology

---

# 27. CUSTOMIZER — THEME

Theme selector:

### Choose Your Experience

Cards:

**Midnight Romance**

**Blush Pink**

**Lavender Dream**

Show live preview.

Once selected:
- Store theme slug
- Apply theme immediately
- Save with surprise configuration

---

# 28. CUSTOMIZER — OPENING

Editable:
- Heading
- Supporting text
- Button
- Background
- Music
- Animation

Live preview required.

---

# 29. CUSTOMIZER — MISTAKE

Editable:
- What I Did
- What I Should Have Done
- Supporting text
- Optional image
- Animation

---

# 30. CUSTOMIZER — NO EXCUSES

Editable:
- Card 1
- Card 2
- Card 3
- Final statement
- Button

---

# 31. CUSTOMIZER — THINGS I SHOULD HAVE SAID

Creator can:
- Add note
- Edit note
- Delete note
- Reorder note
- Choose note style

---

# 32. CUSTOMIZER — PROMISES

Creator can:
- Add promise
- Edit promise
- Delete promise
- Reorder promise
- Select scratch texture
- Select reveal animation

Plan limits must be enforced.

---

# 33. CUSTOMIZER — MEMORIES

Each memory:
- Image
- Title
- Date
- Description

Optional:
- Audio
- Extra animation

Basic and Premium limits must be enforced.

---

# 34. CUSTOMIZER — CUTENESS METER

Editable:
- Heading
- Intro
- Meter messages
- Overload messages
- Final popup
- Button text
- Interaction type
- Animation

Premium:
- Image upload mode
- Upload instruction
- Image frame
- Advanced meter animation

Basic must not expose the image-upload capability.

---

# 35. CUSTOMIZER — VOICE

Premium only.

Controls:
- Upload
- Record
- Replace
- Delete
- Title
- Description

---

# 36. CUSTOMIZER — VIDEO

Premium only.

Controls:
- Upload
- Replace
- Delete
- Title
- Description

---

# 37. CUSTOMIZER — FINAL APOLOGY

Editable:
- Heading
- Main apology
- Signature
- Creator name
- Background
- Music
- Animation

---

# 38. PRODUCT PLAN ENFORCEMENT

Premium functionality must be protected by backend entitlements.

Do not rely only on frontend checks such as:

```js
if (plan === "premium")
```

Frontend checks are for UX.

Backend must validate:
- Product plan
- Instance ownership
- Feature access
- Upload limits
- Memory limits
- Premium APIs
- Live Control Panel access

Basic users must not be able to unlock Premium features by modifying frontend state.

---

# 39. THEME ARCHITECTURE

Recommended:

```text
client/src/
└── apps/
    └── apology/
        ├── ApologySurprise.jsx
        ├── apology.css
        ├── themes/
        │   ├── midnightRomance.css
        │   ├── blushPink.css
        │   ├── lavenderDream.css
        │   └── themeRegistry.js
        │
        ├── components/
        │   ├── OpeningMessage.jsx
        │   ├── MistakeSection.jsx
        │   ├── NoExcuses.jsx
        │   ├── ThingsISaid.jsx
        │   ├── PromiseScratchCards.jsx
        │   ├── MemoryGallery.jsx
        │   ├── CutenessMeter.jsx
        │   ├── VoiceApology.jsx
        │   ├── VideoApology.jsx
        │   ├── MakeItRight.jsx
        │   ├── RecipientResponse.jsx
        │   ├── FutureChanges.jsx
        │   └── FinalApology.jsx
        │
        └── hooks/
            ├── useApologyTheme.js
            ├── useScratchReveal.js
            └── useCutenessMeter.js
```

---

# 40. THEME REGISTRY

Example conceptual structure:

```js
const apologyThemes = {
  "midnight-romance": {
    name: "Midnight Romance",
    cssClass: "theme-midnight-romance"
  },

  "blush-pink": {
    name: "Blush Pink",
    cssClass: "theme-blush-pink"
  },

  "lavender-dream": {
    name: "Lavender Dream",
    cssClass: "theme-lavender-dream"
  }
};
```

The exact implementation can vary.

The important requirement is that the selected theme is loaded from the actual surprise configuration and applied globally.

---

# 41. DATABASE / CONFIGURATION REQUIREMENT

The surprise configuration needs a theme identifier.

Example:

```text
themeSlug:
    midnight-romance
    blush-pink
    lavender-dream
```

The recipient experience reads this configuration.

Flow:

```text
Purchased Product
      ↓
Selected Theme
      ↓
Saved with Surprise Instance
      ↓
Recipient Opens Surprise
      ↓
Backend Returns Configuration
      ↓
Theme Slug Resolved
      ↓
Theme CSS Loaded
      ↓
Apology Experience Rendered
```

Do not hardcode a default theme for purchased instances.

A fallback should only exist for legacy instances where a theme value genuinely does not exist, and it must not override a valid selected theme.

---

# 42. RESPONSIVE DESIGN

Mobile is a primary experience.

Do not simply shrink desktop.

## Mobile

- Single-column flow
- Large touch targets
- Touch scratch
- Swipe-friendly memories
- Full-width cards where appropriate
- Safe-area spacing
- Responsive typography
- Optimized media
- No horizontal overflow

## Tablet

Use adaptive two-column layouts where space allows.

## Desktop

Support:
- Large cinematic layouts
- Hover states
- Mouse scratch
- Optional cursor effects
- Large memory presentation
- Keyboard interaction

---

# 43. MOTION DESIGN

Use motion to communicate interaction.

Recommended motion:

- Fade
- Blur
- Scale
- Slide
- Scratch
- Paper unfold
- Card fold
- Memory expansion
- Particle drift
- Cinematic scene transitions

Avoid:
- Constant bouncing
- Every element moving simultaneously
- Excessive pulse effects
- Long blocking animations

Animations must never prevent the user from progressing unnecessarily.

---

# 44. PERFORMANCE

The experience is visually rich, so performance must be treated as a product requirement.

Requirements:

- Lazy-load heavy images
- Compress uploaded images
- Validate video size/duration
- Lazy-load video
- Avoid unnecessary canvas loops
- Use transform/opacity for animations where possible
- Pause background animations when tab is hidden
- Respect reduced motion
- Avoid large synchronous JavaScript work
- Avoid loading Premium media for Basic
- Avoid loading unused theme assets

Theme-specific assets should load only when needed.

---

# 45. ACCESSIBILITY

Support:

- Keyboard navigation
- Visible focus
- Proper button semantics
- Screen-reader labels
- Accessible form inputs
- Sufficient contrast
- Reduced motion

When reduced motion is enabled:
- Reduce particle movement
- Disable heavy transforms
- Reduce transitions
- Preserve functionality

---

# 46. MEDIA SAFETY AND VALIDATION

For creator uploads:

Images:
- Validate type
- Validate dimensions
- Compress/resize where appropriate
- Generate optimized versions

Audio:
- Validate format
- Validate duration
- Limit size

Video:
- Validate format
- Validate duration
- Limit file size
- Provide clear upload error
- Compress/transcode where supported

Do not allow extremely large files to make the surprise unusable.

---

# 47. ERROR STATES

Errors must be designed as part of the experience.

Examples:

Image upload failure:
> Something went wrong while adding this memory. Try again.

Video upload failure:
> This video is a little too large. Please choose a smaller one.

Network failure:
> We couldn't save that just yet. Your work is still here — try again.

Do not show raw backend errors to users.

---

# 48. LOADING STATES

Avoid full-screen generic spinners.

Use:
- Theme-specific skeletons
- Soft loading transitions
- Local component loaders

Never make the entire experience disappear because one small asset is loading.

---

# 49. SECURITY

The recipient should only access the public surprise experience.

Creator-only functions must require authentication and authorization.

Premium Live Control Panel must be protected.

Do not expose:
- Admin secrets
- Creator private data
- Private media management endpoints
- Internal instance controls

Validate all important product entitlements server-side.

---

# 50. TESTING CHECKLIST

## Theme

- [ ] Midnight Romance loads correctly
- [ ] Blush Pink loads correctly
- [ ] Lavender Dream loads correctly
- [ ] Theme persists after refresh
- [ ] Theme is correct on recipient view
- [ ] No theme cross-contamination

## Basic

- [ ] All Basic sections work
- [ ] Scratch promises work
- [ ] Cuteness Meter works without image upload
- [ ] Meter exceeds 100%
- [ ] Meter reaches overload
- [ ] Meter breaks
- [ ] Basic cannot access Premium features
- [ ] No Live Control Panel

## Premium

- [ ] Image upload works
- [ ] Cuteness Meter uses uploaded image
- [ ] Voice works
- [ ] Video works
- [ ] Live Control Panel works
- [ ] Real-time response arrives
- [ ] Premium limits are enforced

## Responsive

- [ ] Mobile
- [ ] Tablet
- [ ] Desktop

## Accessibility

- [ ] Keyboard navigation
- [ ] Focus states
- [ ] Reduced motion
- [ ] Contrast

## Performance

- [ ] Images optimized
- [ ] Videos lazy-loaded
- [ ] No unnecessary theme assets loaded
- [ ] No major animation jank
- [ ] No horizontal overflow

---

# 51. DEFINITION OF DONE

The Apology Surprise is considered complete only when:

1. All three themes are implemented.
2. Each theme looks genuinely different.
3. The purchased theme is the theme shown to the recipient.
4. No section falls back to another theme when a valid theme is selected.
5. Basic and Premium feature boundaries work.
6. Premium image upload works.
7. Cuteness Meter goes beyond 100%.
8. Cuteness Meter reaches overload and breaks.
9. Scratch-to-reveal promises work on desktop and mobile.
10. Memories are responsive regardless of image dimensions.
11. Premium voice works.
12. Premium video works.
13. Premium Live Control Panel works.
14. Basic has no Live Control Panel.
15. Creator can customize all content.
16. Backend validates Premium entitlements.
17. Upload limits are enforced.
18. Responsive design is complete.
19. Accessibility requirements are met.
20. No placeholder content remains in production.
21. No temporary/demo logic remains.
22. No unnecessary fallback theme overrides a selected theme.
23. Build completes successfully.
24. Production API integration is verified.
25. End-to-end recipient journey is tested from opening to final response.

---

# 52. FINAL EXPERIENCE STANDARD

The final product should NOT feel like:

> "A webpage where someone wrote an apology."

It should feel like:

> "Someone took the time to create an entire little world around their apology."

The experience should repeatedly alternate between:

**Emotion**
↓
**Interaction**
↓
**Discovery**
↓
**Playfulness**
↓
**Sincerity**
↓
**Choice**

The three themes should preserve the story but completely change the atmosphere:

**Midnight Romance**
= intimate cinematic luxury

**Blush Pink**
= warm romantic stationery

**Lavender Dream**
= dreamy magical romance

The final quality target is:

**Premium digital gift + interactive story + emotional experience + personalized couple memory.**


# 53. DEMO CONFIG LINK SYSTEM

The Apology Surprise must include a dedicated **Demo Config Link** system.

The purpose is to allow the Admin to create a shareable demo URL from the Admin Panel so the team can preview the complete Apology Surprise experience before selling or attaching it to a customer instance.

The demo must use the same actual Apology Surprise components, themes, interactions, and configuration system as the production surprise.

Do NOT create a completely separate hardcoded demo page.

---

## 53.1 Admin — Generate Demo Link

Add a component inside the Admin Panel:

```text
DemoConfigGenerator
```

Recommended location:

```text
client/src/
└── admin/
    └── components/
        └── DemoConfigGenerator.jsx
```

The component should allow the Admin to:

- Select the Apology Surprise
- Select one of the three themes
- Configure demo content
- Preview the configuration
- Generate a demo link
- Copy the demo link
- Open the demo in a new tab

Themes:

- Midnight Romance
- Blush Pink
- Lavender Dream

The generated demo should use the selected theme.

---

## 53.2 Demo Configuration

The Admin should be able to create a temporary/demo configuration containing the data required by the Apology Surprise.

The configuration can include:

- Theme
- Opening messages
- Mistake message
- What I Should Have Done
- No Excuses messages
- Things I Should Have Said
- Promises
- Memories
- Cuteness Meter configuration
- Premium image-upload demo state
- Voice demo configuration
- Video demo configuration
- Final apology
- Creator name
- Button labels
- Animation settings

The existing production configuration structure should be reused wherever possible.

Do not duplicate the entire configuration architecture only for demos.

---

# 54. DEMO LINK ROUTE

Create a dedicated public demo route.

Example:

```text
/demo/apology/:demoId
```

Example generated URL:

```text
https://ankasurprise.in/demo/apology/abc123
```

The exact URL structure can follow the application's existing routing conventions, but it must uniquely identify the demo configuration.

The demo route must:

1. Read the demo ID.
2. Fetch the demo configuration.
3. Resolve the selected theme.
4. Load the Apology Surprise.
5. Render the same production components.
6. Enable the configured interactions.
7. Display the demo branding/footer.

---

# 55. DEMO CONFIG COMPONENT ARCHITECTURE

Recommended structure:

```text
client/src/
└── apps/
    └── apology/
        ├── ApologySurprise.jsx
        │
        ├── demo/
        │   ├── DemoApologyPage.jsx
        │   ├── DemoConfigGenerator.jsx
        │   ├── demoConfig.service.js
        │   └── demoConfig.js
        │
        ├── themes/
        │   ├── midnightRomance.css
        │   ├── blushPink.css
        │   ├── lavenderDream.css
        │   └── themeRegistry.js
        │
        └── components/
            └── ...
```

The exact folder structure can be adapted to the existing codebase.

---

# 56. ADMIN DEMO GENERATION FLOW

The Admin flow should be:

```text
Admin Panel
    ↓
Apology Surprise
    ↓
Demo Configuration
    ↓
Select Theme
    ↓
Configure Demo
    ↓
Preview
    ↓
Generate Demo
    ↓
Demo ID Created
    ↓
Demo URL Generated
    ↓
Copy Link / Open Demo
```

The generated link should immediately be usable.

---

# 57. DEMO CONFIGURATION STORAGE

Demo configurations should have their own identifiable record/state.

Recommended conceptual fields:

```text
demoId
productType
themeSlug
configuration
createdAt
expiresAt
createdBy
isActive
```

If the existing backend already has a suitable configuration mechanism, reuse it rather than creating unnecessary duplicate infrastructure.

Demo configurations should be clearly separated from real customer surprise instances.

A demo must never accidentally modify a real customer instance.

---

# 58. DEMO ACCESS

The demo URL is public/shareable.

The recipient should NOT need:

- Admin login
- Customer login
- Instance ID
- Password
- Account creation

The purpose is to make the demo easy to share.

Admin authentication is required for generating/managing demo configurations.

---

# 59. DEMO MODE IDENTIFICATION

The Apology Surprise should know when it is running as a demo.

Example conceptual state:

```js
mode: "demo"
```

Production:

```js
mode: "production"
```

Demo mode can be used to:

- Prevent production data mutations
- Prevent accidental customer notifications
- Prevent real customer analytics from being modified
- Show demo-specific branding
- Display demo footer
- Disable production-only destructive actions

Do not duplicate the entire application for demo mode.

---

# 60. DEMO FOOTER — ANKA SURPRISE LINK

Every public demo must contain a small, elegant AnKa Surprise link at the bottom.

The footer should NOT destroy the premium appearance of the experience.

It should be subtle.

Example:

```text
Made with ❤️ by AnKa Surprise
Create your own surprise →
```

The text can be adapted to the brand design.

The entire CTA should route to the main AnKa Surprise website.

Use the project's canonical website URL from configuration/environment rather than hardcoding different URLs throughout components.

Example conceptual configuration:

```js
const SITE_URL = "https://ankasurprise.in";
```

The footer link should:

- Work on mobile
- Work on desktop
- Open the main website route
- Match the selected Apology theme
- Remain readable
- Have a subtle hover state

---

# 61. DEMO FOOTER THEME BEHAVIOR

The footer must adapt to all three themes.

### Midnight Romance

Example:

```text
Made with ❤️ by AnKa Surprise
Create your own surprise →
```

Use:
- Soft rose text
- Dark translucent footer
- Rose hover glow

### Blush Pink

Use:
- Warm brown/rose text
- Soft cream background
- Pink hover state

### Lavender Dream

Use:
- Deep purple text
- Soft lavender background
- Purple hover state

The footer should look like part of the product rather than an external advertisement.

---

# 62. DEMO GENERATOR — ADMIN UI

The Admin Panel should show a dedicated card:

## Create Demo

Description:

> Create a shareable preview of the Apology Surprise.

Controls:

### Theme

- Midnight Romance
- Blush Pink
- Lavender Dream

### Demo Content

Allow the Admin to configure enough content to demonstrate the full experience.

Buttons:

**Preview**

**Generate Demo Link**

After generation:

```text
Demo created successfully

https://ankasurprise.in/demo/apology/abc123

[Copy Link] [Open Demo]
```

---

# 63. DEMO LINK MANAGEMENT

If the Admin Panel already has link/configuration management, add Demo Links there.

Display:

- Demo name
- Theme
- Created date
- Status
- Demo URL
- Open
- Copy
- Disable/Delete where supported

Do not mix demo links with real customer surprise instances in a way that could cause accidental edits.

---

# 64. DEMO PREVIEW REQUIREMENT

Before generating a link, Admin should be able to preview the exact configuration.

Flow:

```text
Configure
    ↓
Preview
    ↓
Make Changes
    ↓
Preview Again
    ↓
Generate Link
```

The preview must use the same components that the final demo link uses.

There should not be a separate simplified preview implementation.

---

# 65. DEMO LINK + PREMIUM FEATURES

If the Admin creates a Premium demo, the demo should visibly demonstrate Premium functionality where appropriate.

For example:

- Premium Cuteness Meter image upload
- Voice apology
- Video apology
- Premium memory limits
- Live Control Panel-related demo states

However, a public demo must never expose real customer/private data.

Use demo/sample data only.

---

# 66. DEMO LIVE CONTROL PANEL

If the Premium demo needs to demonstrate the Live Control Panel:

Create a separate Admin/demo control context.

Do NOT connect a public demo to a real customer instance.

Conceptually:

```text
Public Demo
     ↓
Demo Instance
     ↓
Demo Events
     ↓
Demo Control Panel
```

All demo events must remain isolated from production customer data.

---

# 67. DEMO SECURITY

Important requirements:

- Demo IDs should be difficult to guess.
- Never expose admin credentials.
- Never expose customer credentials.
- Never expose production instance IDs/passwords.
- Never allow a demo route to access another customer's configuration.
- Validate demo ownership for Admin management actions.
- Sanitize demo configuration.
- Apply upload limits.
- Prevent demo endpoints from modifying production customer data.

---

# 68. DEMO EXPIRATION

The system should support optional demo expiration.

Example:

```text
expiresAt
```

When an expired demo is opened:

Display a theme-compatible page:

> This demo is no longer available.

Button:

**Create Your Own Surprise →**

The button routes to the main AnKa Surprise website.

If the existing product does not require expiration, this can remain configurable.

---

# 69. DEMO ANALYTICS

If analytics already exist, demo activity should be distinguishable from production activity.

Conceptually:

```text
mode = demo
```

This prevents demo traffic from being mistaken for real customer surprise activity.

Possible demo events:

- Demo opened
- Opening completed
- Promise scratched
- Memory opened
- Cuteness Meter completed
- Final section reached
- Website CTA clicked

Do not collect unnecessary personal information.

---

# 70. DEFINITION OF DONE — DEMO SYSTEM

The Demo Config system is complete when:

- [ ] Admin can select Apology Surprise
- [ ] Admin can select all three themes
- [ ] Admin can configure demo content
- [ ] Admin can preview the demo
- [ ] Admin can generate a unique demo link
- [ ] Generated link opens without login
- [ ] Demo uses the same production Apology components
- [ ] Correct theme loads from configuration
- [ ] Basic demo works
- [ ] Premium demo works
- [ ] Demo data is isolated from customer data
- [ ] Demo mode is identifiable internally
- [ ] Admin can copy the generated link
- [ ] Admin can open the generated link
- [ ] Demo footer appears at the bottom
- [ ] Footer links to the canonical AnKa Surprise website
- [ ] Footer adapts to all three themes
- [ ] No customer instance ID/password is exposed
- [ ] Demo cannot modify a real customer instance
- [ ] Expiration behavior works if enabled
- [ ] Build passes successfully
- [ ] Mobile and desktop demo links work

---

# 71. FINAL DEMO EXPERIENCE

The public demo should feel like a real AnKa Surprise product.

The visitor should experience:

```text
Demo Link
   ↓
Opening
   ↓
Interactive Apology Journey
   ↓
Scratch Promises
   ↓
Memories
   ↓
Cuteness Meter
   ↓
Premium Features (Premium Demo)
   ↓
Final Apology
   ↓
AnKa Surprise Footer
   ↓
Create Your Own Surprise →
   ↓
https://ankasurprise.in
```

The visitor should never feel that they are looking at an unfinished development preview.

The demo is a **sales experience** and must maintain the same premium visual quality as the purchased product.


# 72. THEME SELECTION — PURCHASE FLOW, NOT CUSTOMIZER

IMPORTANT PRODUCT RULE:

The customer must NOT be given a theme selector inside the normal Customizer after purchasing.

The three themes are separate product variants.

The customer chooses the theme **before purchasing**.

Available products:

1. **Apology Surprise — Midnight Romance**
2. **Apology Surprise — Blush Pink**
3. **Apology Surprise — Lavender Dream**

The selected product/theme is permanently associated with the purchased surprise configuration.

---

## 72.1 PURCHASE FLOW

The correct flow is:

```text
AnKa Surprise Website
        ↓
Apology Surprise Product
        ↓
Choose Theme
        ↓
Preview Theme
        ↓
Choose Plan
        ↓
Purchase
        ↓
Surprise Created
        ↓
Customizer
        ↓
Customize Content
        ↓
Publish
```

The customer should NOT see:

```text
Customizer
    ↓
Choose Theme
```

The theme has already been selected as part of the purchase.

---

# 73. CUSTOMIZER THEME RESTRICTION

Remove the theme-selection control from the customer's Apology Surprise Customizer.

The Customizer must display the currently purchased theme as information only.

Example:

```text
Your Theme

Midnight Romance
```

It can show a small preview/badge, but there must be no:

- Theme dropdown
- Theme switcher
- Theme cards
- Change Theme button
- Theme selection API
- Theme replacement control

The customer customizes the content and experience, not the purchased product variant.

---

# 74. THEME IMMUTABILITY

Once the customer purchases:

```text
themeSlug = midnight-romance
```

or:

```text
themeSlug = blush-pink
```

or:

```text
themeSlug = lavender-dream
```

that theme becomes part of the purchased product.

The recipient experience must always use that theme.

The frontend must not allow the customer to change it.

The backend should also treat the purchased theme as an entitlement/product attribute rather than trusting a client-provided theme value.

---

# 75. ADMIN DEMO SYSTEM — THREE SEPARATE DEMO THEMES

The Admin Panel must contain three separate demo entries for the Apology Surprise.

Do NOT make the Admin choose a theme every time from a generic demo generator.

Instead, provide three clearly separated demo theme sections/cards:

### Demo — Midnight Romance

Button:

**Create Midnight Romance Demo**

---

### Demo — Blush Pink

Button:

**Create Blush Pink Demo**

---

### Demo — Lavender Dream

Button:

**Create Lavender Dream Demo**

Each demo generator is permanently associated with its theme.

---

# 76. ADMIN DEMO ARCHITECTURE

Recommended Admin structure:

```text
Admin Panel
│
└── Apology Surprise Demos
    │
    ├── Midnight Romance
    │   └── Create Demo
    │
    ├── Blush Pink
    │   └── Create Demo
    │
    └── Lavender Dream
        └── Create Demo
```

Each demo creation action automatically assigns the correct theme.

Example:

```text
Create Midnight Romance Demo
        ↓
themeSlug = "midnight-romance"
```

```text
Create Blush Pink Demo
        ↓
themeSlug = "blush-pink"
```

```text
Create Lavender Dream Demo
        ↓
themeSlug = "lavender-dream"
```

The Admin does not need to manually select the theme.

---

# 77. DEMO CONFIGURATION

Each Admin demo can have its own demo configuration.

For example:

```text
Midnight Romance Demo
    ├── Theme: Midnight Romance
    ├── Demo Content
    ├── Demo Memories
    ├── Demo Promises
    └── Premium Demo Features
```

```text
Blush Pink Demo
    ├── Theme: Blush Pink
    ├── Demo Content
    ├── Demo Memories
    ├── Demo Promises
    └── Premium Demo Features
```

```text
Lavender Dream Demo
    ├── Theme: Lavender Dream
    ├── Demo Content
    ├── Demo Memories
    ├── Demo Promises
    └── Premium Demo Features
```

The three demo environments remain separate.

---

# 78. DEMO LINK MUST NEVER REPRESENT A CUSTOMER PURCHASE

A Demo Link is ONLY a demonstration.

It must NOT be connected to:

- A customer's purchased product
- A customer's surprise instance
- A customer's private configuration
- A customer's uploaded memories
- A customer's account
- A customer's authentication
- A customer's instance ID
- A customer's password
- A customer's Live Control Panel

A demo must use dedicated demo/sample configuration.

---

# 79. PURCHASED SURPRISE VS DEMO

The architecture must clearly distinguish:

## DEMO

```text
mode = "demo"
```

Uses:

- Demo ID
- Demo configuration
- Demo theme
- Demo/sample content
- Demo assets
- Demo behavior

## CUSTOMER SURPRISE

```text
mode = "production"
```

Uses:

- Purchased product
- Purchased theme
- Customer configuration
- Customer uploaded assets
- Customer permissions
- Customer authentication
- Customer-specific data

These two systems must never be mixed.

---

# 80. IMPORTANT — CUSTOMER SURPRISE MUST NOT BE ADDED TO DEMO LINKS

When a customer purchases the product and creates their actual surprise:

DO NOT automatically create or append that surprise to an existing demo URL.

Do NOT turn:

```text
/demo/apology/abc123
```

into a customer's actual surprise.

Do NOT put customer configuration inside a demo link.

Do NOT expose customer-specific configuration through demo routes.

The demo link remains a demo permanently.

---

# 81. CUSTOMER SURPRISE URL

The purchased customer's actual surprise should use the application's normal production surprise route.

Conceptually:

```text
https://ankasurprise.in/surprise/<publicIdentifier>
```

The exact route should follow the existing production architecture.

It must be separate from:

```text
/demo/apology/<demoId>
```

---

# 82. ROUTE SEPARATION

Use clearly separated routing:

```text
/demo/apology/:demoId
```

for Admin-generated demos.

And the existing production surprise route for actual customer surprises.

Never allow a demo route to resolve a customer instance.

Never allow a customer route to accidentally load demo configuration.

---

# 83. DEMO FOOTER

The demo website should contain the AnKa Surprise promotional footer.

Example:

> Made with ❤️ by AnKa Surprise  
> Create your own surprise →

The CTA routes to the main AnKa Surprise website.

This footer is specifically for public demos and promotional/demo experiences.

---

# 84. CUSTOMER SURPRISE FOOTER

The customer-purchased surprise should NOT automatically be treated as a demo.

Do not add the Demo Config Generator or demo controls to the customer's surprise.

The customer experience must remain the purchased product.

If the business later decides to show a small AnKa Surprise brand link on purchased surprises, that should be a separate product/branding configuration and NOT be implemented as a demo mechanism.

---

# 85. ADMIN DEMO MANAGEMENT

The Admin Panel should show:

## Apology Surprise Demos

### Midnight Romance

- Theme: Midnight Romance
- Create Demo
- Existing Demo Links
- Copy
- Open
- Disable/Delete

### Blush Pink

- Theme: Blush Pink
- Create Demo
- Existing Demo Links
- Copy
- Open
- Disable/Delete

### Lavender Dream

- Theme: Lavender Dream
- Create Demo
- Existing Demo Links
- Copy
- Open
- Disable/Delete

Each section is independent.

---

# 86. DEMO CREATION FLOW

Example:

Admin clicks:

**Create Midnight Romance Demo**

System creates:

```text
demoId = generatedSecureId
mode = "demo"
productType = "apology"
themeSlug = "midnight-romance"
```

Then generates:

```text
https://ankasurprise.in/demo/apology/<demoId>
```

Similarly:

**Create Blush Pink Demo**

automatically uses:

```text
themeSlug = "blush-pink"
```

And:

**Create Lavender Dream Demo**

automatically uses:

```text
themeSlug = "lavender-dream"
```

---

# 87. NO THEME SWITCHING INSIDE DEMOS

The public demo itself should also not provide a theme switcher.

Each demo URL represents exactly one theme.

For example:

```text
/demo/apology/midnight-demo-id
```

always shows Midnight Romance.

```text
/demo/apology/blush-demo-id
```

always shows Blush Pink.

```text
/demo/apology/lavender-demo-id
```

always shows Lavender Dream.

If the Admin wants to demonstrate another theme, they open that theme's separate demo link.

---

# 88. PURCHASED THEME VERIFICATION

Before rendering a customer surprise:

```text
Load customer product
        ↓
Verify product entitlement
        ↓
Resolve purchased theme
        ↓
Load matching theme
        ↓
Render surprise
```

The frontend should not be able to change the theme by modifying local state or URL parameters.

For example, a customer should not be able to change:

```text
?theme=lavender-dream
```

and turn a purchased Blush Pink product into Lavender Dream.

The backend/product configuration remains authoritative.

---

# 89. UPDATED DEFINITION OF DONE

The theme/demo system is complete only when:

- [ ] Three themes exist as separate product variants.
- [ ] Theme is selected before purchase.
- [ ] Theme is associated with the purchased product.
- [ ] Customer Customizer has NO theme selector.
- [ ] Customer Customizer cannot change the purchased theme.
- [ ] Admin has three separate Apology demo sections.
- [ ] Admin can create Midnight Romance demo independently.
- [ ] Admin can create Blush Pink demo independently.
- [ ] Admin can create Lavender Dream demo independently.
- [ ] Each demo automatically uses its assigned theme.
- [ ] Public demo URLs contain demo configuration only.
- [ ] Customer purchases never become demo links.
- [ ] Customer configuration never appears inside demo URLs.
- [ ] Customer memories never appear in demos.
- [ ] Customer authentication never appears in demos.
- [ ] Customer instance IDs/passwords are never exposed through demos.
- [ ] Demo routes and production surprise routes are separated.
- [ ] Demo footer links to AnKa Surprise.
- [ ] Customer surprises are not automatically converted into demos.
- [ ] No theme switcher exists in the recipient experience.
- [ ] Backend validates the purchased theme/product entitlement.
- [ ] Basic/Premium entitlement remains separate from demo mode.


# 90. DATABASE SEED — APOLOGY SURPRISE PRODUCT CATALOG

The Apology Surprise must be represented in the product/category seed data.

The catalog should distinguish:

- Product category
- Product variants/themes
- Basic tier
- Premium tier
- Feature entitlements
- Usage limits
- Demo theme records

The customer chooses a theme BEFORE purchase.

The Customizer does not contain a theme selector.

---

# 91. CATEGORY SEED

Create one product category for this experience.

Recommended category:

```js
{
  key: "apology",
  slug: "apology-surprise",
  name: "Apology Surprise",
  description: "An interactive emotional apology experience for couples.",
  status: "ACTIVE",
  productType: "OCCASION_SURPRISE"
}
```

Recommended category metadata:

```text
key:
apology

slug:
apology-surprise

displayName:
Apology Surprise

type:
occasion

status:
ACTIVE
```

The exact field names must follow the existing database schema if equivalent fields already exist.

Do not create duplicate category systems if the application already has a category/product registry.

---

# 92. PRODUCT VARIANTS / THEME SEEDS

The three themes are separate purchasable product variants.

Seed:

### Variant 1

```text
key: apology-midnight-romance
slug: apology-midnight-romance
category: apology-surprise
themeSlug: midnight-romance
themeName: Midnight Romance
```

### Variant 2

```text
key: apology-blush-pink
slug: apology-blush-pink
category: apology-surprise
themeSlug: blush-pink
themeName: Blush Pink
```

### Variant 3

```text
key: apology-lavender-dream
slug: apology-lavender-dream
category: apology-surprise
themeSlug: lavender-dream
themeName: Lavender Dream
```

These are product variants, not Customizer themes.

---

# 93. PRODUCT PURCHASE MODEL

Conceptually:

```text
Category
   ↓
Apology Surprise
   ↓
Theme/Product Variant
   ↓
Basic or Premium Tier
   ↓
Purchase
   ↓
Customer Surprise Instance
```

Example:

```text
Apology Surprise
    └── Midnight Romance
          ├── Basic
          └── Premium
```

```text
Apology Surprise
    └── Blush Pink
          ├── Basic
          └── Premium
```

```text
Apology Surprise
    └── Lavender Dream
          ├── Basic
          └── Premium
```

---

# 94. BASIC TIER SEED

Recommended Basic tier:

```js
{
  key: "basic",
  name: "Basic",
  product: "apology-surprise",
  features: {
    interactiveJourney: true,
    apologySections: true,
    scratchPromises: true,
    memories: true,
    cutenessMeter: true,
    cutenessImageUpload: false,
    voiceApology: false,
    videoApology: false,
    liveControlPanel: false,
    realTimeRecipientResponse: false,
    advancedAnimations: false,
    premiumCustomization: false
  }
}
```

Basic should be a complete product, not a restricted preview.

---

# 95. PREMIUM TIER SEED

Recommended Premium tier:

```js
{
  key: "premium",
  name: "Premium",
  product: "apology-surprise",
  features: {
    interactiveJourney: true,
    apologySections: true,
    scratchPromises: true,
    memories: true,
    cutenessMeter: true,
    cutenessImageUpload: true,
    voiceApology: true,
    videoApology: true,
    liveControlPanel: true,
    realTimeRecipientResponse: true,
    advancedAnimations: true,
    premiumCustomization: true
  }
}
```

Premium includes everything in Basic plus Premium features.

---

# 96. FEATURE ENTITLEMENT DEFINITIONS

Use stable feature keys instead of checking display names throughout the application.

Recommended feature keys:

```text
apology.journey
apology.no_excuses
apology.handwritten_notes
apology.scratch_promises
apology.memories
apology.cuteness_meter
apology.cuteness_image_upload
apology.voice
apology.video
apology.live_control
apology.realtime_response
apology.advanced_animations
apology.advanced_customization
```

Example:

```js
features: [
  "apology.journey",
  "apology.no_excuses",
  "apology.handwritten_notes",
  "apology.scratch_promises",
  "apology.memories",
  "apology.cuteness_meter"
]
```

Premium adds:

```text
apology.cuteness_image_upload
apology.voice
apology.video
apology.live_control
apology.realtime_response
apology.advanced_animations
apology.advanced_customization
```

---

# 97. DATABASE LIMITS

Limits must be stored as product/tier entitlements instead of hardcoding them separately inside every React component.

Recommended Basic limits:

```js
limits: {
  memories: 5,
  promises: 5,
  handwrittenNotes: 5,
  customApologySections: 1,
  voiceFiles: 0,
  videoFiles: 0,
  cutenessImageUploads: 0,
  videoDurationSeconds: 0,
  audioDurationSeconds: 0
}
```

Recommended Premium limits:

```js
limits: {
  memories: 15,
  promises: 10,
  handwrittenNotes: 10,
  customApologySections: 1,
  voiceFiles: 1,
  videoFiles: 1,
  cutenessImageUploads: 1,
  videoDurationSeconds: 180,
  audioDurationSeconds: 300
}
```

These are the initial product limits and should be configurable from the product/tier seed rather than hardcoded in UI components.

---

# 98. STORAGE LIMITS

Recommended initial limits:

## Basic

```text
Memory images: 5
Voice: Not available
Video: Not available
Cuteness image: Not available
```

## Premium

```text
Memory images: 15
Voice files: 1
Video files: 1
Cuteness image: 1
```

Recommended media constraints:

```text
Memory image:
max 10 MB each

Cuteness image:
max 10 MB

Voice:
max 25 MB
max duration 5 minutes

Video:
max 150 MB
max duration 3 minutes
```

The exact storage/provider limits may be adjusted to match the existing infrastructure.

The database entitlement remains the source of the application-level limit.

---

# 99. CONTENT LIMITS

Recommended initial content limits:

```text
Opening heading:
150 characters

Opening supporting text:
500 characters

What I Did:
2,000 characters

What I Should Have Done:
2,000 characters

No Excuses card:
500 characters each

Things I Should Have Said:
1,000 characters per note

Promise:
300 characters each

Memory title:
100 characters

Memory description:
1,500 characters

Final apology:
5,000 characters

Creator name:
100 characters
```

These limits should be validated on both frontend and backend.

---

# 100. DEMO THEME SEED

Create three separate demo theme records.

These are NOT customer product instances.

Recommended:

### Midnight Romance Demo

```js
{
  key: "demo-apology-midnight-romance",
  type: "DEMO",
  productType: "apology-surprise",
  themeSlug: "midnight-romance",
  tier: "premium-demo",
  status: "ACTIVE"
}
```

### Blush Pink Demo

```js
{
  key: "demo-apology-blush-pink",
  type: "DEMO",
  productType: "apology-surprise",
  themeSlug: "blush-pink",
  tier: "premium-demo",
  status: "ACTIVE"
}
```

### Lavender Dream Demo

```js
{
  key: "demo-apology-lavender-dream",
  type: "DEMO",
  productType: "apology-surprise",
  themeSlug: "lavender-dream",
  tier: "premium-demo",
  status: "ACTIVE"
}
```

The Admin Panel should expose these as three separate demo entries.

---

# 101. DEMO TIER

The demo should demonstrate the Premium experience.

Recommended:

```text
demo tier:
premium-demo
```

It can expose sample versions of:

- Image Cuteness Meter
- Voice
- Video
- Advanced memories
- Premium animations
- Live-response demonstration

However, the demo must use only sample/demo data.

Never use a customer's purchased tier or customer data inside a demo.

---

# 102. DEMO FEATURE CONFIGURATION

Recommended demo features:

```js
{
  interactiveJourney: true,
  scratchPromises: true,
  memories: true,
  cutenessMeter: true,
  cutenessImageUpload: true,
  voiceApology: true,
  videoApology: true,
  advancedAnimations: true,
  liveControlPanelDemo: true
}
```

The Live Control Panel demo must use an isolated demo event channel/context.

It must never connect to a customer's production socket/session.

---

# 103. DEMO LIMITS

Recommended demo limits:

```js
limits: {
  memories: 5,
  promises: 5,
  handwrittenNotes: 5,
  cutenessImageUploads: 1,
  voiceFiles: 1,
  videoFiles: 1,
  videoDurationSeconds: 60,
  audioDurationSeconds: 120
}
```

The purpose is to demonstrate the feature without creating an unrestricted media-upload endpoint.

---

# 104. PRODUCT SEED RELATIONSHIP

Recommended conceptual database relationship:

```text
Category
  |
  +-- Apology Surprise
        |
        +-- Midnight Romance
        |      +-- Basic
        |      +-- Premium
        |
        +-- Blush Pink
        |      +-- Basic
        |      +-- Premium
        |
        +-- Lavender Dream
               +-- Basic
               +-- Premium
```

Separately:

```text
Demo Catalog
  |
  +-- Midnight Romance Demo
  +-- Blush Pink Demo
  +-- Lavender Dream Demo
```

The Demo Catalog must not point to customer purchase records.

---

# 105. PURCHASED INSTANCE RECORD

When a customer purchases the product, the resulting surprise instance should retain the purchased product/tier/theme information.

Conceptually:

```js
{
  productCategory: "apology-surprise",
  productVariant: "apology-midnight-romance",
  themeSlug: "midnight-romance",
  tier: "premium",
  mode: "production"
}
```

For Blush Pink:

```js
{
  productCategory: "apology-surprise",
  productVariant: "apology-blush-pink",
  themeSlug: "blush-pink",
  tier: "basic",
  mode: "production"
}
```

The actual field names must follow the existing schema.

Do not introduce duplicate fields if equivalent product/tier/theme fields already exist.

---

# 106. LIMIT ENFORCEMENT FLOW

Every limited feature should follow:

```text
User Action
    ↓
Read Product/Tier Entitlement
    ↓
Read Limit
    ↓
Check Current Usage
    ↓
Allow / Reject
    ↓
Persist
```

Example:

```text
Add Memory
    ↓
Premium?
    ↓
memory limit = 15
    ↓
current memories = 14
    ↓
Allow
```

If:

```text
current memories = 15
```

return a clear application-level limit response.

Example:

> You've reached the memory limit for your plan.

Do not expose raw database errors.

---

# 107. BACKEND IS AUTHORITATIVE

The frontend can use tier information to show or hide UI.

However, the backend must validate:

- Product variant
- Theme
- Tier
- Feature entitlement
- Memory limit
- Promise limit
- Upload limit
- Voice limit
- Video limit
- Media size
- Media duration
- Live Control Panel entitlement

Do not rely on frontend checks alone.

---

# 108. SEED IDEMPOTENCY

The seed script must be safe to run multiple times.

Use stable keys/slugs such as:

```text
apology-surprise
apology-midnight-romance
apology-blush-pink
apology-lavender-dream
basic
premium
demo-apology-midnight-romance
demo-apology-blush-pink
demo-apology-lavender-dream
```

Running the seed again should update/upsert existing records rather than create duplicates.

---

# 109. SEED VALIDATION

After seeding, verify:

```text
Category:
1 Apology Surprise

Variants:
3

Tiers per variant:
2

Customer purchasable combinations:
6

Demo theme configurations:
3
```

Expected product matrix:

| Theme | Basic | Premium | Demo |
|---|---:|---:|---:|
| Midnight Romance | ✓ | ✓ | ✓ |
| Blush Pink | ✓ | ✓ | ✓ |
| Lavender Dream | ✓ | ✓ | ✓ |

Total:

```text
3 themes × 2 tiers = 6 purchasable product combinations
3 separate demo configurations
```

---

# 110. IMPORTANT DISTINCTION

There are three different concepts and they must not be mixed:

## Product Theme

Chosen BEFORE purchase.

```text
Midnight Romance
Blush Pink
Lavender Dream
```

## Customer Tier

Chosen as part of the purchase.

```text
Basic
Premium
```

## Demo Theme

Admin-controlled promotional configuration.

```text
Midnight Romance Demo
Blush Pink Demo
Lavender Dream Demo
```

The customer Customizer changes neither the product theme nor the purchased tier.

---

# 111. CUSTOMER CUSTOMIZER RULE

The Customizer should read:

```text
themeSlug
tier
featureEntitlements
limits
```

from the customer's purchased configuration.

It should then display only the controls allowed by that configuration.

Example:

```text
Purchased:
Blush Pink + Premium
```

Customizer:

```text
Theme:
Blush Pink
(locked)

Plan:
Premium

Available:
✓ Memories
✓ Scratch Promises
✓ Cuteness Image
✓ Voice
✓ Video
✓ Advanced customization
```

There is no:

```text
Change Theme
```

button.

---

# 112. ADMIN SEED / DEMO RULE

Admin demo creation must never require selecting a customer tier.

Each demo theme is a fixed promotional Premium-style demo.

Admin selects the demo theme by entering its dedicated demo section:

```text
Create Midnight Romance Demo
Create Blush Pink Demo
Create Lavender Dream Demo
```

The demo system automatically applies:

```text
mode = demo
tier = premium-demo
themeSlug = fixed theme
```

---

# 113. FINAL DATABASE ARCHITECTURE CHECK

Before production launch, verify that:

- [ ] Apology category exists.
- [ ] Three theme variants exist.
- [ ] Basic tier exists.
- [ ] Premium tier exists.
- [ ] Six purchasable theme/tier combinations exist.
- [ ] Feature entitlements are stored centrally.
- [ ] Limits are stored centrally.
- [ ] Limits are enforced by backend.
- [ ] Three independent demo theme records exist.
- [ ] Demo records are separate from customer instances.
- [ ] Demo records do not reference customer data.
- [ ] Customer purchase stores the selected theme.
- [ ] Customer purchase stores the selected tier.
- [ ] Customizer cannot change theme.
- [ ] Demo cannot become a customer instance.
- [ ] Customer instance cannot become a demo.
- [ ] Seed is idempotent.
- [ ] No duplicate categories/variants/tiers are created by repeated seed execution.
