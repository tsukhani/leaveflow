## MODIFIED Requirements

### Requirement: Reject overlapping requests

A request must not overlap an existing request for the same employee in a
non-cancelled status.

#### Scenario: Overlap refused

- **WHEN** an employee already has approved leave from 20 to 24 July
- **AND** submits a request from 22 to 28 July
- **THEN** the system refuses the new request with a conflict error

<!-- Lab 1C: MODIFIED requires the full updated requirement, and this one also
     needs a migration note for any existing overlapping rows. Neither is here.
     Fix both, then run openspec validate. -->
