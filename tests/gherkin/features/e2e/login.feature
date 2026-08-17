@e2e @regression @login
Feature: Login Page
  As a user
  I want to login to my account
  So that I can access my account features

  Background:
    Given I am on the login page
    And I wait for 3 seconds

  @loginSuccess
  Scenario: Login with valid credentials
    When I open the login modal
    And I login with valid credentials
    Then I should be logged in successfully
    And I should see my username displayed

