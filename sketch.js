let ready = false;


let myGrid;



class GridSquare{

    constructor(initX, initY, width, heigth) {
        this.initX = initX;
        this.initY = initY;
        this.width = width;
        this.heigth = heigth;
        this.selected = false;
    }

    render(){
        push();
        if(this.selected) fill('gray');
        else fill('white');
        rect(this.initX, this.initY, this.width, this.heigth);
        pop();
    }

    isInside(posX, posY){
        let isInside = false;
        if( (posX >= this.initX) && (posX<= this.initX + this.width)){
            if( (posY >= this.initY) && (posY <= this.initY + this.heigth)){
                isInside = true;
            }
        }
        return isInside
    }

    toogleSelection(){
        this.selected = !this.selected;
    }

}

class Grid{

    constructor(window_heigth, window_width, rows, cols) {
        this.resetGridGeometry(window_heigth, window_width, rows, cols);
    }

    resetGridGeometry(window_heigth, window_width, rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.setGridCoordinates(window_heigth, window_width);
        this.setGridDimentions(window_heigth, window_width);
        this.setupSquares();
    }

    setupSquares(){
        let current_initPosX = this.initX;
        let current_initPosY = this.initY;
        this.squareMatrix = []

        for(let colIndex = 0 ; colIndex < (this.cols) ; colIndex ++)  {
            let squareColumn = []
            for(let rowIndex = 0 ; rowIndex < (this.rows) ; rowIndex ++)  {
                let currSquare = new GridSquare(current_initPosX,current_initPosY, this.squareWidth, this.squareHeigth);
                squareColumn.push(currSquare);
                current_initPosY += this.squareHeigth;
            }
            this.squareMatrix.push(squareColumn);
            current_initPosX += this.squareWidth;
            current_initPosY -= (this.squareHeigth * this.rows);
        }
    }

    setGridDimentions(window_heigth, window_width){
        this.width = window_width/2;
        this.heigth = window_heigth/2;
        this.squareWidth = this.width / this.cols;
        this.squareHeigth  = this.heigth / this.rows;
    }

    setGridCoordinates(window_heigth, window_width){
        this.initX = window_width/4;
        this.initY = window_heigth/4;
    }


    renderGrid(){
        for(let colIndex = 0 ; colIndex < (this.cols) ; colIndex ++)  {
            for(let rowIndex = 0 ; rowIndex < (this.rows) ; rowIndex ++)  {
                this.squareMatrix[colIndex][rowIndex].render();
            }
        }
    }

    checkSquareClick(clickX, clickY){
        for(let colIndex = 0 ; colIndex < (this.cols) ; colIndex ++)  {
            for(let rowIndex = 0 ; rowIndex < (this.rows) ; rowIndex ++)  {
                let currentSquare = this.squareMatrix[colIndex][rowIndex];
                if(currentSquare.isInside(clickX,clickY)){
                    currentSquare.toogleSelection();
                }
            }
        }
    }

}


//-------------------------------------------------------
// Create a new canvas to match the browser size
function setup() {
    createCanvas(windowWidth, windowHeight);
    myGrid = new Grid(windowHeight, windowWidth, 3,3 );
}


//-------------------------------------------------------
function initializeAudio() {
    Tone.Master.volume.value = -9; // turn it down a bit
    Tone.Transport.bpm.value = 60; // default 120
    Tone.Transport.start();
}


//-------------------------------------------------------
// On window resize, update the canvas size
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    myGrid.resetGridGeometry(windowHeight,windowWidth,myGrid.rows, myGrid.cols);
}

//-------------------------------------------------------
// Main render loop
function draw() {
    if (!ready) {
        background(0);
        fill(255);text
        textAlign(CENTER);
        text("CLICK TO START", width / 2, height / 2);
    } else {
        background('black');
        stroke("green");
        strokeWeight(3)
        myGrid.renderGrid();
    }
}

function mousePressed(event) {
    if (!ready) {
        initializeAudio();
        ready = true;
    } else {

       myGrid.checkSquareClick(event.clientX,event.clientY);

    }
}

