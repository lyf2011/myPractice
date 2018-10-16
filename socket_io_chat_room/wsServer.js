let app = require("http").createServer()
let io = require("socket.io")(app)

const PORT = 3001
let clientCount = 0

app.listen(PORT)

io.on("connection", (socket)=>{
    console.log("New Connection")
    clientCount++
    let user = "user " + clientCount
    io.emit("enter", user + " comes in")
    socket.on("msg", (data)=>{
        console.log("received " + data)
        io.emit("msg", user + " says: " + data)
    })
    socket.on("disconnect", ()=>{
        console.log("Connection close")
        io.emit("leave", user + " has left")
    })
})

console.log("websocket server listening on port " + PORT)
