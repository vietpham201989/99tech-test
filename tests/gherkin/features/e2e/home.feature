@e2e @regression @home
Feature: Home Page - Filter Products by Category
  As a user
  I want to filter products by category
  So that I can find products I'm interested in

  Background:
    Given I am on the login page
    And I wait for 3 seconds

  Scenario: Filter products by Phones category
    When I select "Home" from header menu
    And I select "Phones" from categories menu
    Then I should see products displayed
    And I should verify all products are valid

  Scenario: Filter products by Laptops category
    When I select "Home" from header menu
    And I select "Laptops" from categories menu
    Then I should see products displayed
    And I should verify all products are valid

  Scenario: Filter products by Monitors category
    When I select "Home" from header menu
    And I select "Monitors" from categories menu
    Then I should see products displayed
    And I should verify all products are valid

