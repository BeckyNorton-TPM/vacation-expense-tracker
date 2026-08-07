# Roadmap



## M1: Core data model + manual entry

Flask backend, SQLite schema, POST/GET expense endpoints

(exchange\_rate accepted manually for now, no live API yet)



## M2: Live currency conversion

Integrate exchange rate API server-side; store rate + computed

USD amount per entry



## M3: Frontend + category totals

React form for entry, list view, category subtotal display



## M4: Deploy

Host backend + frontend; add live link to README. This is the one-time

hosting setup — most platforms auto-redeploy on every future push to

main, so later phases won't need to repeat this setup.



## M5: Vacation trips

Add a Vacation/Trip entity with a title; associate each expense with

a trip so multiple vacations can be tracked separately. Redeploy

(just a push — hosting is already set up).



## M6: Quick currency check

Add a standalone tool: enter an amount + currency, see the USD

equivalent instantly, with no expense saved. Redeploy.



## M7: Automated testing

Add a pytest suite covering the Flask endpoints (expense creation,

currency conversion, totals, vacation scoping, quick check) so

regressions are caught automatically rather than relying on manual

testing alone.

