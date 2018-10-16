let ws = require("nodejs-websocket")

const PORT = 3001

let clientCount = 0

let server = ws.createServer((conn)=>{
    console.log("New Connection")
    clientCount++
    broadcast("user " + clientCount + " comes in")
    conn.on("text", (str)=>{
        console.log("received " + str)
        broadcast(str)
    })
    conn.on("close", (code,reason)=>{
        console.log("Connection close")
        broadcast("user " + clientCount + " has left")
    })
    conn.on("error", (err)=>{
        console.log("some thing wrong happend...")
        console.log(err)
    })
}).listen(PORT)

console.log("websocket server listening on port " + PORT)

function broadcast(str) {
    server.connections.forEach((conn)=>{
        conn.send(str)
    });
}