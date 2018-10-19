/**
 * 该类用来产生 不同的积木块，积木块的外包面积总共为4*4
 */

export default class Block {
    constructor() {
        this.data = [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0]
        ]

        this.origin = {
            row: 0,
            column: 0
        }
    }
}