function loadPage() {
    let canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    let boardW, boardH, boardArray, squareSize, color, canvasSize, boardTopMargin, playerTurn, countTurn, endGame, inRow, img, escalaFoto;
    let tablero = 'imagenes/tablero.png';
    let fichaAmarilla = 'imagenes/fichaAmarilla.png';
    let fichaRoja = 'imagenes/fichaRoja.png';


    //Inicio de juego
    setUp();
    draw();
    eventosJugador();


    //FUNCTIONS

    //Configuarcion general de datos
    function setUp() {
        canvasSize = 800;
        inRow = 4;
        boardW = 7;
        boardH = 6;
        color = {
            "player": {
                0: "white",
                1: "yellow",
                2: "red"
            }
        };
        playerTurn = 1;
        countTurn = 0;
        endGame = false;
        setUpTablero();
        setUpCanvas();
        topText();
    }

    //Configura el tablero y la matriz
    function setUpTablero() {
        let image = new Image();
        image.src = tablero;
        image.onload = function () {
            img = this;
            ctx.drawImage(this, 0, 0 + squareSize, boardW * squareSize, boardH * squareSize);
            draw();
        }
        boardArray = [];
        for (y = 0; y < boardH; y++) {
            let row = [];
            for (x = 0; x < boardW; x++) {
                row.push(0);
            }
            boardArray.push(row);
        }
    }

    //Configura el canvas
    function setUpCanvas() {
        if (boardH + 1 > boardW) {
            canvas.height = canvasSize;
            squareSize = canvasSize / (boardH + 1);
            canvas.width = boardW * squareSize;
        } else {
            canvas.width = canvasSize;
            console.log(canvas.width);
            squareSize = canvasSize / boardW;
            canvas.height = (boardH + 1) * squareSize;
            console.log(canvas.height);
        }
    }

    //Dibuja las fichas en la matriz el valor 0 es el fondo blanco
    function draw() {
        for (y = 0; y < boardH; y++) {
            for (x = 0; x < boardW; x++) {
                drawTile(x, y + 1, boardArray[y][x]);
            }
        }
    }

    //Dibuja la ficha
    function drawTile(x, y, tileColor) {
        let centerX = (x * squareSize) + (squareSize / 2);
        let centerY = (y * squareSize) + (squareSize / 2);
        let tileSize = (squareSize * 0.8) / 2;

        ctx.fillStyle = color.player[tileColor];
        ctx.beginPath();
        ctx.arc(centerX, centerY, tileSize, 0, 2 * Math.PI);
        ctx.fill();
    }

    //Controla los movimientos del usuario
    function eventosJugador() {
        canvas.addEventListener("mousemove", (e) => {
            let posX = Math.floor((e.clientX - canvas.offsetLeft) / squareSize);
            if (!endGame) {
                clearTopRow();
                topText();
                drawTile(posX, 0, playerTurn);
            }
        })
        canvas.addEventListener("click", (e) => {
            let clickX = Math.floor((e.clientX - canvas.offsetLeft) / squareSize)
            if (!endGame) {
                for (y = boardH - 1; y >= 0; y--) {
                    if (boardArray[y][clickX] == 0) {
                        playMove(clickX, y);
                        break;
                    }
                }
            }
        })
    }

    //Controla los turnos y si el juego termina en victoria o empate
    function playMove(x, y) {
        countTurn++
        boardArray[y][x] = playerTurn;
        if (checkWin()) {
            topText("win")
        } else if (checkTie()) {
            topText("tie")
        } else {
            cambiarJugador();
            clearTopRow();
            topText("start");
            drawTile(x, 0, playerTurn);
        }
        draw();
    }
    //El squareSize es el rectangulo que esta entre el titulo y el tablero, maneja el ancho del tablero y el alto que es la division entre el tamanio del canvas(900) y la cantidad de columnas (7)
    function clearTopRow() {
        ctx.clearRect(0, 0, canvas.width, squareSize);
    }

    //Checkea victoria
    function checkWin() {
        if (winDirections()) {
            endGame = true
            return true;
        }
    }
    //Checkea empate
    function checkTie() {
        if (countTurn == boardW * boardH) {
            endGame = true;
            return true;
        }
    }

    //Cambia el jugador
    function cambiarJugador() {
        if (playerTurn == 1) {
            playerTurn = 2;
        } else {
            playerTurn = 1;
        }
    }

    //Titulo del juego
    let titulo = document.querySelector('#titulo');
    function topText(text) {
        clearTopRow();
        switch (text) {
            case "win": titulo.innerHTML = '4 en linea - El jugador ' + playerTurn + ' gana!'; break;
            case "tie": titulo.innerHTML = '4 en linea - Empate!'; break;
        };
    }

    //Checkeos de que forma gano
    function winDirections() {
        for (y = 0; y < boardH; y++) { //horizontal
            for (x = 0; x < boardW - 3; x++) {
                if (boardArray[y][x] == playerTurn && boardArray[y][x + 1] == playerTurn && boardArray[y][x + 2] == playerTurn && boardArray[y][x + 3] == playerTurn) return true;
            }
        }
        for (y = 0; y < boardH - 3; y++) { //vertical
            for (x = 0; x < boardW; x++) {
                if (boardArray[y][x] == playerTurn && boardArray[y + 1][x] == playerTurn && boardArray[y + 2][x] == playerTurn && boardArray[y + 3][x] == playerTurn) return true;
            }
        }
        for (y = 0; y < boardH - 3; y++) { //diagonal1
            for (x = 0; x < boardW - 3; x++) {
                if (boardArray[y][x] == playerTurn && boardArray[y + 1][x + 1] == playerTurn && boardArray[y + 2][x + 2] == playerTurn && boardArray[y + 3][x + 3] == playerTurn) return true;

            }
        }
        for (y = 3; y < boardH; y++) { //diagonal2
            for (x = 0; x < boardW - 3; x++) {
                if (boardArray[y][x] == playerTurn && boardArray[y - 1][x + 1] == playerTurn && boardArray[y - 2][x + 2] == playerTurn && boardArray[y - 3][x + 3] == playerTurn) return true;
            }
        }
        return false
    }

    let btnReset = document.querySelector('#btn-reset');
    function reiniciar() {
        setUp();
        draw();
        titulo.innerHTML = '4 en linea';
    }
    btnReset.addEventListener('click', reiniciar);
}
document.addEventListener("DOMContentLoaded", loadPage);