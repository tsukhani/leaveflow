## ADDED Requirements

### Requirement: Exclude public holidays from the day count

The system excludes gazetted public holidays from the working day count for a
leave request.

#### Scenario: Holiday inside the range

- **WHEN** a request spans 30 April to 4 May 2026 in Malaysia
- **THEN** Labour Day and Wesak Day are not deducted
- **AND** the request consumes 1 day

<!-- Lab 1C: this delta is missing the second scenario the spec requires.
     Add it, then run openspec validate. -->
