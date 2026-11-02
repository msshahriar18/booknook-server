# BookNook Server

Express and MongoDB API for BookNook, a small online library where people add books, borrow them for seven days and return them.

## Routes

| Method | Route | Access |
| --- | --- | --- |
| GET | `/books` | public, supports `?limit=`, `?email=`, `?category=` |
| GET | `/books/:id` | token required |
| POST | `/books` | token required |
| PATCH | `/books/:id` | token required |
| DELETE | `/books/:id` | token required |
| POST | `/borrows` | token required |
| GET | `/borrows` | token required, returns the logged in user's borrows |
| DELETE | `/borrows/:id` | token required, returns the book |

## Run it

```bash
npm install
npm run dev
```

`.env` needs `MONGODB_URI` and `CLIENT_URL`. The client's BetterAuth JWKS endpoint at `CLIENT_URL/api/auth/jwks` is what every protected route is verified against.
