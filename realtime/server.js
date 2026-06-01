import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer)

io.on('connection', (socket) => { // when a new user connects to the server via socket.io
    console.log('a user connected');
})

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get("/sse", (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const intervalId = setInterval(() => {
        res.write(`data: some data in JSON formate\n\n`);
    }, 1000)

    setTimeout(() => {
        clearInterval(intervalId);
        res.end();
    }, 10000)
})


httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});