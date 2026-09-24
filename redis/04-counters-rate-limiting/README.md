# Chapter 04: Counters and Rate Limiting

This chapter covers how Redis can be used to store counters and build a basic fixed-window rate limiter using counters and TTL.

## What I Learned

### Redis Counters

Redis provides commands for increasing and decreasing numeric values:

```text
INCR
INCRBY
DECR
DECRBY

`INCR` increases a value by `1`:

```
INCR page:views
```

`INCRBY` increases it by a specific amount:

```
INCRBY page:views 5
```

If the key does not exist, Redis treats its value as `0` before incrementing it.

## Rate Limiting

A basic rate limiter can combine a Redis counter with TTL.

Example:

```
Maximum requests: 5
Time window: 60 seconds
```

The first request creates the counter and starts the TTL:

```
INCR counter
    ↓
count = 1
    ↓
EXPIRE counter 60
```

Later requests only increase the counter while the existing TTL continues counting down.

When the counter reaches the limit, further requests can be rejected.

When the TTL expires, Redis removes the counter and the next request starts a new window.

## Important Concept

The TTL should only be set when the counter is first created.

```js
if (requestCount === 1) {
  await redisClient.expire(rateLimitKey, 60);
}
```

Setting the TTL on every request would continuously extend the time window.

## Node.js Practice

Implemented:

* Redis counters using `INCR` and `INCRBY`
* A fixed-window rate limiter using `INCR` + `EXPIRE`
* Request count and remaining TTL checks

## Commands Practiced

```
INCR
INCRBY
DECR
DECRBY
EXPIRE
TTL
GET
DEL
```