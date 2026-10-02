# Chapter 05: Redis Strings

## 1. What are Redis Strings?

Strings are the basic data type in Redis.

I can store a simple value against a key:

```redis
SET user:42:name Taufique

and get it back with:

GET user:42:name

The value doesn't have to be just normal text. I can also store numbers, JSON, tokens, flags, etc. as String values.

2. Storing Numbers

I can store a number using SET:

SET user:42:score 100

When I use:

GET user:42:score

Redis returns:

"100"

Redis is storing it as a String, but numeric String values can still be used with commands like INCR.

For example:

INCR user:42:score

The value becomes:

101

So Redis doesn't need a separate "number" type for this.

3. Storing JSON

A JavaScript object can't be passed directly to Redis as a value.

For example:

const user = {
  id: 42,
  name: "Taufique",
  role: "developer"
};

I first convert it to JSON:

const userJSON = JSON.stringify(user);

Then store it:

await redisClient.set("user:42", userJSON);

When I get it back:

const storedUser = await redisClient.get("user:42");

I get a String.

To use it as a JavaScript object again:

const user = JSON.parse(storedUser);

So the flow is:

JavaScript object
↓
JSON.stringify()
↓
JSON String
↓
Redis
↓
GET
↓
JSON String
↓
JSON.parse()
↓
JavaScript object

One important thing I understood is that Redis doesn't know that the String contains a JavaScript object. It just stores the JSON as a String.

4. JSON with TTL

I can also give JSON data an expiration time.

For example:

SET cache:user:42 '{"id":42,"name":"Taufique"}' EX 30

Now the key will automatically expire after 30 seconds.

I can check the value:

GET cache:user:42

and check the remaining time:

TTL cache:user:42

This is basically combining what I learned in the TTL chapter with storing JSON in a String.

5. Updating a String and TTL

If a key already has a TTL and I update it using SET without an expiration:

SET cache:user:42 '{"id":42,"name":"Updated"}'

the old TTL is removed.

So if I want the updated value to still expire, I need to set the expiration again:

SET cache:user:42 '{"id":42,"name":"Updated"}' EX 30

This is the same SET + TTL behavior I learned in the previous chapter.

6. Using Strings as Flags

Strings can also be used for simple state or flags.

For example:

SET feature:ai-chat enabled

Then:

GET feature:ai-chat

returns:

"enabled"

I can also use simple values like:

SET maintenance-mode 1

or:

SET maintenance-mode 0

The actual value depends on how the application wants to represent the state.

7. GET vs EXISTS

I also practiced the difference between GET and EXISTS.

GET gives me the value:

GET maintenance-mode

EXISTS only tells me whether the key is present:

EXISTS maintenance-mode

So:

GET
→ What is the value?

EXISTS
→ Does the key exist?
8. Node.js Methods I Practiced

For the Node.js experiments, I used:

redisClient.set()
redisClient.get()
redisClient.incr()
redisClient.exists()

I also used:

JSON.stringify()
JSON.parse()

to move JavaScript objects to and from Redis.

9. What I Understand Now

After this chapter, I understand that Redis Strings can be used for more than just storing simple text.

I practiced using them for:

Normal values
Numbers
JSON data
Temporary JSON with TTL
Simple flags/state

The main thing I learned is that JSON is still just a String from Redis's point of view. The application is responsible for converting the JavaScript object into JSON before storing it and parsing it again after retrieving it.


Available next action: :contentReference[oaicite:0]{index=0}