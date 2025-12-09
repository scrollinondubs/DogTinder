# Dependency Graph

```mermaid
graph TD

  11[[#11: Technical Foundation]]
  1[[#1: User Interaction]]
  2[#2: Implement Swipe Functionality]
  3[#3: Develop Liked Profiles List]
  9[[#9: Shelter Dog Management]]
  10[#10: Build Shelter Dashboard]
  7[[#7: Shelter Communication]]
  8[#8: Implement Messaging System]
  4[[#4: Appointment Requests]]
  6[#6: Build Appointment Request Form]

  11 -->|Foundation before features| 1
  11 -->|Foundation before features| 9
  11 -->|Foundation before features| 7
  11 -->|Foundation before features| 4

  1 -->|Swipe before appointments| 4
  1 -->|User context for messaging| 7
  9 -->|Dogs exist before appointments| 4
  9 -->|Shelter context for messaging| 7

  2 -->|Swipe before likes list| 3
  10 -->|Dashboard before dog forms| 9
  8 -->|Messaging is core of epic| 7

  classDef epicStyle fill:#e1f5ff,stroke:#01579b,stroke-width:2px
  classDef taskStyle fill:#fff3e0,stroke:#e65100,stroke-width:1px
  class 1,4,7,9,11 epicStyle
  class 2,3,6,8,10 taskStyle
```

## Implementation Phases

```mermaid
gantt
    title Dog Tinder MVP Implementation
    dateFormat  YYYY-MM-DD
    section Phase 1
    Technical Foundation (#11)    :p1, 2025-01-01, 7d
    section Phase 2
    User Interaction (#1)         :p2, after p1, 7d
    Swipe Functionality (#2)      :after p1, 7d
    Liked Profiles List (#3)      :after p1, 7d
    section Phase 3
    Shelter Dog Management (#9)   :p3, after p2, 7d
    Shelter Dashboard (#10)       :after p2, 7d
    section Phase 4
    Appointment Requests (#4)     :p4, after p3, 7d
    Appointment Form (#6)         :after p3, 7d
    Shelter Communication (#7)    :after p3, 7d
    Messaging System (#8)         :after p3, 7d
    section Phase 5
    Testing & Launch              :after p4, 7d
```

## Legend
- **Double box [[]]**: Epic (major feature area)
- **Single box []**: Task (specific implementation work)
- **Arrow direction**: Dependency flow (A → B means B depends on A)

## Active Issues (MVP)

| Issue | Type | Title | Phase | Status |
|-------|------|-------|-------|--------|
| #11 | Epic | Technical Foundation | Week 1 | ✅ Closed |
| #1 | Epic | User Interaction | Week 2 | ✅ Closed |
| #2 | Task | Implement Swipe Functionality | Week 2 | ✅ Closed |
| #3 | Task | Develop Liked Profiles List | Week 2 | ✅ Closed |
| #9 | Epic | Shelter Dog Management | Week 3 | ✅ Closed |
| #10 | Task | Build Shelter Dashboard | Week 3 | ✅ Closed |
| #4 | Epic | Appointment Requests (Simplified) | Week 4 | 🔴 Open |
| #6 | Task | Build Appointment Request Form | Week 4 | 🔴 Open |
| #7 | Epic | Shelter Communication | Week 4 | 🔴 Open |
| #8 | Task | Implement Messaging System | Week 4 | 🔴 Open |

## Closed Issues (Deferred to Post-MVP)

| Issue | Title | Reason |
|-------|-------|--------|
| #5 | Integrate Calendar API | Simplified to form-based requests |

## Dependency Details

### Epic #11: Technical Foundation
**Depends on:** Nothing (starting point)
**Blocks:** All other epics

This is the foundation that everything else builds upon:
- Next.js project setup
- SQLite (dev) / Turso (prod) + Drizzle ORM database
- NextAuth.js authentication (email/password)
- Vercel deployment

### Epic #1: User Interaction
**Depends on:** #11 (Technical Foundation)
**Blocks:** #4 (Appointment Requests), #7 (Shelter Communication)

Core user-facing features:
- Swipe interface
- Dog profile details
- Liked dogs list

### Epic #9: Shelter Dog Management
**Depends on:** #11 (Technical Foundation)
**Blocks:** #4 (Appointment Requests), #7 (Shelter Communication)

Shelter admin features:
- Dashboard
- Dog CRUD operations
- Image upload

### Epic #7: Shelter Communication
**Depends on:** #11, #1, #9 (needs foundation, user context, and shelter context)
**Blocks:** Nothing

In-app messaging features:
- Real-time chat between users and shelters
- Conversation management
- Message notifications

### Epic #4: Appointment Requests
**Depends on:** #11, #1, #9 (needs foundation, user flow, and dogs)
**Blocks:** Nothing

Final user journey step:
- Request form
- Email notifications
- Status management

## Development Flow

1. **Start with #11 (Technical Foundation)**
   - Set up project, database, auth, deployment
   - This unblocks all other work

2. **Phase 2: #1 (User Interaction)**
   - Swipe interface
   - Dog profiles
   - Liked dogs list

3. **Phase 3: #9 (Shelter Dog Management)**
   - Shelter dashboard
   - Dog CRUD operations
   - Image upload

4. **Phase 4: #4 and #7 (Appointments & Communication)**
   - Can be developed in parallel
   - #4: Appointment request forms and email notifications
   - #7: In-app messaging system
   - Both require user and shelter contexts from earlier phases

5. **Phase 5: Testing & Launch**
   - End-to-end testing
   - Performance optimization
   - Production deployment

## About This Diagram

This diagram shows the dependencies between epics and tasks for the Dog Tinder MVP. Use it to understand the order in which work should be completed.

- **Epics** (double boxes) represent major features or components
- **Tasks** (single boxes) are specific implementation work items
- **Arrows** show dependencies (A → B means B depends on A completing first)

For parallel development using git worktrees, run:
```bash
./confabulator/setup-worktrees.sh
```
