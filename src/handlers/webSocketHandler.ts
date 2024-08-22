export function handleWebSocketUpgrade(request: Request, url: URL, state: DurableObjectState) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
        return new Response('Durable Object expected Upgrade: websocket', { status: 426 });
    }

    let user = {
        hash: url.searchParams.get("hash"),
        enterTime: Date.now()
    };

    const [client, websocket] = Object.values(new WebSocketPair());
    websocket.serializeAttachment(user);
    state.acceptWebSocket(websocket);

    return new Response(null, { status: 101, webSocket: client });
}
