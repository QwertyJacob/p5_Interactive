let ready = false;


let myGrid;



class Grid{

    constructor(window_heigth, window_width, rows, cols) {
        this.resetGridGeometry(window_heigth, window_width, rows, cols);
    }

    resetGridGeometry(window_heigth, window_width, rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.setGridCoordinates(window_heigth, window_width);
        this.setGridDimentions(window_heigth, window_width);
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
        let current_initPosX = this.initX;
        let current_initPosY = this.initY;


        for(let colIndex = 0 ; colIndex < (this.cols) ; colIndex ++)  {
            for(let rowIndex = 0 ; rowIndex < (this.rows) ; rowIndex ++)  {
                rect(current_initPosX,current_initPosY, this.squareWidth, this.squareHeigth);
                current_initPosY += this.squareHeigth
            }
            current_initPosX += this.squareWidth
            current_initPosY -= (this.squareHeigth * this.rows)
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

       console.log(event.clientX)
       console.log(event.clientY)
    }
}

