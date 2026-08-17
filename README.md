# Tech99 - Playwright Test Automation

A Playwright-based test automation framework with multi-environment support, comprehensive reporting, and CI/CD integration.

## Project Structure

```
tech99/
├── .github/workflows/          # GitHub Actions workflows
├── api/                       # API classes (AccountApi, CartApi, etc.)
├── data/                      # Test data (account.json, config.json, etc.)
├── helpers/                   # Utility functions and constants
├── pageObjects/               # Page Object Model classes
├── tests/
│   ├── api/                   # API tests
│   ├── e2e/                   # End-to-end tests
│   └── gherkin/               # Gherkin/Cucumber tests
│       ├── features/          # Feature files (e2e, api)
│       ├── step_definitions/  # Step definitions (e2e, api)
│       └── helpers/           # Helper functions
├── performance-tests/         # K6 performance tests
├── .env.stg                   # Staging environment variables
├── .env.uat                   # UAT environment variables
├── playwright.config.ts       # Playwright configuration
├── playwright.api.config.ts   # Playwright API configuration
├── eslint.config.mjs          # ESLint configuration
├── package.json               # Project dependencies and scripts
├── allure-results/            # Allure reports (generated)
├── playwright-report/         # Playwright HTML reports (generated)
└── test-results/              # Test execution results (generated)
```

## Installation

```bash
npm ci
npx playwright install --with-deps
```

## Environment Configuration

Create environment-specific `.env` files:

**`.env.stg`** (Staging):
```bash
BASE_URL=https://staging.demoblaze.com
API_URL=https://api.staging.demoblaze.com
TIMEOUT=30000
```

**`.env.uat`** (UAT):
```bash
BASE_URL=https://uat.demoblaze.com
API_URL=https://api.uat.demoblaze.com
TIMEOUT=30000
```

The framework loads the appropriate `.env` file based on the `RUNNING_ENV` or `ENV` environment variable.

## Running Tests

### Playwright Tests

```bash
# E2E Tests
npm run test:e2e-chromium        # Chromium (headed)
npm run test:e2e-chromium:ci     # Chromium (headless)
npm run test:e2e-firefox         # Firefox (headed)
npm run test:e2e-firefox:ci      # Firefox (headless)

# Run by tag
npm run test:e2e-chromium -- --grep @regression
npm run test:e2e-chromium -- --grep "@login|@regression"
npm run test:e2e-chromium -- --grep-invert @skip

# With environment
RUNNING_ENV=.uat npm run test:e2e-chromium
```

### Gherkin/Cucumber Tests

```bash
# E2E Tests
npm run test:gherkin:e2e              # All E2E (Chromium)
npm run test:gherkin:e2e:chromium     # Chromium
npm run test:gherkin:e2e:firefox      # Firefox
npm run test:gherkin:e2e:webkit       # WebKit

# API Tests
npm run test:gherkin:api              # All API tests

# All Tests
npm run test:gherkin:all              # E2E + API

# With browser/environment
BROWSER=firefox npm run test:gherkin:e2e
ENV=uat npm run test:gherkin:e2e
ENV=uat BROWSER=firefox npm run test:gherkin:e2e
```

### Run by Feature File or Tag

```bash
# E2E: Run specific feature file
npm run test:gherkin:e2e:file -- tests/gherkin/features/e2e/login.feature

# E2E: Run by tag
npm run test:gherkin:e2e:tag -- @login
npm run test:gherkin:e2e:tag -- "@login or @regression"

# API: Run specific feature file
npm run test:gherkin:api:file -- tests/gherkin/features/api/account.feature

# API: Run by tag
npm run test:gherkin:api:tag -- @api

# With browser/environment
BROWSER=firefox npm run test:gherkin:e2e:tag -- @login
ENV=uat npm run test:gherkin:e2e:file -- tests/gherkin/features/e2e/login.feature
```

### K6 Performance Tests

K6 is used for API and performance testing. K6 scripts are located in the `performance-tests/` directory.

**Example K6 Test**: `performance-tests/login-test.js`

This script performs a login load test against the API:

```js
import http from "k6/http"
import { check, sleep } from "k6"
import encoding from "k6/encoding"
const accData = JSON.parse(open("../data/account.json"))
const configData = JSON.parse(open("../data/api/config.json"))
const env = __ENV.ENV || 'stg';

export const options = {
  scenarios: {
    user_login_load: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 5,
      maxVUs: 50,
      stages: [
        { duration: '5s', target: 50 },
        { duration: '20s', target: 50 },
      ],
    },
  },
}

const BASE_API_URL = configData[env].API_URL

export default function () {
  let user = accData[env].username
  let password = accData[env].password
  const pass = encoding.b64encode(password)
  const res = http.post(
    `${BASE_API_URL}/login`,
    JSON.stringify({ username: user, password: pass }),
    { headers: { "Content-Type": "application/json" } }
  )
  check(res, {
    "status 200": (r) => r.status === 200,
    "token exists": (r) => !!res.body.startsWith("\"Auth_token:"),
    "response time < 500ms": (r) => r.timings.duration < 500,
  })
  sleep(1)
}
```

**Running K6 Performance Tests**

From the `performance-tests/` directory:

```bash
# Run the login performance test and output results to k6-results.json
npm run test:performance -- -e ENV:stg login-test.js

# Run in CI mode (no debug output)
npm run test:performance:ci -- -e ENV:stg login-test.js

# Run with different environment
npm run test:performance -- -e ENV:uat login-test.js
```

Test results are saved to `performance-tests/k6-results.json`.

For more information, see the [K6 documentation](https://k6.io/docs/).

## Available Scripts

```bash
# Playwright Tests
npm run test:e2e-chromium        # Run E2E in Chromium (headed)
npm run test:e2e-chromium:ci     # Run E2E in Chromium (headless)
npm run test:e2e-firefox         # Run E2E in Firefox (headed)
npm run test:e2e-firefox:ci      # Run E2E in Firefox (headless)

# Gherkin Tests
npm run test:gherkin:e2e         # All E2E Gherkin tests
npm run test:gherkin:e2e:chromium # E2E in Chromium
npm run test:gherkin:e2e:firefox  # E2E in Firefox
npm run test:gherkin:e2e:webkit   # E2E in WebKit
npm run test:gherkin:api         # All API Gherkin tests
npm run test:gherkin:all         # All Gherkin tests

# K6 Performance Tests (from performance-tests/ directory)
cd performance-tests && npm run test:performance -- -e ENV:stg login-test.js

# Reports
npm run serve-report             # Serve Allure report

# Code Quality
npm run format:check             # Check formatting
npm run format:fix               # Fix formatting
npm run lint:check               # Check linting
npm run lint:fix                 # Fix linting
```

## Reports

- **Playwright HTML Report**: `playwright-report/index.html`
- **Allure Report**: `allure-results/` (view with `npm run serve-report`)
- **Cucumber Reports**: `tests/gherkin/cucumber-report.html` and `.json`
- **Screenshots**: `test-results/gherkin-screenshots/` (on failure)

## GitHub Actions CI/CD

### Workflows

- **playwright-e2e.yml**: Playwright E2E tests
- **playwright-api.yml**: Playwright API tests
- **gherkin-e2e.yml**: Gherkin E2E tests (Chromium)
- **gherkin-api.yml**: Gherkin API tests
- **performance.yml**: K6 performance tests

### Running Workflows

1. Go to **Actions** tab in GitHub
2. Select the workflow
3. Click **Run workflow**
4. Choose environment: `stg` or `uat`

For push/PR events, tests run against **staging** by default.

### Artifacts

After workflow completion, you can download:
- Cucumber Reports (HTML/JSON)
- Allure Results (JSON files)
- Allure Report (Single HTML file)
- Screenshots (on failure)

## Notes

- **Gherkin Tests**: Use same page objects and API classes as Playwright tests
- **Browser Support**: Chromium (default), Firefox, WebKit
- **Environment Variables**: `ENV` (stg/uat), `BASE_URL`, `API_URL`, `BROWSER`
- **CI Mode**: Tests automatically run headless on GitHub Actions
- **Screenshots**: Automatically captured on test failure
- **Allure Reports**: Generated automatically for each scenario
