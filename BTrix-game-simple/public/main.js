import Local from './Local.js'
import Remote from './Remote.js'

let socket = io("ws://localhost:3001")
let localGame = new Local(socket)
let remoteGame = new Remote(socket)

socket.on("waiting", (data)=>{
    document.getElementById("waiting_wrap").style.display = "block"
})

socket.on("start", ()=>{
    document.getElementById("waiting_wrap").style.display = "none"
    localGame.start()
})



