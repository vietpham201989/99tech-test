@api @regression
Feature: Cart API
  As a system
  I want to test cart API endpoints
  So that I can verify cart functionality

  Scenario: Verify view cart of user successfully
    Given I have a valid authentication token
    When I send POST request to "/viewcart" with the token
    Then I should receive status code 200
    And I should see the cart information
    And the response should match the view cart schema

