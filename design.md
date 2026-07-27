# Ali Aslanbayli Portfolio Design Specification
Version: 1.0

This document is the single source of truth for implementing the portfolio website.

The goal is NOT to build a SaaS landing page or a generic developer portfolio. The goal is to build a premium, minimal, modern AI engineer portfolio inspired by the visual language of Linear, Vercel, Raycast, OpenAI, and the attached inspiration.

Everything must feel clean, spacious, intentional, and extremely polished.

The site is completely static and will be hosted on GitHub Pages.

------------------------------------------------------------------------------

# TECHNOLOGY

Framework:
- Astro

Styling:
- TailwindCSS
- CSS variables
- Minimal custom CSS

Animations:
- Framer Motion (optional)
OR
- CSS transitions + Intersection Observer

Content

Portfolio content:
content/vault/projects/*.md

Public blog posts:
content/vault/blog/public/*.md

Experience and profile:
content/vault/experience.md
content/vault/profile.md

Images:
public/images/

No backend.

------------------------------------------------------------------------------

# DESIGN PRINCIPLES

The website should feel:

• premium
• minimal
• modern
• engineering-focused
• calm
• high-end

Avoid:

❌ loud gradients
❌ excessive animations
❌ neon cyberpunk
❌ clutter
❌ giant paragraphs
❌ glass everywhere

Instead:

✓ whitespace
✓ typography
✓ subtle glow
✓ subtle gradients
✓ clean cards
✓ crisp spacing

Everything should breathe.

------------------------------------------------------------------------------

# COLOR SYSTEM

Background

Primary Background

#090B12

Secondary Surface

#10141D

Card

#121824

Elevated Card

#181F2B

Border

rgba(255,255,255,.08)

Border Hover

rgba(255,255,255,.15)

Primary Text

#F7F8FB

Secondary Text

#A5ADBC

Muted

#697287

Accent Orange

#FF6B3D

Accent Purple

#C56CFF

Accent Blue

#62A7FF

Success

#4ADE80

------------------------------------------------------------------------------

# GRADIENTS

Hero Gradient

linear-gradient(
135deg,
#FF6B3D 0%,
#D26CFF 60%,
#7A6FFF 100%
)

Button Hover

Orange -> Purple

Text Gradient

Orange -> Purple

Use ONLY for:

Hero title

Buttons

Small highlights

Never use gradients for body text.

------------------------------------------------------------------------------

# BACKGROUND

Entire website background:

Solid #090B12

Overlay:

Very subtle grid

opacity: 6%

Behind Hero:

Large orange radial gradient

top left

blur: 180px

opacity: .22

Large purple radial gradient

right side

blur: 220px

opacity: .18

Add very subtle animated movement

Duration:

30s

Infinite

Extremely slow.

Do NOT animate the grid.

------------------------------------------------------------------------------

# TYPOGRAPHY

Heading Font

General Sans

Fallback

Inter

Body

Inter

Weights

400

500

600

700

800

Hero

Desktop

80px

Line height

0.95

Weight

800

Tablet

64px

Mobile

44px

Section Heading

36px

Body

18px

Small

15px

Buttons

16px

------------------------------------------------------------------------------

# SPACING SYSTEM

8

12

16

24

32

48

64

80

96

128

Max Content Width

1280px

Text Width

650px

Page Horizontal Padding

Desktop

48px

Tablet

32px

Mobile

24px

Vertical Section Padding

120px desktop

96 tablet

80 mobile

------------------------------------------------------------------------------

# BORDER RADIUS

Buttons

16px

Cards

24px

Small Cards

18px

Images

24px

Profile

50%

------------------------------------------------------------------------------

# SHADOWS

Cards

0 10px 40px rgba(0,0,0,.25)

Hover

0 20px 60px rgba(0,0,0,.45)

Glow

0 0 60px rgba(198,108,255,.10)

------------------------------------------------------------------------------

# NAVIGATION

Height

80px

Sticky

Yes

Top

0

Desktop Layout

Logo

Projects

Blog

Github

Resume

Mobile

Logo

Hamburger

Menu slides from right

Blur background

Navbar Background

Initially transparent

After scrolling

backdrop-filter: blur(18px)

background:

rgba(9,11,18,.65)

border-bottom

1px solid rgba(255,255,255,.06)

------------------------------------------------------------------------------

# HERO

Height

100vh

Minimum

820px

Desktop Layout

------------------------------------------------

Text Left

Image Right

------------------------------------------------

LEFT

Small label

AI ENGINEER

Gradient Hero Title

Building AI systems,
developer tools,
and modern software.

Subtitle

Computer Engineering graduate from NYU building AI agents, retrieval systems, developer tools, and open-source software.

Buttons

View Projects

Read Blog

Small social row

GitHub

LinkedIn

Resume

RIGHT

Circular portrait

320x320

Border

2px

Glass surface

Orange glow

Purple glow

Very subtle floating animation

Duration

5s

Infinite

Ease in out

Behind portrait

Blurred glow

------------------------------------------------------------------------------

# HERO MICRO BADGES

Around portrait

Floating pills

Python

AI Agents

LLMs

Mojo

TypeScript

PyTorch

RAG

Docker

Slow drifting animation

Very subtle

Desktop only

Hide on mobile

------------------------------------------------------------------------------

# ABOUT SECTION

Layout

Desktop

2 columns

Left

Text

Right

Photo / Information

Heading

About Me

Paragraph

Maximum 3 short paragraphs.

Below

Current Focus cards

Building

Pelmen

Learning

Mojo

Interested In

Inference

Compilers

Developer Tools

Cards

Small

Rounded

Minimal

------------------------------------------------------------------------------

# SKILLS

Infinite horizontal carousel

Two rows

Top

Moves left

Bottom

Moves right

Cards

Height

48px

Rounded pill

Dark background

Thin border

Icon

Skill

Skills

Python

TypeScript

React

Astro

Bun

Docker

Linux

Redis

Postgres

FastAPI

PyTorch

Mojo

CUDA

OpenAI

Ollama

Qdrant

Git

GitHub Actions

AWS

C++

Tailwind

Framer Motion

Do NOT stop animation.

Pause on hover.

------------------------------------------------------------------------------

# FEATURED PROJECTS

Section Title

Featured Projects

Exactly three projects.

Large alternating layout.

Project 1

Image Left

Content Right

Project 2

Content Left

Image Right

Project 3

Image Left

Content Right

Image

Large

Rounded

24px

Content

Project title

Status badge

Description

Tech stack pills

Buttons

GitHub

Live Demo

Read More

Hover

Image zoom

1.03

Border glow

Card elevation

Status badges

Open Source

Production

In Progress

Research

------------------------------------------------------------------------------

# PROJECT CARD DESIGN

Card

24px radius

Dark

Thin border

Padding

32px

Image

16:9

Rounded

Description

Maximum

3 lines

Tech

Small pills

Buttons

Ghost style

Hover

Entire card lifts

8px

Shadow increases

------------------------------------------------------------------------------

# ALL PROJECTS

Grid

Desktop

3 columns

Tablet

2 columns

Mobile

1 column

Cards

Image

Title

Description

Tags

Links

GitHub

Demo

Search

Not required

Filtering

Not required

Projects sorted

Featured first

Remaining newest first

------------------------------------------------------------------------------

# BLOG PAGE

Separate page

Hero

Thoughts on AI,
Engineering,
and Building.

Cards

Vertical list

Each card

Title

Date

Read Time

Excerpt

Arrow

Hover

Arrow slides right

Card lifts

Markdown pages

Simple typography

Table

Code blocks

Images

Quotes

------------------------------------------------------------------------------

# FOOTER

Large heading

Let's build something great.

Buttons

GitHub

LinkedIn

Email

Small copyright

Built with Astro

Hosted on GitHub Pages

------------------------------------------------------------------------------

# ANIMATIONS

Use only these.

Fade Up

Sections

Duration

700ms

Hover Lift

Cards

6px

Button Hover

Gradient becomes brighter

Portrait Float

5s infinite

Background Gradient Drift

30s

Skills Marquee

Infinite

Project Image Zoom

1.03

Navbar Blur

On scroll

Nothing should bounce.

Nothing flashy.

------------------------------------------------------------------------------

# MOBILE

Everything stacks vertically.

Hero

Photo

↓

Label

↓

Title

↓

Subtitle

↓

Buttons

↓

Social Links

Featured Projects

Image

↓

Title

↓

Description

↓

Buttons

Project Grid

One column

Cards

100% width

Navbar

Hamburger

Fullscreen menu

Bottom spacing

Generous

------------------------------------------------------------------------------

# RESPONSIVE BREAKPOINTS

Mobile

<768

Tablet

768-1024

Desktop

1024+

Large Desktop

1440+

------------------------------------------------------------------------------

# CONTENT STRUCTURE

Hero

↓

About

↓

Skills

↓

Featured Projects

↓

All Projects

↓

Footer

Blog exists separately.

------------------------------------------------------------------------------

# PROJECT JSON SCHEMA

[
  {
    "title": "",
    "description": "",
    "image": "",
    "featured": true,
    "status": "Open Source",
    "tags": [],
    "github": "",
    "demo": "",
    "blog": ""
  }
]

------------------------------------------------------------------------------

# BLOG FRONTMATTER

---
title:
date:
excerpt:
readTime:
cover:
tags:
---

------------------------------------------------------------------------------

# COMPONENT LIST

Layout

Navbar

Footer

Hero

HeroButtons

HeroPortrait

BackgroundGlow

AboutSection

CurrentFocusCards

SkillsCarousel

FeaturedProjects

FeaturedProjectCard

ProjectsGrid

ProjectCard

StatusBadge

Tag

Button

SectionHeading

SocialLinks

BlogHero

BlogCard

MarkdownLayout

------------------------------------------------------------------------------

# ICONS

Use Lucide Icons exclusively.

Stroke width

1.75

------------------------------------------------------------------------------

# BUTTONS

Primary

Gradient fill

White text

Hover

Lift

2px

Glow

Secondary

Transparent

Border

White 10%

Hover

Border brightens

Background slightly lighter

------------------------------------------------------------------------------

# ACCESSIBILITY

Contrast AA compliant

Keyboard navigation

Visible focus rings

Alt text on all images

Reduced motion respected

Semantic HTML

------------------------------------------------------------------------------

# PERFORMANCE

Lighthouse target

100 Performance

100 Accessibility

100 Best Practices

100 SEO

Optimize images

Lazy load project screenshots

No unnecessary JavaScript

Prefer Astro islands only where needed

------------------------------------------------------------------------------

# FINAL IMPRESSION

The website should immediately communicate that the owner is a professional AI engineer who builds sophisticated systems. It should feel closer to the landing page of a premium developer tool than a traditional personal portfolio. Every section should prioritize clarity, craftsmanship, and visual restraint, allowing featured projects to become the primary focus while maintaining excellent readability and responsiveness across all devices.
