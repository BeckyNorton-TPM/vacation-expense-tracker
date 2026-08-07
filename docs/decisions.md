\# Decisions Log



\## Stack: Flask + React + SQLite

Chose Flask for a lightweight Python backend, React for a

mobile-friendly frontend, SQLite for zero-setup persistence

appropriate for single-user scale.



\## Currency conversion: live API vs manual entry

Chose live API lookup at time of entry to reduce manual error and

keep the workflow fast while traveling.



\## Build approach: Claude Code

Using Claude Code for implementation, with PRD, roadmap, and GitHub

Issues driving scope and direction.



\## Testing: manual first, automated as its own phase

Chose to manually test each phase as it was built (fast feedback

during early iteration), then add an automated pytest suite as a

dedicated milestone (M7) once the feature set stabilized — balancing

build speed early on with regression protection long-term.



\## Interim "Clear all expenses" tool

Added a temporary clear-all-expenses button (with confirm-before-delete)

during M3 testing, ahead of the roadmap. Needed a way to reset test

data between manual test runs before M5 introduces proper per-vacation

separation — expected to become unnecessary once trips can be selected

individually.



\## Multi-user support: deferred, not dropped

Considered adding multi-user separation (so different people could use

a shared deployment without seeing each other's data) after M4 went

live. Deferred intentionally — this is a portfolio project, and

multi-user auth was explicitly scoped out of v1 in the PRD's non-goals.

If this became a real product used by others, the path forward would

likely be lightweight workspace-scoping first (a shareable code with

no full auth), with real user accounts as a later step if warranted.

