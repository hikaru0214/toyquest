const options = {
    cors: {
        origin: '*',
    }
};

const io = require("socket.io")(6060,options);

const Game = require('../public/javascript/KillToolsGame.js');

const gamerooms = [];


for(var i = 0;i < 16;i++){
    gamerooms.push(new Game());
}

function getAvailableRoomIndex(){
    for(var i = 0;i < gamerooms.length;i++){
       if(!gamerooms[i].isFull())return i;
    }
    return -1;
}

io.on("connection",(socket)=>{
    console.log("user connected");
    var id = socket.id;

    socket.on("join_room",(r)=>{
    });

    socket.emit("ask job");

    socket.on("ask roominfo",()=>{
        var room_player_limits = [];
        var room_player_counts = [];
        for(var i = 0;i < gamerooms.length;i++){
            room_player_counts[i] = gamerooms[i].getPlayerCount();
            room_player_limits[i] = gamerooms[i].getPlayerLimit();
        }
        var roominfo = {room_count:gamerooms.length,limit:room_player_limits,count:room_player_counts};
        socket.emit("roominfo",roominfo);
    });

    socket.on("request join room",(data)=>{
        const game = gamerooms[data.index];
        game.addPlayer(id);
        socket.join(game.room_id);
        socket.emit("successfully joined a room");
    });


    socket.on("disconnect",()=>{
        console.log("user disconnected");
    }); 
});