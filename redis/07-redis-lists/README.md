
# Redis Lists

This chapter is about Redis Lists and how they work. I practised adding, reading, removing, and managing list items using the Redis CLI and Node.js.

I also tried a simple activity history example to understand where lists can be useful in an application.

### What I covered

- `LPUSH` and `RPUSH` to add items
- `LPOP` and `RPOP` to remove items
- `LRANGE` and `LINDEX` to read items
- `LLEN` to count items
- `LTRIM` to keep a specific range
- Using list operations from Node.js

### Running the examples

You'll need Node.js and a running Redis server. I used Memurai on Windows for these exercises.

Install the required packages:

```bash
npm install redis dotenv
```

Make sure your `.env` file contains the correct Redis connection URL and that the Redis server is running.

Run the example from this directory:

```bash
node code/lists.js
```

The code folder contains the Node.js example, and `notes.md` has the commands and concepts I practised throughout this chapter.
