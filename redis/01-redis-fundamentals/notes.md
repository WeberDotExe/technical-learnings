# Redis Fundamentals

## What is Redis?

Redis is an in-memory data store designed for very fast data access.

It primarily works with data stored in RAM, which makes read and write operations very fast.

Redis uses a key-value model. A key identifies the data, while the value contains the data associated with that key.

Example:

```
Key: scenario:interview:status
Value: paused
```

I practiced Redis locally using Memurai on Windows. I verified that the Redis server was running by using the `PING` command, which returned `PONG`.

The Redis server was running at:

```
redis://localhost:6379
```

## Redis vs MongoDB

I learned that Redis and MongoDB can work together rather than replacing each other.

Redis is useful for data that needs fast access or does not necessarily need permanent storage.

Examples include:

- Session state
- Counters
- Caching
- Rate-limit information
- Temporary application data

MongoDB is better suited for persistent application data.

Examples include:

- Users
- Notes
- Scenario records
- Other long-term application data

A simple way to understand their roles is:

```
Redis    → Fast / temporary data
MongoDB  → Persistent application data
```

They can therefore have separate responsibilities within the same application.

## Key-Value Operations

I practiced storing and retrieving values using `SET` and `GET`.

Example:

```
SET scenario:interview:status paused
GET scenario:interview:status
```

I learned that `SET` creates a key or replaces its existing value.

If a key does not exist, `GET` returns `(nil)`.

I also tested overwriting a key:

```
SET scenario:interview:status active
SET scenario:interview:status completed
```

The second `SET` replaced the previous value instead of creating another copy of the same key.

This helped me understand that Redis keys are unique and `SET` updates the value associated with an existing key.

## TTL

TTL means Time To Live. It determines how long a key should remain available before Redis automatically removes it.

I practiced creating a key with an expiration:

```
SET practice-session:test active EX 60
```

I then checked its remaining lifetime using:

```
TTL practice-session:test
```

The important TTL results I learned are:

- `TTL > 0` → The key exists and the returned number represents the remaining seconds.
- `-1` → The key exists but does not have an expiration.
- `-2` → The key does not exist.

I also tested what happens when a key with an existing TTL is overwritten.

First:

```
SET practice-session:test active EX 60
```

Then:

```
SET practice-session:test paused
```

After checking the TTL, it returned `-1`.

This showed me that a normal `SET` replaces the value and removes the previous expiration unless a new expiration is specified.

I also tested `APPEND` on a key with a TTL and verified that the TTL continued counting down.

## Redis Strings

I learned about Redis Strings and practiced storing text values.

Example:

```
SET user:42:name Taufeek
GET user:42:name
```

Redis returned the stored value.

I also practiced `APPEND`, which modifies an existing String.

Example:

```
APPEND practice-session:test " - user123"
```

For example, a value such as:

```
active
```

can become:

```
active - user123
```

I verified that modifying a String using `APPEND` did not remove its existing TTL.

## Counters

I practiced Redis counters using:

```
INCR
INCRBY
DECR
DECRBY
```

`INCR` increases a numeric value by 1.

For example:

```
SET user:42:login-count 5
INCR user:42:login-count
```

The value becomes `6`.

`INCRBY` increases a value by a specified amount.

`DECR` decreases a value by 1.

`DECRBY` decreases a value by a specified amount.

I also tested `INCR` on a key that did not exist.

Redis effectively starts the counter from `0` and increments it to `1`.

## Node.js Counter Experiment

I used Redis counters from Node.js as well.

For the login counter, I used:

```js
const loginCount = await redisClient.incr("user:42:login-count");
```

I intentionally did not reset the counter between executions.

When I ran the Node.js script multiple times, the counter continued increasing.

This helped me understand that the value was stored in Redis rather than being only a JavaScript variable inside the Node.js process.

I also created an AI request counter:

```js
const aiRequestCount = await redisClient.incr("user:42:ai-requests");
```

I verified the value through the Redis CLI.

This connected the Redis counter concept to a practical use case such as tracking AI requests.

## Redis CLI Commands I Practiced

The main Redis CLI commands I practiced were:

| Command | Description |
|---|---|
| `SET key value` | Stores a value. |
| `GET key` | Retrieves a value. |
| `EXPIRE key seconds` | Adds an expiration time to an existing key. |
| `TTL key` | Checks the remaining expiration time. |
| `APPEND key value` | Appends text to an existing String. |
| `INCR key` | Increases a counter by 1. |
| `INCRBY key amount` | Increases a counter by a specific amount. |
| `DECR key` | Decreases a counter by 1. |
| `DECRBY key amount` | Decreases a counter by a specific amount. |
| `EXISTS key` | Checks whether a key exists. |
| `DEL key` | Deletes a key. |
| `TYPE key` | Checks the data type of a key. |

## Connecting Redis with Node.js

I connected Redis to Node.js using the `redis` and `dotenv` packages.

I used `dotenv` so that the Redis connection URL could be stored in an environment variable instead of being hardcoded.

The environment variable I used was:

```
REDIS_URL=redis://localhost:6379
```

I created the Redis client using `createClient()`.

The client configuration was separated into `connection.js`:

```js
import "dotenv/config";
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

export default redisClient;
```

I learned that `createClient()` creates the Redis client, but it does not establish the connection by itself.

The actual connection is established using:

```js
await redisClient.connect();
```

After connecting, I could perform Redis operations from Node.js.

For example:

```js
await redisClient.set("user:42:name", "Taufeek Chaudhary");

const name = await redisClient.get("user:42:name");

const loginCount = await redisClient.incr("user:42:login-count");

const sessionTTL = await redisClient.ttl("practice-session:demo");
```

After finishing the operations in my practice script, I closed the connection using:

```js
await redisClient.quit();
```

I separated the Redis client configuration into `connection.js` and the Redis operations into `basics.js`.

I also learned how Redis CLI commands map to Node.js methods:

| Redis CLI | Node.js Method |
|---|---|
| `SET` | `redisClient.set()` |
| `GET` | `redisClient.get()` |
| `DEL` | `redisClient.del()` |
| `EXPIRE` | `redisClient.expire()` |
| `TTL` | `redisClient.ttl()` |
| `INCR` | `redisClient.incr()` |
| `APPEND` | `redisClient.append()` |
| `EXISTS` | `redisClient.exists()` |
| `TYPE` | `redisClient.type()` |

## What I Learned from the Experiments

The main purpose of this chapter was to understand Redis through actual experiments instead of only memorizing commands.

I learned how Redis stores data using keys and values, how values can be created and retrieved, how existing values are replaced, and how missing keys behave.

I learned how TTL works and how Redis automatically removes expired data.

I learned that a normal `SET` can remove an existing TTL, while `APPEND` preserves the existing TTL during my experiment.

I learned how Redis Strings work and how they can also be used with counter operations.

I learned how Redis counters can be incremented and decremented and verified that counter values remain stored in Redis between separate Node.js executions.

I also learned how to inspect and delete keys using `EXISTS`, `TYPE`, and `DEL`.

Finally, I learned how a Node.js application connects to Redis and performs the same types of operations that I practiced through the Redis CLI.

## Scenario Lab Relevance

The concepts from this chapter are useful for Scenario Lab because the application will need some data that can be accessed quickly and does not necessarily need permanent storage.

Redis can later be useful for temporary scenario or session-related information, counters, and AI request tracking.

For example:

```
Redis    → Temporary scenario state, session data, counters, AI request tracking
MongoDB  → Users, scenario records, conversation data, feedback, and other persistent information
```

The AI request counter I practiced is one example of how Redis can be used inside Scenario Lab:

```js
await redisClient.incr("user:42:ai-requests");
```

The goal of this chapter was not to build the complete Redis functionality for Scenario Lab.

The goal was to understand the Redis fundamentals first so that more advanced Redis concepts can be implemented with a clear understanding of how Redis behaves.