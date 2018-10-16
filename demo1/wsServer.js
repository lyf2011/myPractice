let ws = require("nodejs-websocket")

const PORT = 3001
let server = ws.createServer((conn)=>{
    console.log("New Connection")
    conn.on("text", (str)=>{
        console.log("received " + str)
        conn.send(str)
    })
    conn.on("close", (code,reason)=>{
        console.log("Connection close")
    })
    conn.on("error", (err)=>{
        console.log("some thing wrong happend...")
        console.log(err)
    })
}).listen(PORT)

console.log("websocket server listening on port " + PORT)