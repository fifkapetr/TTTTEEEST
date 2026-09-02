# Testing Guide

## What is covered

Unit tests cover:

- `src/services/loanService.ts`
  - loading and saving loans
  - creation validation
  - status updates
  - auto-decision rules
  - monthly payment calculation
- `src/components/LoanForm.vue`
  - form validation
  - service call payload
  - `created` event emission
  - error handling from service
- `src/components/LoanList.vue`
  - empty state
  - rendered loan details and formatting
  - pending actions (`approve`, `reject`, `autoDecide`)
  - hidden actions for non-pending items
- `src/components/LoanSummary.vue`
  - totals by status
  - total approved amount
- `src/App.vue`
  - initial loan loading on mount
  - refresh flow after child events
  - approve/reject/auto-decision handlers

## Run tests locally

```bash
npm run test
```

## Run tests with reports

```bash
npm run test:report
```

Generated outputs:

- `reports/test-report.html` - test execution report
- `reports/test-results.json` - machine-readable test results
- `reports/coverage/index.html` - coverage report entry page

## CI behavior

On every pull request targeting `main`, GitHub Actions:

1. Installs dependencies
2. Runs lint
3. Runs tests with reports
4. Builds the app
5. Uploads test report artifacts
6. Publishes a simple test/coverage overview in the workflow summary
