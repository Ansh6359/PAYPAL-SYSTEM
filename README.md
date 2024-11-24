# PayPal System

A simple web-based PayPal-like system that allows users to register, log in, view their wallet balance, add funds to their wallet, send money, and view their transaction history.

## Features:
- User Registration & Login
- View Wallet Balance
- Add Funds to Wallet
- Send Money to Another User
- View Transaction History (Sent and Received)

## Tech Stack:
- **Backend**: Node.js, Express.js
- **Database**: Sequelize ORM with SQLite (or any other database you prefer)
- **Frontend**: Pug (Jade), HTML, CSS, Bootstrap
- **Authentication**: Passport.js (for user login and session management)
- **Password Hashing**: bcrypt.js

## Prerequisites:
Before you begin, ensure you have the following installed on your machine:

- Node.js (v14 or above)
- npm (Node Package Manager)

## Installation:

1. Clone the repository:
   ```bash
   cd PaypalSystem
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - The project uses Sequelize ORM to interact with the database. By default, it uses SQLite.
   - If you want to use a different database (like MySQL or PostgreSQL), you'll need to configure the `config/database.js` file accordingly.

4. Start the application:
   ```bash
   npm start
   ```

5. Open the application in your browser:
   ```bash
   http://localhost:3000
   ```

## API Routes:

- **`GET /`**: Home page (checks if user is authenticated and shows wallet balance).
- **`GET /login`**: Login page for authenticated users.
- **`POST /login`**: Handles login form submission.
- **`GET /register`**: Registration page for new users.
- **`POST /register`**: Handles user registration.
- **`GET /transactions`**: View transaction history (sent and received transactions).
- **`POST /add-money`**: Add funds to the user's wallet.
- **`POST /send-money`**: Send money to another user.

## Authentication:

- **Registration**: New users can create an account by providing a `username`, `email`, and `password`. Passwords are hashed using bcrypt for security.
- **Login**: Users log in with their credentials (username/email and password). Sessions are managed using Passport.js.
- **Session Management**: Once authenticated, the session is maintained for the user.

## How to Use:

1. **Sign Up**: Navigate to the register page (`/register`) to create a new account.
2. **Login**: After registration, log in with your credentials (`/login`).
3. **View Wallet**: After logging in, you can view your wallet balance and recent transactions.
4. **Add Funds**: Use the "Add Funds" button to deposit money into your wallet.
5. **Send Money**: Use the "Send Money" form to transfer funds to other users.
6. **Transaction History**: View sent and received transactions from your dashboard.

