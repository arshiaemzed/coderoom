import app from "./app.js";
import { runWebSocketServer } from "./infrastructure/websocket/server.js";

app.listen(3001, () => {
  console.log(`HTTP server listening on port 3001`);
});

runWebSocketServer();
