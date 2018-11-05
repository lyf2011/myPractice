import Game from './Game.js'

const INTERVAL = 300  //下落时间间隔

export default class Remote {
    constructor(socket) {
        let remoteInitOption = {
            gameAreaID : "remote_gameDiv",
            nextAreaID : "remote_nextDiv",
            timerID    : "remote_time",
            scoreID    : "remote_score",
            cellWidth  : 10,
        }
        this.socket = socket
        this.remote_game = new Game(remoteInitOption)
        this.timer = null
        bindCommandListener(this.socket, this)
    }

    start(randomType, randomDir) {
        this.remote_game.initGame(randomType, randomDir)
        // this.remote_game.doNext(generateType(), generateDir())
    }

    stop() {
        clearInterval(this.timer)
        this.local_game.stopGame()
    }
}

function generateType() {
    return Math.floor(Math.random() * 7 )
}

function generateDir() {
    return Math.floor(Math.random() * 4 )
}

function bindCommandListener(socket, remote) {
    socket.on("init", (data)=>{//收到来自对方的init消息（即对方已经执行了start），所以要在自己的remote中执行start
        remote.start(data.randomType, data.randomDir)
    })
    socket.on("next", (data)=>{//收到来自对方的next消息
        remote.remote_game.doNext(data.randomNextType,data.randomNextDir)
    })
    socket.on("drop", (data)=>{//收到来自对方的next消息
        remote.remote_game.drop()
    })
    socket.on("left", (data)=>{//收到来自对方的next消息
        remote.remote_game.left()
    })
    socket.on("rotate", (data)=>{//收到来自对方的next消息
        remote.remote_game.rotate()
    })
    socket.on("right", (data)=>{//收到来自对方的next消息
        remote.remote_game.right()
    })
    socket.on("down", (data)=>{//收到来自对方的next消息
        remote.remote_game.down()
    })
    socket.on("fixed", (data)=>{//收到来自对方的next消息
        remote.remote_game.fixed()
    })
    socket.on("clearLines", (data)=>{//收到来自对方的next消息
        remote.remote_game.clearLines()
        remote.remote_game.addScore(data)
    })
}