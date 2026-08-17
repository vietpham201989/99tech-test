@api @regression
Feature: Account API
  As a system
  I want to test account API endpoints
  So that I can verify authentication functionality

  Scenario: Login successfully via API
    When I send POST request to "/login" with username and password
    Then I should receive status code 200
    And I should see the login information

  Scenario: Check account information via API
    Given I have a valid authentication token
    When I send POST request to "/check" with the token
    Then I should receive status code 200
    And I should see the account information

