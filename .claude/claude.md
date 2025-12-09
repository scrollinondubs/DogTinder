# Dog Tinder

## Project Overview

I want to build an application that is essentially a Tinder for orphaned dogs. And so this is the ability to basically find and adopt a dog via swiping.


### Target Customer
Our ideal customer has discretionary income, the ability to adopt an animal, and is likely familiar with social media and apps. The primary thing is that they're capable of adopting an animal.


### Value Proposition
Customers will use our product because it's super fun, with lots of cute dog pictures. Plus, we'll pepper in some educational stuff to raise awareness about the issue. Yeah, it'll be fun, frictionless, and easy to use.


## Key Documentation

This project was created with Confabulator, an AI-powered project documentation wizard. All major requirements and specifications are documented in the `confabulator/` directory:

### Essential Reading
1. **Product Requirements Document** (`confabulator/PRD.md`)
   - Complete feature specifications
   - User stories and acceptance criteria
   - Technical requirements
   - Success metrics

2. **Project Vision** (`confabulator/project-vision.md`)
   - Problem statement and motivation
   - Target users and use cases
   - Long-term vision and goals

3. **Implementation Plan** (`confabulator/implementation-plan.md`)
   - Technical architecture
   - Development phases and milestones
   - Task breakdown and priorities
   - Technology stack decisions

4. **Business Model Canvas** (`confabulator/business-model-canvas.md`)
   - Revenue streams
   - Cost structure
   - Key partnerships
   - Customer relationships

5. **UI Mockups** (`confabulator/mocks/`)
   - Source of truth for all front-end UI screens
   - Reference these mockups when building any UI components
   - Available screens:
     - `welcome-screen.png` - App entry/onboarding
     - `login-screen.png` - Authentication screen
     - `swipe-interface.png` - Core swiping feature
     - `dog-profile-detail.png` - Expanded dog information
     - `liked-dogs-list.png` - Saved favorites list
     - `appointment-booking.png` - Calendar and time slot selection
     - `appointment-conf.png` - Booking confirmation
     - `message-chat.png` - Shelter communication
     - `shelter-dashboard.png` - Admin view for shelters

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| UI | shadcn/ui, Tailwind CSS |
| State | TanStack Query, Zustand |
| Forms | React Hook Form, Zod |
| Auth | NextAuth.js v5 (Auth.js) |
| Database | SQLite (local) / Turso (production) |
| ORM | Drizzle ORM |
| File Storage | Vercel Blob |
| Email | Resend |
| Hosting | Vercel |
| PWA | next-pwa |

## Database

### Local Development
- **Database file:** `app/local.db` (SQLite)
- **Interact via:** `sqlite3 app/local.db` or Drizzle queries
- **Always use local database** for development and testing

### Production (Turso)
- **Database:** `dog-tinder` on Turso
- **URL:** `libsql://dog-tinder-scrollinondubs.aws-eu-west-1.turso.io`
- **Interact via:** `turso db shell dog-tinder`
- **Only use production database** when explicitly needed for production debugging

### Database Connection
The `app/src/db/index.ts` automatically selects the database:
- If `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set → Turso (production)
- Otherwise → `file:local.db` (local development)

### Common Commands
```bash
# Local database
sqlite3 app/local.db ".tables"
sqlite3 app/local.db "SELECT * FROM dogs;"

# Production database (use sparingly)
turso db shell dog-tinder ".tables"
turso db shell dog-tinder "SELECT * FROM dogs;"
```

## Environment Variables

When adding secrets to Vercel or other services via CLI, use `printf` instead of `echo` to avoid trailing newline characters:

```bash
# CORRECT - use printf (no trailing newline)
printf "your-secret-value" | vercel env add SECRET_NAME production

# WRONG - echo adds a trailing newline that breaks URLs and tokens
echo "your-secret-value" | vercel env add SECRET_NAME production
```

## Development Guidelines

When working on this project:

1. **Start with Context**: Always review the relevant sections of the PRD before implementing features
2. **Follow the Plan**: The implementation plan outlines the recommended development sequence
3. **Reference User Stories**: Each feature should map to user stories in the PRD
4. **Maintain Alignment**: Technical decisions should align with the architecture in the implementation plan
5. **Use UI Mockups**: When building front-end components, always reference the mockups in `confabulator/mocks/` as the source of truth for visual design, layout, and user flow

## Current Focus

The MVP focuses on these core capabilities (P0 features):

1. **User Authentication** - Sign up/login with Google OAuth
2. **Swipe Interface** - Tinder-like swiping to like/pass on dogs
3. **Dog Profile Detail** - Expanded view with photos and info
4. **Liked Dogs List** - View all right-swiped dogs
5. **Shelter Admin Dashboard** - Add/edit/remove dogs
6. **Simple Appointment Request** - Form submission with email notification
7. **In-App Messaging** - Direct communication between users and shelters

**Deferred to Post-MVP:**
- Full calendar integration for appointments
- Dog filtering (breed, size, age)
- Push notifications (native)
- Batch dog uploads

See `confabulator/implementation-plan.md` for the complete development roadmap.

## Important Notes

- This is a Progressive Web App (PWA) - installable on mobile devices
- All generated documentation is in the `confabulator/` directory
- The PRD contains the definitive feature requirements
- The implementation plan provides the technical roadmap


## Repository

https://github.com/scrollinondubs/DogTinder

---

*Generated by [Confabulator](https://vibecodelisboa.com/confabulator)*
