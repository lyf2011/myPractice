// 游戏区和next区域的行数和列数
const GAME_ROW = 20
const GAME_COLUMN = 10
const NEXT_ROW = 4
const NEXT_COLUMN = 4
const CELL_WIDTH = 20

export default class Game {
    constructor(gameAreaID, nextAreaID) {
        // 游戏区数据数组和next数据数组
        this.gameData = []
        this.nextData = []

        // 游戏区的所有div和next区域所有的div
        this.gameDivs = []
        this.nextDivs = []

        this.gameAreaID = gameAreaID
        this.nextAreaID = nextAreaID
    }

    initGame() {
        this.gameData = initData(GAME_ROW, GAME_COLUMN)
        this.nextData = initData(NEXT_ROW, NEXT_COLUMN)
        this.gameDivs = initDivs(this.gameAreaID, GAME_ROW, GAME_COLUMN)
        this.gameDivs = initDivs(this.nextAreaID, NEXT_ROW, NEXT_COLUMN)
    }


}


function initData(row, column) {
    let arr_2D = []
    for (var i = 0; i < row; i++) {
        if (i === 3) {
            let data = new Array(column).fill(1)
        }
        let data = new Array(column).fill(0)
        arr_2D.push(data)
    }

    return arr_2D
}

function initDivs(divID,row, column) {
    let areaDivs = []    //整个面的div数组，二维的
    let fragment = new DocumentFragment()
    for (var i = 0; i < row; i++) {
        let lineDivs = [] //一行的div数组
        for (var j = 0; j < column; j++) {
            let newDiv = document.createElement("div")
            newDiv.className = "none"
            newDiv.style.top = i * CELL_WIDTH + "px"
            newDiv.style.left = j * CELL_WIDTH + "px"
            lineDivs.push(newDiv)
            fragment.appendChild(newDiv)
        }
        areaDivs.push(lineDivs)
    }

    document.getElementById(divID).appendChild(fragment)
    return areaDivs
}


