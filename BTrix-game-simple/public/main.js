// 游戏区和next区域的行数和列数
const GAME_ROW = 20
const GAME_COLUMN = 10
const NEXT_ROW = 4
const NEXT_COLUMN = 4

export default class Game {
    constructor() {
        // 游戏区数据数组和next数据数组
        this.gameData = []
        this.nextData = []
    }

    initGame() {
        this.gameData = initData(GAME_ROW, GAME_COLUMN)
        this.nextData = initData(NEXT_ROW, NEXT_COLUMN)
    }


}


function initData(row, column) {
    let arr_2D = []
    for (var i = 0; i < row; i++) {
        let data = new Array(column).fill(0)
        arr_2D.push(data)
    }

    return arr_2D
}

