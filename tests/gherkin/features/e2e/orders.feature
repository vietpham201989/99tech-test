@e2e @regression @orders
Feature: Orders - Place Order
  As a logged-in user with items in cart
  I want to place an order
  So that I can complete my purchase

  Background:
    Given I am on the login page
    And I open the login modal
    And I login with valid credentials
    And I select "Cart" from header menu
    And I add product to cart if cart is empty
    And I select "Cart" from header menu

  @orders01
  Scenario: Place order with valid information
    When I get the cart table data
    And I calculate the total price
    And I tap the "Place Order" button
    And I fill in order information
    And I submit the order
    Then I should see success message "Thank you for your purchase!"
    And I should see the order amount in the confirmation
    And I should see the credit card number in the confirmation
    And I should see the customer name in the confirmation
    And I tap "OK" button

