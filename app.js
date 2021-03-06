document.addEventListener('DOMContentLoaded', () => {
    var mgContainerDiv = document.querySelector('.mini-grid-container');
    var gridDiv = document.getElementById('grid');

    for( i=0; i < 200; i++ ) {
        var cell = document.createElement("DIV");
        gridDiv.appendChild(cell);
    }
    for( i=0; i < 10; i++ ) {
        var cell = document.createElement("DIV");
        cell.classList.add('taken', 'floor');
        gridDiv.appendChild(cell);
    }

    var miniGrid = document.createElement("DIV");
    miniGrid.classList.add('mini-grid');
    mgContainerDiv.appendChild(miniGrid);

    for( i=0; i < 16; i++ ) {
        var cell = document.createElement("DIV");
        miniGrid.appendChild(cell);
    }

    const grid = document.querySelector('#grid');
    let squares = Array.from(document.querySelectorAll('#grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const newGameBtn = document.querySelector('#newGameButton');
    const width = 10;
    let nextRandom = 0;
    let timerSpeed = 1000;
    let timerId;
    let score = 0;
    const colors = [
        'rgb(131, 56, 236)',
        'rgb(255, 0, 110)',
        'rgb(255, 190, 11)',
        'rgb(58, 134, 255)',
        'rgb(251, 86, 7)'
    ]


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
    //randomly select a tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);

    let current = theTetrominoes[random][0];
    
    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        })
    }

    //undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }

    //make the tetromino move down every second
    // timerId = setInterval(moveDown, 1000);

    //assign functions to keycodes
    function control(e) {
        if(e.which === 37) {
            moveLeft();
        }
        else if (e.which === 32){
            rotate("right");
        }
        else if (e.which === 91){
            rotate("left");
        }
        else if (e.which === 39){
            moveRight()
        }
        else if (e.which === 40){
            moveDown()
        }
    }

    document.addEventListener('keydown', control);

    //move down dunction
    function moveDown(){
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            //start new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            addScore();
            draw();
            displayShape();
            gameOver();
        }
    }

    //move left, unless at the edge of the board
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0 );

        if(!isAtLeftEdge) currentPosition -=1;

        if( current.some(index => squares[currentPosition + index].classList.contains('taken')) ){
            currentPosition +=1;
        }
        
        draw();
    }

    //move right, unless at the edge of the board
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1 );

        if(!isAtRightEdge) currentPosition +=1;

        if( current.some(index => squares[currentPosition + index].classList.contains('taken')) ){
            currentPosition -=1;
        }
        
        draw();
    }

    //rotate the tetromino
    function rotate(dir) {
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0 );
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1 );
        undraw();

        if (dir ==="right"){
            currentRotation++;
            if(currentRotation === current.length){
                currentRotation = 0;
            }
        }
        else if (dir ==="left"){
            if(currentRotation === 0){
                currentRotation = current.length;
            }
            currentRotation--;

        }
        //If current rotation is in the final position, go back to first rotation
        
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    //Show up-next tetromino in mini-grid diplay
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    //The Tetrominoes without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]//iTetromino
    ]

    // display the shape in the mini-grid display
    function displayShape(){
        //remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index + 1].classList.add('tetromino');
            displaySquares[displayIndex + index + 1].style.backgroundColor = colors[nextRandom];
        })
    }

    //add functionality to the button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            startBtn.innerHTML = 'Resume';
            startBtn.style.backgroundColor = 'rgb(58, 134, 255)';
            clearInterval(timerId);
            timerId = null;
        }
        else {
            startBtn.innerHTML = 'Pause';
            startBtn.style.backgroundColor = '#da3636';
            draw();
            timerId = setInterval(moveDown, timerSpeed);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    })

    newGameBtn.addEventListener('click', () => {
        newGame();
    })

    // add score
    function addScore(){
        for(let i = 0; i < 199; i +=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;



                colors.push(colors[0]);
                colors.shift();
                document.querySelectorAll('div.tetromino').forEach(elem => {
                    var currentColor = elem.style.backgroundColor;
                    var currentColorArrIndex = colors.indexOf(currentColor);
                    if (currentColor === colors[(colors.length + 1)]) {
                        currentColor = colors[0];
                    }
                    else{
                        currentColor = colors[currentColorArrIndex +1];
                    }
                    elem.style.backgroundColor = currentColor;
                })


                //speed up game every 50 pts
                if (score % 50 === 0) {
                    timerSpeed *= .7;
                    clearInterval(timerId);
                    timerId = setInterval(moveDown, timerSpeed);
                }
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken' , 'tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
                
            }
        }
    }



    //Game over
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            console.log("game over");
            // scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
            newGameBtn.style.display = 'block';
            startBtn.style.display = 'none';

        }
    }

    function newGame() {
        clearInterval(timerId);
        squares.forEach(index => {
            index.classList.remove("taken", "tetromino");
            index.style.backgroundColor = "";
         });
         document.querySelectorAll('.floor').forEach(index => {
            index.classList.add('taken');
         })
         newGameBtn.style.display = 'none';
         startBtn.style.display = 'block';            
         nextRandom = Math.floor(Math.random()*theTetrominoes.length);
         score = 0;
         timerSpeed = 1000;
         currentPosition = 4;
         currentRotation = 0;
         random = Math.floor(Math.random()*theTetrominoes.length);
         current = theTetrominoes[random][0];
         draw();
         timerId = setInterval(moveDown, timerSpeed);
         nextRandom = 0;
         displayShape();
         startBtn.innerHTML = 'Pause';
    }


});

