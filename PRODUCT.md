# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
One user: the author, a software engineer with a Kafka, Databricks and time-series data background, preparing for a lateral move. The tool is personal and does not need to serve other candidates.

## Product Purpose
PrepHub (manifest name "PrepHub: Interview Prep") brings everything needed to land either a **Motorq** offer or a **remote India role** into one place: DSA patterns, system design, company intel and a visual Learn Scroll. The two targets carry equal weight. Success means an offer from Motorq or a strong remote role.

## Positioning
It is tuned to one person and two target loops: Motorq's reported rounds (OA, DSA, system design, CS fundamentals, CTO round) and the general remote-India loop (DSA, machine coding/LLD, HLD, hiring manager), both mapped onto the author's own background. It is not a generic prep site.

## Operating Context
- Two modes of use: **desktop deep study** (long sessions working through problems and system design) and **phone short sessions** (installed PWA, quick daily reviews, the Learn Scroll).
- Tabs: Today, Learn, Practice (DSA), System Design, Companies, Resources. Each tab can be opened directly by URL hash.
- Links out to YouTube (NeetCode, Striver, Aditya Verma), Reddit, LinkedIn and careers pages.

## Capabilities and Constraints
- Vite + React 18, no backend. All content lives in `src/data/`.
- Progress is saved in localStorage (`interview-prep-progress-v1`). Theme options are light, dark and system.
- Installable PWA with a service worker, a manifest and shortcuts to Learn, DSA and Design.
- The company "hiring" lists are snapshots and must be re-checked against live links before applying.

## Evidence on Hand
- Company intel and reported question types in `src/data/companies.js`.
- YouTube IDs in `src/data/learn.js`, verified on 2026-10-27.
- Never fabricate interview questions, loop details or hiring status.

## Product Principles
1. Two targets, equal weight: rank and frame content by its relevance to the Motorq loop and the remote-India loop; show where they overlap.
2. Personal over general: lean on the author's real background, with no generic onboarding.
3. Make it easy to come back every day: it should be quick to resume on a phone and focused enough for deep work on a desktop.
4. Keep the intel honest: verified sources, dated snapshots, links to the live source.
