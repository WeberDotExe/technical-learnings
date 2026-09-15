# Redis Memory, Disk & Key-Value Storage

## Memory vs Disk

Redis keeps its working data in memory (RAM).

The basic idea is:

```text
Application
    ↓
Redis
    ↓
RAM
```

Memory access is very fast, which is one of the main reasons Redis is useful for applications that need quick data access.

MongoDB works differently. It is mainly being used as the persistent database for application data.

```text
Application
    ↓
MongoDB
    ↓
Disk / Storage
```

This is why Redis and MongoDB can have different jobs in the same application.

Redis can handle data that needs fast access, while MongoDB can store the data that needs to stay permanently.

Redis can also persist data to disk, but for now I'm focusing on understanding Redis as an in-memory data store.

## Why Redis Is Fast

The first thing I learned is that Redis works with data in memory.

For example, if I have:

```text
user:42:status → "active"
```

I can ask Redis for that key:

```redis
GET user:42:status
```

Redis is designed for this kind of direct key-based access.

So the simple mental model I'm using is:

```text
MongoDB
→ persistent application data

Redis
→ fast access to working data
```

Redis isn't fast only because RAM is faster than disk. Redis is also designed around efficient data structures and operations.

## Key-Value Model

The basic Redis model is:

```text
KEY → VALUE
```

For example:

```text
user:42:name → "Taufique"
```

Here:

```text
Key   = user:42:name
Value = Taufique
```

Another example:

```text
practice:42:status → "active"
```

The key tells Redis which value I want.

## Overwriting a Value

If I use `SET` with a key that already exists, Redis replaces its old value.

For example:

```redis
SET user:42:name "Taufique"
SET user:42:name "Developer"
GET user:42:name
```

The result is:

```text
"Developer"
```

So:

```text
Before:

user:42:name → "Taufique"


After:

user:42:name → "Developer"
```

## Key Naming

I practiced using descriptive keys instead of very generic names.

For example:

```text
name
status
count
```

are not very useful when an application has a lot of data.

Instead, I used:

```text
user:42:name
user:42:role
user:42:status
```

and:

```text
practice:42:status
practice:42:topic
practice:42:mode
```

The `:` is just part of the key name. It doesn't create a nested structure.

So these:

```text
user:42:name
user:42:role
user:42:status
```

are three separate keys.

The naming pattern just makes related keys easier to recognize.

## Inspecting Keys

I practiced `EXISTS` to check whether a key is present.

```redis
EXISTS user:42:name
```

If it exists:

```text
(integer) 1
```

If it doesn't:

```text
(integer) 0
```

I also used `TYPE`:

```redis
TYPE user:42:name
```

which returned:

```text
string
```

I used `KEYS` to inspect keys matching a pattern:

```redis
KEYS user:42:*
```

The `*` is a wildcard, so it can match keys such as:

```text
user:42:name
user:42:role
user:42:status
```

I used `KEYS` here mainly for learning and inspecting my local Redis instance.

## Missing Keys

When a key doesn't exist:

```redis
GET user:999:name
```

Redis CLI returns:

```text
(nil)
```

When doing the same thing from Node.js:

```js
const value = await redisClient.get("user:999:name");

console.log(value);
```

the result is:

```text
null
```

So I need to remember the difference when working between the CLI and Node.js.

## Connecting Redis with Node.js

I used the `redis` package to communicate with Redis from Node.js.

The connection URL is stored in `.env`:

```env
REDIS_URL=redis://localhost:6379
```

The client is created with:

```js
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
```

Creating the client doesn't connect to Redis immediately.

The connection happens here:

```js
await redisClient.connect();
```

After connecting, I can use methods such as:

```js
await redisClient.set("user:42:name", "Taufique");

const name = await redisClient.get("user:42:name");

const exists = await redisClient.exists("user:42:name");

const type = await redisClient.type("user:42:name");
```

When the script is finished, I close the connection:

```js
await redisClient.quit();
```

## CLI vs Node.js

The commands I used in the CLI have corresponding methods in Node.js.

```text
Redis CLI                    Node.js

SET user:42:name Taufique    redisClient.set()
GET user:42:name             redisClient.get()
EXISTS user:42:name          redisClient.exists()
TYPE user:42:name            redisClient.type()
```

Both are communicating with the same Redis server.

The CLI is useful for experimenting and checking things manually, while Node.js is how my backend code will communicate with Redis.

## What I Learned from the Experiments

After doing the experiments, the main things I understand are:

* Redis keeps its working data in memory.
* Memory access is one of the reasons Redis is fast.
* Redis stores data using keys and values.
* `SET` can create a key or replace its existing value.
* Descriptive key names make Redis data easier to understand.
* `:` is a naming convention, not a folder or nested object.
* `EXISTS` tells me whether a key exists.
* `TYPE` tells me the Redis data type.
* `KEYS` can be used to inspect matching keys while experimenting locally.
* A missing value is `(nil)` in the CLI and `null` in Node.js.
* Node.js can communicate with Redis through the `redis` package.

## Scenario Lab Relevance

For Scenario Lab, I can use descriptive Redis keys for things that need quick access.

For example:

```text
practice:42:status
practice:42:topic
practice:42:mode
```

A key like:

```text
practice:42:status → "active"
```

could represent the current state of a practice session.

The idea is not to move everything from MongoDB into Redis. MongoDB can still handle persistent application data, while Redis can be used for data where fast access makes sense.

This chapter gives me the basic understanding I need before moving into the next Redis concepts.
