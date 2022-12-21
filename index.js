const canvas = document.getElementById("canvas")
const text = document.getElementById("text")
const context = canvas.getContext("2d")
const CELL_SIZE = 40
const COLORS = [
    "black",
    "green",
    "red",
    "blue",
    "purple",
    "violet",
    "yellow",
    "gray"
]
// 20 x 10
canvas.width = 10 * CELL_SIZE
canvas.height = 20 * CELL_SIZE
context.scale(CELL_SIZE, CELL_SIZE)

drawBlackBackground()

let score = 0
text.innerHTML = score 
let boardMatrix = createBoardMatrix()
let shapeMatrix = getRamdonShapeMatrix()
let position = {x: 3, y: 0}
drawMatrix(shapeMatrix, position)

let timeCounter = 0
let lastFrameTime = 0
let deltaTime = 0
function gameLoop(time = 0){
    deltaTime = time - lastFrameTime
    lastFrameTime = time
    timeCounter += deltaTime
    drawBlackBackground()
    if(timeCounter >= 1000){
        drop()
    }
    drawMatrix(shapeMatrix, position)
    drawMatrix(boardMatrix, {x:0, y: 0})
    drawGrid()
    requestAnimationFrame(gameLoop)
}
gameLoop()

document.onkeydown = event => {
    switch(event.keyCode){
        case 40:
            drop()
            break
        case 37:
            moveLeft()
            break
        case 39:
            moveRight()
            break
        case 32:
            rotateShape()
            break
    }
}

function drawLine(x1, y1, x2, y2){
    context.strokeStyle = "black"
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = 1/CELL_SIZE
    context.stroke();
}
function drawGrid(){
    // 20 x 10
    for(let y = 0;y<20;y++){
        drawLine(0, y, 10, y)
    }
    for(let x = 0; x<10; x++){
        drawLine(x, 0, x, 20)
    }
}
function getRamdonShapeMatrix(){
    let shapeList = [
        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ],
        [
            [0,2,0],
            [0,2,0],
            [2,2,0]
        ],
        [
            [0,3,0],
            [0,3,0],
            [0,3,3]
        ],
        [
            [4,4],
            [4,4]
        ],
        [
            [0,5,5],
            [5,5,0],
            [0,0,0]
        ],
        [
            [6,6,0],
            [0,6,6],
            [0,0,0]
        ],
        [
            [7,7,7],
            [0,7,0],
            [0,0,0]
        ]
    ]
    let randomIndex = Math.floor(Math.random() * shapeList.length) 
    return shapeList[randomIndex]
}
function rotateMatrix(matrix, clockWise){
    // Hoan vi
    for(let i = 0; i<matrix.length;i++){
        for(let j = 0; j < i; j++){
            [matrix[i][j],  matrix[j][i]] =  [ matrix[j][i], matrix[i][j]]
        }
    }
    // Kim dong ho - nghich dao cot
    if(clockWise === 1)
    matrix.forEach(row => {
        row.reverse()
    });
    // Nguoc kim dong ho - nghich dao hang
    else if(clockWise === -1)
        matrix.reverse()
}
function rotateShape(){
    rotateMatrix(shapeMatrix, 1)
    if(isColliding()){
        rotateMatrix(shapeMatrix, -1)
    }
}
function moveLeft(){
    position.x --
    if(isColliding()){
        position.x ++

    }
}
function moveRight(){
    position.x ++
    if(isColliding()){
        position.x --

    }
}
function isColliding(){
    for(let y = 0; y < shapeMatrix.length; y ++){
        for(let x = 0; x < shapeMatrix[y].length; x ++){
            if(shapeMatrix[y][x] !== 0 
                && boardMatrix[y + position.y]?.[x+position.x] !== 0){
                    return true
            }
        }
    }
    return false
}
function resetShape(){
    shapeMatrix = getRamdonShapeMatrix()
    position = {x: 3, y: 0}
    timeCounter = 0
    // Thua
    if(isColliding()){
        boardMatrix.forEach(row=>row.fill(0))
        resetShape()
        score = 0
        text.innerHTML = score
    }
}
function applyShapeMatrixToBoardMatrix(){
    for(let y = 0; y < shapeMatrix.length; y ++){
        for(let x = 0; x < shapeMatrix[y].length; x ++){
            if(shapeMatrix[y][x] !== 0 ){
                boardMatrix[y + position.y][x + position.x] = shapeMatrix[y][x]
            }
        }
    }
}
function checkLines(){
    let plusScore = 0
    let rowScore = 10
    row: for(let y = boardMatrix.length - 1; y >= 0; y--){
        for(let x = 0; x < boardMatrix[y].length; x ++){
            if(boardMatrix[y][x] === 0)
                continue row 
        }
        let deletedRow = boardMatrix.splice(y, 1)[0].fill(0)
        boardMatrix.unshift(deletedRow)
        y++
        plusScore += rowScore
        rowScore *= 2
    }

    score += plusScore
    text.innerHTML = score
}
function drop(){
    position.y ++
    if(isColliding()){
        position.y --
        applyShapeMatrixToBoardMatrix()
        checkLines()
        resetShape()
    }
    timeCounter = 0
}
function drawMatrix(matrix, position){
    matrix.forEach((row, y) => {
        row.forEach((number, x)=>{
            if(number !==0){
                context.fillStyle = COLORS[number]
                context.fillRect(x + position.x, y+position.y, 1, 1)
            }
        })
    });
}
function createBoardMatrix(){
    let matrix = []
    for(let i = 0; i< 20;i++){
        matrix.push(new Array(10).fill(0))
    }
    return matrix
}
function drawBlackBackground(){
    context.fillStyle = "black"
    context.fillRect(0, 0, canvas.width, canvas.height)
}