# Chapter 04: Counters and Rate Limiting

## Redis Counters

Redis can also be used to store numbers and keep increasing or decreasing them.

The main commands I practiced are:

- `INCR`
- `INCRBY`
- `DECR`
- `DECRBY`

### INCR

`INCR` increases a number by 1.

```redis
INCR login:attempts

If the key doesn't exist, Redis starts from 0 and then increments it.

So:

```
INCR login:attempts
→ 1

INCR login:attempts
→ 2

INCR login:attempts
→ 3
```

I don't need to create the key first.

## INCRBY

`INCRBY` is useful when I want to increase the value by more than 1.

```
INCRBY login:attempts 5
```

For example, if the current value is 2, this changes it to 7.

## DECR and DECRBY

These work in the opposite direction.

```
DECR login:attempts
```

decreases the value by 1.

```
DECRBY login:attempts 2
```

decreases it by 2.

## Counters Stay in Redis

One thing I noticed while testing the Node.js code is that the counter doesn't disappear when the program stops.

For example, if my program increments:

```
user:42:login-attempts
```

and reaches 7, running the program again starts from 7 instead of 0.

That's because the value is stored in Redis, not inside the Node.js process.

If I want the counter gone, I have to delete it or give it an expiration.

## Rate Limiting

After understanding counters, I used them to build a basic rate limiter.

The idea is simple:

```
5 requests
within 60 seconds
```

If the user makes the first 5 requests, they are allowed.

The 6th request is rejected.

The counter is stored in Redis and the key has a TTL.

## How It Works

For every request, I increment the counter:

```js
const requestCount = await redisClient.incr(rateLimitKey);
```

If this is the first request:

```js
if (requestCount === 1) {
  await redisClient.expire(rateLimitKey, 60);
}
```

So the first request does two things:

```
INCR
↓
count = 1

EXPIRE
↓
60 second window starts
```

After that, every request just increases the counter.

```
Request 1 → 1
Request 2 → 2
Request 3 → 3
Request 4 → 4
Request 5 → 5
Request 6 → 6
```

The application can check the count and reject the request when it goes above the limit.

## Why I Don't Reset the TTL Every Time

This was an important part of the experiment.

I only set the TTL when the counter becomes `1`.

If I set `EXPIRE` on every request, the 60-second timer would keep restarting.

For example:

```
Request 1 → TTL 60s
Request 2 → TTL 60s again
Request 3 → TTL 60s again
```

The window would keep getting extended as long as requests continued coming in.

Instead, the timer starts with the first request and keeps counting down.

## What Happens After the TTL

Once the 60 seconds are over, Redis removes the counter.

For example:

```
rate-limit:ai:42
```

expires and no longer exists.

The next request then starts from 1 again:

```
Old counter expires
       ↓
Key is removed
       ↓
New request
       ↓
INCR
       ↓
count = 1
       ↓
new 60 second window
```

## What I Practiced in Node.js

I created two small experiments:

* `counters.js` — practiced Redis counters.
* `rate-limit.js` — combined a counter with TTL to create a basic fixed-window rate limiter.

The main Redis methods I used were:

```js
redisClient.incr()
redisClient.incrBy()
redisClient.get()
redisClient.expire()
redisClient.ttl()
```

## What I Understand Now

I understand how Redis can be used to keep counters and how those counters can be combined with TTL to control requests within a time window.

The main pattern I learned is:

```
INCR
+
EXPIRE
=
Basic fixed-window rate limiting
```