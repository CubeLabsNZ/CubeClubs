import { WebSocketServer } from "ws";

export const configureServer = (server) => {
    if (!server.httpServer) return;

    const webSocketServer = new WebSocketServer({
        server: server.httpServer,
    });

    webSocketServer.on("connection", (socket, request) => {
        socket.on("message", (data, isBinary) => {
            console.log(`Recieved ${data}`);
        });

        socket.send("test from server");
    });
}

export const webSocketServer = {
    name: "webSocketServer",
    configureServer,
}
