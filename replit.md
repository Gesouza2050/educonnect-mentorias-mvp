# EduConnect - Plataforma de Mentores

## Overview

EduConnect is a mentor-student connection platform inspired by Superprof, built entirely with vanilla HTML, CSS, and JavaScript without any frameworks. The platform allows students to find and connect with mentors across various fields, schedule sessions, join study groups, and manage favorites. It features a responsive design with real-time search and filtering capabilities, a booking system with local storage persistence, and an accessible user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
- Single Page Application (SPA) built with vanilla JavaScript
- Modular CSS with CSS custom properties for theming and consistency
- Mobile-first responsive design using CSS Grid and Flexbox
- Component-based JavaScript architecture with separated concerns (data handling, UI rendering, event management)

**Data Management**
- Client-side data storage using localStorage for favorites and appointments
- JSON-based mentor data loaded via fetch API from static files
- Real-time filtering and search without page reloads
- Client-side pagination for performance optimization

**User Interface Components**
- Modal system for mentor profile details
- Responsive navigation with hamburger menu for mobile
- Dynamic card-based layout for mentor listings
- Form validation with user-friendly error messages
- Loading states and error handling for improved UX

**State Management**
- Global variables for application state (mentors, favorites, appointments)
- localStorage persistence for user data across sessions
- Event-driven updates for UI synchronization

**Accessibility Features**
- Semantic HTML with proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management and visible focus states

**Performance Optimizations**
- Client-side filtering and sorting for instant results
- Lazy loading concepts for mentor data
- Efficient DOM manipulation with minimal reflows
- CSS-only animations and transitions

## External Dependencies

**Third-party Services**
- Unsplash API for mentor profile images
- External study materials links (MDN, Kaggle, Figma Academy, etc.)

**Static Assets**
- Mock mentor data served from local JSON file (data/mentors.json)
- Image assets stored in assets/ directory
- Custom icons and images for UI components

**Browser APIs**
- localStorage for client-side data persistence
- Fetch API for loading mentor data
- DOM APIs for dynamic content rendering and event handling
- CSS Grid and Flexbox for responsive layouts

**Development Tools**
- No build process or bundlers - direct browser execution
- Standard web APIs and vanilla JavaScript features
- CSS custom properties for theming and maintainability