I learned that Redis is useful for data that needs fast access or does not necessarily need permanent storage.

## Redis vs MongoDB

I learned that Redis and MongoDB can work together rather than replacing each other.

Redis is useful for fast or temporary data such as session state, counters, caching, and rate-limit information.

MongoDB is better suited for persistent application data such as users, notes, scenario records, and other long-term data.

```text
Redis    → Fast / temporary data
MongoDB  → Persistent application data

# Redis Practice Notes

## Key-Value Operations

I practiced storing and retrieving values using:

```
SET key value
GET key
```

I learned that `SET` creates a key or replaces its existing value.
If a key does not exist, `GET` returns `(nil)`.
I also learned that Redis does not create duplicate values when the same key is set again; the existing value is replaced.

## TTL

TTL means Time To Live. It determines how long a key should remain available before Redis automatically removes it.

I practiced:

```
SET practice-session:test active EX 60
TTL practice-session:test
```

I learned:

```
TTL > 0  → seconds remaining
-1       → key exists without expiration
-2       → key does not exist
```

I also discovered that performing a normal `SET` on a key removes its previous expiration unless a new expiration is specified.

## Redis Strings

I learned about Redis Strings and practiced storing text:

```
SET user:42:name Taufeek
GET user:42:name
```

I also practiced `APPEND`, which modifies an existing String:

```
APPEND practice-session:test " - user123"
```

I verified that modifying the String with `APPEND` did not remove its existing TTL.

## Counters

I practiced Redis counters using:

```
INCR
INCRBY
DECR
DECRBY
```

I learned that Redis can increment or decrement numeric values directly.
I also tested `INCR` on a missing key and learned that Redis effectively starts from `0` and increments it to `1`.
I created counters for login attempts and AI requests, then verified their values through the Redis CLI.

## Other Commands

I practiced:

```
EXISTS key
DEL key
TYPE key
```

These helped me check whether keys existed, remove keys, and inspect their data type.

## Node.js Integration

I connected Redis to Node.js using the `redis` and `dotenv` packages.

I learned that `createClient()` creates the Redis client, while:

```
await redisClient.connect();
```

establishes the connection.

I used environment variables for the Redis URL:

```
REDIS_URL=redis://localhost:6379
```

I separated the Redis client configuration into `connection.js` and used it from `basics.js`.

I also learned how Redis CLI commands map to Node.js methods such as `set()`, `get()`, `incr()`, `ttl()`, `del()`, and `exists()`.