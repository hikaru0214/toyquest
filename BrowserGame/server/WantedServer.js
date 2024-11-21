const options = {
    cors: {
        origin: '*',
    }
};

const io = require("socket.io")(3939,options);

const Game = require('../public/javascript/WantedGame.js');

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

io.on('connection',(socket)=>{
    const id = socket.id;
    var room = getAvailableRoomIndex();
    var roomname = "room"+room;

    socket.on("room query",()=>{
        var limits = [];
        var players = [];
        for(var i = 0;i < gamerooms.length;i++){
            limits.push(gamerooms[i].getPlayerLimit());
            players.push(gamerooms[i].getPlayerCount());
        }
        socket.emit("room info",{limit:limits,player:players});
    });
    
});