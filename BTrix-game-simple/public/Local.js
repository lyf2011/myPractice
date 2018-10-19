import Game from './Game.js'

export default class Local {
    constructor() {
        this.local_game = new Game("local_gameDiv", "local_nextDiv", 20)
        this.remote_game = new Game("remote_gameDiv", "remote_nextDiv", 10)
    }

    start() {
        this.local_game.initGame()
        this.remote_game.initGame()
        bindKeyEvent(this.local_game)
    }
}

function bindKeyEvent(bind_Target) {
    document.onkeydown = (e)=>{
        if (e.keyCode === 32) { //空格
            
        } else if (e.keyCode === 37) { //左
            
        } else if (e.keyCode === 38) { //上
            
        } else if (e.keyCode === 39) { //右
            
        } else if (e.keyCode === 40) { //下
            bind_Target.drop()
        } 
    }
}