import Local from './Local.js'
import Remote from './Remote.js'

let socket = io("ws://2theqh.natappfree.cc")
let localGame = new Local(socket)
let remoteGame = new Remote(socket)

socket.on("waiting", (data)=>{
    document.getElementById("waiting_wrap").style.display = "block"
})

socket.on("start", ()=>{
    document.getElementById("waiting_wrap").style.display = "none"
    localGame.start()
})

socket.on("gameOver", ()=>{//但凡收到gameOver的消息，肯定是对方发来的，我方胜利
    localGame.stop(true)
    remoteGame.stop()
})



