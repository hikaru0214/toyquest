const options = {
    cors: {
        origin: '*',
    }
};

const io = require("socket.io")(6060,options);

const Game = require('../public/javascript/KillToolsGame.js');

const games = {};

io.on("connection",(socket)=>{
    console.log("user connected");
    var id = socket.id;
    var joinedgame = "";

    socket.on("create game",function(gamename){
        if(games.hasOwnProperty(gamename)){
            socket.emit("create error","game already exists : "+gamename);
            return;
        }else if(gamename==""){
            socket.emit("create error","empty game name");
            return;
        }
        console.log("game "+gamename+" created!");
        games[gamename] = {gamename:gamename};
        joinedgame = gamename;
        socket.join(gamename);
        socket.emit("game created");
    });

    socket.on("join game",function(gamename){
        if(games.hasOwnProperty(gamename)){
            joinedgame = gamename;
            socket.join(gamename);
        }else{

        }
    });

    socket.on("disconnect",()=>{
        socket.leave(joinedgame);
        console.log("user disconnected");
    }); 
});