import Game from './Game.js'

const INTERVAL = 300  //下落时间间隔
// 游戏区和next区域的行数和列数
const GAME_ROW = 20
const GAME_COLUMN = 10
const NEXT_ROW = 4
const NEXT_COLUMN = 4

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
                    
                }
                if (this.local_game.checkGameOver()) {
                    this.stop(false)//我方检查完 发现我方自己已经gameOver,则说明我方失败
                    this.socket.emit("gameOver")
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

    /**
     * 
     * @param {*你是否赢了} isYouWin
     */
    stop(isYouWin) {
        clearInterval(this.timer)
        this.local_game.stopGame()
        this.local_game.showResult(isYouWin, "result_text", "result_wrap")
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
    socket.on("clearLines", (data)=>{//收到来自对方的clearLines消息
        if (data >= 3) {//如果对方一次消3行以上，我方需要自行增加干扰行,并告知对方我方产生的干扰行的数组数据
            let jamLines = generateJamLines(1)
            let addSuccessful = bind_Target.addBottomLines(jamLines)
            if (addSuccessful) {
                this.socket.emit("addBottomLines", jamLines)
            } else {//如果我方添加底部干扰行失败，说明我方游戏结束了，发送游戏结束消息
                this.stop(false)
                this.socket.emit("gameOver")
            }
        }
    })
}

function generateJamLines(num) {
    let jamLinesArr = []
    //产生num行干扰行，每行里至少要有一个方块的值为0,也至少要有一个1
    for (var row = 0; row < num; row++) {
        //每一行都一个一个的生成方块，随机填充0 或者 1，如果某一行在填充第10个方块时，还没有0，则第十个填充为0
        let hasZero = false 
        let hasOne = false 
        let temLine = []
        for (var column = 0; column < GAME_COLUMN-1; column++) {
            let cellValue = Math.round(Math.random())
            temLine[column] = cellValue
            if (cellValue === 0) {
                hasZero = true
            } else if(cellValue === 1) {
                hasOne = true
            }
        }
        if (hasZero && hasOne) {//绝大多数情况都是 已经有0和1了，则最后一个随即填充
            temLine.push(Math.round(Math.random()))
        } else if (!hasZero){
            temLine.push(0)
        } else if (!hasOne){
            temLine.push(1)
        }
        jamLinesArr.push(temLine)
    }
    return jamLinesArr
}