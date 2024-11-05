const options = {
    cors: {
        origin: '*',
    }
};

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

const io = require("socket.io")(7000, options);

io.on("connection", socket => {
    console.log('a user connected');
    socket.emit('message',getRandomString(10));
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    });
});