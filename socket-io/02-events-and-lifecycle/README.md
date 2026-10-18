# Events and Connection Lifecycle

This chapter is where I explored how Socket.IO connections behave in different situations, including disconnections, reconnections, and connection failures.

I tested these concepts using a small Express and Socket.IO application, focusing on what happens behind the scenes when a client connects to the server, loses its connection, or tries to reconnect.

## What I Worked On

- Handling connection and disconnection events.
- Understanding socket IDs and why they change after reconnecting.
- Observing the transport upgrade from HTTP long-polling to WebSocket.
- Understanding disconnect reasons and connection errors.
- Testing automatic and manual reconnection.
- Sending acknowledgements from the server to the client.
- Handling acknowledgement timeouts when the server doesn't respond.
- Testing what happens when the server goes offline and comes back online.

## Practical Experiments

I tested these concepts directly in the browser and terminal using multiple connection scenarios. I also simulated server downtime and network interruptions to observe how the client behaved.

One of the important things I learned was that receiving an event and acknowledging it are two different things. The server can process an event without sending an acknowledgement, which is why timeout handling matters.

I also learned that a socket ID represents a particular connection, not a permanent user identity.

## What I Learned

This chapter helped me understand how to handle connection-related situations instead of assuming that a client will always stay connected. These concepts will be useful when building real-time features where network interruptions and reconnections are expected.

## Tech Stack

- Node.js
- Express
- Socket.IO
- JavaScript (ES Modules)
- HTML