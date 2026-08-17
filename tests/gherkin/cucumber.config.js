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
      "json:tests/gherkin/cucumber-report.json",
      "html:tests/gherkin/cucumber-report.html",
      "message:tests/gherkin/cucumber-messages.ndjson",
    ],
    formatOptions: {
      snippetInterface: "async-await",
    },
    publishQuiet: false,
  },
}

