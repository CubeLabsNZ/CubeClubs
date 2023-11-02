import { WebSocketServer } from "ws";
import { db } from '../lib/db';

export const configureServer = () => {
    const webSocketServer = new WebSocketServer({
        port: 3000
    });

    webSocketServer.on("connection", (socket, request) => {
        socket.on("message", async (data, isBinary) => {
            console.log(`Recieved ${data}`);

            let users = await db
                .selectFrom("user")
                .select(["id", "name"])
                .where("name", "ilike", `%${data}%`)
                .execute();

            socket.send(JSON.stringify(users));
        });
    });
}

export const webSocketServer = {
    name: "webSocketServer",
    configureServer
}
