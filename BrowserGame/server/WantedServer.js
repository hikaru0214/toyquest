const options = {
    cors: {
        origin: '*',
    }
};

const io = require("socket.io")(3939,options);

const Game = require('../public/javascript/WantedGame.js');

const gamerooms = [];

for(var i = 0;i < 5;i++){
    gamerooms.push(new Game(i,4));
}

function getAvailableRoomIndex(){
    for(var i = 0;i < gamerooms.length;i++){
       if(!gamerooms[i].isFull())return i;
    }
    return -1;
}

io.on('connection',(socket)=>{
    const id = socket.id;
    var room = getAvailableRoomIndex(); //might not use
    var roomid = "room"+room; //might not use
    var ipaddress = socket.handshake.address;
    console.log("user connected! ip:"+ipaddress);

    socket.on("room query",()=>{
        var limits = [];
        var players = [];
        for(var i = 0;i < gamerooms.length;i++){
            limits.push(gamerooms[i].getPlayerLimit());
            players.push(gamerooms[i].getPlayerCount());
        }
        socket.emit("room info",{limit:limits,player:players});
    });

    socket.on("create new room",(room_setting)=>{
        var success = false;
        gamerooms.push(new Game(room_setting.room_id,room_setting.player_limit));
        success=true;
        if(success)socket.emit("room successfully created");
    });
    
});