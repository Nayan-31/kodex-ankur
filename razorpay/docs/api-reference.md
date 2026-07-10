# API Reference

Base URL: `http://localhost:3000`

All protected routes require this header:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Common Response Format

Success responses usually return either a JSON document or a small message object such as:

```json
{
  "message": "..."
}
```

Errors return:

```json
{
  "message": "Human readable error message"
}
```

## Authentication

### Register User

`POST /api/auth/register`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Required fields:

- `name` string
- `email` string
- `password` string, minimum 6 characters

Success response: `201 Created`

```json
{
  "message": "User registered successfully",
  "token": "<jwt_token>",
  "user": {
    "id": "66b7d2b6e6a5b7c9f9f3a111",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Possible errors:

- `400 Bad Request` when required fields are missing
- `409 Conflict` when the email already exists

### Login User

`POST /api/auth/login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Required fields:

- `email` string
- `password` string

Success response: `200 OK`

```json
{
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": {
    "id": "66b7d2b6e6a5b7c9f9f3a111",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Possible errors:

- `400 Bad Request` when required fields are missing
- `401 Unauthorized` when credentials are invalid

## Products

### List Products

`GET /api/products`

Auth: not required

Success response: `200 OK`

```json
[
  {
    "_id": "66b7d2b6e6a5b7c9f9f3a222",
    "name": "Wireless Mouse",
    "description": "Ergonomic mouse",
    "price": 999,
    "stock": 10,
    "category": "accessories",
    "imageUrl": "",
    "active": true,
    "createdAt": "2026-07-10T10:00:00.000Z",
    "updatedAt": "2026-07-10T10:00:00.000Z",
    "__v": 0
  }
]
```

### Get Product By Id

`GET /api/products/:id`

Auth: not required

Path parameter:

- `id` product MongoDB ObjectId

Success response: `200 OK`

```json
{
  "_id": "66b7d2b6e6a5b7c9f9f3a222",
  "name": "Wireless Mouse",
  "description": "Ergonomic mouse",
  "price": 999,
  "stock": 10,
  "category": "accessories",
  "imageUrl": "",
  "active": true,
  "createdAt": "2026-07-10T10:00:00.000Z",
  "updatedAt": "2026-07-10T10:00:00.000Z",
  "__v": 0
}
```

Possible errors:

- `404 Not Found` when the product does not exist

### Create Product

`POST /api/products`

Auth: required

Request body:

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic mouse",
  "price": 999,
  "stock": 10,
  "category": "accessories",
  "imageUrl": "https://example.com/mouse.png",
  "active": true
}
```

Required fields:

- `name` string
- `price` number
- `stock` number

Optional fields:

- `description` string
- `category` string
- `imageUrl` string
- `active` boolean

Success response: `201 Created`

The response is the full created product document:

```json
{
  "_id": "66b7d2b6e6a5b7c9f9f3a222",
  "name": "Wireless Mouse",
  "description": "Ergonomic mouse",
  "price": 999,
  "stock": 10,
  "category": "accessories",
  "imageUrl": "https://example.com/mouse.png",
  "active": true,
  "createdAt": "2026-07-10T10:00:00.000Z",
  "updatedAt": "2026-07-10T10:00:00.000Z",
  "__v": 0
}
```

### Update Product

`PUT /api/products/:id`

Auth: required

Path parameter:

- `id` product MongoDB ObjectId

Request body:

Any product field can be sent for update, for example:

```json
{
  "price": 1099,
  "stock": 8
}
```

Success response: `200 OK`

Returns the updated product document.

Possible errors:

- `404 Not Found` when the product does not exist

### Delete Product

`DELETE /api/products/:id`

Auth: required

Path parameter:

- `id` product MongoDB ObjectId

Success response: `200 OK`

```json
{
  "message": "Product deleted successfully"
}
```

Possible errors:

- `404 Not Found` when the product does not exist

## Cart

All cart routes require a valid JWT.

Cart item shape:

```json
{
  "product": {
    "_id": "66b7d2b6e6a5b7c9f9f3a222",
    "name": "Wireless Mouse",
    "description": "Ergonomic mouse",
    "price": 999,
    "stock": 10,
    "category": "accessories",
    "imageUrl": "",
    "active": true,
    "createdAt": "2026-07-10T10:00:00.000Z",
    "updatedAt": "2026-07-10T10:00:00.000Z",
    "__v": 0
  },
  "quantity": 2
}
```

### Get My Cart

`GET /api/cart`

Auth: required

Success response: `200 OK`

If the cart exists:

```json
{
  "_id": "66b7d2b6e6a5b7c9f9f3a333",
  "user": "66b7d2b6e6a5b7c9f9f3a111",
  "items": [
    {
      "product": {
        "_id": "66b7d2b6e6a5b7c9f9f3a222",
        "name": "Wireless Mouse"
      },
      "quantity": 2
    }
  ],
  "createdAt": "2026-07-10T10:00:00.000Z",
  "updatedAt": "2026-07-10T10:00:00.000Z",
  "__v": 0
}
```

If the cart does not exist yet:

```json
{
  "user": "66b7d2b6e6a5b7c9f9f3a111",
  "items": []
}
```

### Add Item To Cart

`POST /api/cart/items`

Auth: required

Request body:

```json
{
  "productId": "66b7d2b6e6a5b7c9f9f3a222",
  "quantity": 2
}
```

Required fields:

- `productId` string, valid product ObjectId

Optional fields:

- `quantity` number, defaults to `1`

Success response: `200 OK`

Returns the updated cart document with populated products.

Possible errors:

- `400 Bad Request` when `productId` is missing
- `404 Not Found` when the product does not exist

### Update Cart Item Quantity

`PATCH /api/cart/items/:productId`

Auth: required

Path parameter:

- `productId` product ObjectId already in the cart

Request body:

```json
{
  "quantity": 3
}
```

Required fields:

- `quantity` number

Success response: `200 OK`

Returns the updated cart document with populated products.

Possible errors:

- `404 Not Found` when the cart or cart item does not exist

### Remove Cart Item

`DELETE /api/cart/items/:productId`

Auth: required

Path parameter:

- `productId` product ObjectId to remove from the cart

Success response: `200 OK`

Returns the updated cart document with populated products.

Possible errors:

- `404 Not Found` when the cart does not exist

### Clear Cart

`DELETE /api/cart`

Auth: required

Success response: `200 OK`

```json
{
  "message": "Cart cleared successfully"
}
```

Possible errors:

- `404 Not Found` when the cart does not exist

## Environment Variables

The server expects these values in `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/razorpay_local
JWT_SECRET=your-secret-value
```
