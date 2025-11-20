# Dependency Graph

```mermaid
graph TD

  1[[#1: User Interaction]]
  2[#2: Implement Swipe Functionality]
  3[#3: Develop Liked Profiles List]
  4[[#4: Appointment Management]]
  5[#5: Integrate Calendar API]
  6[#6: Develop Appointment Booking UI]
  7[[#7: Shelter Communication]]
  8[#8: Implement Messaging System]
  9[[#9: Shelter Profile Management]]
  10[#10: Develop Profile Creation Interface]
  11[[#11: Technical Foundation]]

  11 -->|Database before API| 5
  5 -->|API before UI| 6
  11 -->|API before UI| 6
  11 -->|Setup before features| 2

  classDef epicStyle fill:#e1f5ff,stroke:#01579b,stroke-width:2px
  classDef taskStyle fill:#fff3e0,stroke:#e65100,stroke-width:1px
  class 1,4,7,9,11 epicStyle
  class 2,3,5,6,8,10 taskStyle
```

## Legend
- **Double box**: Epic
- **Single box**: Task
- **Arrow direction**: Dependency flow (A → B means B depends on A)

## About This Diagram

This diagram shows the dependencies between epics and tasks in your project. Use it to understand the order in which work should be completed and merged.

- **Epics** (double boxes) represent major features or components
- **Tasks** (single boxes) are specific implementation work items
- **Arrows** show dependencies (A → B means B depends on A completing first)

For parallel development using git worktrees, run:
```bash
./confabulator/setup-worktrees.sh
```
