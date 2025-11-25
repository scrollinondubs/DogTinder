# Wireframes: Dog Tinder

## Overview & User Story Mapping

**Design Approach:** Focus on a fun, intuitive, and engaging interface that simplifies dog adoption. Targeting mobile users familiar with social media interfaces.

**User Story → Screen Mapping:**
- US-1: Swipe Interface → Swipe Screen, Liked Profiles Screen
- US-2: Appointment Booking System → Appointment Booking Screen
- US-3: Shelter Communication → Messaging Screen
- US-4: Quick Profile Creation for Shelters → Profile Creation Screen

## Screen Flow Diagram

```
[Home Screen] → [Swipe Screen] → [Liked Profiles Screen]
      ↓                ↓
[Login Screen]   [Appointment Booking Screen] → [Messaging Screen]
      ↓
[Profile Creation Screen]
```

## ASCII Wireframes

### 1. Home Screen
**User Stories Enabled:** [US-1, US-2]

```
┌─────────────────────────────────────────────────────────────┐
│  [Dog Tinder Logo]   <Swipe> <Appointments> <Messages>     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│            Welcome to Dog Tinder                            │
│   Swipe right to find your new furry friend!                │
│                                                             │
│           [Start Swiping →]  <Learn More>                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Footer: <About Us> | <Contact> | <Privacy Policy>           │
└─────────────────────────────────────────────────────────────┘

        ↓ User clicks [Start Swiping]

```

### 2. Swipe Screen (Enables US-1)

```
┌─────────────────────────────────────────────────────────────┐
│  [Dog Tinder Logo]    <Home> <Liked Dogs> <Profile>        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │                 [Dog Image Here]                      │  │
│  │                                                       │  │
│  │   Name: Charlie                                       │  │
│  │   Age: 2 years      Breed: Labrador                   │  │
│  │   <More Info>                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  [← Swipe Left to Pass]    [Swipe Right to Like →]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

        ↓ User swipes right

```

### 3. Liked Profiles Screen (Enables US-1)

```
┌─────────────────────────────────────────────────────────────┐
│  [Dog Tinder Logo]    <Swipe> <Liked Dogs> <Profile>       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Your Liked Dogs                                            │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │  Charlie                │  │  Bella                  │  │
│  │  Labrador, 2 years      │  │  Beagle, 3 years        │  │
│  │  [Book Appointment →]   │  │  [Book Appointment →]   │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

        ↓ User clicks [Book Appointment →]

```

### 4. Appointment Booking Screen (Enables US-2)

```
┌─────────────────────────────────────────────────────────────┐
│  [Dog Tinder Logo]    <Swipe> <Appointments> <Messages>    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Book an Appointment                                        │
│                                                             │
│  Dog: Charlie                                               │
│  {Select Date:..............}                               │
│  {Select Time Slot:........}                                │
│                                                             │
│  [Confirm Appointment →]                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

        ↓ User clicks [Confirm Appointment →]

```

### 5. Messaging Screen (Enables US-3)

```
┌─────────────────────────────────────────────────────────────┐
│  [Dog Tinder Logo]    <Swipe> <Appointments> <Messages>    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Messages with Shelters                                     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Shelter Name: Happy Tails                             │  │
│  │                                                       │  │
│  │ User: Hi, I would like to know more about Charlie.    │  │
│  │ Shelter: Of course! Charlie is a playful Labrador...  │  │
│  │                                                       │  │
│  │ {Type your message here...} [Send]                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

        ↓ User sends a message

```

### 6. Profile Creation Screen (Enables US-4)

```
┌─────────────────────────────────────────────────────────────┐
│  [Dog Tinder Logo]    <Dashboard> <Create Profile>         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Create a Dog Profile                                       │
│                                                             │
│  {Dog Name:....................}                            │
│  {Breed:.......................}                            │
│  {Age:........................}                             │
│  {Upload Photo} [Choose File]                               │
│  {Description:............................................} │
│                                                             │
│  [Save Profile →]                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

        ↓ User clicks [Save Profile →]

```

## Mobile Responsive Variations

### Swipe Screen (Mobile)

```
┌─────────────────────┐
│  [☰]   Logo  [User] │
├─────────────────────┤
│                     │
│  ┌───────────────┐  │
│  │               │  │
│  │  Dog Image    │  │
│  │               │  │
│  └───────────────┘  │
│  Name: Charlie       │
│  Age: 2 years        │
│  Breed: Labrador     │
│  <More Info>         │
│                     │
│  [← Pass]  [Like →] │
│                     │
└─────────────────────┘
```

## Interactive States

### Button States
```
[Normal Button]  [Hover: underline]  [Disabled: gray]  [Loading: spinner]
```

### Form Validation
```
{Valid Input✓}   {Invalid Input✗ Error message}
```

## Design System Quick Reference

- **Primary Action:** [Button] style
- **Secondary Action:** <Link> style
- **Input Fields:** {Field Name..........} style
- **Dropdowns:** (Select Option ▼) style
- **Navigation:** Top bar or sidebar with <Links>
- **Cards:** Boxes with ┌─┐└┘ characters

---

**REMEMBER:** Each screen must be drawn using ASCII art to show layout and interactive elements clearly. Use this guide to ensure all features from the user stories are visually represented.