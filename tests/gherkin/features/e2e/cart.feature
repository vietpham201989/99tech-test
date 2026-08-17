@e2e @regression @cart
Feature: Cart - Add Product to Cart
  As a logged-in user
  I want to add products to my cart
  So that I can purchase them later

  Background:
    Given I am on the login page
    And I open the login modal
    And I login with valid credentials
    And I wait for the page to load

  @cart01
  Scenario: Add product to cart
    When I select "Home" from header menu
    And I select the first product
    Then I add the product to cart

