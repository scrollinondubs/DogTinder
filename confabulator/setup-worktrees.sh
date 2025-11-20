#!/bin/bash
#
# Git Worktree Setup Script
# Project: Dog Tinder
# Repository: https://github.com/scrollinondubs/DogTinder
# Generated: 2025-11-20T16:33:11.231Z
#
# This script creates separate git worktrees for each task and epic,
# enabling parallel development without branch conflicts.
#

set -e  # Exit on error

echo "🌳 Setting up git worktrees for parallel development..."
echo ""

# ================================================
# EPICS
# ================================================

# Epic #1: User Interaction
# ✅ No dependencies - can start immediately
echo "Creating worktree for Epic #1..."
git worktree add ../epic-1-worktree -b epic/1-user-interaction 2>/dev/null || echo "  Worktree already exists"

# Epic #4: Appointment Management
# ✅ No dependencies - can start immediately
echo "Creating worktree for Epic #4..."
git worktree add ../epic-4-worktree -b epic/4-appointment-management 2>/dev/null || echo "  Worktree already exists"

# Epic #7: Shelter Communication
# ✅ No dependencies - can start immediately
echo "Creating worktree for Epic #7..."
git worktree add ../epic-7-worktree -b epic/7-shelter-communication 2>/dev/null || echo "  Worktree already exists"

# Epic #9: Shelter Profile Management
# ✅ No dependencies - can start immediately
echo "Creating worktree for Epic #9..."
git worktree add ../epic-9-worktree -b epic/9-shelter-profile-management 2>/dev/null || echo "  Worktree already exists"

# Epic #11: Technical Foundation
# ✅ No dependencies - can start immediately
echo "Creating worktree for Epic #11..."
git worktree add ../epic-11-worktree -b epic/11-technical-foundation 2>/dev/null || echo "  Worktree already exists"

# ================================================
# TASKS
# ================================================

# Task #2: Implement Swipe Functionality
# ⚠️  Dependencies: #11
echo "Creating worktree for Task #2..."
git worktree add ../task-2-worktree -b task/2-implement-swipe-functionality 2>/dev/null || echo "  Worktree already exists"

# Task #3: Develop Liked Profiles List
echo "Creating worktree for Task #3..."
git worktree add ../task-3-worktree -b task/3-develop-liked-profiles-list 2>/dev/null || echo "  Worktree already exists"

# Task #5: Integrate Calendar API
# ⚠️  Dependencies: #11
echo "Creating worktree for Task #5..."
git worktree add ../task-5-worktree -b task/5-integrate-calendar-api 2>/dev/null || echo "  Worktree already exists"

# Task #6: Develop Appointment Booking UI
# ⚠️  Dependencies: #5, #11
echo "Creating worktree for Task #6..."
git worktree add ../task-6-worktree -b task/6-develop-appointment-booking-ui 2>/dev/null || echo "  Worktree already exists"

# Task #8: Implement Messaging System
echo "Creating worktree for Task #8..."
git worktree add ../task-8-worktree -b task/8-implement-messaging-system 2>/dev/null || echo "  Worktree already exists"

# Task #10: Develop Profile Creation Interface
echo "Creating worktree for Task #10..."
git worktree add ../task-10-worktree -b task/10-develop-profile-creation-interface 2>/dev/null || echo "  Worktree already exists"

echo ""
echo "✅ Worktree setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. View all worktrees: git worktree list"
echo "2. Check dependencies: ./confabulator/worktree-status.sh"
echo "3. Start working: cd <worktree-directory>"
echo ""
echo "🔀 Recommended merge order (dependencies first):"
echo "  1. #1 - User Interaction"
echo "  2. #2 - Implement Swipe Functionality"
echo "  3. #3 - Develop Liked Profiles List"
echo "  4. #4 - Appointment Management"
echo "  5. #6 - Develop Appointment Booking UI"
echo "  6. #7 - Shelter Communication"
echo "  7. #8 - Implement Messaging System"
echo "  8. #9 - Shelter Profile Management"
echo "  9. #10 - Develop Profile Creation Interface"
echo ""
echo "To cleanup all worktrees: ./confabulator/cleanup-worktrees.sh"
