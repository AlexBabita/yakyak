# YakYak PoC context (yakyak.dev)

Reference for rebuilding the **Try to Translate** experience from the existing one-pager at [yakyak.dev](https://yakyak.dev/).

## Product

**YakYak Team Talk Translator** — *Translate your team talk with ease.*

Translates “developer language” into PM, QA, and designer speak (and vice versa). Optional real language translation (e.g. English ↔ Spanish).

## One-pager flow (PoC)

1. **From Role** / **To Role** — Dropdowns (e.g. Developer → Project Manager, QA, Designer).
2. **From Language** / **To Language** — Optional; for actual language translation.
3. **Original Message** — Text area for the message to rewrite.
4. **“YakYak It”** — Primary CTA; runs the rewrite.
5. **Output** — Rewritten message.
6. **Feedback** — Thumbs up / thumbs down on the result.
7. **FAQ** — What does YakYak do? Who is it for? Is my data saved? How accurate?
8. **Wishlist** — Suggest a feature or report a bug.

## Build order (when we build it)

- Recreate this one-pager flow in the new app (landing + try-it section).
- Wire “YakYak It” to backend/API when ready.
- Add feedback (thumbs) and optional wishlist/feedback collection.
