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

### Feb 5, 2026 - Session 2 Updates
- ✅ **Subscription Frequency Choice**: Biweekly OR Monthly options
- ✅ **Contact Us Page**: Full form (Name, Phone, Email, Message) with company info:
  - Partnerships: sales@foeguard.com
  - General: info@foeguard.com
  - Phone: 905-466-7787
  - Hours: Mon-Fri 9am-10pm, Sat 9am-6pm, Sun Closed
  - Office: 405 The West Mall, Etobicoke, M9C 5J1, ON
- ✅ **Delivery/Order Instructions**: Textarea in checkout for custom notes
- ✅ **"Delivery Address"**: Changed from "Shipping Address"
- ✅ **Subscription Swap**: Users can change box size (12/18/24/30lb)
- ✅ **Product Detail Page**: Fixed styling
- ✅ **Calculator**: Added lbs/month display

### Feb 5, 2026 - Session 1 (Design Refresh)
- ✅ Updated color scheme to authentic farm palette
- ✅ New typography: Crimson Pro, Source Sans 3
- ✅ Responsive mobile navigation with hamburger menu

### Previous Implementation
- ✅ Single-page menu with direct box selection
- ✅ Complete address form with Google Places
- ✅ Separate Stripe card fields
- ✅ Delivery date selector

## Testing Status
- Backend: 100%
- Frontend: 95% (minor 401 console warning, non-blocking)

## Next Action Items (Requested by User)
1. **Dog/Cat Menu Selection**: Large menu buttons with images to switch between dog food and cat food
2. **Header Images for Menu Items**: Replace small icons with header images above each product
   - **Recommended Image Sizes**:
     - Desktop: 280px × 180px (16:10 ratio)
     - Mobile: 100% width × 150px height
     - Format: WebP or optimized JPEG
     - Resolution: 2x for retina displays (560px × 360px actual)

## Prioritized Backlog

### P1 - In Progress
- [ ] Dog/Cat menu selector with large image buttons
- [ ] Header images for menu product cards (awaiting user images)

### P2 - Medium Priority
- [ ] Admin dashboard enhancements
- [ ] Cat food products and treats

### P3 - Lower Priority
- [ ] Blog page
- [ ] Marketing email automation
- [ ] Rewards/loyalty program

## Tech Stack
- React 18.x
- FastAPI
- MongoDB with Motor
- Stripe
- Google Places API
- Brevo (SendinBlue)

## Environment Variables
### Backend (.env)
- MONGO_URL, DB_NAME
- STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY
- JWT_SECRET
- BREVO_API_KEY
- GOOGLE_PLACES_API_KEY

### Frontend (.env)
- REACT_APP_BACKEND_URL
