import Game from './Game.js'

let local_game = new Game("local_gameDiv", "local_nextDiv")
let remote_game = new Game("remote_gameDiv", "remote_nextDiv")

local_game.initGame()
remote_game.initGame()