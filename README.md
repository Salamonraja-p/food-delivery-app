# Food Delivery App

## Overview

Food Delivery App is a full-stack food ordering and management platform built with React, Node.js, Express, Prisma, and PostgreSQL. The application connects customers, food companies, delivery workflows, and administrators in one system.

Customers can discover food, manage their cart, place and track orders, submit ratings and feedback, and raise support tickets. Food companies can manage their menus and orders, while administrators can manage users, companies, subscriptions, reports, and platform activity.

## Features

### Customer Features

- User registration and login
- JWT-based authentication
- Browse available food items
- Add and remove items from the cart
- Place food orders
- View order history and order details
- Cancel eligible orders
- Track order status
- Submit food ratings and order feedback
- Create and manage support tickets

### Food Company Features

- Company account management
- Create, update, and delete food items
- Upload food images
- Manage company food listings
- View company orders
- Approve or reject orders
- Update order status through the delivery workflow
- View ratings and feedback
- Subscription-based limits for foods and orders

### Super Admin Features

- Dashboard statistics and platform analytics
- Manage users and food companies
- Approve or reject companies
- Manage subscription plans
- Monitor company subscriptions
- View revenue and report data
- Manage support tickets and platform activity

### Platform Features

- REST API architecture
- PostgreSQL database with Prisma ORM
- Role-based access control
- Password hashing with bcrypt
- Rate limiting and CORS configuration
- Real-time communication with Socket.IO
- Email notifications and scheduled email jobs
- File uploads with Multer
- Database migrations and seed data

## Order Status Flow

```text
PENDING
  ↓
CONFIRMED
  ↓
PREPARING
  ↓
OUT_FOR_DELIVERY
  ↓
DELIVERED
```

Orders may also be rejected or cancelled when the relevant business rules allow it.

## Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- React Toastify
- Recharts
- React Datepicker
- Lucide React
- XLSX export support

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JSON Web Tokens
- bcryptjs
- Socket.IO
- Multer
- Nodemailer
- node-cron
- express-rate-limit

## Project Structure

```text
Delivery_App/
├── backend/
│   ├── prisma/
│   │   ├── migrations/       # Database migration history
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.js           # Initial database data
│   ├── src/
│   │   ├── config/            # Application configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── jobs/              # Scheduled background jobs
│   │   ├── middleware/        # Authentication and request middleware
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic and database operations
│   │   ├── validators/        # Request validation
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/               # Uploaded files
│   ├── .env                   # Local backend configuration
│   └── package.json
├── frontend/
│   ├── public/                # Static assets
│   ├── src/                   # React application source
│   ├── .env                   # Local frontend configuration
│   └── package.json
└── README.md
```

## Main API Modules

The backend exposes API modules for:

- `/api/auth` — registration and login
- `/api/food` — food creation and management
- `/api/cart` — cart operations
- `/api/order` — order placement and status management
- `/api/super-admin` — administrator operations

Additional routes support ratings, feedback, subscriptions, reports, tickets, and company workflows.

## Getting Started

### Prerequisites

- Node.js 18 or later
- PostgreSQL
- npm
- A configured environment file for the backend and frontend

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Configure Backend Environment

Create `backend/.env` and provide values for your local environment, including the database connection, JWT secret, server port, administrator credentials, and email configuration.

Never commit `.env` files, passwords, private keys, or production credentials to GitHub.

### Prepare the Database

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### Start the Backend

```bash
cd backend
npm run dev
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Start the Frontend

```bash
cd frontend
npm run dev
```

Open the frontend URL displayed by Vite in your browser.

## Available Scripts

### Backend

```bash
npm run dev            # Start the backend with Nodemon
npx prisma generate    # Generate Prisma Client
npx prisma migrate dev # Apply development migrations
npx prisma db seed     # Seed initial data
```

### Frontend

```bash
npm run dev      # Start the Vite development server
npm run build    # Build the frontend for production
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## Security Notes

- Store secrets in environment variables.
- Do not commit `.env` files.
- Use a strong JWT secret in production.
- Use a restricted database user for deployed environments.
- Configure CORS for trusted frontend origins only.
- Rotate exposed credentials immediately if they are committed accidentally.

## Future Improvements

- Add automated backend and frontend tests
- Add payment gateway integration
- Add live map-based delivery tracking
- Add push notifications
- Add Docker and production deployment configuration
- Add CI/CD with GitHub Actions
- Add API documentation with Swagger or OpenAPI

## Author

Salamonraja P  
LinkedIn: [https://www.linkedin.com/in/salamonrajap/](https://www.linkedin.com/in/salamonrajap/)

## License

This project is intended for educational and portfolio purposes.
