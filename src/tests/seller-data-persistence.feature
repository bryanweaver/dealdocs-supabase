Feature: Seller Data Persistence
  As a user creating a real estate contract
  I want my seller information to be saved
  So that I don't lose my work when navigating between pages

  Background:
    Given I am logged in as a test user
    And I am on the form page for a new contract

  Scenario: Seller data persists after navigation
    When I fill in the seller information:
      | field                    | value              |
      | sellerFirstName          | John               |
      | sellerLastName           | Smith              |
      | sellerEmail              | john@example.com   |
      | sellerPhone              | 5125551234         |
    And I save the form
    And I navigate to the contracts page
    And I navigate back to the form page
    Then the seller information should be preserved:
      | field                    | value              |
      | sellerFirstName          | John               |
      | sellerLastName           | Smith              |
      | sellerEmail              | john@example.com   |
      | sellerPhone              | 5125551234         |
