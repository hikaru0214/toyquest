const options = {
    cors: {
        origin: '*',
    }
};

const io = require("socket.io")(7000,options);

const Game = require('../public/javascript/BrushDengonGame.js');

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
        gamerooms[room].addPlayer(id,{name:data.name,score:0});
        socket.broadcast.to(room_name).emit("player join",data.name);
        socket.emit('game init',gamerooms[room]);
        socket.broadcast.to(room_name).emit("game update",gamerooms[room]);
        console.log("player "+data.name+" joined in the room "+room);
    });

    socket.on('textchat',(messsage)=>{
        var name = gamerooms[room].getPlayerById(id).name;
        console.log(name+" : "+messsage);
    });

    socket.on("player_draw",(client)=>{

    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      gamerooms[room].removePlayer(socket.id);
      io.to(room_name).emit("player disconnect",id);
    });
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