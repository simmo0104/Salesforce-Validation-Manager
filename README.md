# Salesforce Validation Manager

A web application built using Angular and Salesforce APIs that allows users to authenticate with Salesforce, retrieve validation rules from an Account object, view their status, and manage them through a user-friendly interface.

## Features

* Salesforce OAuth 2.0 Login
* Retrieve Validation Rules using Salesforce Tooling API
* Display Validation Rule Name and Status (Active/Inactive)
* Enable or Disable Validation Rules
* Deploy changes back to Salesforce
* Responsive Angular UI

## Tech Stack

* Angular
* TypeScript
* Salesforce Developer Org
* Salesforce OAuth 2.0
* Salesforce Tooling API
* Salesforce Metadata API

## Salesforce Configuration

### Prerequisites

1. Create a Salesforce Developer Org.
2. Create a Connected App.
3. Enable OAuth Settings.
4. Add the required OAuth scopes:

   * Access and manage your data (api)
   * Perform requests at any time (refresh_token, offline_access)
   * Access identity URL service (id)

### Callback URL

For local development:

http://localhost:4200/callback

For production deployment:

lucky-lily-6987d2.netlify.app/callback

### Validation Rules Created

* Phone_required
* Billing_Country_Required_For_Industry
* Account_Name_No_All_Numbers
* Annual_Revenue_Must_Be_Positive
* Website_must_be_HTTPS

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd sf-validation-manager
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
ng serve
```

Open:

http://localhost:4200

## Deployment

Application deployed using Netlify.

Live URL:

lucky-lily-6987d2.netlify.app


## Author

Simran Khan
