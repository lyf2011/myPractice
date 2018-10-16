const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)

app.use(express.static(__dirname + '/public'));

const PORT = 3001
let users = []

server.listen(PORT)

io.on("connection", (socket)=>{
    console.log("New connection")
    let user = null
    
    socket.on("registName", (nickName)=>{
        user = nickName
        console.log(user)
        users.push(user)
        io.emit("enter", user + " has come in")
    })

    socket.on("message", (msg)=>{
        let handledMsg = {
            user,
            message: user + " says: " + msg
        }
        io.emit("message", handledMsg)
    })
    socket.on("disconnect", ()=>{
        if (user) {
            let index = users.findIndex((value, index, arr)=>{
                return value === user
            })
            users.splice(index,1)
            io.emit("leave", user + " has left!!!")
        }
    })
})

// server.get

console.log("socketIO service is listening on " + PORT)