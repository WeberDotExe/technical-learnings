
# Redis Lists — Notes

## What are Redis Lists?

Redis Lists store string values in a particular order. I can add items to either end of a list, read them by position, and remove them when needed.

One thing to remember is that a list can contain the same value more than once.

## Adding items

I used `RPUSH` to add items to the end of a list.

```redis
RPUSH learning:messages "Hello"
RPUSH learning:messages "How are you?"
RPUSH learning:messages "Let's learn Redis"
```

The items stay in the order they were added.

`LPUSH` works from the opposite end:

```redis
LPUSH learning:messages "First"
LPUSH learning:messages "Second"
LPUSH learning:messages "Third"
```

The resulting order is `Third`, `Second`, `First`, because each new item is added to the beginning.

## Reading items

To see the entire list, I used `LRANGE`.

```redis
LRANGE learning:messages 0 -1
```

The indexes start at `0`, and `-1` refers to the last item. Using `0 -1` returns everything in the list.

When I only need one item, I can use `LINDEX`.

```redis
LINDEX learning:messages 0
LINDEX learning:messages 1
LINDEX learning:messages -1
```

This returns the first, second, and last items respectively.

## Removing items

`LPOP` removes the first item, while `RPOP` removes the last one.

```redis
LPOP learning:messages
RPOP learning:messages
```

Both commands return the item they remove. If the list is empty or doesn't exist, they return nil.

## Counting items

I used `LLEN` to check how many items are in a list.

```redis
LLEN learning:messages
```

If the key doesn't exist, Redis returns `0`.

## Keeping only the items I need

`LTRIM` keeps a selected range and removes everything outside it.

For example, this keeps the first three items:

```redis
LTRIM learning:messages 0 2
```

To keep only the last three items, I can use:

```redis
LTRIM learning:messages -3 -1
```

This operation changes the actual list, so the removed items won't remain in that list.

## A simple activity history

One example I tried was storing recent activity in a list.

```redis
RPUSH learning:activity "Logged in"
RPUSH learning:activity "Opened profile"
RPUSH learning:activity "Updated profile"
RPUSH learning:activity "Viewed settings"
RPUSH learning:activity "Logged out"
```

If I only want to keep the last three entries, I can run:

```redis
LTRIM learning:activity -3 -1
LRANGE learning:activity 0 -1
```

This is a simple way to maintain a limited history. In an actual application, I could use a separate key for each user.

## Using Lists with Node.js

The `redis` package provides methods for the same operations.

| Redis command | Node.js method |
|---|---|
| `LPUSH` | `lPush()` |
| `RPUSH` | `rPush()` |
| `LPOP` | `lPop()` |
| `RPOP` | `rPop()` |
| `LRANGE` | `lRange()` |
| `LINDEX` | `lIndex()` |
| `LLEN` | `lLen()` |
| `LTRIM` | `lTrim()` |

For example:

```javascript
await redisClient.rPush("learning:tasks", [
  "Learn Redis Lists",
  "Practise Node.js",
  "Write notes",
]);

const tasks = await redisClient.lRange(
  "learning:tasks",
  0,
  -1
);

console.log(tasks);
```

The methods are asynchronous, so I use `await` to get their results.

## Redis connection

I kept the connection setup in a separate `redis.js` file so the example code can reuse the same client.

```javascript
import "dotenv/config";
import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

await redisClient.connect();
```

The `.env` file contains:

```env
REDIS_URL=redis://localhost:6379
```

This connects to my local Memurai server. The same setup can be used with a Redis server running at a different address by changing the connection URL.

## What I took away from this

Redis Lists make it easy to work with ordered data. I now understand how to add and remove items from either end, retrieve items by index, count the list, and remove entries outside a range.

They can be useful for things like simple queues and recent activity histories, depending on how the application needs to handle its data.
