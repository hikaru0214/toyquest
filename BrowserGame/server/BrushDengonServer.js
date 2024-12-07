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
const secretword = [];
const wordhint = [];

for(var i = 0;i < 5;i++){
    gamerooms.push(new Game(i));
    secretword.push("");
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
        socket.emit('game init',JSON.stringify(gamerooms[room]));
        socket.broadcast.to(room_name).emit("game update",JSON.stringify(gamerooms[room]));
        io.to(room_name).emit("message to everyone in room",data.name+"が入室しました！");
        console.log("player "+data.name+" joined in the room "+room);
    });

    socket.on('textchat',(message)=>{
        var name = gamerooms[room].getPlayerById(id).name;
        console.log(name+" : "+message);

        io.to(room_name).emit("message to everyone in room",name+" : "+message);
        if(message===secretword[room]){
            //socket.emit(); 正解通知をチャットに送る
            gamerooms[room].addScore(id,123);
        }
    });

    socket.on("client draw",(data)=>{
        
        if(gamerooms[room].state=="standby"||gamerooms[room].isDrawing(id)){
            io.to(room_name).emit("draw relay",data);
        }
    });

    socket.on("clear canvas",(data)=>{
        if(gamerooms[room].state=="standby"||gamerooms[room].isDrawing(id)){
            io.to(room_name).emit("clear canvas");
        }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      const gameroom = gamerooms[room];
      io.to(room_name).emit("message to everyone in room",gameroom.getPlayerById(id).name+"が退室しました。");
      gameroom.removePlayer(socket.id);
      if(gameroom.getPlayerCount()<gameroom.minimum_players){
        gameroom.resetGame(io);
      }
      socket.broadcast.to(room_name).emit("game update",JSON.stringify(gameroom));
      io.to(room_name).emit("player disconnect",id);
    });
});


function update(){
    for(var i = 0;i < gamerooms.length;i++){
        var roomname = "room_"+i;
        var game = gamerooms[i];
        var remainingtime = parseInt(game.getRemainingTime(), 10);
        io.to(roomname).emit("update timer",remainingtime);
        io.to(roomname).emit("game update",JSON.stringify(game));
        var response = game.gameupdate(io);
        switch(response.instruction){
            case "setword":
                secretword[i] = response.word;
                break;
            case "reveal_and_result":
                var resultdata = {word:secretword[i],scores:response.data};
                io.to(roomname).emit("show_client_overlay_timed",{id:"gamescore",time:5,results:resultdata});
                break;
        }
    }
}

const updateInterval = 1000.0/15.0;
setInterval(update,updateInterval);