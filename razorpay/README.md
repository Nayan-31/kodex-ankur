# Razorpay Express API

An Express API scaffold using ES modules, Morgan logging, JWT auth, and MongoDB models for products and carts.

Full endpoint documentation is available in [docs/api-reference.md](docs/api-reference.md).

## Setup

1. Install dependencies.
2. Make sure MongoDB is running locally.
3. Start the server with `npm run dev`.

## Environment

The app reads these values from `.env`:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
