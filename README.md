# MiniJournal — Backend (README)

A clear, step-by-step guide to run and test the MiniJournal backend APIs using **Postman**.

---

## What this repo contains

* Backend for a mini journaling app (Node + Express + MongoDB + Mongoose)
* Features:

  * Sign up
  * Sign in (JWT)
  * JWT-based auth middleware (expects cookie `token`)
  * Password hashing with bcrypt
  * CRUD for journal **entries**

---

## Prerequisites

* Node.js (v16+ recommended)
* MongoDB instance (local or Atlas)
* Postman installed

---

## Repository Setup (for beginners)

🔹 Step 1: Fork the Repository

Go to the GitHub repository you want to work on.

In the top-right corner, click the Fork button.

This will create a copy of the repo under your own GitHub account.

🔹 Step 2: Clone Your Fork

Now bring your forked repo into your local machine.

```bash
// Replace <your-username> with your GitHub username
git clone https://github.com/<your-username>/<repo-name>.git
```

Example:

```bash
git clone https://github.com/deepak/my-daily-journal.git
```


🔹 Step 3: Move Into the Project Directory
cd my-daily-journal

```bash
cd my-daily-journal
```

🔹 Step 4 (Optional but Recommended): Add Upstream Remote

This lets you sync changes from the original repo later.

```bash
git remote add upstream https://github.com/<original-owner>/<repo-name>.git
```


Now you’re all set 🚀.

## Environment

Create a `.env` file in the project root and set at minimum:

```
dburl=mongodb://localhost:27017/mini-journal   # <-- your MongoDB connection string (variable name: dburl)
JWT_SECRET=your_jwt_secret_here
```

> You **must** use the environment variable name `dburl` for the MongoDB URL per repo requirement.

---

## Start the server

1. Install dependencies:

```bash
npm install
```

2. Start the server (replace with your start command if different):

```bash
npm run dev    # or: node index.js
```

Server assumed to run on `http://localhost:8000` (adjust if different).

---

## Quick Postman notes (important)

* Auth uses a cookie named `token`. After sign-in the backend should set `Set-Cookie: token=...`.
* Postman will store cookies automatically for the domain. After signing in:

  * Click the **Cookies** button (top-right in Postman) → select `localhost` → you should see a cookie `token`.
  * Subsequent requests to the same domain will include that cookie automatically.


---

## API endpoints (assumed base `http://localhost:8000`)

> Provided CRUD entry endpoints are already in your code:

* `POST /createEntry` — create an entry
* `GET /entries` — list entries (reverse chronological)
* `PATCH /entries/:id` — update entry content
* `DELETE /entries/:id` — delete entry

Auth endpoints (common naming used here; if your code uses different routes, replace accordingly):

* `POST /signup` — create user account
* `POST /signin` — sign in (sets JWT cookie `token`)

---

## Step-by-step: Test flow in Postman

### 1) Sign up (create user)

* Method: `POST`
* URL: `http://localhost:8000/signup`
* Headers: `Content-Type: application/json`
* Example Body (raw JSON):

```json
{
  "name": "Deepak",
  "userName": "deepak01",
  "email": "deepak@example.com",
  "password": "StrongPassword123"
}
```

* Expected: `201 Created` (or `200`) and a successful message. If email/userName duplicate, expect `409` or similar.

---

### 2) Sign in (get JWT cookie)

* Method: `POST`
* URL: `http://localhost:8000/signin`
* Headers: `Content-Type: application/json`
* Example Body (raw JSON):

```json
{
  "userName": "deepak01",
  "password": "StrongPassword123"
}
```

* Expected:

  * Server sets cookie `token` (httpOnly) via `Set-Cookie` header.
  * Or server returns JSON containing token (less secure).
* Verify in Postman:

  * Click **Cookies** → select `localhost` → confirm `token` exists.

> If cookie is missing and server returns token in body, copy token and either set the `Cookie` header manually for the next requests (`Cookie: token=<token>`) or add the cookie via Postman cookie manager.

---

### 3) Create entry (authenticated)

* Method: `POST`
* URL: `http://localhost:8000/createEntry`
* Headers: `Content-Type: application/json`
* Make sure cookie `token` is present in Postman for `localhost`.
* Example Body (raw JSON):

```json
{
  "date": "2025-09-15",
  "content": "Today I built my first fullstack app!"
}
```

* Expected success: `201 Created` and response:

```json
{
  "id": "652e1fa8a2b4f2a8f0d0b123",
  "date": "2025-09-15T00:00:00.000Z",
  "content": "Today I built my first fullstack app!"
}
```

* Save the returned `id` — you will use it for update/delete.

---

### 4) Fetch entries (authenticated)

* Method: `GET`
* URL: `http://localhost:8000/entries`
* Headers: (none needed, cookie will be sent automatically)
* Expected response (reverse chronological order):

```json
[
  {
    "id": "652e1fa8a2b4f2a8f0d0b123",
    "date": "2025-09-15T00:00:00.000Z",
    "content": "Today I built my first fullstack app!"
  },
  {
    "id": "652e1f9fa2b4f2a8f0d0b122",
    "date": "2025-09-14T00:00:00.000Z",
    "content": "Yesterday's short note"
  }
]
```

---

### 5) Update the entry (authenticated)

* Method: `PATCH`
* URL: `http://localhost:8000/entries/{id}` → replace `{id}` with the id from create response
* Headers: `Content-Type: application/json`
* Example Body (raw JSON):
```json
{
  "content": "Updated entry content"
}
```

* Expected response:

```json
{
  "id": "652e1fa8a2b4f2a8f0d0b123",
  "date": "2025-09-15T00:00:00.000Z",
  "content": "Updated entry content"
}
```

* Errors:

  * `400` if `content` missing
  * `404` if entry not found or not owned by the signed-in user

---

### 6) Delete the entry (authenticated)

* Method: `DELETE`
* URL: `http://localhost:8000/entries/{id}` → replace `{id}`
* Expected response:

```json
{
  "message": "Entry deleted successfully"
}
```

* Error:

  * `404` if not found or not authorized


## Date format notes

* `date` is saved as a `Date` in MongoDB. You can send `"YYYY-MM-DD"` (server will call `new Date(date)`), or send full ISO `"2025-09-15T00:00:00.000Z"`.
* Sorting is by `date` in descending order to serve entries in **reverse chronological order** (newest first).

---

## Troubleshooting & tips

* **Token not found (middleware returns 404)**: check cookies in Postman. Ensure the server sets cookie `token` and Postman has stored it for `localhost`.
* **401 Token not valid**: ensure `JWT_SECRET` in `.env` matches the secret used to sign tokens.
* **CORS / cookies**: if client is not on same origin, server must enable CORS with `credentials: true` and set cookie options with `sameSite` and `secure` appropriately.
* **Duplicate sign-ups**: unique email/userName errors — use different values.
* **Timezones**: `new Date("2025-09-15")` may convert to UTC midnight; if precise time matters, send ISO timestamps.

---

## Summary (test flow checklist)

1. Create `.env` and set `dburl`, `JWT_SECRET`, `PORT`.
2. `npm install` → `npm run dev`
3. Postman: `POST /signup` → create user
4. Postman: `POST /signin` → confirm cookie `token` set
5. Postman: `POST /createEntry` → create entry (save `id`)
6. Postman: `GET /entries` → verify entry appears (newest first)
7. Postman: `PATCH /entries/{id}` → update content
8. Postman: `DELETE /entries/{id}` → delete entry

---



