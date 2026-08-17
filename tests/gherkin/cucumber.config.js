module.exports = {
  default: {
    require: [
      "tests/gherkin/step_definitions/**/*.ts",
      "tests/gherkin/step_definitions/**/*.js",
    ],
    requireModule: ["ts-node/register"],
    format: [
      "progress-bar",
      "pretty",
      "summary",
      "json:tests/gherkin/reports/cucumber-report.json",
      "html:tests/gherkin/reports/cucumber-report.html",
      "message:tests/gherkin/reports/cucumber-messages.ndjson",
    ],
    formatOptions: {
      snippetInterface: "async-await",
    },
    publishQuiet: false,
  },
}

