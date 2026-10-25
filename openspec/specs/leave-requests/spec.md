# leave-requests

## Purpose

Employees submit leave requests. Managers approve or reject them. Balances
decrease when leave is approved and are restored when it is cancelled.

## Requirements

### Requirement: Submit a leave request

An employee submits a request with a leave type, a start date, an end date and an
optional reason. The system records the number of working days the request
consumes.

#### Scenario: Weekday range

- **WHEN** an employee submits leave from Monday to Wednesday
- **THEN** the request consumes 3 days

#### Scenario: Weekend excluded

- **WHEN** an employee submits leave from Friday to Monday
- **THEN** the request consumes 2 days

#### Scenario: Public holiday excluded

- **WHEN** a requested range contains a gazetted public holiday
- **THEN** the holiday is not deducted from the employee's balance

### Requirement: Reject overlapping requests

A request must not overlap an existing request for the same employee in a
non-cancelled status.

#### Scenario: Overlap refused

- **WHEN** an employee already has approved leave from 20 to 24 July
- **AND** submits a request from 22 to 28 July
- **THEN** the system refuses the new request with a conflict error

### Requirement: Approve or reject a request

Only the employee's resolved manager may decide a request. Every decision is
recorded with the deciding user and a timestamp, and prior decisions are
retained.

#### Scenario: Non-manager refused

- **WHEN** an employee attempts to approve a request that is not theirs to decide
- **THEN** the system refuses with a forbidden error

#### Scenario: Decision history retained

- **WHEN** a decision is reversed
- **THEN** both the original and the reversing decision remain readable

### Requirement: Cancel an approved request

An employee may cancel their own request while it is pending or approved.

#### Scenario: Cancel approved leave

- **WHEN** an employee cancels their own approved request
- **THEN** the request status becomes cancelled
- **AND** the deducted days return to the employee's balance

### Requirement: Balance is derived from history

An employee's used leave equals the sum of days from approved requests for the
current year. The stored counter must never disagree with that sum.

#### Scenario: Counter matches history

- **WHEN** the balance is read for any employee
- **THEN** the used figure equals the sum of days from their approved requests

### Requirement: Accessible leave list

The leave request table meets WCAG 2.2 level AA.

#### Scenario: Header association

- **WHEN** a screen reader reads a table cell
- **THEN** the associated column header is announced

#### Scenario: Status not conveyed by colour alone

- **WHEN** a status is displayed
- **THEN** the status is available as text to assistive technology
