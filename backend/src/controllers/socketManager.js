import { Server } from "socket.io";
// this function will handle socket connections and events 
let connections = {};
let messages = {};
let timeOnline = {};

// at a point of time 
// connections = {
//     room1:["id1","id2","id3"],
//     room2:["id4"]
// }

// Object.entries(connections)
// [
//    ["room1",["id1","id2","id3"]],
//    ["room2",["id4"]]
// ]

export const connectToSocket = (server) => {
  const io = new Server(server ,{
    cors:{
        origin :"*",
        methods :['GET', 'POST'],
        allowedHeaders :['*'],
        credentials : true

    }

  });
  io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);
    socket.on("join-call" , (path)=>{
        console.log("📥 Path received from client:", path); 
        if(connections[path]=== undefined){
            connections[path] = [];
        }
        connections[path].push(socket.id);
        timeOnline[socket.id] = new Date();
        // traverse connections-path
        
        for(let a = 0 ; a < connections[path].length ; a++){
            io.to(connections[path][a]).emit("user-joined" , socket.id , connections[path]);
        }

        if(messages[path] != undefined){
            messages[path].forEach(msg => {
                io.to(socket.id).emit("chat-message" , msg['data'] , msg['sender'] , msg['socket-id-sender']);
            });
            messages[path] = [];
        }
    })
    

    socket.on('signal' ,(toId , message)=>{
        io.to(toId).emit('signal' , socket.id , message);
    })

//     messages = {
//     room1:[
//         {
//             sender:"Deepak",
//             data:"Hello",
//             socket-id-sender:"id2"
//         }
//     ]
// }
    // data and sender send to all other user on that room
    socket.on("chat-message", (message, senderName) => {

        let roomName = "";
        for (const room in connections) {
            if (connections[room].includes(socket.id)) {
                roomName = room;
                break;
            }
        }
        if (roomName === "") return;

        if (!messages[roomName]) {
            messages[roomName] = [];
        }

        messages[roomName].push({
            sender: senderName,
            data: message,
            "socket-id-sender": socket.id
        });

        console.log(
            "message",
            roomName,
            ":",
            senderName,
            message
        );

        connections[roomName].forEach((userId) => {
            io.to(userId).emit(
                "chat-message",
                message,
                senderName,
                socket.id
            );
        });

    });
   socket.on("disconnect", () => {

        const onlineTime = Math.abs(timeOnline[socket.id] - new Date());

        let roomName = "";

        for (const [currentRoom, users] of Object.entries(connections)) {

            if (users.includes(socket.id)) {
                roomName = currentRoom;

                users.forEach((userId) => {
                    io.to(userId).emit(
                        "user-left",
                        socket.id
                    );
                });

                const index = users.indexOf(socket.id);

                users.splice(index, 1);

                if (users.length === 0) {
                    delete connections[currentRoom];
                    //  delete messages[roomName];
                }

                break;
            }
        }
    });




    // Handle user connection}
  })
  return io;

}

