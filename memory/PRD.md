# FounderFund - Product Requirements Document

## Original Problem Statement
Create a high-converting, single-page landing website for FounderFund to validate market demand before any agents, apps, or infrastructure are built. Target audiences: Founders, Investors, and Investment Funds.

## Architecture & Tech Stack
- **Frontend**: React 19 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Email Marketing**: Mailchimp (optional, requires API keys)
- **Styling**: Dark theme with gold accent (#D4AF37)
- **Typography**: Playfair Display (headings) + Manrope (body)

## User Personas
1. **Founders** (first-time, indie hackers, early-stage, growth-stage)
2. **Investors** (angels, micro-VCs, syndicates, family offices)
3. **Investment Funds** (institutional, emerging)

## Core Requirements
- Single-page landing layout
- Hero with exact headline: "Find funding opportunities. Apply once. Track everything."
- Problem section with 5 emotional pain points
- 3-step solution (Discover → Apply → Track)
- Audience segmentation section
- Early access form with structured data collection
- CTA appears 3 times across page
- 3D animated currency bill in hero background
- Mobile-first responsive design

## What's Been Implemented (Jan 30, 2026)
- ✅ Full landing page with all required sections
- ✅ CSS 3D animated currency bill with scroll-responsive rotation
- ✅ Early access form collecting: email, role, stage, pain points (dropdown + free-text)
- ✅ Backend API: POST /api/waitlist, GET /api/waitlist/stats
- ✅ MongoDB data persistence
- ✅ Mailchimp integration ready (activates when env vars are set)
- ✅ Duplicate email detection (409 response)
- ✅ Glass-morphism design with gold accents
- ✅ Framer Motion animations
- ✅ Responsive mobile design
- ✅ All data-testid attributes for testing

## Prioritized Backlog

### P0 (Critical)
- [x] Landing page MVP complete

### P1 (High Priority)
- [ ] Configure Mailchimp API keys for live email sync
- [ ] Domain setup (founderfund.app or founderfund.io)
- [ ] Basic analytics tracking (GA or Mixpanel)

### P2 (Medium Priority)
- [ ] A/B testing for headlines/CTAs
- [ ] Thank you email automation
- [ ] Social sharing meta tags (OG images)
- [ ] Admin dashboard for viewing signups

### P3 (Nice to Have)
- [ ] Three.js 3D currency with WebGL fallback
- [ ] Multi-language support
- [ ] Referral tracking

## Success Metrics
- 50-100 organic signups within 7-10 days
- 20+ detailed qualitative pain responses
- Clear pattern clustering in responses

## Next Steps
1. Add Mailchimp credentials: MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, MAILCHIMP_AUDIENCE_ID
2. Secure domain and deploy
3. Share on Twitter, LinkedIn, founder groups
4. Manual outreach to 20+ founders/investors
