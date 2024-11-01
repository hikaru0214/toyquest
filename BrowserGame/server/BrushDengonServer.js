const express = require('express');
const app = express();
const http = require('http');
const server= http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

app.use(express.static('../public'));

app.get('/', (req, res) => {
    console.log(path.join(__dirname,'../html/brush_dengon_draw.html'));
    res.sendFile(path.join(__dirname,'../public/html/brush_dengon_draw.html'));
});

const characters = "abcdefghijklmnopqrstuvwxy0123456789";
function getRandomString(length){ //ランダム文字列
    var x = "";
    for(var i = 0;i < length;i++){
        var uppercase = Math.random()*2;
        var randomindex = Math.random()*characters.length;
        var randomcharacter = characters.substring(randomindex,randomindex+1);
        x+=(uppercase==0) ? randomcharacter : randomcharacter.toUpperCase();
    }
    return x;
}

const Game = require('./BrushDengonGame.js');

const gamerooms = [];

for(var i = 0;i < 5;i++){
    gamerooms.push(new Game(i));
}

function getAvailableRoomIndex(){
    for(var i = 0;i < gamerooms.length;i++){
       if(!gamerooms[i].isFull())return i;
    }
    return -1;
}

io.on('connection', (socket) => {
    var id = socket.id;
    var room = getAvailableRoomIndex();
    var room_name = "room_"+room;
    var ipaddress = socket.handshake.address;
    console.log('a user connected, id : '+id+" ipaddress : "+ipaddress);
    //io.to(id).emit('connection established',id);
    socket.emit('connection established',{id,room});

    socket.on('return player data',(data)=>{
        socket.join(room_name);
        var name = data.name;
        var score = 0;
        var initdata = {name,score};
        gamerooms[room].addPlayer(id,initdata);
        io.to(room_name).emit("player join",name);
    });

    socket.on("player_draw",(client)=>{

    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      gamerooms[room].removePlayer(socket.id);
      io.to(room_name).emit("player disconnect",id);
    });
});

server.listen(7000,()=>{
    console.log("BrushDengon Listening on port : 7000");
});


var start = Date.now();
var last = Date.now();
var timer = 0;
function update(){
    var now = Date.now();

    if(Date.now() >= last+1000){
        last+=1000;
        timer++;
        for(var i = 0;i < gamerooms.length;i++){
            console.log("room_"+i+" players : "+gamerooms[i].getPlayerCount());
        }
    }
}

const updateInterval = 1000.0/60.0;
setInterval(update,updateInterval);