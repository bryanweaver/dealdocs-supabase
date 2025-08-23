Feature: Systematic Property Search Testing - Session session-1755991412555-lqgz7mpv1
  As a quality assurance engineer
  I want to systematically test property searches with 3 real Texas addresses
  So that I can identify data inconsistencies and API issues

  @systematic
  Scenario Outline: Property Search with Address "<address>" using "<searchString>"
    Given I navigate to the login page
    When I enter my username
    And I enter my password
    And I click the login button
    Then I should see the contract listing
    When I click on "Start New Contract"
    And I click on "Let's Go!"
    And I enter the address "<searchString>"
    And I capture any console errors
    And I select a random option from the dropdown if available
    And I click "Fetch Property Details"
    Then I should see the property details page
    And I record the test results for "<address>"

    Examples:
      | address | searchString |
      | 2301 Main St, Houston, TX | 2301 Main |
      | 4567 Oak Ave, Houston, TX | 4567 Oak |
      | 8910 Pine St, Houston, TX | 8910 Pine |
