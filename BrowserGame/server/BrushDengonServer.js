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

function hiddenWord(str){
    const x = "";
    const arr = Array.from(str);
    for(var i = 0;i < str.length;i++){
        x+=(arr[i]!=" ")?"_":" ";
    }
    return x;
}

function revealAndMergeLetter(origin,hinted){
    const index = parseInt(Math.random()*origin.length);
    const x = 0;
    const org_arr = Array.from(origin);
    const hnt_arr = Array.from(hinted);
    for(var i = 0;i < origin.length;i++){
        x+=i!=index?hnt_arr[i]:org_arr[index];
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

function startRound(room,socket){
    const game = gamerooms[room];
    const room_name = "room_"+room;
    if(game.state=="standby"){ //待機中で二人以上になったらゲーム開始
        if(game.getPlayerCount()>=2){
            game.state = "draw";
            var turn = game.turn;
            secretword[room] = game.words[parseInt((Math.random()*game.words.length), 10)];
            console.log("next word for room "+room+" is : "+secretword[room]);
            var painter = game.getPlayerById(game.getDrawerId());
            io.to(room_name).emit("message to everyone in room",painter.name+"が筆を手にした！");
            io.to(room_name).emit("get word",getRandomString(secretword[room].length));
            io.to(game.getDrawerId()).emit("get word",secretword[room]);
            game.setStartTime();
            socket.broadcast.to(room_name).emit("game update",JSON.stringify(gamerooms[room]));
        }else{
            console.log("you need atlease 2 player to start a round in room "+room);
        }
    }else{
        console.log("round already started in room "+room);
    }
}

function nextTurn(room){
    const game = gamerooms[room];
    const room_name = "room_"+room;
    if(game.state=="draw"){
        game.turn++;
        game.turn%=game.getPlayerCount();
        secretword[room] = game.words[parseInt((Math.random()*game.words.length), 10)];
        console.log("next word for room "+room+" is : "+secretword[room]);
        var painter = game.getPlayerById(game.getDrawerId());
        io.to(room_name).emit("message to everyone in room",painter.name+"が筆を手にした！");
        io.to(room_name).emit("get word",getRandomString(secretword[room].length));
        io.to(game.getDrawerId()).emit("get word",secretword[room]);
        game.setStartTime();
        console.log("game turn in room "+room+" is "+game.turn);
        io.to(room_name).emit("clear canvas");
    }
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

        if(gamerooms[room].getPlayerCount()>=2)startRound(room,socket);
    });

    socket.on('textchat',(messsage)=>{
        var name = gamerooms[room].getPlayerById(id).name;
        console.log(name+" : "+messsage);

        io.to(room_name).emit("message to everyone in room",name+" : "+messsage);
    });

    socket.on("client draw",(data)=>{
        io.to(room_name).emit("draw relay",data);
        /*
        if(gamerooms[room].getGameState()=="standby"||gamerooms[room].isDrawing(id)){
            io.to(room_name).emit("draw relay",data);
            console.log("relaying drawing to clients!");
        }
            */
    });

    socket.on("clear canvas",(data)=>{
        if(gamerooms[room].getGameState()=="standby"||gamerooms[room].isDrawing(id)){
            io.to(room_name).emit("clear canvas");
        }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      io.to(room_name).emit("message to everyone in room",gamerooms[room].getPlayerById(id).name+"が退室しました。");
      gamerooms[room].removePlayer(socket.id);
      socket.broadcast.to(room_name).emit("game update",JSON.stringify(gamerooms[room]));
      io.to(room_name).emit("player disconnect",id);
    });
});


function update(){
    for(var i = 0;i < gamerooms.length;i++){
        var roomname = "room_"+i;
        const game = gamerooms[i];
        var remainingtime = parseInt(game.getRemainingTime(), 10);
        io.to(roomname).emit("update timer",remainingtime);
        io.to(roomname).emit("game update",JSON.stringify(game));
        if(remainingtime<=0)nextTurn(i);
    }
}

const updateInterval = 1000.0/30.0;
setInterval(update,updateInterval);