// This file re-exports the new ModernNavbar + ModernFooter under the legacy
// `Navbar` / `Footer` names. Previously, the legacy Navbar/Footer rendered a
// different visual style (red bar + circular image logo), which created a
// brand inconsistency when navigating from the new landing page into other
// internal pages. Re-aliasing keeps the entire site visually consistent.
import { ModernNavbar, ModernFooter } from '../pages/LandingPage';

export const Navbar = ModernNavbar;
export const Footer = ModernFooter;
