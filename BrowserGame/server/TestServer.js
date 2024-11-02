const options = {
    cors: {
        origin: '*',
    }
};
const io = require("socket.io")(7000, options);

io.on("connection", socket => {
    console.log('a user connected');
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    });
});