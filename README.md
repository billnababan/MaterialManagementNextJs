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
   cd Client
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

## User Roles

1. **Production Department**:

   - Create, update, or delete material requests.
   - Check the status of material requests (pending approval, approved, or rejected).

2. **Warehouse Department**:
   - View incoming material requests.
   - Approve or reject material requests, providing reasons if necessary.

## Notes

I am very open to feedback and suggestions from everyone. Your insights will help improve this project and make it more effective for users. Thank you for your support!
