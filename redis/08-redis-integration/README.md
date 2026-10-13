# Redis Integration with Node.js and Express

This project is where I practiced integrating Redis into a Node.js and Express application. I used Memurai as my local Redis-compatible server and built a small scenario API to understand how caching works in a real backend workflow.

Instead of connecting a real database, I used a JavaScript array to simulate database queries so I could focus on learning Redis integration first.

## What I Built

- Connected Redis to an Express application using the `redis` npm package.
- Created separate route and service files to keep the code organized.
- Built API endpoints to fetch all scenarios and retrieve a scenario by ID.
- Implemented Redis caching using the cache-aside pattern.
- Added a 60-second TTL so cached data expires automatically.
- Tested cache hits, cache misses, API responses, and key expiration.

## How Caching Works

Whenever a request comes in, the application checks Redis before fetching the data.

If the requested data is already cached, the application returns it directly from Redis. Otherwise, it fetches the data from the simulated database, stores it in Redis, and returns the result.

I used keys such as `scenarios:all` and `scenarios:scenario-1` to cache the collection and individual scenarios separately.

Each cached entry expires after 60 seconds. Once it expires, the next request fetches the data again and creates a new cache entry.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Checks whether the application and Redis are working |
| GET | `/api/scenarios` | Returns all scenarios |
| GET | `/api/scenarios/:id` | Returns a scenario by its ID |

## Tech Stack

- Node.js
- Express
- Redis
- Memurai
- dotenv

## Running Locally

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file using `.env.example` as a reference.

3. Make sure Memurai is running on your machine.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000/health` to verify the connection.

## What I Learned

This project helped me understand how Redis fits into a backend application instead of just using Redis commands in the terminal. I learned how to reuse a Redis client, organize API logic into separate files, serialize data as JSON, set expiration times, and identify cache hits and misses.

I also saw how caching can avoid repeated data-fetching work when the same information is requested multiple times.

**Note:** The data source is simulated, so this project focuses on understanding Redis integration and caching rather than building a complete production backend.