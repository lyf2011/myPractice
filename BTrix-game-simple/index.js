let express = require("express")
let app = express()
let server = require("http").Server(app)
let io = require("socket.io")(server)

const PORT = 3001

server.listen(PORT)

app.use(express.static(__dirname + '/public'))

io.on("connection", (socket)=>{
    
})

console.log("server is listening on " + PORT)