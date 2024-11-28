const options = {
    cors: {
        origin: '*',
    }
};

const io = require("socket.io")(3939,options);

const Game = require('../public/javascript/WantedGame.js');

const gamerooms = [];
const players = {};

for(var i = 0;i < 5;i++){
    gamerooms.push(new Game(i+1,4,"public",""));
}

function getGameByRoomId(roomid){
    for(var i = 0;i < gamerooms.length;i++){
        if(gamerooms[i].room_id==roomid)return gamerooms[i];
    }
    return null;
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
    var ipaddress = socket.handshake.address;
    console.log("user connected! ip:"+ipaddress);
    var page = "";
    var userid = "";

    socket.on("get my room",(data)=>{
        userid = data.userid;
        var playerdata = players[userid]
        if(playerdata){
            socket.join(playerdata.roomid);
            socket.emit("log on client","joined in the room "+playerdata.roomid);
            socket.emit("send player data",getGameByRoomId(playerdata.roomid).player_data);
            socket.broadcast.to(playerdata.roomid).emit("send player data",getGameByRoomId(playerdata.roomid).player_data);
            page="inroom";
            console.log("プレイヤー"+playerdata.username+"が部屋"+playerdata.roomid+"に入りました。");
        }else{
            socket.emit("log on client","you are not in a room!");
            socket.emit("exit room");
        }
    });

    socket.on("cursor update",data=>{
        var playerdata = players[userid];
        if(playerdata){
            socket.broadcast.to(playerdata.roomid).emit("cursor broadcast",{userid:userid,x:data.x,y:data.y});
        }
    });

    socket.on("room query",()=>{
        var limits = [];
        var playercounts = [];
        var roomids = [];
        var accesstypes = [];
        for(var i = 0;i < gamerooms.length;i++){
            limits.push(gamerooms[i].getPlayerLimit());
            playercounts.push(gamerooms[i].getPlayerCount());
            roomids.push(gamerooms[i].getID());
            accesstypes.push(gamerooms[i].access);
        }
        socket.emit("room info",{roomids:roomids,limit:limits,player:playercounts,access:accesstypes});
    });

    socket.on("create new room",(room_setting)=>{
        const rid = room_setting.room_id;

        if(idIsUnique(rid)){
            const newgame = new Game(rid,room_setting.player_limit,room_setting.access,room_setting.password);
            gamerooms.push(newgame);
            socket.emit("room successfully created");
        }else{
            socket.emit("room id already exists");
        }

    });

    socket.on("request join room",function(data){
        var message = "";
        const game = gamerooms[data.index]; // might be better to store game objects with roomid as key
        const roomid = game.room_id;

        if(game.isFull()){
            message = "部屋が満員です";
            socket.emit("failed to join",message);
            return;
        }

        if(game.access=="public"){
            game.addPlayer(data.userid,data.username);
            players[data.userid] = {roomid:roomid,username:data.username};
            socket.emit("successfully joined room");
        }else{
            
        }
    });

    socket.on('disconnect', () => {
        var playerdata = players[userid];
        if(page=="inroom"&&playerdata){
            const game = getGameByRoomId(playerdata.roomid);
            game.removePlayer(userid);
            socket.broadcast.to(playerdata.roomid).emit("send player data",getGameByRoomId(playerdata.roomid).player_data);
            socket.leave(playerdata.roomid);
            console.log("プレイヤー"+playerdata.username+"が部屋"+playerdata.roomid+"に入りました。");
            delete players[userid];
        }else{
            console.log("socket disconnected");
        }
    });
    
});