Feature: Login
  As a registered user
  I want to log in with my username and password
  So that I can access my account dashboard

  Scenario: Successful Login with Valid Credentials
    Given I navigate to the login page
    When I enter my username
    And I enter my password
    And I click the login button
    Then I should see the contract listing