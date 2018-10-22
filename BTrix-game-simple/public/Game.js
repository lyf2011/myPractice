import BlockFactory from './BlockFactory.js'

// 游戏区和next区域的行数和列数
const GAME_ROW = 20
const GAME_COLUMN = 10
const NEXT_ROW = 4
const NEXT_COLUMN = 4

export default class Game {
    constructor(gameAreaID, nextAreaID, cellWidth) {
        // 游戏区数据数组和next数据数组
        this.gameData = []
        this.nextData = []

        // 游戏区的所有div和next区域所有的div
        this.gameDivs = []
        this.nextDivs = []

        this.gameAreaID = gameAreaID
        this.nextAreaID = nextAreaID

        this.cellWidth = cellWidth  //界面中每个方块的大小

        //界面中当前正在操作的积木  以及  接下来要进入的积木
        //这两个积木存在的意义是  每次有新的方块进入游戏区域时 将其中的数据赋值给 gameData 和 nextData
        this.currentBlock = null
        this.nextBlock = null
    }

    initGame() {
        this.gameData = initData(GAME_ROW, GAME_COLUMN)
        this.nextData = initData(NEXT_ROW, NEXT_COLUMN)
        this.gameDivs = initDivs(this.gameAreaID, GAME_ROW, GAME_COLUMN, this.cellWidth)
        this.nextDivs = initDivs(this.nextAreaID, NEXT_ROW, NEXT_COLUMN, this.cellWidth)

        this.currentBlock = new BlockFactory(3, 2)
        this.nextBlock = new BlockFactory(1, 1)

        copyData(this.gameData, this.currentBlock)
        copyData(this.nextData, this.nextBlock)

        this.refreshDivs(this.gameDivs, this.gameData)
        this.refreshDivs(this.nextDivs, this.nextData)
    }

    refreshDivs(divs, data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] === 0) {
                    divs[i][j].className = "none"
                } else if (data[i][j] === 1) {
                    divs[i][j].className = "fixed"
                } else if (data[i][j] === 2) {
                    divs[i][j].className = "current"
                } 
            }            
        }
    }

    down() {
        if (this.currentBlock.canDown(this.gameData)) {
            clearData(this.gameData, this.currentBlock)
            this.currentBlock.down()
            copyData(this.gameData, this.currentBlock)
            this.refreshDivs(this.gameDivs, this.gameData)
            return true
        } else {
            return false
        }
    }

    left() {
        if (this.currentBlock.canLeft(this.gameData)) {
            clearData(this.gameData, this.currentBlock)
            this.currentBlock.left()
            copyData(this.gameData, this.currentBlock)
            this.refreshDivs(this.gameDivs, this.gameData)
        }
    }

    right() {
        if (this.currentBlock.canRight(this.gameData)) {
            clearData(this.gameData, this.currentBlock)
            this.currentBlock.right()
            copyData(this.gameData, this.currentBlock)
            this.refreshDivs(this.gameDivs, this.gameData)
        }
    }

    rotate() {
        if (this.currentBlock.canRotate(this.gameData)) {
            clearData(this.gameData, this.currentBlock)
            this.currentBlock.rotate()
            copyData(this.gameData, this.currentBlock)
            this.refreshDivs(this.gameDivs, this.gameData)
        }
    }

    drop() {
        while(this.down()) {}
    }

    fixed() {
        
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

//初始化的时候，产生20*10个div(game区域) 以及 4*4个div(next区域)
function initDivs(containerID,row, column, cellWidth) {
    let areaDivs = []    //整个面的div数组，二维的
    let fragment = new DocumentFragment()
    for (var i = 0; i < row; i++) {
        let lineDivs = [] //一行的div数组
        for (var j = 0; j < column; j++) {
            let newDiv = document.createElement("div")
            newDiv.className = "none"
            newDiv.style.top = i * cellWidth + "px"
            newDiv.style.left = j * cellWidth + "px"
            lineDivs.push(newDiv)
            fragment.appendChild(newDiv)
        }
        areaDivs.push(lineDivs)
    }

    document.getElementById(containerID).appendChild(fragment)
    return areaDivs
}

function copyData(target_data, source) {
    for (var i = 0; i < source.data.length; i++) {
        for (var j = 0; j < source.data[0].length; j++) {
            let checkPointRow = i + source.origin.row
            let checkPointColumn = j + source.origin.column
            if (checkPointValid(target_data, checkPointRow, checkPointColumn)) {
                target_data[checkPointRow][checkPointColumn] = source.data[i][j]
            }
        }
    }
}

function clearData(target_data, source) {
    for (var i = 0; i < source.data.length; i++) {
        for (var j = 0; j < source.data[0].length; j++) {
            let checkPointRow = i + source.origin.row
            let checkPointColumn = j + source.origin.column
            if (checkPointValid(target_data, checkPointRow, checkPointColumn)) {
                target_data[checkPointRow][checkPointColumn] = 0
            }
        }
    }
}

//检测某一个点是否合法
function checkPointValid(gameData, checkPointRow, checkPointColumn) {
    if (checkPointRow < 0) {
        return false
    } else if (checkPointRow >= gameData.length) {
        return false
    } else if (checkPointColumn < 0) {
        return false
    } else if (checkPointColumn >= gameData[0].length) {
        return false
    } else if (gameData[checkPointRow][checkPointColumn]  === 1) { //如果下一个位置已经有fixed的方块了
        return false
    } else {
        return true
    }
}
