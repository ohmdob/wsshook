interface DataType {
    hash: string
    data: string
    delay: number
}

export async function handleRest(request: Request, url: URL, state: DurableObjectState) {
    const res: DataType  = await request.json();

    setTimeout(() => {
        let sockets = state.getWebSockets();
        sockets.forEach((ws) => {
            const { hash } = ws.deserializeAttachment();
            if (res.hash === hash) {
                try {
                    ws.send(res.data);
                } catch (error) {
                    ws.close();
                }
                return;
            }
        });
    }, res.delay * 1000)

    return new Response(`Data Received!`, { status: 200 });
}
