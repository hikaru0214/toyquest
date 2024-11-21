const options = {
    cors: {
        origin: '*',
    }
};

const io = require("socket.io")(3939,options);

const Game = require('../public/javascript/WantedGame.js');

const gamerooms = [];

for(var i = 0;i < 5;i++){
    gamerooms.push(new Game(i+1,4,"public"));
}

function getAvailableRoomIndex(){
    for(var i = 0;i < gamerooms.length;i++){
       if(!gamerooms[i].isFull())return i;
    }
    return -1;
}

function idIsUnique(id){
    for(var i = 0;i < gamerooms.length;i++){
        if(gamerooms[i].room_id==id)return false;
    }
    return true;
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
        var roomids = [];
        var accesstypes = [];
        for(var i = 0;i < gamerooms.length;i++){
            limits.push(gamerooms[i].getPlayerLimit());
            players.push(gamerooms[i].getPlayerCount());
            roomids.push(gamerooms[i].getID());
            accesstypes.push(gamerooms[i].access);
        }
        socket.emit("room info",{roomids:roomids,limit:limits,player:players,access:accesstypes});
    });

    socket.on("create new room",(room_setting)=>{
        const rid = room_setting.room_id;

        if(idIsUnique(rid)){
            gamerooms.push(new Game(rid,room_setting.player_limit,room_setting.access));
            socket.emit("room successfully created");
        }else{
            socket.emit("room id already exists");
        }

    });
    
});