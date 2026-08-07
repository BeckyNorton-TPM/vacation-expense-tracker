# PRD: Vacation Expense Tracker



## Problem

Tracking vacation expenses across multiple currencies is tedious and

error-prone when done manually.



## Users

\- Primary: me, solo traveler

\- Future: could extend to shared/group trips



## Requirements

\- Log an expense: date, business name, description, category,

&#x20; local currency, local amount

\- Auto-fetch live exchange rate at time of entry, compute USD amount

\- Running total by category

\- Overall trip total

\- View/filter expense list

\- Title and save expenses under a named vacation/trip, so multiple

&#x20; trips can be tracked separately over time

\- Quick currency check: let the user enter an amount and currency

&#x20; and see the USD equivalent, without creating a saved expense entry



## Non-goals (v1)

\- Multi-user auth

\- Receipt photo storage

\- Offline mode



## Success criteria

\- Can log an expense in under 15 seconds

\- Category totals accurate to the cent

\- Usable on mobile browser

