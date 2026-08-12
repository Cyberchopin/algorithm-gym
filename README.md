# Shiyue Algorithm Gym

> A personalized, pattern-first LeetCode training system for consistent interview preparation.

Shiyue Algorithm Gym turns algorithm practice into a small daily loop: one representative core problem, one transfer or spaced-review problem, progressive hints, and a required interview-style debrief.

## Why this exists

Grinding random problem lists can create answer recognition without transferable skill. This project organizes practice around reusable patterns and requires the learner to explain:

- the signal that suggests a pattern;
- the repeated work in the brute-force approach;
- the invariant maintained by the optimized approach;
- time and space complexity;
- boundary cases and a nearby variant.

The first release is a private-by-design personal training workflow for technical interview preparation.

## Current features

- 14-day foundation sprint covering HashSet, HashMap, prefix sums, running state, Kadane, two pointers, write pointers, and sliding windows
- one core problem plus one transfer or closed-book review slot per day
- three-level hint ladder that reveals direction gradually
- direct links to the original LeetCode problems without copying proprietary problem statements
- daily completion gate requiring attempt outcome, complexity analysis, and reflection
- Los Angeles timezone-aware streak tracking
- local-first progress persistence with no account, API key, or paid backend
- portable coaching snapshot for continuing with ChatGPT across conversations
- responsive desktop and mobile interface

## Learning protocol

Java 21 is the primary interview language. Python is used twice a week as a 10–15 minute transfer exercise for AI, ML, and data work.

Each problem follows this interview sequence:

1. Restate and clarify.
2. Propose a brute-force solution.
3. Identify the bottleneck.
4. State the optimized invariant.
5. Implement.
6. Manually test boundary cases.
7. Analyze complexity.
8. Explain one variation.

Missing a day never creates a large problem debt. Due reviews take priority and each day stays capped at two training slots.

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```

## Architecture

- Next.js / React / TypeScript
- standard Next.js deployment target
- browser `localStorage` for private, device-local learning records
- no database, authentication, scraping, or LLM API in v1

The primary product logic and curriculum live in `app/AlgorithmGym.tsx`; the visual system is in `app/globals.css`.

## Roadmap

- 12-week curriculum and spaced-review queue (1, 3, 7, 14, 30 days)
- pattern-level mastery scores and structured error taxonomy
- JSON progress import/export
- weekly Java/Python mock-interview mode
- optional cross-device persistence

## Responsible content

This repository contains original summaries, teaching notes, and hints. It links to LeetCode for official problem statements and does not reproduce complete copyrighted prompts.

---

Built for deliberate practice: recognize the pattern, justify the invariant, and communicate the solution.
