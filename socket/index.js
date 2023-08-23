const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
  console.log("A User Connected !");

  //take userId and SocketId From User
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get messages
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log("users : "+ users);
    io.to(user.socketId).emit("getMessage" , {
      senderId,
      text
    })
  });

  //Disconnection
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User Disconnected");
    io.emit("getUsers", users);
  });
});
