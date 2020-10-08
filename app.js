document.addEventListener('DOMContentLoaded', () => {

    var gridDiv = document.getElementById('grid');

    for( i=0; i < 200; i++ ) {
        var cell = document.createElement("DIV");
        gridDiv.appendChild(cell);
    }
    for( i=0; i < 10; i++ ) {
        var cell = document.createElement("DIV");
        cell.classList.add('taken');
        gridDiv.appendChild(cell);
    }

    const grid = document.querySelector('#grid');
    let squares = Array.from(document.querySelectorAll('#grid div'));
    const ScoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#start-button');
    const width = 10;

    //Tetrominoes

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ];

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    //randomly select a tetramino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);
    console.log(random);

    let current = theTetrominoes[random][0];
    console.log("current= " +current);

    //draw the tetramino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        })
    }

    //undraw the tetramino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }

    //make the tetromino move down every second
    timerId = setInterval(moveDown, 1000);

    //move down dunction
    function moveDown(){
        undraw();
        currentPosition += width;
        draw();
    }

    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        }
    }

});

