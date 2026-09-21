# Chapter 03: TTL, Cache, and Session-Like Data

This chapter is about using Redis for temporary data.

I learned how Redis can automatically remove data after a certain amount of time using TTL. I also learned how Redis can be used to keep temporary session-like data and how it can work as a cache in front of MongoDB.

## What I Learned

### 1. TTL and Expiration

TTL means Time To Live. It tells Redis how long a key should remain before it expires.

I practiced:

- `EXPIRE`
- `TTL`
- `SET ... EX`

For example:

```redis
SET practice:ttl-test "active"
EXPIRE practice:ttl-test 30

The key will automatically expire after 30 seconds.

I also learned:

* A positive TTL means the key has that many seconds remaining.
* `TTL -1` means the key exists but has no expiration.
* `TTL -2` means the key does not exist.

One important thing I learned is that using a normal `SET` on an existing key removes its previous expiration.

```
SET practice:session "active"
EXPIRE practice:session 60

SET practice:session "in-progress"
```

After the second `SET`, the TTL is removed.

To update the value and set an expiration at the same time:

```
SET practice:session "in-progress" EX 60
```

## 2. Temporary Session-Like Data

Redis can be used to store temporary application state.

For example, a practice session can be stored as:

```
practice:42:session
```

with data such as:

```json
{
  "status": "active",
  "topic": "interview",
  "mode": "text"
}
```

The session can have a TTL so Redis automatically removes it after a period of inactivity.

I also practiced refreshing the TTL when the user becomes active again.

The basic flow is:

```
User starts session
        ↓
Store session in Redis
        ↓
Set TTL
        ↓
User interacts again
        ↓
Refresh TTL
        ↓
User becomes inactive
        ↓
Session expires
```

This can be useful in Scenario Lab for temporary active practice-session state.

## 3. Cache-Aside Pattern

I learned how Redis can be used as a cache in front of MongoDB.

Instead of always going directly to MongoDB, the application first checks Redis.

```
Request
   ↓
Check Redis
   ↓
Cache hit?
 ┌──┴──┐
Yes    No
 ↓      ↓
Return  MongoDB
         ↓
      Store in Redis
         ↓
        Return
```

If the data is already in Redis, it is a cache hit.

If the data isn't there, it is a cache miss. The application then gets the data from MongoDB, stores it in Redis, and returns it.

I practiced this flow using a simulated MongoDB function in Node.js.

## 4. Caching JSON Data

Redis stores the value as a String in the examples I worked with.

When storing a JavaScript object, I used:

```js
JSON.stringify(data)
```

After getting it back:

```js
JSON.parse(data)
```

This allowed me to cache JavaScript objects as JSON strings.

## Scenario Lab Connection

The concepts from this chapter can be used in Scenario Lab for:

* Caching scenario prompts
* Keeping temporary active practice-session state
* Expiring inactive sessions
* Refreshing a session TTL when the user is active
* Reducing unnecessary MongoDB reads for frequently requested data

MongoDB can remain the durable source of the application's data, while Redis can handle fast and temporary data.

## Code

The `code` folder contains the experiments I built while learning these concepts:

```
code/
├── ttl.js
├── session.js
└── cache-aside.js
```

Each file focuses on a different part of the chapter.