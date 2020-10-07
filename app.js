document.addEventListener('DOMContentLoaded', () => {

    var gridDiv = document.getElementById('grid');

    for( i=0; i < 200; i++ ) {
        var cell = document.createElement("DIV");
        gridDiv.appendChild(cell);
    }

    const grid = document.querySelector('#grid');
    let squares = Array.from(document.querySelectorAll('#grid div'));
    const width = 10;
    console.log(squares);

});
