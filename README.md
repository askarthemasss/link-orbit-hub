# Link Orbit Hub

You are a world-class product designer, UX architect, SaaS engineer, brand designer, and full-stack application developer.

Build a polished, production-quality web application called "LinkOrbit".

PRODUCT TAGLINE:
"One link. Everything around you."

PRODUCT CONCEPT:
LinkOrbit is a simple, modern, responsive link-in-bio platform.

The core idea is extremely simple:

A user creates an account → creates their personal profile → adds useful links → gets one public LinkOrbit URL → shares that single URL anywhere.

Example:

linkorbit.app/askar

When someone visits the public profile, they see the person's profile image, name, short bio, social links, and a beautifully designed list of their links.

This is inspired by the general concept of Linktree, but DO NOT simply copy Linktree's UI, branding, layout, terminology, or visual identity.

LinkOrbit should have its own visual identity, interaction patterns, and personality.

The product should feel like a modern startup SaaS product: simple, fast, elegant, responsive, and extremely easy to understand.

IMPORTANT MVP PRINCIPLE:

Do NOT overbuild the first version.

The purpose of this MVP is to validate the fundamental product:

CREATE PROFILE → ADD LINKS → SHARE PROFILE.

Everything else should be secondary.

==================================================
1. PRODUCT GOAL
==================================================

Create the simplest possible platform for people who need one URL to represent their online presence.

Typical users:

• Developers
• Designers
• Creators
• Freelancers
• Students
• Influencers
• Entrepreneurs
• Artists
• Small businesses
• Professionals
• Anyone with multiple online profiles

A user may have:

LinkedIn
GitHub
Instagram
YouTube
Portfolio
Personal website
X/Twitter
Medium
Behance
Dribbble
Resume
Blog
Contact page

Instead of sharing 10 different URLs, the user shares one LinkOrbit profile URL.

The product should communicate this concept immediately.

==================================================
2. MVP USER JOURNEY
==================================================

The complete MVP flow should be:

1. Visitor lands on homepage.
2. Visitor understands the product immediately.
3. Visitor clicks "Create your LinkOrbit".
4. User signs up.
5. User creates their profile.
6. User chooses a username.
7. User uploads an optional profile image.
8. User enters name and bio.
9. User adds links.
10. User reorders links.
11. User previews their public profile.
12. User publishes the profile.
13. System generates a public URL.
14. User copies and shares the URL.
15. Anyone can visit the public profile.

Keep this flow extremely simple.

Avoid unnecessary onboarding screens.

==================================================
3. AUTHENTICATION
==================================================

Implement proper authentication.

Required:

• Sign up
• Login
• Logout
• Password reset
• Persistent authenticated session

Use Supabase authentication if appropriate for the Lovable environment.

Optional:

• Google authentication

Do not require social login for MVP.

After authentication, users should be redirected to their dashboard.

Authentication must be secure.

A user must only be able to modify their own profile and links.

==================================================
4. USER PROFILE
==================================================

Each authenticated user should have one primary public profile.

Profile fields:

• Username
• Display name
• Bio
• Profile image
• Optional location
• Optional website

Username requirements:

• Unique
• URL-safe
• Lowercase
• No spaces
• Allow letters, numbers, hyphens, and underscores

Example:

linkorbit.app/askar

The username should be validated while the user types.

Show:

✓ Username available

or:

✕ Username already taken

The public profile URL should be easy to copy.

==================================================
5. LINK MANAGEMENT
==================================================

This is the most important feature of the MVP.

Users should be able to add links.

Each link contains:

• Title
• URL
• Optional icon/platform type
• Active/inactive state

Example:

GitHub
https://github.com/example

LinkedIn
https://linkedin.com/in/example

Portfolio
https://example.com

YouTube
https://youtube.com/@example

The user should be able to:

• Add link
• Edit link
• Delete link
• Enable/disable link
• Reorder links

==================================================
6. ADD LINK EXPERIENCE
==================================================

Create a clean "Add Link" interaction.

When the user clicks:

"+ Add Link"

Open a modal or inline editor.

Fields:

Link title
URL

Optional platform selector:

Website
LinkedIn
GitHub
Instagram
YouTube
X
Facebook
TikTok
Discord
Telegram
Email
Other

If a known platform is selected, automatically use the appropriate icon.

The system should validate URLs.

Do not allow malformed URLs.

Provide helpful validation messages.

==================================================
7. DRAG AND DROP
==================================================

Users must be able to reorder links.

Use drag-and-drop on desktop.

On mobile, provide a touch-friendly alternative.

The ordering should persist in the database.

Example:

1. Portfolio
2. GitHub
3. LinkedIn
4. YouTube

If the user changes the order:

1. GitHub
2. Portfolio
3. LinkedIn
4. YouTube

Save the new order automatically.

==================================================
8. LIVE PROFILE PREVIEW
==================================================

One of the most important UX features:

Show a real-time preview of the public profile while the user edits it.

Desktop layout:

LEFT:
Editor

RIGHT:
Phone-like public profile preview

The preview should update immediately when the user changes:

• Name
• Bio
• Profile image
• Links
• Link order

On smaller screens, provide a toggle:

EDITOR | PREVIEW

The user should never need to publish repeatedly just to see what the profile looks like.

==================================================
9. PUBLIC PROFILE
==================================================

Every published profile should have a public URL:

/username

Example:

/askar

The public page should NOT require authentication.

It should be extremely fast.

Public profile layout:

Profile image

Display name

Optional verified-style visual indicator if appropriate, but do NOT falsely imply verification.

Bio

Social/profile icons

Link buttons

Optional footer branding:

"Create your LinkOrbit"

The page should feel beautiful even with only 2–3 links.

==================================================
10. PUBLIC PROFILE DESIGN
==================================================

Do not create a generic list of boring buttons.

Each link should feel like a polished interactive card.

Possible interaction:

Normal:
Subtle card

Hover:
Slight elevation + glow

Click:
Smooth interaction

Keep animations subtle.

Do not make every element bounce, rotate, or glow excessively.

The design should feel premium rather than gimmicky.

==================================================
11. RESPONSIVE DESIGN
==================================================

The application must be fully responsive.

Desktop:
Professional dashboard with editor + preview.

Tablet:
Adapt the editor and preview intelligently.

Mobile:
Prioritize usability.

Public profiles must be optimized especially well for mobile because most profile links will likely be opened from social media apps on phones.

The public profile should:

• Load quickly
• Fit the viewport naturally
• Have large touch targets
• Avoid horizontal scrolling
• Have readable typography
• Maintain comfortable spacing

==================================================
12. DASHBOARD
==================================================

After login, show a simple dashboard.

Dashboard should contain:

Header:

"Your LinkOrbit"

Public profile URL

"Copy link" button

"View profile" button

Main area:

Profile editor

Link manager

Live preview

Do not overload the dashboard with analytics or advanced settings in V1.

==================================================
13. DASHBOARD NAVIGATION
==================================================

Keep navigation minimal.

Possible navigation:

Profile
Links
Settings

Avoid creating unnecessary pages.

The product should feel like one focused tool rather than a giant SaaS platform.

==================================================
14. HOMEPAGE
==================================================

Create a beautiful landing page.

The homepage must explain the product in seconds.

Hero headline:

"One link. Everything around you."

Supporting copy:

"Bring your portfolio, socials, projects, and everything you want to share into one simple profile."

Primary CTA:

"Create your LinkOrbit"

Secondary CTA:

"Explore an example"

Include an interactive/example profile preview.

Show the fundamental workflow:

Create → Add → Share

==================================================
15. HOMEPAGE SECTIONS
==================================================

Keep the homepage concise.

Recommended sections:

1. Hero
2. How it works
3. Example profile
4. Why LinkOrbit
5. CTA
6. Footer

Do not create a huge marketing website.

==================================================
16. WHY LINKORBIT
==================================================

Communicate simple benefits:

ONE URL
Everything you want people to find.

EASY TO EDIT
Update your links anytime.

BEAUTIFUL BY DEFAULT
A professional profile without designing a website.

SHARE ANYWHERE
Use your LinkOrbit URL in social bios, resumes, emails, business cards, and messages.

==================================================
17. SPACE VISUAL IDENTITY
==================================================

Use a subtle space-inspired visual identity.

The product should feel like:

"Your little corner of the internet."

Background:

Deep space-inspired background.

Use:

• Very subtle stars
• Deep navy/black tones
• Occasional soft cosmic gradients
• Subtle nebula-like lighting

IMPORTANT:

The stars must NEVER interfere with content.

Do NOT put bright stars directly behind important text.

Do NOT create a visually noisy background.

Do NOT reduce contrast to achieve the space aesthetic.

The UI must remain extremely readable.

==================================================
18. STAR BACKGROUND
==================================================

Implement a subtle star field.

Stars can:

• Slowly twinkle
• Slightly move
• Have varying opacity

Animations must be lightweight.

Avoid heavy particle systems that negatively impact performance.

Respect:

prefers-reduced-motion

If the user has reduced motion enabled, disable or significantly reduce background animation.

==================================================
19. GLASS / COSMIC UI
==================================================

Use subtle glassmorphism where appropriate.

Panels can have:

• Slight transparency
• Backdrop blur
• Soft border
• Very subtle glow

Do NOT overuse glassmorphism.

Content should remain readable.

The space theme is an accent, not the product itself.

==================================================
20. COLOR SYSTEM
==================================================

Suggested foundation:

Background:
Deep space black / navy

Surface:
Dark translucent blue

Text:
White / near-white

Secondary text:
Muted cool gray

Accent:
Electric blue / cyan / violet

Success:
A clear accessible green

Error:
A clear accessible red

Make sure all important text passes accessible contrast requirements.

==================================================
21. TYPOGRAPHY
==================================================

Use a modern sans-serif font.

Typography should feel:

Modern
Technical
Friendly
Premium

Headings should have strong hierarchy.

Avoid overly futuristic fonts that reduce readability.

==================================================
22. DATABASE
==================================================

Use Supabase/PostgreSQL if appropriate.

Suggested tables:

profiles

Fields:

id
user_id
username
display_name
bio
avatar_url
location
website_url
is_published
created_at
updated_at

links

Fields:

id
profile_id
title
url
platform
display_order
is_active
created_at
updated_at

The database must enforce ownership through Row Level Security.

Users must only be able to modify their own profile and links.

Public profiles should only expose information intended to be public.

==================================================
23. ROW LEVEL SECURITY
==================================================

Implement proper Supabase RLS policies.

Authenticated user:

Can read/write their own profile.

Can create/update/delete their own links.

Public visitor:

Can read only published profile data.

Public visitor must NOT be able to access private user information.

Do not rely only on frontend authorization.

Authorization must be enforced at database/API level.

==================================================
24. PROFILE PUBLISHING
==================================================

A user should have control over whether their profile is public.

State:

Draft

Published

If unpublished:

Public URL should not expose the profile.

If published:

Public profile becomes accessible.

Provide a clear toggle:

"Publish profile"

==================================================
25. URL ROUTING
==================================================

Implement routes similar to:

/
 /login
 /signup
 /dashboard
 /settings
 /:username

The public username route must not conflict with system routes.

Reserve system paths such as:

login
signup
dashboard
settings
api
admin

Prevent users from choosing reserved usernames.

==================================================
26. SETTINGS
==================================================

Keep settings minimal in V1.

Include:

Display name

Username

Bio

Profile image

Website

Publish/unpublish

Account logout

Account deletion

Do not create unnecessary settings.

==================================================
27. PROFILE IMAGE
==================================================

Allow users to upload a profile image.

Use Supabase Storage or the appropriate storage mechanism.

Requirements:

• Image preview
• Upload state
• Replace image
• Remove image

Optimize uploaded images where possible.

Do not allow enormous uncompressed files.

==================================================
28. LINK ICONS
==================================================

Automatically identify common platforms from URLs where possible.

Examples:

github.com → GitHub

linkedin.com → LinkedIn

youtube.com → YouTube

instagram.com → Instagram

x.com → X

facebook.com → Facebook

tiktok.com → TikTok

telegram.me / t.me → Telegram

For unknown URLs:

Use a generic link icon.

Do not depend on external APIs just to identify a simple platform.

==================================================
29. LINK VALIDATION
==================================================

Validate URLs before saving.

Accept:

https://example.com

https://github.com/user

https://linkedin.com/in/user

etc.

Normalize URLs where appropriate.

Prevent unsafe protocols such as:

javascript:

data:

file:

Only allow safe HTTP/HTTPS URLs.

==================================================
30. ACCESSIBILITY
==================================================

The application must be accessible.

Requirements:

• Keyboard navigation
• Visible focus states
• Proper labels
• Semantic HTML
• Accessible buttons
• Accessible modals
• Screen-reader-friendly controls
• Sufficient color contrast

Drag-and-drop must have an accessible alternative.

Never make drag-and-drop the ONLY way to reorder links.

==================================================
31. SEO
==================================================

Public profiles should have dynamic metadata.

For example:

Title:
Askar — LinkOrbit

Description:
Explore Askar's links, projects, and online presence.

Use the profile name and bio where appropriate.

Public profile pages should be indexable only if the profile is intended to be public.

Provide appropriate Open Graph metadata.

When a public profile is shared on social media, generate a useful preview.

==================================================
32. PERFORMANCE
==================================================

Performance is a major priority.

Public profiles should load extremely quickly.

Avoid:

• Huge JavaScript bundles
• Heavy animation libraries unless necessary
• Excessive API requests
• Unoptimized images

Use lazy loading where appropriate.

Keep the public profile lightweight.

==================================================
33. ERROR STATES
==================================================

Design proper states for:

Loading

Empty profile

No links

Invalid username

Username unavailable

Profile not found

Profile unpublished

Failed image upload

Failed link save

Authentication failure

Network error

Each state should provide a useful next action.

Never show raw database errors to users.

==================================================
34. EMPTY STATES
==================================================

New user dashboard:

"Your Orbit is empty."

"Add your first link and start building your profile."

CTA:

"+ Add your first link"

Public profile with no links:

Show profile information and a tasteful message such as:

"Links are coming soon."

Do not make the empty state look broken.

==================================================
35. MICROINTERACTIONS
==================================================

Use subtle interactions:

Buttons respond naturally.

Cards gently lift on hover.

Drag-and-drop provides visual feedback.

Save states should be clear.

For example:

"Saved"

Do not use excessive animation.

The product should feel fast.

==================================================
36. AUTOSAVE
==================================================

Prefer automatic saving for profile edits where practical.

When a user edits:

Name
Bio
Links
Order

Persist changes.

Show a subtle save state:

Saving...

Saved

Avoid forcing users to constantly click a giant Save button.

For destructive actions, require confirmation.

==================================================
37. DELETE CONFIRMATION
==================================================

When deleting a link:

Show a confirmation only when appropriate.

Example:

"Delete this link?"

"Your link will be removed from your public profile."

Buttons:

Cancel

Delete

For account deletion, require a stronger confirmation.

==================================================
38. SECURITY
==================================================

Follow secure application practices.

Never expose:

• Supabase service role keys
• Private environment variables
• Authentication secrets

Use frontend-safe environment variables only where appropriate.

Use server-side functionality for operations that require secrets.

Validate user input on both client and server where applicable.

==================================================
39. PRODUCT ANALYTICS
==================================================

Do NOT build advanced analytics in V1.

However, structure the application so analytics can be added later.

Future metrics might include:

Profile views

Link clicks

Top links

Referrers

Devices

But do not allow analytics to complicate the MVP.

==================================================
40. FUTURE ROADMAP
==================================================

Design the architecture so future features can be added without rebuilding the product.

Potential future features:

• Link click analytics
• Themes
• Custom colors
• Custom backgrounds
• Custom domains
• Social icons
• Embedded media
• Newsletter signup
• Contact form
• QR code
• Multiple profiles
• Team profiles
• Profile scheduling
• SEO controls
• Premium templates

But NONE of these should distract from the V1 implementation.

==================================================
41. IMPORTANT PRODUCT PHILOSOPHY
==================================================

This product should follow one principle:

"SIMPLE BY DEFAULT."

Do not add features just because competitors have them.

The MVP should answer one question:

"Can I create one beautiful page containing all my important links in under two minutes?"

If yes, the product is successful.

==================================================
42. QUALITY BAR
==================================================

Do not produce a generic AI-generated SaaS dashboard.

Avoid:

• Excessive gradients
• Random decorative elements
• Giant empty spaces
• Generic stock illustrations
• Overcomplicated navigation
• Unnecessary dashboards
• Too many cards
• Excessive animations
• Poor mobile layouts

The result should look like a real startup product designed by an experienced product team.

==================================================
43. PUBLIC PROFILE EXPERIENCE
==================================================

The public profile is the most important visual surface.

Prioritize it heavily.

When someone opens:

linkorbit.app/username

they should immediately understand whose profile they are viewing and what links are available.

Suggested hierarchy:

Profile image

Display name

Bio

Social links

Main link cards

Optional LinkOrbit footer

The design should be centered and elegant.

On desktop, keep the profile width constrained so it does not become an enormous horizontal page.

On mobile, use the full available width with comfortable margins.

==================================================
44. PROFILE THEMING
==================================================

For V1, provide a single carefully designed default theme.

Do NOT create a theme marketplace yet.

The default theme should combine:

Deep space

Subtle stars

Clean typography

Cosmic accent

Elegant link cards

This creates a recognizable LinkOrbit identity.

Future versions can introduce multiple themes.

==================================================
45. COPYWRITING
==================================================

Keep product copy concise.

Avoid corporate SaaS language.

Use human language.

Examples:

"Your links. One orbit."

"Everything worth sharing, in one place."

"Build your corner of the internet."

"Share one link. Let people find the rest."

Use clear CTA labels:

Create your LinkOrbit

Add link

Copy profile link

View profile

Publish profile

==================================================
46. FINAL TECHNICAL EXPECTATION
==================================================

Use the best architecture naturally supported by Lovable.

Prefer:

React + TypeScript

Tailwind CSS

shadcn/ui or equivalent high-quality component system

Supabase

PostgreSQL

Supabase Auth

Supabase Storage

Use reusable components.

Keep the codebase organized.

Avoid putting the entire application into one enormous component.

Separate:

Authentication

Profile management

Link management

Public profile rendering

Reusable UI

Database operations

Validation

==================================================
47. COMPONENT ARCHITECTURE
==================================================

Create reusable components such as:

Navbar

AuthForm

ProfileEditor

ProfilePreview

LinkEditor

LinkList

LinkCard

AddLinkModal

UsernameInput

ProfileImageUploader

PublicProfile

StarBackground

DashboardLayout

EmptyState

LoadingState

ErrorState

Do not duplicate components unnecessarily.

==================================================
48. FINAL BUILD INSTRUCTIONS
==================================================

Build the application completely rather than creating only static mockups.

The following must actually work:

✓ Authentication
✓ Database
✓ Profile creation
✓ Username uniqueness
✓ Profile editing
✓ Profile image upload
✓ Add links
✓ Edit links
✓ Delete links
✓ Enable/disable links
✓ Reorder links
✓ Autosave
✓ Publish/unpublish
✓ Public profile URL
✓ Responsive public profile
✓ Responsive dashboard
✓ Secure user data
✓ Supabase RLS
✓ Proper loading states
✓ Proper error handling

Do not fake database functionality with localStorage if Supabase is available.

Do not hardcode a single demo profile.

The application must support multiple users.

==================================================
49. DEFINITION OF DONE
==================================================

Consider V1 complete only when a new user can perform this entire journey:

1. Visit LinkOrbit.
2. Click Create your LinkOrbit.
3. Register.
4. Choose a unique username.
5. Add their name.
6. Add a bio.
7. Upload a profile picture.
8. Add LinkedIn.
9. Add GitHub.
10. Add their portfolio.
11. Reorder the links.
12. See the live preview.
13. Publish their profile.
14. Copy their LinkOrbit URL.
15. Open the URL in an incognito browser.
16. See the public profile without logging in.
17. Click the links successfully.
18. Return to the dashboard.
19. Edit a link.
20. See the public profile update.

All of this should work reliably.

==================================================
50. FINAL PRODUCT EXPERIENCE
==================================================

The finished product should feel like:

A tiny personal website builder.

Not a complicated SaaS.

Not a social network.

Not a full website builder.

Not an analytics platform.

Just an exceptionally good place to put everything you want to share.

The strongest feeling should be:

"I can set this up in two minutes."

The visual identity should make LinkOrbit memorable.

The space theme should communicate the idea of an individual's own little orbit on the internet.

The final product should be:

• Simple
• Fast
• Beautiful
• Responsive
• Secure
• Accessible
• Easy to understand
• Easy to maintain
• Ready for real users

Build the complete MVP with production-quality UX and engineering practices.

Prioritize working functionality over decorative complexity.

Do not add unnecessary features simply to make the application look larger.

Make the small product exceptionally good.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7d180990-186f-4fca-8a5b-4f23cb7549dc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
