# Redis — Memory, Disk & Key-Value Storage

This chapter is about understanding how Redis stores data and why it is fast.

I worked with Redis locally using Memurai on Windows, first through the CLI and then through Node.js.

## What I Practiced

* Memory vs disk storage
* Why Redis is fast
* Redis key-value storage
* Redis key naming
* Checking keys and their types
* Using Redis from Node.js

## Memory vs Disk

Redis keeps its working data in memory (RAM), which allows it to access data very quickly.

A simple way to look at it is:

```text
Application
    ↓
Redis
    ↓
RAM
```

MongoDB is mainly used for persistent application data:

```text
Application
    ↓
MongoDB
    ↓
Disk / Storage
```

So Redis and MongoDB can be used together instead of treating Redis as a replacement for MongoDB.

## Key-Value Storage

Redis stores data using a simple key-value model:

```text
KEY → VALUE
```

For example:

```text
user:42:name → "Taufique"
```

I practiced creating, reading, and overwriting these values.

If I run:

```redis
SET user:42:name "Taufique"
SET user:42:name "Developer"
```

the value becomes:

```text
user:42:name → "Developer"
```

The same key can be assigned a new value.

## Key Naming

I used names such as:

```text
user:42:name
user:42:role
user:42:status

practice:42:status
practice:42:topic
practice:42:mode
```

Using a pattern like this makes it easier to understand what a key belongs to.

The `:` doesn't create folders or nested objects. For example:

```text
user:42:name
user:42:role
user:42:status
```

are still three separate keys.

The naming convention just makes them easier to organize and recognize.

## Redis Commands Practiced

```text
SET
GET
EXISTS
TYPE
KEYS
```

Example:

```redis
SET user:42:name "Taufique"
GET user:42:name
EXISTS user:42:name
TYPE user:42:name
KEYS user:42:*
```

I also tested what happens when trying to get a key that doesn't exist.

In the CLI, Redis returns:

```text
(nil)
```

Through Node.js, the same missing value is returned as:

```js
null
```

## Node.js Setup

I connected Redis to Node.js using:

```text
redis
dotenv
```

The Redis connection URL is stored in `.env`:

```env
REDIS_URL=redis://localhost:6379
```

The Node.js client is created using the Redis URL:

```js
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
```

Then the client connects to Redis:

```js
await redisClient.connect();
```

I used the client to run operations such as:

```js
await redisClient.set("user:42:name", "Taufique");

const name = await redisClient.get("user:42:name");

const exists = await redisClient.exists("user:42:name");

const type = await redisClient.type("user:42:name");
```

Finally, I closed the connection with:

```js
await redisClient.quit();
```

## Folder Structure

```text
02-memory-disk-key-value/
├── README.md
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── code/
    └── key-value.js
```

## Running Locally

Install the dependencies:

```bash
npm install
```

Make sure Memurai is running, then run:

```bash
node code/key-value.js
```

## Scenario Lab Relevance

The main thing I wanted to understand here is how Redis can be used alongside MongoDB.

For example, practice-related data can use keys like:

```text
practice:42:status
practice:42:topic
practice:42:mode
```

This kind of data can be useful to keep in Redis when it needs to be accessed quickly.

Later, these concepts will be used when I start integrating Redis into Scenario Lab.
