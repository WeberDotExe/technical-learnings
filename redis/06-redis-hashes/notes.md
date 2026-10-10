# Chapter 06: Redis Hashes — Notes

## 1. What is a Redis Hash?

A Hash lets me store multiple fields and values under one Redis key.

For example:

```redis
HSET user:42 name Taufique
HSET user:42 role developer
HSET user:42 status active
```

The structure looks like this:

```text
user:42
├── name   → Taufique
├── role   → developer
└── status → active
```

Here, `user:42` is the Redis key. The other names are fields inside that Hash.

This is different from creating separate keys like `user:42:name` and `user:42:role`.

## 2. Creating and updating fields

The command is:

```redis
HSET <key> <field> <value>
```

I can add several fields to the same Hash by running `HSET` multiple times.

If I set a field that already exists, Redis updates its value.

```redis
HSET user:42 role backend-developer
```

The value of `role` changes, but the other fields remain unchanged.

The integer returned by `HSET` tells me how many new fields were added. A result of `0` can mean the field already existed and was updated.

## 3. Reading fields

### HGET

Gets one field:

```redis
HGET user:42 name
```

### HMGET

Gets selected fields:

```redis
HMGET user:42 name role status
```

The values are returned in the same order as the fields I requested. If a field doesn't exist, its result is `nil`.

### HGETALL

Returns all fields and their values:

```redis
HGETALL user:42
```

Quick comparison:

```text
HGET      → one field
HMGET     → selected fields
HGETALL   → all fields
```

## 4. Checking and deleting fields

### HEXISTS

Checks whether a field exists:

```redis
HEXISTS user:42 name
```

It returns `1` if the field exists and `0` if it doesn't.

### HDEL

Deletes a specific field:

```redis
HDEL user:42 age
```

It returns the number of fields that were removed.

The difference between `HDEL` and `DEL` is important:

```text
HDEL user:42 age
→ removes only the age field

DEL user:42
→ removes the entire Hash key
```

## 5. Hashes vs JSON Strings

I can store a JavaScript object as a JSON String:

```js
await redisClient.set("user:42", JSON.stringify(user));
```

To use it as an object again:

```js
const storedUser = await redisClient.get("user:42");
const user = JSON.parse(storedUser);
```

Redis stores the JSON as one String value. If I want to update one property, my application generally needs to retrieve the object, parse it, make the change, and store it again.

With a Hash, I can update a field directly:

```redis
HSET user:42 role backend-developer
```

Both approaches are useful. The choice depends on how I want to store and access the data.

## 6. Incrementing a Hash field

I already learned `INCR` and `INCRBY` for counters. For numeric fields inside a Hash, I can use `HINCRBY`.

```redis
HSET user:42 loginAttempts 5
HINCRBY user:42 loginAttempts 1
```

The result is `6`.

I can also increment by a larger amount:

```redis
HINCRBY user:42 loginAttempts 5
```

If the field doesn't exist, Redis treats its initial value as zero before applying the increment.

The difference:

```text
INCR
→ increments a value stored directly at a Redis key

HINCRBY
→ increments a numeric field inside a Hash
```

## 7. Using Hashes in Node.js

These are the Node.js methods I practiced with the Redis client:

| Redis command | Node.js method |
|---|---|
| `HSET` | `hSet()` |
| `HGET` | `hGet()` |
| `HMGET` | `hmGet()` |
| `HGETALL` | `hGetAll()` |
| `HEXISTS` | `hExists()` |
| `HDEL` | `hDel()` |
| `HINCRBY` | `hIncrBy()` |

Example:

```js
await redisClient.hSet("user:42", {
  name: "Taufique",
  role: "developer",
  loginAttempts: "0",
});

await redisClient.hIncrBy("user:42", "loginAttempts", 1);

const user = await redisClient.hGetAll("user:42");

console.log(user);
```

One thing to remember: values returned by `hGetAll()` are strings, so a numeric field such as `loginAttempts` comes back as a String.

## 8. What I practiced

- Creating a Hash and adding fields
- Reading one or multiple fields
- Retrieving the complete Hash
- Updating an existing field
- Checking whether a field exists
- Deleting a field without deleting the whole Hash
- Incrementing numeric fields
- Performing these operations from Node.js

My main takeaway is that Hashes give me a way to keep related fields under one Redis key while still being able to work with each field separately.