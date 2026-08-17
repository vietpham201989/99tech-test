# Tech99 - Playwright Test Automation

A Playwright-based test automation framework with multi-environment support, comprehensive reporting, and CI/CD integration.

## Project Structure


```
tech99/
├── .github/
│   └── workflows/
│       ├── playwright-e2e.yml    # Playwright E2E workflow
│       ├── playwright-api.yml    # Playwright API workflow
│       └── performance.yml       # K6 Performance workflow
├── pageObjects/                  # Page Object Model classes
│   ├── basePage.ts              # Base page with common actions
│   ├── indexPage.ts             # Home page object
│   └── ...                      # Other page objects
├── tests/
│   ├── api/                     # API tests
│   └── e2e/                     # End-to-end tests
│       └── login.spec.ts        # Login test scenarios
├── allure-results/              # Allure test reports (generated)
├── playwright-report/           # Playwright HTML reports (generated)
├── test-results/                # Test execution results (generated)
├── performance-tests/           # K6 performance tests
│   ├── login-test.js            # Example K6 test
│   ├── k6-results.json          # K6 test results (generated)
│   └── package.json             # K6 dependencies and scripts
├── .env.stg                     # Staging environment variables
├── .env.uat                     # UAT environment variables
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Project dependencies and scripts
├── eslint.config.mjs            # ESLint configuration
└── helpers/                     # Utility and constants files
  ├── constants.ts
  └── utilities.ts
```
# K6 Performance Tests

K6 is used for API and performance testing. K6 scripts are located in the `performance-tests/` directory.

### Example K6 Test: `performance-tests/login-test.js`

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
        { duration: '20', target: 50 },
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

### Running K6 Performance Tests

From the `performance-tests/` directory:

```bash
# Run the login performance test and output results to k6-results.json
npm run test:performance -- -e ENV:<environment> login-test.js

# Run a specific test file
npm run test:performance:ci:file -- -e ENV:<environment> <your-test-file.js>
```

Test results are saved to `performance-tests/k6-results.json`.

For more information, see the [K6 documentation](https://k6.io/docs/).

## Environment Configuration

The framework supports multiple environments through `.env` files. Create environment-specific configuration files:

### Example: `.env.stg`
```bash
# Staging Environment
BASE_URL=https://staging.demoblaze.com
API_URL=https://api.staging.demoblaze.com
TIMEOUT=30000
```

### Example: `.env.uat`
```bash
# UAT Environment
BASE_URL=https://uat.demoblaze.com
API_URL=https://api.uat.demoblaze.com
TIMEOUT=30000
```

**Note:** The framework will load the appropriate `.env` file based on the `RUNNING_ENV` environment variable.

## Running Tests

### Local Execution

Run tests against **staging** environment (default):
```bash
npm run test:e2e-chromium
```

Run tests against **UAT** environment:
```bash
RUNNING_ENV=.uat npm run test:e2e-chromium
```

Run tests in **headless mode** (CI):
```bash
npm run test:e2e-chromium:ci
```

Run tests with **Firefox**:
```bash
npm run test:e2e-firefox
RUNNING_ENV=.uat npm run test:e2e-firefox
```

### Running Tests by Tag

Use the `--` option to pass additional Playwright arguments. Tag your tests in spec files with `@tag`:

```typescript
// Example test with tags
test('@smoke @login User can login successfully', async ({ page }) => {
  // test code
});

test("Should login successfully with valid credential", { tag: ["@loginSuccess"] }, async (page) => {
}
```

Run tests by **tag**:
```bash
# Run smoke tests only
npm run test:e2e-chromium -- --grep @smoke

# Run login tests only
npm run test:e2e-chromium -- --grep @login

# Run tests with multiple tags (OR logic - match any tag)
npm run test:e2e-chromium -- --grep "@smoke|@regression"

# Run tests with multiple tags (AND logic - match all tags)
npm run test:e2e-chromium -- --grep "(?=.*@smoke)(?=.*@login)"

# Exclude specific tags
npm run test:e2e-chromium -- --grep-invert @skip

# Combine with environment
RUNNING_ENV=.uat npm run test:e2e-chromium -- --grep @smoke

# Multiple tags with environment
RUNNING_ENV=.uat npm run test:e2e-chromium -- --grep "@smoke|@regression"
```

### Available Scripts

```bash
# Testing
npm run test:e2e-chromium        # Run E2E tests in Chromium (headed)
npm run test:e2e-chromium:ci     # Run E2E tests in Chromium (headless)
npm run test:e2e-firefox         # Run E2E tests in Firefox (headed)
npm run test:e2e-firefox:ci      # Run E2E tests in Firefox (headless) 

# Reports
npm run serve-report             # Serve Allure report

# Code Quality
npm run format:check             # Check code formatting
npm run format:fix               # Fix code formatting
npm run lint:check               # Check linting issues
npm run lint:fix                 # Fix linting issues
```

## GitHub Actions CI/CD

The workflow supports manual environment selection:

1. Go to **Actions** tab in GitHub
2. Select **Playwright Tests** workflow
3. Click **Run workflow**
4. Choose environment: `stg` or `uat`
5. Click **Run workflow**

For push/PR events, tests run against **staging** by default.

## Installation

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

## Reports

- **Playwright HTML Report**: `playwright-report/index.html`
- **Allure Report**: Run `npm run serve-report` to view
- **JUnit Report**: `results.xml` (for CI integration)
