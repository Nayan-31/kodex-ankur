import app from './src/app.js';
import connectDB from './src/config/db.js';
import { createRedisClient } from './src/config/cache.js';
import { createServer } from "http"
import { initializeSocketServer } from "./src/sockets/socket.server.js"


const server = createServer(app);

// –––––––– connect to database ––––––––––––––––––––––––––
await connectDB();


// –––––––– connect to Redis ––––––––––––––––––––––––––––
createRedisClient();


// –––––––– initialize socket server –––––––––––––––––––––
initializeSocketServer(server);

server.listen(3000, () => {
    console.log('Server is running on port 3000');
})