let express = require("express")
let app = express()
let server = require("http").Server(app)
let io = require("socket.io")(server)

const PORT = 3001

server.listen(PORT)

let playerCount = 0
let socketMap = new Map()

app.use(express.static(__dirname + '/public'))

io.on("connection", (socket)=>{
    playerCount++
    socket.playerNum = playerCount
    socketMap.set(playerCount, socket)
    if (playerCount % 2 === 1) { //如果是第一个进入游戏的人
        socket.emit("waiting")
    } else {
        socket.emit("start")
        socketMap.get(playerCount - 1).emit("start")
    }
    bindCommandListener(socket, "init")
    bindCommandListener(socket, "next")
    bindCommandListener(socket, "drop")
    bindCommandListener(socket, "left")
    bindCommandListener(socket, "rotate")
    bindCommandListener(socket, "right")
    bindCommandListener(socket, "down")
    bindCommandListener(socket, "fixed")
    bindCommandListener(socket, "clearLines")
    bindCommandListener(socket, "addBottomLines")
    bindCommandListener(socket, "gameOver")

    socket.on("disconnect", ()=>{

    })
})

function bindCommandListener(socket, command) {
    socket.on(command, (data)=>{
        if (socket.playerNum % 2 === 0) { 
            socketMap.get(socket.playerNum - 1).emit(command, data)
        } else {
            socketMap.get(socket.playerNum + 1).emit(command, data)
        }
    })
}

console.log("server is listening on " + PORT)