// Node server which will handle socket io connections

const io= require('socket.io')(3000, {
    cors: {
        origin: "*",
    }
});

const users = {};

io.on('connection', (socket) =>{
    // if any new user joined , let other users connected to the serer know!
    socket.on('new-user-joined', (uname)=>{
        console.log("New User", uname);
        users[socket.id] = uname;
        socket.broadcast.emit('user-joined', uname);
    }); 

    // if someone sends a message , broadcast it to other people
    socket.on('send', (message) =>{
        socket.broadcast.emit('receive',  {message: message, uname: users[socket.id]});
    });

    // if someone leaves the chat, let others know!
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    });
});