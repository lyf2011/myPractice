import BlockFactory from './BlockFactory.js'

// 游戏区和next区域的行数和列数
const GAME_ROW = 20
const GAME_COLUMN = 10
const NEXT_ROW = 4
const NEXT_COLUMN = 4

export default class Game {
    constructor({gameAreaID, nextAreaID, cellWidth, timerID, scoreID}) {
        // 游戏区数据数组和next数据数组
        this.gameData = []
        this.nextData = []

        // 游戏区的所有div和next区域所有的div
        this.gameDivs = []
        this.nextDivs = []
        this.timerDiv = document.getElementById(timerID)
        this.scoreDiv = document.getElementById(scoreID)

        this.gameAreaID = gameAreaID
        this.nextAreaID = nextAreaID
        
        this.cellWidth = cellWidth  //界面中每个方块的大小

        //界面中当前正在操作的积木  以及  接下来要进入的积木
        //这两个积木存在的意义是  每次有新的方块进入游戏区域时 将其中的数据赋值给 gameData 和 nextData
        this.currentBlock = null
        this.nextBlock = null

        this.score = 0
        this.usedTime = 0
        this.isStop = true
    }

    initGame(randomType, randomDir) {
        this.gameData = initData(GAME_ROW, GAME_COLUMN)
        this.nextData = initData(NEXT_ROW, NEXT_COLUMN)
        this.gameDivs = initDivs(this.gameAreaID, GAME_ROW, GAME_COLUMN, this.cellWidth)
        this.nextDivs = initDivs(this.nextAreaID, NEXT_ROW, NEXT_COLUMN, this.cellWidth)

        this.nextBlock = new BlockFactory(randomType, randomDir)

        this.refreshDivs(this.gameDivs, this.gameData)
        this.refreshDivs(this.nextDivs, this.nextData)
        this.timerStart()
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
        setData(this.gameData, this.currentBlock, 1)
        this.refreshDivs(this.gameDivs, this.gameData)
    }

    clearLines() {
        let hasLine = true
        let lines = 0
        while(hasLine) {
            let row = this.gameData.findIndex((line)=>{
                return !line.includes(0)    //寻找某一行中不包含0的，也就是全是1或者2的行
            })
            if (row === -1) { //所有的行中  没有一行符合以上条件 也就是不用消行  结束此方法
                hasLine = false
                this.refreshDivs(this.gameDivs, this.gameData)
                return lines
            } else {
                this.gameData.splice(row, 1) //删除该行数据
                this.gameData.unshift(Array(GAME_COLUMN).fill(0)) //将数据最前边添加一行0
                lines++
            }
        }
    }

    addScore(lines) {
        let s = 0
        switch (lines) {
            case 1://消除一行，加10分
                s = 10
                break
            case 2://一次性消除2行，每行在10分基础上，再奖励5分
                s = 30
                break
            case 3://一次性消除3行，每行在10分基础上，再奖励10分
                s = 60
                break
            case 4://一次性消除4行，每行在10分基础上，再奖励15分
                s = 100
                break
            default:
                break
        }
        this.score += s
        this.scoreDiv.innerHTML = this.score
    }

    //判断游戏结束的条件就是  只检查  第二行的中间几个位置是否有值就行
    //因为  下一个方块是从编号为 3 4 5 6 四个位置开始的 且每个图形第二行都有值
    //所以  第二行的3 4 5 6 位置有值的话，就会使得下一个图形不能正常摆放，遂  游戏结束
    checkGameOver() {
        var gameOver = false
        for (var column = 3; column < 7; column++) {
            if (this.gameData[1][column] === 1) {
                gameOver = true
            }
        }
        return gameOver
    }

    doNext(randomType, randomDir) {
        this.nextBlock.origin.column = 3
        this.currentBlock = this.nextBlock
        this.nextBlock = new BlockFactory(randomType, randomDir)
        copyData(this.gameData, this.currentBlock)
        copyData(this.nextData, this.nextBlock)

        this.refreshDivs(this.gameDivs, this.gameData)
        this.refreshDivs(this.nextDivs, this.nextData)
    }

    timerStart() {
        this.isStop = false
        let timer = setInterval(()=>{
            if (this.isStop) {
                clearInterval(timer)
            } else {
                this.usedTime ++
                this.timerDiv.innerHTML = this.usedTime
            }
        },1000,this)
    }

    stopGame() {
        this.isStop = true
    }

    showResult(win, resultDivID, resultWrapID) {
        if (win) {
            document.getElementById(resultDivID).innerHTML = "太棒了，你赢了"
        } else {
            document.getElementById(resultDivID).innerHTML = "很可惜，你输了"
        }
        document.getElementById(resultWrapID).style.display = "block"
    }

    /**
     * 添加底部干扰行
     * @param {*生成干扰行的数量} lineNumber 
     */
    addBottomLines(lineNumber) {
        //首先整体向上移动n行,也就是把上边n行数据删除掉
        this.gameData.splice(0, lineNumber)
        //产生n行干扰行数据
        let jamLines = generateJamLines(lineNumber)
        //将n行干扰行数据添加在数据尾部
        this.gameData = this.gameData.concat(jamLines)
        //刷新界面
        this.refreshDivs(this.gameDivs, this.gameData)
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
    // for (var i = 0; i < source.data.length; i++) {
    //     for (var j = 0; j < source.data[0].length; j++) {
    //         let checkPointRow = i + source.origin.row
    //         let checkPointColumn = j + source.origin.column
    //         if (checkPointValid(target_data, checkPointRow, checkPointColumn)) {
    //             target_data[checkPointRow][checkPointColumn] = source.data[i][j]
    //         }
    //     }
    // }
    setData(target_data, source, 2)
}

function clearData(target_data, source) {
    // for (var i = 0; i < source.data.length; i++) {
    //     for (var j = 0; j < source.data[0].length; j++) {
    //         let checkPointRow = i + source.origin.row
    //         let checkPointColumn = j + source.origin.column
    //         if (checkPointValid(target_data, checkPointRow, checkPointColumn)) {
    //             target_data[checkPointRow][checkPointColumn] = 0
    //         }
    //     }
    // }
    setData(target_data, source, 0)
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

function setData(target_data, source, value) {
    for (var i = 0; i < source.data.length; i++) {
        for (var j = 0; j < source.data[0].length; j++) {
            let checkPointRow = i + source.origin.row
            let checkPointColumn = j + source.origin.column
            if (checkPointValid(target_data, checkPointRow, checkPointColumn)) {
                if (value === 1) {//要将gamedata中的值设为1，也就是要做fixed
                    if (target_data[checkPointRow][checkPointColumn] === 2) {
                        target_data[checkPointRow][checkPointColumn] = 1
                    }
                } else if(value === 2) {//要将gamedata中的值设为2，也就是要做移动(则不做判断，将cur中的值全部拷贝)
                    target_data[checkPointRow][checkPointColumn] = source.data[i][j]
                } else if(value === 0) {//要将gamedata中的值设为0，也就是要做清空上一位置的数据
                    target_data[checkPointRow][checkPointColumn] = 0
                }
            }
        }
    }
}

function generateJamLines(num) {
    let jamLinesArr = []
    //产生num行干扰行，每行里至少要有一个方块的值为0
    for (var row = 0; row < num; row++) {
        //每一行都一个一个的生成方块，随机填充0 或者 1，如果某一行在填充第10个方块时，还没有0，则第十个填充为0
        let hasZero = false 
        let temLine = []
        for (var column = 0; column < GAME_COLUMN-1; column++) {
            let cellValue = Math.round(Math.random())
            temLine[column] = cellValue
            if (cellValue === 0) {
                hasZero = true
            }
        }
        if (hasZero) {
            temLine.push(Math.round(Math.random()))
        } else {
            temLine.push(0)
        }
        jamLinesArr.push(temLine)
    }
    return jamLinesArr
}