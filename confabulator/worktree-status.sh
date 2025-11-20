#!/bin/bash
#
# Git Worktree Status Script
# Project: Dog Tinder
# Generated: 2025-11-20T16:33:11.231Z
#
# Shows the status of all worktrees and their dependencies.
#

echo "📊 Worktree Status - Dog Tinder"
echo "="
echo ""

echo "📂 Active Worktrees:"
git worktree list
echo ""

echo "🔗 Dependency Summary:"
echo ""
echo "Epics:"
echo "  ✅ #1 - User Interaction (no dependencies)"
echo "  ✅ #4 - Appointment Management (no dependencies)"
echo "  ✅ #7 - Shelter Communication (no dependencies)"
echo "  ✅ #9 - Shelter Profile Management (no dependencies)"
echo "  ✅ #11 - Technical Foundation (no dependencies)"
echo ""
echo "Tasks:"
echo "  ⚠️  #2 - Implement Swipe Functionality (depends on: #11)"
echo "  ✅ #3 - Develop Liked Profiles List (no dependencies)"
echo "  ⚠️  #5 - Integrate Calendar API (depends on: #11)"
echo "  ⚠️  #6 - Develop Appointment Booking UI (depends on: #5, #11)"
echo "  ✅ #8 - Implement Messaging System (no dependencies)"
echo "  ✅ #10 - Develop Profile Creation Interface (no dependencies)"
echo ""
echo "🔀 Recommended Merge Order:"
echo "  1. 📦 #1 - User Interaction"
echo "  2. 📝 #2 - Implement Swipe Functionality"
echo "  3. 📝 #3 - Develop Liked Profiles List"
echo "  4. 📦 #4 - Appointment Management"
echo "  5. 📝 #6 - Develop Appointment Booking UI"
echo "  6. 📦 #7 - Shelter Communication"
echo "  7. 📝 #8 - Implement Messaging System"
echo "  8. 📦 #9 - Shelter Profile Management"
echo "  9. 📝 #10 - Develop Profile Creation Interface"
echo ""
echo "💡 Tips:"
echo "  - Work on tasks with no dependencies first"
echo "  - Merge branches in the order shown above"
echo "  - Check GitHub issues for detailed requirements"
echo ""