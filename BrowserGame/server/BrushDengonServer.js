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

function toHira(str){
    return str.replace(/[\u30a1-\u30f6]/g,function(match){
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
}

function toKana(str){
    return str.replace(/[\u3041-\u3096]/g,function(match){
        var chr = match.charCodeAt(0) + 0x60;
        return String.fromCharCode(chr);
    });
}

function isCorrect(word,guess){
    var hira = toHira(guess);
    var kata = toKana(guess);
    return (word==hira)||(word==kata);
}

const themes = [
    "イヌ",
    "ウシ",
    "ウマ",
    "カバ",
    "クマ",
    "サイ",
    "サル",
    "シカ",
    "ゾウ",
    "トラ",
    "ネコ",
    "ヒト",
    "ブタ",
    "ヤギ",
    "ラバ",
    "ラマ",
    "リス",
    "ロバ",
    "ハンバーグ",
    "ハンバーガー",
    "オムライス",
    "カレーライス",
    "パスタ",
    "からあげ",
    "おにぎり",
    "ききゅう",
    "きゅうきゅうしゃ",
    "くるま",
    "じてんしゃ",
    "しょうぼうしゃ",
    "しんかんせん",
    "タクシー",
    "せんすいかん",
    "ちかてつ",
    "でんしゃ",
    "ふね",
    "ヘリコプター",
    "ヨット",
    "サッカー",
    "フットサル",
    "やきゅう",
    "バスケットボール",
    "バレーボール",
    "ラグビー",
    "バドミントン",
    "たっきゅう",
    "テニス",
    "ゴルフ",
    "ボクシング",
    "プロレス",
    "ソフトボール",
    "ハンドボール",
    "ソフトテニス",
    "ビーチバレー",
    "りくじょう",
    "マラソン",
    "すいえい",
    "けんどう",
    "じゅうどう",
    "きゅうどう",
    "じょうば",
    "トランポリン",
    "ダンス",
    "バレエ",
    "ヨガ",
    "スポーツクライミング",
    "ボディビル",
    "ビーチサッカー",
    "スケートボード",
    "ダーツ",
    "ビリヤード",
    "ボウリング",
    "ドッジボール",
    "サーフィン",
    "スキー",
    "スノーボード",
    "フィギュアスケート",
    "アイスホッケー",
    "eスポーツ"];

    function escapeHtml(unsafe){
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
    }

const gamerooms = {};

for(var i = 0;i < 5;i++){
    var roomname = "room"+i;
    gamerooms[roomname] = {game:new Game(roomname,"public"),secretword:"",wordhint:""};
}

function getAvailableRoomName(){
    for(var roomname in gamerooms){
        var game = gamerooms[roomname].game;
        if(game.access=="public"&&!game.isFull())return roomname;
    }
    return "no room available";
}

io.on('connection', (socket) => {
    var id = socket.id;
    var room = getAvailableRoomName();
    var joined = false;
    var ipaddress = socket.handshake.address;

    var gamedata = gamerooms[room];
    var game = gamedata.game;
    var secretword = gamedata.secretword;
    var wordhint = gamedata.wordhint;

    console.log('a user connected, id : '+id+" ipaddress : "+ipaddress);
    socket.emit('connection established',{id,room});

    socket.on('search room',(rid)=>{
        if(Object.hasOwn(gamerooms,rid)){
            socket.emit("search room exists",rid);
        }else{
            socket.emit("search room doesnt exist",rid);
        }
    });

    socket.on('search create room',(rid)=>{
        if(Object.hasOwn(gamerooms,rid)){
            socket.emit("create room exists",rid);
        }else{
            socket.emit("create room doesnt exist",rid);
        }
    });

    socket.on('return player data',function(data){//すでに部屋に入っていた時の処理が必要かも
        if(joined)return;
        room = getAvailableRoomName();
        socket.join(room);
        joined = true;
        game.addPlayer(id,{name:data.name,score:0});
        socket.broadcast.to(room).emit("player join",data.name);
        socket.emit('game init',JSON.stringify(game));
        socket.broadcast.to(room).emit("game update",JSON.stringify(game));
        io.to(room).emit("notify in chat",{message:(data.name+"が入室しました!"),color:"#00ff00",background:"#ffffff"});
        console.log("player "+data.name+" joined in the room "+room);
    });

    socket.on('join room',function(data){//すでに部屋に入っていた時の処理が必要かも
        if(joined)return;

        var roomAlreadyExist = Object.hasOwn(gamerooms,data.roomid);

        room = data.roomid;

        if(!roomAlreadyExist){
            gamerooms[room] = {game:new Game(room,"private"),secretword:"",wordhint:""};
        }

        gamedata = gamerooms[room];
        game = gamedata.game;
        secretword = gamedata.secretword;
        wordhint = gamedata.wordhint;

        socket.join(room);
        joined = true;
        game.addPlayer(id,{name:data.name,score:0});
        socket.broadcast.to(room).emit("player join",data.name);
        socket.emit('game init',JSON.stringify(game));
        socket.broadcast.to(room).emit("game update",JSON.stringify(game));
        io.to(room).emit("notify in chat",{message:(data.name+"が入室しました!"),color:"#00ff00",background:"#ffffff"});
        console.log("player "+data.name+" joined in the room "+room);
    });

    socket.on('textchat',function(message){

        if(!joined)return;

        gamedata = gamerooms[room];
        game = gamedata.game;
        secretword = gamedata.secretword;
        wordhint = gamedata.wordhint;

        var name = game.getPlayerById(id).name;
        message = escapeHtml(message);
        console.log(name+" : "+message);
        if(game.Guessed(id)){
            var allguessed = game.AllIdOfGuessed();
            for(var i of allguessed){
                io.to(i).emit("chat message guessed",{name:name,message:message});
            }
            return;
        }
        if(message=="game start"){
            var didstart = game.gameStart();
            io.to(room).emit("chat message",{name:"*server*",message:didstart});
            return;
        }

        if(message=="skip painter"){
            game.painterSkip();
            io.to(room).emit("chat message",{name:"*server*",message:"painter skipped"});
            return;
        }

        if(message=="game reset"){
            game.resetGame();
            io.to(room).emit("chat message",{name:"*server*",message:"game reset"});
            return;
        }

        console.log(secretword+" : "+message+" : "+isCorrect(secretword,message));

        if(isCorrect(secretword,message)){
            //socket.emit(); 正解通知をチャットに送る
            game.Guess(id);
            io.to(room).emit("notify in chat",{message:(name+"が正解しました!"),color:"#3abe3a",background:"#3abe3a"});
            io.to(room).emit("play sound","guess");
            socket.emit("get word",secretword);
            socket.emit("confetti");
        }else{
            io.to(room).emit("chat message",{name:name,message:message});
        }
    });

    socket.on("client draw",function(data){
        if(!joined)return;
        if(game.state=="standby"||game.isDrawing(id)){
            io.to(room).emit("draw relay",data);
        }
    });

    socket.on("clear canvas",function(data){
        if(!joined)return;
        if(game.state=="standby"||game.isDrawing(id)){
            io.to(room).emit("clear canvas");
        }
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
      if(!joined)return;
      if(game.isDrawing(id))game.painter_left=true;
      io.to(room).emit("notify in chat",{message:(game.getPlayerById(id).name+"が退室しました。"),color:"#ff0000",background:"#be3a00"});
      game.removePlayer(id);
      if(game.getPlayerCount()<game.minimum_players){
        game.resetGame(io);
      }
      socket.broadcast.to(room).emit("game update",JSON.stringify(game));
      io.to(room).emit("player disconnect",id);
    });
});

function revealAndMerge(origin,fulltext){
    var index = parseInt(Math.random()*fulltext.length);
    var org_arr = Array.from(origin);
    org_arr[index]=fulltext[index];
    return org_arr.join('');
}

function update(){

    for(var roomname in gamerooms){
        var gamedata = gamerooms[roomname];
        var game = gamedata.game;
        var secretword = gamedata.secretword;
        var wordhint = gamedata.wordhint;

        var remainingtime = parseInt(game.getRemainingTime(), 10);
        if(!game.allguessed&&!game.painter_left)io.to(roomname).emit("update timer",remainingtime);
        io.to(roomname).emit("game update",JSON.stringify(game));
        var response = game.gameupdate(io);

        var swlength = 5;
        if(game.state=="drawing")swlength = gamerooms[roomname].secretword.length;
        if(game.state=="drawing"&&game.getTimer((game.time_limit/swlength)*1.3)<=0){
            game.setTimer();
            gamerooms[roomname].wordhint = revealAndMerge(wordhint,secretword);
            io.to(roomname).emit("get word",gamerooms[roomname].wordhint);
            io.to(game.getDrawerId()).emit("get word",gamerooms[roomname].secretword);
        }

        switch(response.instruction){
            case "setword":
                var sw = "";
                sw = themes[parseInt((Math.random()*themes.length),10)];
                console.log("next word for room "+roomname+" is : "+sw);
                gamerooms[roomname].secretword = sw;
                secretword = gamerooms[roomname].secretword;
                gamerooms[roomname].wordhint = game.hiddenWord(secretword);
                io.to(roomname).emit("get word",gamerooms[roomname].wordhint);
                io.to(game.getDrawerId()).emit("get word",sw);
                break;
            case "reveal_and_result":
                var resultdata = {word:secretword,scores:response.data};
                io.to(roomname).emit("show_client_overlay_timed",{id:"gamescore",time:5,results:resultdata});
                break;
        }
    }

}

const updateInterval = 1000.0/15.0;
setInterval(update,updateInterval);

setInterval(function(){
    var out = "";
    for(var r in gamerooms){
        var game = gamerooms[r].game;
        out+="["+r+" : "+game.getPlayerCount()+"/"+game.player_limit+"]";
    }
    console.log(out);
},1000);