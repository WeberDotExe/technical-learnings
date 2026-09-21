## 1. TTL

TTL means Time To Live.

It tells Redis how much longer a key should exist before it expires.

Example:

```
SET practice:ttl-test "active"
EXPIRE practice:ttl-test 30
```

Check the remaining time:

```
TTL practice:ttl-test
```

Possible results:

```
positive number → seconds remaining
-1              → key exists but has no expiration
-2              → key does not exist
```

When the TTL reaches zero, Redis removes the key.

## 2. SET and TTL Behavior

If a key already has a TTL:

```
SET practice:session "active"
EXPIRE practice:session 60
```

and I run:

```
SET practice:session "in-progress"
```

the TTL is removed.

The key still exists, but it no longer has an expiration.

To update the value and set an expiration at the same time:

```
SET practice:session "in-progress" EX 60
```

## 3. Node.js Redis Methods Used

### `set()`

Store a value:

```js
await redisClient.set("key", "value");
```

Store a value with expiration:

```js
await redisClient.set("key", "value", {
  EX: 60,
});
```

### `expire()`

Add or refresh expiration:

```js
await redisClient.expire("key", 60);
```

### `ttl()`

Check the remaining expiration time:

```js
await redisClient.ttl("key");
```

### `get()`

Read a value:

```js
const value = await redisClient.get("key");
```

## 4. Temporary Session Data

A Redis key can represent an active practice session:

```
practice:42:session
```

Example data:

```json
{
  "status": "active",
  "topic": "interview",
  "mode": "text"
}
```

The session can have a TTL.

When the user interacts again, I can refresh the TTL:

```js
await redisClient.expire(sessionKey, 30);
```

If there is no activity and the TTL reaches zero, Redis removes the session.

This makes Redis useful for temporary state that shouldn't stay forever.

## 5. Cache-Aside

The cache-aside pattern means the application checks Redis before going to the database.

**Cache Hit**

```
Application
    ↓
Redis
    ↓
Data found
    ↓
Return data
```

**Cache Miss**

```
Application
    ↓
Redis
    ↓
Data not found
    ↓
MongoDB
    ↓
Get data
    ↓
Store in Redis
    ↓
Return data
```

This avoids unnecessary database reads when the requested data is already cached.

## 6. JSON Caching

Redis stores the cached value as a String in the examples I practiced.

For a JavaScript object:

```js
const scenario = {
  id: "123",
  prompt: "You are negotiating your salary with a company.",
};
```

Before storing it:

```js
JSON.stringify(scenario)
```

After retrieving it:

```js
JSON.parse(cachedScenario)
```

The flow is:

```
JavaScript object
      ↓
JSON.stringify()
      ↓
Redis String
      ↓
JSON.parse()
      ↓
JavaScript object
```

## 7. Redis vs MongoDB in Caching

I learned that Redis doesn't have to replace MongoDB.

A common setup is:

```
MongoDB
↓
Permanent / durable application data

Redis
↓
Temporary / cached / fast-access data
```

If cached data disappears from Redis, the application can fetch it again from MongoDB.

This is why Redis can be used as a cache instead of being the permanent source of truth.

## 8. Scenario Lab Examples

Possible uses I learned for Scenario Lab:

```
Scenario prompt
→ Cache in Redis
→ Give it a TTL
```

```
Active practice session
→ Store temporarily in Redis
→ Refresh TTL while user is active
→ Let it expire after inactivity
```

```
Frequently requested data
→ Check Redis first
→ If missing, get from MongoDB
→ Cache the result
→ Return it
```

These are the main Redis concepts I practiced in this chapter.