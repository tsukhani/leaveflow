# Change proposals

Lab 1C asks you to write an OpenSpec change proposal here, against the existing
spec of record in `../specs/`.

The repository ships with the deltas already drafted for two requirements, so you
have a worked example. They are deliberately **incomplete**: one is missing its
scenarios, the other is missing the migration note a REMOVED requirement needs.

Your task in Lab 1C is to fix them using the correct markers and header hashes,
then validate.

## Markers

- `## ADDED Requirements`
- `## MODIFIED Requirements`, which must restate the full updated requirement
- `## REMOVED Requirements`, which must carry a Reason and a Migration note
- `## RENAMED Requirements`, with FROM and TO

A requirement is a level-three header. A scenario is a level-four header. Exactly
four hashes on the scenario; three fails silently.
