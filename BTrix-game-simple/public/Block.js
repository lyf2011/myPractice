/**
 * 该类用来产生 不同的积木块，积木块的外包面积总共为4*4
 */

const OPERATETYPE = {
    ROTATE: 1,
    DOWN:2,
    LEFT:3,
    RIGHT:4
}

export default class Block {
    constructor() {
        this.dir = 0
        
        
        this.data = this.shapes[this.dir]

        this.origin = {
            row: 0,
            column: 0
        }
    }

    //检测当前积木  假如 下降一次后  每一个有值的方块  
    //是否是合法的  如果合法则可以下降，反之则不能下降
    canDown(check_target){
        return canOperate(check_target, this, OPERATETYPE.DOWN)
    }

    down() {
        this.origin.row += 1
    }

    //检测当前积木  假如 向左移动一次后  每一个有值的方块  
    //是否是合法的  如果合法则可以左移，反之则不能
    canLeft(check_target){
        return canOperate(check_target, this, OPERATETYPE.LEFT)
    }

    left() {
        this.origin.column -= 1
    }

    //检测当前积木  假如 向右移动一次后  每一个有值的方块  
    //是否是合法的  如果合法则可以右移，反之则不能
    canRight(check_target){
        return canOperate(check_target, this, OPERATETYPE.RIGHT)
    }

    right() {
        this.origin.column += 1
    }

    //检测当前积木  假如 顺时针旋转一次后  每一个有值的方块  
    //是否是合法的  如果合法则可以旋转，反之则不能
    canRotate(check_target) {
        return canOperate(check_target, this, OPERATETYPE.ROTATE)
    }

    rotate() {
        this.dir = (this.dir + 1) % 4
        this.data = this.shapes[this.dir]
    }
}

/**
 * 循环遍历  整个当前积木  是否可以进行下一步操作（旋转、下、左、右）
 * @param {Array} check_target  检测的容器
 * @param {Array} curBlockData  当前积木
 * @param {Integer} operateType 要检测的操作类型
 */
function canOperate(check_target, curBlock, operateType) {
    let nextOriginRow = curBlock.origin.row
    let nextOriginColumn = curBlock.origin.column
    let tempBlockData = curBlock.data

    if (operateType === OPERATETYPE.ROTATE) {
        let dir = (curBlock.dir + 1) % 4
        tempBlockData =  curBlock.shapes[dir]
    } else if(operateType === OPERATETYPE.DOWN) {
        nextOriginRow = curBlock.origin.row + 1
    } else if(operateType === OPERATETYPE.LEFT) {
        nextOriginColumn = curBlock.origin.column - 1
    } else if(operateType === OPERATETYPE.RIGHT) {
        nextOriginColumn = curBlock.origin.column + 1
    }

    for (var i = 0; i < tempBlockData.length; i++) {
        for (var j = 0; j < tempBlockData[0].length; j++) {
            if (tempBlockData[i][j] !== 0) {
                let checkPointRow = i + nextOriginRow
                let checkPointColumn = j + nextOriginColumn
                if (!checkPointValid(check_target, checkPointRow, checkPointColumn)) {
                    return false
                }
            }            
        }        
    }
    return true
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