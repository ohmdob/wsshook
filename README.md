## WebSocket hook with Cloudflare worker + Durable Objects

Inspired by webhook for long execution  process via websocket



```mermaid
graph TD;
    WebA[Webhook Trigger] -->|Initiate Process| WebB[Process Server];
    WebB -->|Start Long Execution| WebSocket[WebSocket Connection];
    WebSocket -->|Send Updates| WebA[Webhook Receiver];
```

![alt text](example.jpg "Example")

Demo
[https://wsshook.ohmdob.workers.dev/home.html](https://wsshook.ohmdob.workers.dev/home.html)

Use case
- Shabu/Buffet Order
- Payment Process

Worker Doc
[https://developers.cloudflare.com/durable-objects/reference/websockets/](https://developers.cloudflare.com/durable-objects/reference/websockets/)