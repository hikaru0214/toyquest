const express = require('express');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('../public'));

app.get('/BrushDengon',(req,res)=>{
    res.sendFile(__dirname+'./public/html/bd_draw.html');
});

io.on("connection",(socket)=>{
    console.log("user connected");

    socket.on('username',function(un){
        console.log(un);
    });

    socket.on("disconnect",()=>{
        console.log("user disconnected");
    });
});

server.listen(7000,()=>{
    console.log('listening on port: 7000');
});