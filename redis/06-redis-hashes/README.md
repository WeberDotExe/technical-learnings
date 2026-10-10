# Chapter 06: Redis Hashes

In this chapter I learned how Redis Hashes work and how they are different from storing JSON as a String. I practiced creating Hashes, reading and updating fields, deleting fields, and working with Hashes from Node.js.

## What I learned

### Creating a Hash

Earlier, I stored user details using separate Redis keys, like `user:42:name` and `user:42:role`.

With a Hash, I can keep multiple fields under one key:

```redis
HSET user:42 name Taufique
HSET user:42 role developer
HSET user:42 status active
```

Now `user:42` is the key, and `name`, `role`, and `status` are its fields.

### Reading and updating fields

I used these commands to read data:

```redis
HGET user:42 name
HMGET user:42 name role
HGETALL user:42
```

`HGET` returns one field, `HMGET` returns selected fields, and `HGETALL` returns all fields and their values.

I also tested updating an existing field:

```redis
HSET user:42 name Taufeeq
```

If the field already exists, Redis updates its value instead of creating another field with the same name.

### Checking and deleting fields

I used `HEXISTS` to check whether a field exists and `HDEL` to remove a specific field.

```redis
HEXISTS user:42 email
HDEL user:42 age
```

`HDEL` removes the selected field, while `DEL` removes the entire Redis key.

### Hashes vs JSON Strings

I had already learned to store JavaScript objects in Redis using `JSON.stringify()` and retrieve them using `JSON.parse()`.

With a JSON String, the entire object is stored as one String value. If I want to change one property, I generally retrieve the JSON, parse it, update the object, and store it again.

With a Hash, I can update a single field directly:

```redis
HSET user:42 role backend-developer
```

### Incrementing numeric fields

I also learned `HINCRBY`, which increments a numeric field inside a Hash.

```redis
HSET user:42 loginAttempts 5
HINCRBY user:42 loginAttempts 1
```

The value becomes `6`. If the field doesn't exist, Redis starts it at zero and applies the increment.

## Node.js practice

I used the Redis Node.js client to perform the same operations from JavaScript.

The methods I practiced were:

- `hSet()`
- `hGet()`
- `hmGet()`
- `hGetAll()`
- `hExists()`
- `hDel()`
- `hIncrBy()`

I tested creating a user Hash, updating fields, incrementing counters, checking whether fields exist, deleting a field, and reading the final Hash.

## My main takeaway

A Redis Hash lets me group related fields under one key and work with each field separately. A JSON String is still useful when I want to store an entire object as one value, while a Hash is useful when I need to read or update individual fields directly.