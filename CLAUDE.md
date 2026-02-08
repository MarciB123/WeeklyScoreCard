# CLAUDE.md — WeeklyScoreCard

This file provides guidance for AI assistants working on the WeeklyScoreCard repository.

## Project Overview

**WeeklyScoreCard** is a project for tracking and displaying weekly scores/metrics. The repository is in its initial state and is being bootstrapped.

## Repository Status

- **Current state**: New repository — no application code, dependencies, or configuration files exist yet.
- **Remote**: `MarciB123/WeeklyScoreCard`
- **Primary branch**: `main` (not yet created — first commit will establish it)

## Development Guidelines

### Git Workflow

- Create feature branches off `main` for all changes.
- Use clear, descriptive commit messages summarizing the "why" not just the "what".
- Push with `git push -u origin <branch-name>`.
- Open pull requests for review before merging to `main`.

### Code Conventions (to adopt as the project grows)

- Keep code simple and avoid over-engineering.
- Prefer small, focused files and functions.
- Write tests alongside new features.
- Document public APIs and non-obvious logic with brief comments.

### When Adding Dependencies

- Choose well-maintained, widely-used libraries.
- Pin dependency versions for reproducibility.
- Document why a dependency was added if the reason isn't obvious.

## Project Setup

No setup steps are required yet. When application code is added, update this section with:

1. Prerequisites (Node.js version, etc.)
2. Install command (`npm install`, `pip install`, etc.)
3. Environment variable configuration
4. How to run the development server
5. How to run tests
6. How to build for production

## File Structure

```
WeeklyScoreCard/
├── CLAUDE.md          # This file — AI assistant guidance
└── .git/              # Git metadata
```

> Update this tree as the project structure evolves.

## Key Commands

_No commands configured yet. Add build, test, lint, and run commands here as they are set up._

```
# Example placeholders — replace when tooling is chosen:
# npm install        — install dependencies
# npm run dev        — start development server
# npm test           — run test suite
# npm run build      — production build
# npm run lint       — run linter
```

## Architecture Notes

_To be documented once the tech stack and application architecture are chosen._

Topics to cover when updating:
- Framework and language choices
- Directory layout conventions (e.g., `src/`, `tests/`, `public/`)
- State management approach
- Data storage / database
- API design patterns
- Authentication / authorization strategy

## Testing

_No test framework configured yet._ When tests are added, document:
- Test framework and runner
- How to run unit vs integration vs e2e tests
- Test file naming conventions (e.g., `*.test.ts`, `*.spec.ts`)
- Mocking strategies

## Updating This File

Keep this file current as the project evolves. After significant changes (new framework, restructured directories, added tooling), update the relevant sections so AI assistants always have accurate context.
