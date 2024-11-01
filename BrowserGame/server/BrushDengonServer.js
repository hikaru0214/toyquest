const express = require('express');
const app = express();
const http = require('http');
const server= http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

app.use(express.static('../public'));

app.get('/', (req, res) => {
    //console.log(path.join(__dirname,'../html/brush_dengon_draw.html'));
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

class Game{ //ゲームクラス、部屋ごとにゲームオブジェクトを用意する
    constructor(room_id){
        this.room_id = room_id;
        this.player_limit = 4; //プレイヤー数制限
        this.time_limit = 60; //時間制限
        this.round = 0; //ラウンドカウンター
        this.rounds = 0; //ラウンド数
        this.hints = 2; //ヒント(文字の一つを表示する)
        this.words = []; //お題
        this.player_ids = []; //プレイヤーid
        this.access = 0; //部屋アクセスタイプ　0(公開) 1(プライベート)
        this.state = 0; //部屋状態

        this.paint_history = []; //ペインターが書いている途中でゲッサーが入室した場合ゲッサーにそれまでの絵のデータをおくる
    }

    isFull(){ //満室か
        return this.player_ids.length >= this.player_limit;
    }

    getPlayerCount(){ //プレイヤーカウント
        return this.player_ids.length;
    }

    addPlayer(player_id){ //プレイヤー追加
        if(this.getPlayerIndexById(player_id)==-1)this.player_ids.push(player_id);
    }

    getPlayerIndexById(player_id){
        for(var i = 0;i < this.player_ids.length;i++){
            if(this.player_ids[i]===player_id){
                return i;
            }
        }
        return -1;
    }

    removePlayer(player_id){
        var index = this.getPlayerIndexById(player_id);
        if(index!=-1)this.player_ids.splice(index,1);
    }
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

var connections = 0;

io.on('connection', (socket) => {
    var id = socket.id;
    var room = getAvailableRoomIndex();
    var room_name = "room_"+room;
    var ipaddress = socket.handshake.address;
    connections++;

    //io.to(id).emit('connection established',id);
    socket.emit('connection established',{id,room});

    socket.join(room_name);
    gamerooms[room].addPlayer(id);

    console.log('a user connected, id : '+id+" ipaddress : "+ipaddress);

    socket.on("player_draw",(client)=>{

    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      gamerooms[room].removePlayer(socket.id);
      connections--;
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
        console.log("total of connected player : "+connections);
        for(var i = 0;i < gamerooms.length;i++){
            console.log("room_"+i+" players : "+gamerooms[i].getPlayerCount());
        }
    }
}

const updateInterval = 1000.0/60.0;
setInterval(update,updateInterval);