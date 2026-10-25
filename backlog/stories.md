# LeaveFlow backlog: 20 stories

For Lab 2A. These are mixed quality on purpose. Some are ready to estimate.
Some are vague, some are duplicates, and one is not a story at all.

Score them with RICE, then WSJF. The point of the lab is the argument about
the outliers, not the arithmetic.

**Deliberate quality problems, for the instructor:**

- LF-04, LF-11, LF-17 have no acceptance criteria
- LF-07 and LF-15 are the same work described twice
- LF-19 is a meeting, not a story
- LF-13 has an untestable criterion ("feels faster")
- LF-02 states a solution, not a need

---

## LF-01: Employee submits a leave request

As an employee, I want to submit a leave request for a date range, so that my
manager can approve it and my balance stays accurate.

**Acceptance criteria**

- Given a valid date range, when I submit, then the request is created with status Pending
- Given an end date before the start date, when I submit, then the form shows an error and no request is created
- Given a request, when it is created, then the number of working days is stored on it

**Out of scope:** attachments, half days

---

## LF-02: Use server components for the request list

Convert the requests page to React Server Components so it is faster.

**Acceptance criteria**

- Page renders in under 200ms on the lab machine

**Out of scope:** none stated

---

## LF-03: Manager approves or rejects a request

As a manager, I want to decide a pending request, so that leave is authorised
before it happens.

**Acceptance criteria**

- Given a pending request assigned to me, when I approve it, then status becomes Approved and the balance increases by the day count
- Given a pending request, when I reject it, then status becomes Rejected and the balance is unchanged
- Given a request I do not own, when I attempt to decide it, then I get 403

**Out of scope:** delegation, escalation, multi-level approval

---

## LF-04: Improve the approvals page

Users say the approvals page is confusing. Make it better.

---

## LF-05: Refuse overlapping requests

As an employee, I want the system to refuse a request that overlaps my existing
leave, so that I cannot double-book and create a reconciliation mess.

**Acceptance criteria**

- Given an approved request from 20 to 24 July, when I submit 22 to 28 July, then I get a 409 with a clear message
- Given a cancelled request over the same dates, when I submit, then it succeeds
- Given a pending overlap, when I submit, then I get a 409

**Out of scope:** partial-day overlap

---

## LF-06: Cancel my own approved leave

As an employee, I want to cancel my approved leave, so that the days return to
my balance when plans change.

**Acceptance criteria**

- Given my own approved request, when I cancel it, then status becomes Cancelled and the days are credited back
- Given another employee's request, when I attempt to cancel it, then I get 403
- Given a rejected request, when I attempt to cancel it, then I get 409

**Out of scope:** retroactive cancellation, HR overrides

---

## LF-07: Balance must match the request history

As a finance user, I want the used-leave figure to equal the sum of approved
requests, so that payroll and the leave system agree.

**Acceptance criteria**

- Given any employee, when the balance is read, then used equals the sum of days from approved requests in the current year

---

## LF-08: Exclude public holidays from the day count

As an employee, I want gazetted public holidays excluded from my leave, so that
I am not charged for a day the office is closed.

**Acceptance criteria**

- Given a range containing a gazetted holiday, when the request is created, then the holiday is not deducted
- Given 30 April to 4 May 2026, when submitted, then it consumes 1 day

**Out of scope:** state-level holidays, replacement days

---

## LF-09: Table has no caption and no scope attributes

Add a caption and `scope` attributes to the request table so screen readers
announce the column header with the cell.

**Acceptance criteria**

- Given a screen reader, when a cell is read, then its column header is announced
- Given the page, when audited with axe-core, then there are no table-related violations

**Out of scope:** full WCAG audit

---

## LF-10: Status must not be conveyed by colour alone

Status badges use colour only. Add a text alternative and announce changes.

**Acceptance criteria**

- Given a screen reader, when a status changes, then the change is announced via an aria-live region
- Given the page, when audited, then no colour-contrast-only findings remain

---

## LF-11: Add an audit trail to approvals

We need to know who approved what, and when, including revisions.

---

## LF-12: Read the story through the Jira MCP server

As a developer, I want the agent to read a story from Jira directly, so that I
stop pasting ticket text into the terminal.

**Acceptance criteria**

- Given a story key, when the skill runs, then it reads title, description and acceptance criteria through MCP
- Given Jira is unreachable, when the skill runs, then it reports the failure rather than inventing criteria

**Out of scope:** writing back to Jira (that is LF-18)

---

## LF-13: Make the app feel faster

The app should feel faster when loading the requests page.

**Acceptance criteria**

- It feels snappier

---

## LF-14: Validate request payloads at the API boundary

As a developer, I want the create endpoint to reject malformed payloads with a
400 and a field-level message, so that bad data cannot reach the database.

**Acceptance criteria**

- Given a missing employeeId, when I POST, then I get 400 naming the field
- Given an end date before the start date, when I POST, then I get 400
- Given a well-formed payload, when I POST, then I get 201

**Out of scope:** client-side validation

---

## LF-15: Reconcile the balance counter with history

Rebuild the stored balance from approved requests so the counter cannot drift.

**Acceptance criteria**

- Given an employee with drift, when reconciliation runs, then used equals the sum of approved days
- Given cancellation, when it completes, then the counter comes back down

---

## LF-16: Add a CI workflow

As a team, we want format, lint, typecheck, test and build to run on every push,
so that a broken main branch is caught before review.

**Acceptance criteria**

- Given a pull request, when it is opened, then all five checks run and report
- Given a failing check, when it runs, then the PR is blocked from merge

**Out of scope:** deployment

---

## LF-17: Hooks for formatting and protected paths

Set up hooks.

---

## LF-18: Write the decision back to Jira

As a manager, I want the story status updated automatically when the agent
finishes, so that the board reflects reality without manual edits.

**Acceptance criteria**

- Given a completed implementation, when the skill ends, then the Jira story moves to In Review with a comment
- Given Jira rejects the transition, when it fails, then the agent reports the error and does not claim success

**Out of scope:** custom workflows

---

## LF-19: Weekly backlog grooming session

Hold a one-hour grooming session every Tuesday to review new stories.

---

## LF-20: Reduce requests page to two database queries

As a developer, I want the requests page to load its data in one round trip, so
that page latency does not grow with employee count.

**Acceptance criteria**

- Given 500 employees, when the page loads, then it issues at most two queries
- Given the page, when it renders, then no N+1 query appears in the log

**Out of scope:** caching layer
