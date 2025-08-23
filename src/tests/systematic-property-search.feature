Feature: Systematic Property Search Testing
  As a quality assurance engineer
  I want to systematically test property searches with various Texas addresses
  So that I can identify data inconsistencies and API issues

  Scenario Outline: Property Search with Address "<address>"
    Given I navigate to the login page
    When I enter my username
    And I enter my password
    And I click the login button
    Then I should see the contract listing
    When I click on "Start New Contract"
    And I click on "Let's Go!"
    And I enter the address "<address>"
    And I capture any console errors
    And I select a random option from the dropdown if available
    And I click "Fetch Property Details"
    Then I should see the property details page
    And I record the test results for "<address>"

    Examples:
      | address |
      # Addresses will be generated dynamically 