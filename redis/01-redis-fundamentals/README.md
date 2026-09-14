# Chapter 01 — Redis Fundamentals

This **Chapter 01** repository is focused on learning the fundamentals of Redis through practical, hands-on experiments.

The chapter covers **what Redis is**, how its in-memory data storage works, and why Redis is useful when an application needs fast access to data or temporary data storage.

## CLI Practice

I practiced Redis locally using **Memurai** on Windows and worked with Redis through the **Redis CLI**. I learned the basic key-value model and practiced storing, retrieving, updating, and deleting data using commands such as `SET`, `GET`, `EXISTS`, `DEL`, and `TYPE`.

## TTL

I also learned how **TTL (Time To Live)** works and how Redis can automatically remove temporary data after a specified amount of time. I tested different ways of setting expiration and observed how operations such as `SET` and `APPEND` affect an existing TTL.

## Strings & Counters

The chapter also covers **Redis Strings** and **counters**. I practiced modifying Strings with `APPEND` and worked with `INCR`, `INCRBY`, `DECR`, and `DECRBY` to understand how Redis can maintain counters. I used these concepts to create practical login and AI request counters and verified their values through the Redis CLI.

## Redis + MongoDB

Another important part of this chapter was understanding how Redis can work alongside MongoDB. I learned that Redis can handle fast or temporary data while MongoDB can continue handling persistent application data.

## Node.js Integration

Finally, I connected Redis with **Node.js** using the `redis` and `dotenv` packages. I learned how to:

- Create a Redis client
- Connect to the Redis server
- Perform Redis operations from Node.js
- Use environment variables for configuration
- Close the connection properly

## Purpose

The purpose of this chapter was not to cover every Redis feature. Instead, I focused on understanding the core concepts through actual experiments and connecting those concepts to practical backend use cases.

These fundamentals will serve as the foundation for the more advanced Redis concepts I learn and use in future projects.
