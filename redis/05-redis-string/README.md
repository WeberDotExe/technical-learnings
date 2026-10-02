# Chapter 05: Redis Strings

In this chapter I went deeper into Redis Strings. I had already used `SET` and `GET` before, but here I tested what else I can do with String values.

## What I learned

### Storing normal values

The basic way to store and read a value is:

```redis
SET user:42:name Taufique
GET user:42:name

Redis stores the value against the key and gives it back when I use `GET`.

I also tried storing numbers:

```
SET user:42:score 100
```

Even though `100` is a number, Redis is storing it as a String. I can still use commands like `INCR` on it.

## Storing JSON

Redis doesn't directly store a JavaScript object, so I can convert the object into a JSON String first.

```js
const user = {
  id: 42,
  name: "Taufique",
  role: "developer"
};

await redisClient.set(
  "user:42",
  JSON.stringify(user)
);
```

When I get it back from Redis, I get a String, so I need to convert it back into an object:

```js
const storedUser = await redisClient.get("user:42");

const user = JSON.parse(storedUser);
```

So the process is basically:

```
Object
↓
JSON.stringify()
↓
String stored in Redis
↓
GET
↓
JSON.parse()
↓
Object
```

One thing I understood here is that Redis doesn't know that the String contains a JavaScript object. As far as Redis is concerned, it's just a String.

## JSON with TTL

I also tested storing JSON with an expiration.

```
SET cache:user:42 '{"id":42,"name":"Taufique"}' EX 30
```

This stores the JSON as a String and removes the key after 30 seconds.

I also tested what happens when I update an existing key using `SET` without an expiration.

The previous TTL gets removed, which is something I had already seen in the TTL chapter.

## Using Strings as Simple State

Strings can also be used for simple values that represent some state.

For example:

```
SET feature:ai-chat enabled
```

or:

```
SET maintenance-mode 1
```

I can read the value with:

```
GET maintenance-mode
```

And if I only want to know whether the key exists:

```
EXISTS maintenance-mode
```

So:

```
GET
→ gives me the value

EXISTS
→ tells me whether the key exists
```

## What I Practiced in Node.js

I created a small Node.js experiment where I:

* Stored normal String values
* Stored numbers
* Stored JavaScript objects as JSON
* Retrieved and parsed JSON
* Stored JSON with a TTL
* Used Strings for simple state values

## Commands I Practiced

```
SET
GET
INCR
EXISTS
```

## My Main Takeaway

Redis Strings aren't limited to simple text.

