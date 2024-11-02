const options = {
    cors: {
        origin: "http://52.68.111.88:7000",
        methods: ["GET", "POST"]
    }
};
const io = require("socket.io")(7000, options);

io.on("connection", socket => {
    console.log('a user connected');
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    });
});