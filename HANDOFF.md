# Engineering Handoff Document

**Date:** December 9, 2024
**Previous Work:** Epic #9 (Shelter Dog Management) + Task #10 (Shelter Dashboard)
**Next Issues:** #4, #6, #7, #8 (Appointments & Messaging)

---

## Quick Start

```bash
cd app
npm install
npm run db:push    # Apply schema
npm run db:seed    # Seed test data
npm run dev        # Start dev server
```

**Test Accounts:**
| Role | Email | Password |
|------|-------|----------|
| Shelter Admin | `admin@happypaws.com` | `password123` |
| Regular User | `alex@example.com` | `password123` |

---

## Project Overview

Dog Tinder is a PWA for dog adoption with Tinder-like swiping. Users swipe on dogs, save favorites, message shelters, and book appointments.

**Tech Stack:**
- Next.js 14 (App Router) + TypeScript
- Drizzle ORM + SQLite (dev) / Turso (prod)
- NextAuth.js v5 (credentials auth)
- Tailwind CSS + custom components
- Vercel Blob (image uploads)
- Vercel (hosting)

---

## What's Been Completed

### Phase 1: Technical Foundation ✅
- Next.js project setup with App Router
- Drizzle ORM database with full schema
- NextAuth.js authentication (email/password)
- Middleware route protection

### Phase 2: User Interaction ✅
- Swipe interface (`/swipe`) - real database integration
- Favorites list (`/favorites`) - shows liked dogs
- Dog detail page (`/dog/[id]`)

### Phase 3: Shelter Dog Management ✅ (Just Completed)
- **Dashboard** (`/shelter/dashboard`) - real stats, dogs, appointments
- **Dogs list** (`/shelter/dogs`) - with status filtering and quick toggle
- **Dog CRUD** (`/shelter/dogs/new`, `/shelter/dogs/[id]`) - full form with image upload
- **Appointments view** (`/shelter/appointments`) - confirm/decline requests
- **Image upload** - Vercel Blob integration working

---

## Remaining Open Issues

### Issue #4: Appointment Requests (Epic)
**Status:** Open
**Priority:** P0 (MVP)

User-side appointment booking. Shelter side (viewing/confirming) is already done.

**What exists:**
- Database schema for `appointmentRequests` ✅
- Shelter appointments management page ✅ (`/shelter/appointments`)
- API for shelter to update appointment status ✅ (`/api/shelter/appointments/[id]`)

**What needs to be built:**
1. User appointment request form (from dog profile page)
2. API endpoint for users to create appointment requests
3. User appointments view page (see their pending/confirmed requests)
4. Email notifications (using Resend)

### Issue #6: Build Appointment Request Form (Task under #4)
**Status:** Open
**Priority:** P0

The form component for users to request appointments.

**Suggested approach:**
```
/app/dog/[id]/page.tsx          # Add "Request Visit" button
/app/api/appointments/route.ts   # POST endpoint for creating requests
/lib/validations/appointment.ts  # Zod schema (already exists partially)
```

**Note:** There's existing UI at `/app/appointment/[dogId]/page.tsx` with a calendar picker - this uses dummy data. You can either:
1. Refactor it to use the real database
2. Or build a simpler form-based approach per the issue description

### Issue #7 & #8: Shelter Communication / Messaging System
**Status:** Open
**Priority:** P0 (MVP)

In-app messaging between users and shelters.

**What exists:**
- Database schema for `conversations` and `messages` ✅
- Seed data with sample conversation ✅
- UI mockups at `/app/messages/` (using dummy data)

**What needs to be built:**
1. API endpoints for conversations/messages CRUD
2. Wire up existing UI to real database
3. "Message Shelter" button on dog profile
4. Real-time updates (polling or Pusher)

---

## Key Files to Know

### Database
- **Schema:** `src/db/schema.ts` - All tables defined here
- **Seed:** `src/db/seed.ts` - Test data including shelter admin linkage
- **Connection:** `src/db/index.ts`

### Authentication
- **Config:** `src/auth.config.ts` - Route protection rules
- **Setup:** `src/auth.ts` - NextAuth configuration
- **Types:** `src/types/next-auth.d.ts` - Session type extensions

### Shelter Admin
- **Auth helper:** `src/lib/shelter-auth.ts` - `getShelterForAdmin()` verifies role + shelter ownership
- **API routes:** `src/app/api/shelter/` - All shelter management endpoints
- **Pages:** `src/app/shelter/` - Dashboard, dogs, appointments

### Validations
- **Dog schema:** `src/lib/validations/dog.ts` - Zod schemas for dog forms

### Components
- **Form inputs:** `src/components/Input.tsx`, `Select.tsx`, `Textarea.tsx`
- **Shelter components:** `src/components/shelter/` - DogForm, ImageUpload

---

## Database Schema Highlights

```typescript
// User-Shelter Link (added for Epic #9)
users.shelterId -> shelters.id  // Links SHELTER_ADMIN to their shelter

// Appointment Requests
appointmentRequests {
  userId, dogId, shelterId,
  preferredDate, preferredTime, message,
  status: "pending" | "confirmed" | "cancelled" | "completed"
}

// Messaging
conversations { userId, shelterId, dogId? }
messages { conversationId, senderId, senderType, content, readAt }
```

---

## API Patterns

All shelter APIs follow this pattern:

```typescript
import { getShelterForAdmin, isAuthError } from "@/lib/shelter-auth";

export async function GET() {
  const result = await getShelterForAdmin();
  if (isAuthError(result)) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  const { shelter } = result;
  // ... use shelter.id for queries
}
```

For user APIs, use:
```typescript
import { auth } from "@/auth";

const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

## Environment Variables

Required in `.env.local`:
```
AUTH_SECRET=xxx                    # NextAuth secret
TURSO_DATABASE_URL=xxx            # Database (optional for dev - uses SQLite)
TURSO_AUTH_TOKEN=xxx              # Database auth
BLOB_READ_WRITE_TOKEN=xxx         # Vercel Blob for image uploads
```

For email notifications (Issue #4), you'll need:
```
RESEND_API_KEY=xxx                # For sending emails
```

---

## Gotchas & Tips

1. **Zod v4:** Project uses Zod 4 which has slightly different API. No `required_error` on enums - use `.refine()` if needed.

2. **Set iteration:** TypeScript config requires `Array.from(new Set(...))` instead of spread operator on Sets.

3. **Image uploads:** Vercel Blob requires `BLOB_READ_WRITE_TOKEN`. The upload API is at `/api/shelter/upload`.

4. **Form components:** Use existing `Input`, `Select`, `Textarea` components for consistent styling.

5. **Server vs Client:** Shelter pages are server components that fetch data directly. Use `"use client"` only for interactive parts.

6. **Dummy data:** Files in `src/data/dummy-data.ts` are legacy - real data comes from database now. The messages pages still use dummy data.

---

## Suggested Order for Next Issues

1. **Issue #6 first** - Build appointment request form (user side)
   - Add API endpoint `/api/appointments`
   - Wire up dog detail page with "Request Visit" button
   - Create user appointments view page

2. **Then Issue #8** - Messaging system
   - Create conversation/message API endpoints
   - Wire up existing UI at `/app/messages/`
   - Add "Message Shelter" to dog profile

3. **Email notifications** - Can be added incrementally
   - Set up Resend
   - Add to appointment creation flow
   - Add to message notifications

---

## Testing the Shelter Dashboard

1. Log in as `admin@happypaws.com` / `password123`
2. Go to `/shelter/dashboard`
3. You should see Happy Paws Shelter with 2 dogs (Max and Luna)
4. Try adding a new dog with image upload
5. Check the appointments page (will be empty unless you create some)

---

## GitHub Issues Status

| Issue | Title | Status |
|-------|-------|--------|
| #11 | Technical Foundation | ✅ Closed |
| #1 | User Interaction | ✅ Closed |
| #2 | Swipe Functionality | ✅ Closed |
| #3 | Liked Profiles List | ✅ Closed |
| #9 | Shelter Dog Management | ✅ Closed (just now) |
| #10 | Build Shelter Dashboard | ✅ Closed (just now) |
| #4 | Appointment Requests | 🔴 Open |
| #6 | Appointment Request Form | 🔴 Open |
| #7 | Shelter Communication | 🔴 Open |
| #8 | Messaging System | 🔴 Open |

---

## Questions?

Check `confabulator/` directory for:
- `PRD.md` - Full product requirements
- `implementation-plan.md` - Technical architecture
- `mocks/` - UI mockups for all screens
- `dependency-graph.md` - Issue dependencies

Good luck! 🐕
