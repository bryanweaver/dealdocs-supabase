Feature: Property Data UI Improvements
  As a user viewing property details
  I want to see improved display formatting
  So that the property information is clearer and better organized

  Scenario: Property with no price shows appropriate message
    Given I am viewing a property with no price information
    When I look at the price display area
    Then I should see "Price not available" without a dollar sign
    And I should not see "$" followed by undefined or null

  Scenario: Property status pills are properly sized
    Given I am viewing a property with status information
    When I look at the status pills
    Then the status pill should be larger with px-4 py-2 padding
    And the MLS number pill should not be displayed
    And only the property status should be shown

  Scenario: Recorded Transactions appear before Transaction History
    Given I am viewing a property with both transaction types
    When I scroll down to the history sections
    Then "Recorded Transactions" should appear before "Transaction History"
    And both sections should show newest entries first

  Scenario: Transaction History removes duplicates and filters properly
    Given I am viewing a property with duplicate status entries
    When I look at the Transaction History section
    Then I should not see duplicate entries with the same type and date
    And I should not see any entries without valid dates
    And all unique statuses should be displayed chronologically

  Scenario: Recorded Transactions only shows entries with names
    Given I am viewing a property with transaction data
    When I look at the Recorded Transactions section
    Then I should only see transactions that have buyer names
    And I should not see any transactions without buyer first or last names

  Scenario: Transaction History is properly sorted
    Given I am viewing a property with multiple status entries
    When I look at the Transaction History section
    Then the entries should be sorted with newest dates first
    And older entries should appear below newer ones

  Scenario: Price display consistency
    Given I am viewing property details
    When I look at the List Price in Property Specifications
    Then if no price is available, it should show "Not available"
    And if a price exists, it should show with a dollar sign 