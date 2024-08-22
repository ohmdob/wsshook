import { handleRest } from '../handlers/restHandler';
import { handleWebSocketUpgrade } from '../handlers/webSocketHandler';

export class DoJson {
    state: DurableObjectState;
    env: Env;
    initializePromise: Promise<void> | undefined;
  
    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
    }

    async fetch(request: Request) {
        let url = new URL(request.url);


        if (url.pathname.startsWith('/api')) {
            return handleRest(request, url, this.state);
        }

        // Handle WebSocket upgrade
        return handleWebSocketUpgrade(request, url, this.state);
    }

    // WebSocket close handler
    async webSocketClose(websocket: WebSocket) {
        let user = websocket.deserializeAttachment();
        // Handle the socket closing (not implemented in the provided code)
    }

    // Broadcast a message to all connected sockets
    async broadcast(message: string) {
        let sockets = this.state.getWebSockets();
        for (let socket of sockets) {
            try {
                socket.send(message);
            } catch (error) {
                console.error(error);
            }
        }
    }
}
