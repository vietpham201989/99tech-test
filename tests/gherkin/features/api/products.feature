@api @regression
Feature: Products API
  As a system
  I want to test products API endpoints
  So that I can verify product functionality

  Scenario: Verify get products successfully
    When I send GET request to "/entries"
    Then I should receive status code 200
    And I should see the products information
    And the response should match the products schema

  Scenario: Verify view product successfully
    Given I have retrieved the list of products
    When I send POST request to "/view" with the first product ID
    Then I should receive status code 200
    And I should see the product information
    And the response should match the product schema

