const express = require('express');
const app = express();
const http = require('http');
const server= http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('../', (req, res) => {
    res.sendFile(__dirname + '/html/brush_dengon_draw.html');
});


io.on('connection', (socket) => {
    console.log('a user connected');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

server.listen(7000,()=>{
    console.log("BrushDengon Listening on port : 7000");
});