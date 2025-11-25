# SmartFlow Gate Automation Project

## Overview

This is a full-stack web application for SmartFlow, a company specializing in smart gate automation systems in the UAE. The application serves as both a marketing website showcasing products and services, and includes an embedded 3D settlement-building game experience. Built with React, Express, and PostgreSQL, it features a modern tech stack with TypeScript throughout.

The project combines a traditional business website with an interactive 3D game component, creating an engaging user experience while providing essential business information about automatic gates, garage door systems, and home automation solutions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript running on Vite for development and production builds.

**UI Component System:** Built on Radix UI primitives with custom styling via Tailwind CSS. Uses shadcn/ui design patterns for consistent, accessible components across the application.

**3D Graphics:** Leverages React Three Fiber (R3F) for WebGL rendering, with @react-three/drei for common 3D utilities and @react-three/postprocessing for visual effects. The 3D game includes terrain rendering, building models, dynamic lighting with day/night cycles, and interactive placement mechanics.

**State Management:** 
- Zustand for client-side state management with middleware support
- TanStack Query (React Query) for server state synchronization and caching
- Separate stores for game logic (`useGame`), settlement management (`useSettlement`), and audio control (`useAudio`)

**Routing:** Client-side routing handled through the Express server, which serves the React SPA for all non-API routes.

**Styling:** Tailwind CSS with custom design tokens defined through CSS variables, enabling theme customization. PostCSS for preprocessing.

### Backend Architecture

**Framework:** Express.js server with separate development and production entry points.

**Development Mode:** Uses Vite middleware for hot module replacement and fast refresh during development. Templates are dynamically reloaded from disk.

**Production Mode:** Pre-built static assets served from the `dist/public` directory. All routes fall through to serve `index.html` for client-side routing.

**API Structure:** Routes prefixed with `/api` for backend endpoints. Currently uses a placeholder route registration system ready for expansion.

**Storage Layer:** Abstracted through an `IStorage` interface with two implementations:
- `MemStorage`: In-memory storage for development (current default)
- Database-backed storage (ready for PostgreSQL integration)

**Data Validation:** Drizzle-Zod integration for type-safe schema validation on insert operations.

### Data Storage

**ORM:** Drizzle ORM configured for PostgreSQL with TypeScript-first schema definitions.

**Database:** PostgreSQL via Neon serverless driver (`@neondatabase/serverless`), configured through `DATABASE_URL` environment variable.

**Schema Management:** 
- Schema defined in `shared/schema.ts` for code sharing between client and server
- Migration files output to `./migrations` directory
- Uses `drizzle-kit` for schema pushing and migration management

**Current Schema:** Basic user table with username/password fields, demonstrating authentication-ready structure.

### Build System

**Development:** 
- Vite dev server with custom logger that exits on errors
- tsx for running TypeScript directly in development
- Hot module replacement for rapid development

**Production:**
- Vite builds the client to `dist/public`
- esbuild bundles the server to `dist/index.js` as an ESM module
- Separate build commands for client and server with external package resolution

**Module System:** ESM throughout with import.meta.url for file path resolution.

### Authentication & Authorization

Architecture is prepared for session-based authentication with `connect-pg-simple` for PostgreSQL session storage. User schema includes password field, suggesting planned password-based authentication. No implementation currently active.

## External Dependencies

**Database:** 
- Neon Serverless PostgreSQL for scalable, serverless database hosting
- Connection via `DATABASE_URL` environment variable

**UI Framework:**
- Radix UI for accessible, unstyled component primitives
- Extensive component library including dialogs, dropdowns, forms, tooltips, and more

**3D Rendering:**
- Three.js for WebGL rendering
- React Three Fiber for React integration
- Drei for helpful 3D utilities (textures, controls, effects)
- GLSL shader support via vite-plugin-glsl

**Developer Tools:**
- Replit-specific runtime error modal for development debugging
- TypeScript with strict mode enabled
- Path aliases (`@/` for client, `@shared/` for shared code)

**Font Management:**
- Fontsource for self-hosted Inter font family
- Web font optimization through build process

**Styling:**
- Tailwind CSS for utility-first styling
- class-variance-authority for component variant management
- clsx and tailwind-merge for conditional class handling

**Audio:** HTML5 Audio API for background music and sound effects in the game component, with custom audio state management.