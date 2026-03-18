# FoeGuard - Raw Pet Food Website

## Original Problem Statement
Build a website for "FoeGuard," a raw dog/cat food company. The site features a landing page, About Us (Why FoeGuard), New to Raw page, Blog, Product Detail pages, Treat Detail pages, and a Box Builder page for customers to select products.

## Core Requirements
1. Add photos to fill all placeholder images across the site
2. Update product information (descriptions, ingredients, nutrition) in the database
3. Implement a dog survey to automate customer meal plans
4. Various UI/UX and content edits across all pages

## Tech Stack
- **Frontend**: React, React Router, TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Process Management**: Supervisor

## Key DB Schema
- **products**: `{ product_id, product_line, protein_type, name, description, short_description, highlights, ingredients, recipe_breakdown, nutrition/nutrition_facts, pet_type, pricing, inventory_status, feeding_guide, product_info, is_complete_balanced }`
- **treats**: `{ treat_id, name, price, quantity_description, pet_type, description, feeding_guide, product_information }`

## What's Been Implemented
### Completed (Previous Sessions)
- Full UI/UX overhaul: Homepage, Box Builder, Navbar, About, New to Raw, Blog pages
- Carousels for reviews and proteins on homepage
- Box Builder redesign with banner carousel
- ScrollToTop component
- Global font and styling consistency

### Completed (Current Session - Feb 18, 2026)
- **Database Update Complete**: All 24 products (Comfort Dinner x8, Primal Feast x8, Royal Paws x8) and all 18 treats updated with correct descriptions, ingredients, nutrition, feeding guides, and product information
- Treats verified rendering correctly on frontend with description, feeding guide, and product information sections

## Prioritized Backlog
### P0 (High Priority)
- Add real photos/images to replace all ~65 placeholders across the site (user will provide after DB update)

### P1 (Medium Priority)
- Implement dog survey feature for automated meal plan creation

### P2 (Low Priority)
- Full testing pass across all pages
- Additional UI/UX refinements as requested
