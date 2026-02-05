# FoeGuard - Raw Dog Food Subscription Platform

## Original Problem Statement
Build and maintain FoeGuard, a raw dog food subscription e-commerce platform for Ontario, Canada. Features include box customization, protein selection, treats, checkout with Stripe, Google Places autocomplete, and subscription management.

## Architecture
- **Frontend**: React 18 with Tailwind CSS
- **Backend**: FastAPI with MongoDB (Motor driver)
- **Payments**: Stripe integration
- **Email**: Brevo (SendinBlue) for transactional emails
- **Address**: Google Places Autocomplete

## User Personas
1. **Pet Parents**: Ontario dog owners seeking premium raw food options
2. **Health-Conscious Owners**: Those wanting biologically appropriate diets for pets
3. **Subscription Users**: Recurring customers with auto-delivery preferences

## Core Requirements (Static)
- Box builder with 4 size options (12lb, 18lb, 24lb, 30lb)
- 8 protein options across 2 product lines (Comfort Dinner, Primal Feast)
- Volume discounts (5%, 10%, 15% for larger boxes)
- Cart drawer with order summary
- Checkout with separate Stripe card fields
- Google Places address autocomplete
- Delivery date selector (3+ days from today)
- Subscription vs one-time purchase option
- User authentication (login/register)
- Order history in account page

## What's Been Implemented
### Feb 5, 2026 - Design Refresh
- ✅ Updated color scheme to authentic farm palette:
  - Barn Red (#A41E34)
  - Burgundy (#88302F)
  - Khaki (#D9C8B3)
  - Offwhite (#F2F4F3)
  - Charcoal (#2B2B2B)
- ✅ New typography: Crimson Pro (headings), Source Sans 3 (body)
- ✅ Modern farmhouse design aesthetic
- ✅ Improved responsive design with mobile hamburger menu
- ✅ Enhanced card styles and button interactions
- ✅ Better visual hierarchy and spacing

### Previous Implementation
- ✅ Single-page menu with direct box selection
- ✅ Complete address form (Street, Unit, City, Province dropdown, Postal Code, Country)
- ✅ Separate Stripe card fields (Card Number, Expiry Date, CVC)
- ✅ Google Places Autocomplete working
- ✅ Removed sticky checkout bar - cart at top right
- ✅ Delivery date selector with 3-day minimum

## Testing Status
- Backend: 100% (20/20 tests passed)
- Frontend: 100% (all flows verified)

## Prioritized Backlog

### P0 - Complete ✅
- Core e-commerce flow working end-to-end

### P1 - Next Up
- [ ] Admin dashboard enhancements
- [ ] Subscription management UI improvements

### P2 - Medium Priority
- [ ] Add feeding calculator link in floating cart ("Edit Quiz" button)
- [ ] Subscription swap functionality (change proteins)
- [ ] Quick Reorder for returning customers

### P3 - Lower Priority
- [ ] Blog page
- [ ] Marketing email automation (Brevo campaigns)
- [ ] Rewards/loyalty program

## Tech Stack
- React 18.x
- FastAPI
- MongoDB with Motor
- Stripe
- Google Places API
- Brevo (SendinBlue)
- Tailwind CSS

## Environment Variables Required
### Backend (.env)
- MONGO_URL
- DB_NAME
- STRIPE_SECRET_KEY
- STRIPE_PUBLIC_KEY
- JWT_SECRET
- BREVO_API_KEY
- GOOGLE_PLACES_API_KEY

### Frontend (.env)
- REACT_APP_BACKEND_URL
