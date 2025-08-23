Feature: Property Search
  As a logged-in user
  I want to search for properties
  So that I can start a new contract with property details

  Scenario: Successful Property Search with Random Address
    Given I navigate to the login page
    When I enter my username
    And I enter my password
    And I click the login button
    Then I should see the contract listing
    When I click on "Start New Contract"
    And I click on "Let's Go!"
    And I enter a random 4-digit address in Texas
    And I select a random option from the dropdown
    And I click "Fetch Property Details"
    Then I should see the property details page 