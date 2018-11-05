import Game from './Game.js'

const INTERVAL = 300  //下落时间间隔

export default class Local {
    constructor(socket) {
        let localInitOption = {
            gameAreaID : "local_gameDiv",
            nextAreaID : "local_nextDiv",
            timerID    : "local_time",
            scoreID    : "local_score",
            cellWidth  : 20,
        }
        this.socket = socket
        this.local_game = new Game(localInitOption)
        this.timer = null
    }

    start() {
        let randomType = generateType()
        let randomDir = generateDir()
        this.local_game.initGame(randomType, randomDir)
        this.socket.emit("init", {
            randomType,
            randomDir
        })
        // this.remote_game.initGame(generateType(), generateDir())
        let randomNextType = generateType()
        let randomNextDir = generateDir()
        this.local_game.doNext(randomNextType, randomNextDir)
        this.socket.emit("next", {
            randomNextType,
            randomNextDir
        })
        // this.remote_game.doNext(generateType(), generateDir())
        bindKeyEvent(this.local_game, this.socket)
        this.timer = setInterval(()=>{
            if (!this.local_game.down()) {
                this.local_game.fixed()
                this.socket.emit("fixed")
                let lines = this.local_game.clearLines()
                this.socket.emit("clearLines", lines)
                if (lines) {
                    this.local_game.addScore(lines)
                    if (data >= 3) {//如果对方一次消3行以上，则通知对方，让其自行增加1行干扰行
                        this.socket.emit("addBottomLines", 1)
                    }
                }
                if (this.local_game.checkGameOver()) {
                    this.stop()
                    this.local_game.showResult(true, "result_text", "result_wrap")
                } else {
                    let randomNextType = generateType()
                    let randomNextDir = generateDir()
                    this.local_game.doNext(randomNextType, randomNextDir)
                    this.socket.emit("next", {
                        randomNextType,
                        randomNextDir
                    })
                }
            } else {
                this.socket.emit("down")
            }
        }, INTERVAL)
    }

    stop() {
        clearInterval(this.timer)
        this.local_game.stopGame()
        document.onkeydown = null
    }


}

function generateType() {
    return Math.floor(Math.random() * 7 )
}

function generateDir() {
    return Math.floor(Math.random() * 4 )
}

function bindKeyEvent(bind_Target, socket) {
    document.onkeydown = (e)=>{
        if (e.keyCode === 32) { //空格  直接到底
            bind_Target.drop()
            socket.emit("drop")
        } else if (e.keyCode === 37) { //左
            bind_Target.left()
            socket.emit("left")
        } else if (e.keyCode === 38) { //上
            bind_Target.rotate()
            socket.emit("rotate")
        } else if (e.keyCode === 39) { //右
            bind_Target.right()
            socket.emit("right")
        } else if (e.keyCode === 40) { //下
            bind_Target.down()
            socket.emit("down")
        } 
    }
    socket.on("addBottomLines", (data)=>{//收到了对方让我方自行增加干扰行的消息，
        bind_Target.addBottomLines(data)
    })
}