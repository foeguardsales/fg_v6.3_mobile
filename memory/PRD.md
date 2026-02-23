# FoeGuard E-Commerce Platform - PRD

## Original Problem Statement
Build a modern e-commerce website for FoeGuard, a raw pet food company selling farm-fresh meals for dogs and cats in Ontario.

## Core Requirements
- Modern farmhouse aesthetic with Fraunces/Inter fonts
- Color palette: barn red (#88302F), burgundy (#732827), cream (#f5f3ef), khaki (#D9C8B3)
- 9-section homepage with specific copy
- Dog and Cat food product lines
- Build-a-Box customization
- Stripe payment integration
- Google Places address autocomplete
- Brevo email integration

---

## What's Been Implemented (Dec 2025)

### Homepage (9 Sections) ✅
1. Hero with "See a Happier, Healthier Pet In Just 14 Days"
2. Why Guardians Switch (3 icons)
3. The Problem section
4. Our Standards (3 pillars with header)
5. How It Works (3 steps - concise)
6. Real Food Real Results (6 benefits + AAFCO)
7. From Farm to Bowl (8 proteins, testimonials)
8. New to FoeGuard section
9. Final CTA with promise list

### Pages ✅
- Landing Page (complete with all 9 sections)
- Build-a-Box (dog/cat selector, image banners)
- Product Detail (redesigned, collapsible sections)
- Contact Us
- About Us
- Calculator
- Account/Login
- New to Raw (placeholder)

### Integrations ✅
- Stripe payments (test key)
- Google Places autocomplete
- Brevo email (configured)

### Checkout Features ✅
- Biweekly/Monthly subscription choice
- Delivery instructions textarea
- "Delivery Address" labeling

---

## Pending Tasks

### P1 - High Priority
- [x] Complete "About Us / Why FoeGuard" page (user copy implemented)
- [x] Expand "New to FoeGuard" page (user copy implemented with comparison table)
- [ ] Test Royal Paws cat food line on Build-a-Box
- [ ] Verify cart calculations for cat food
- [ ] Fix errors (pending user feedback)

### P2 - Medium Priority
- [ ] Complete subscription swap functionality
- [ ] End-to-end checkout testing

### Backlog
- [ ] Quick Reorder feature
- [ ] Blog page
- [ ] Marketing email automation
- [ ] Rewards/loyalty program
- [ ] Admin dashboard enhancements

---

## Image Placeholders Needed
- 3 icons for "Why Guardians Switch"
- Farm sourcing banner
- 8 protein images (Chicken, Beef, Duck, Fish, Lamb, Turkey, Goat, Rabbit)
- 3 testimonial photos
- 12 customer photo grid
- AAFCO logo

---

## Technical Stack
- Frontend: React + TailwindCSS (craco)
- Backend: FastAPI + Python
- Database: MongoDB
- Styling: CSS variables, Fraunces/Inter fonts

## Key Files
- `/app/frontend/src/pages/LandingPage.js` - Homepage
- `/app/frontend/src/App.css` - Main styles
- `/app/frontend/src/pages/BoxBuilder.js` - Build-a-box
- `/app/backend/server.py` - API endpoints
- `/app/backend/seed_data.py` - Product data
