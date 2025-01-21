# Material Request Management System - Frontend

## Introduction

The frontend of the Material Request Management System is built using Next.js. It provides a user-friendly interface for users in the Production and Warehouse departments to manage material requests efficiently.

## Features

- **User Authentication**: Secure login using JWT (JSON Web Token).
- **Role-Based Access Control (RBAC)**: Different functionalities for Production and Warehouse departments.
- **Material Request Management**: Create, view, and manage material requests.

## Technologies Used

- **Frontend**: Next.js
- **UI Framework**: Mantine, Sweet Alert, Shadcn UI & Tailwind CSS

## Installation

To set up the frontend on your local machine, follow these steps:

### Prerequisites

- Node.js (version 14 or higher)
- Git

### Step 1: Clone the Repository

Clone the repository to your local machine using the following command:

### Step 2: Set Up the Frontend

1. Navigate to the frontend directory:

   ```bash
   cd MaterialManagementNextJs
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Run the Next.js application:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to access the application.

## Troubleshooting CORS Issues
   If you encounter any issues related to CORS (Cross-Origin Resource Sharing) errors while running the frontend, please note that these are typically caused by restrictions in accessing resources from a different domain. To resolve this, I recommend using the CORS       Unblock extension.

   How to Use CORS Unblock
   - Install the Extension:

  -  You can install the CORS Unblock extension for your browser (e.g., Chrome or Firefox).
   Visit the browser extension store and search for CORS Unblock, then click Add to Chrome or Add to Firefox.
   Enable CORS Unblock:

   - After installation, click the extension icon in your browser toolbar to enable it. It should unblock CORS for any local requests to the backend during development.
   Resolve CORS Errors:

   - Once the extension is enabled, refresh the page and try making requests again. This should resolve the CORS errors and allow smooth communication between the frontend and backend.


## User Roles

1. **Production Department**:

   - Create, update, or delete material requests.
   - Check the status of material requests (pending approval, approved, or rejected).

2. **Warehouse Department**:
   - View incoming material requests.
   - Approve or reject material requests, providing reasons if necessary.

## Notes

I am very open to feedback and suggestions from everyone. Your insights will help improve this project and make it more effective for users. Thank you for your support!
