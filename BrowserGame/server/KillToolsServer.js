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

    socket.on("create game",function(gamename){
        if(games.hasOwnProperty(gamename)){
            socket.emit("create error","game already exists : "+gamename);
            return;
        }else if(gamename==""){
            socket.emit("create error","empty game name");
            return;
        }
        console.log("game "+gamename+" created!");
        games[gamename] = {gamename};
        socket.join(gamename);
        socket.emit("game created");
    });

    socket.on("disconnect",()=>{
        console.log("user disconnected");
    }); 
});