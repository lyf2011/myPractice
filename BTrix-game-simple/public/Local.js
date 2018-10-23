import Game from './Game.js'

const INTERVAL = 300  //下落时间间隔

export default class Local {
    constructor() {
        this.local_game = new Game("local_gameDiv", "local_nextDiv", 20)
        this.remote_game = new Game("remote_gameDiv", "remote_nextDiv", 10)
        this.timer = null
    }

    start() {
        this.local_game.initGame()
        this.remote_game.initGame()
        bindKeyEvent(this.local_game)
        this.timer = setInterval(()=>{
            if (!this.local_game.down()) {
                this.local_game.fixed()
                this.local_game.doNext(generateType(), generateDir())
            }
        }, INTERVAL)
    }
}

function generateType() {
    return Math.floor(Math.random() * 7 )
}

function generateDir() {
    return Math.floor(Math.random() * 4 )
}

function bindKeyEvent(bind_Target) {
    document.onkeydown = (e)=>{
        if (e.keyCode === 32) { //空格  直接到底
            bind_Target.drop()
        } else if (e.keyCode === 37) { //左
            bind_Target.left()
        } else if (e.keyCode === 38) { //上
            bind_Target.rotate()
        } else if (e.keyCode === 39) { //右
            bind_Target.right()
        } else if (e.keyCode === 40) { //下
            bind_Target.down()
        } 
    }
}