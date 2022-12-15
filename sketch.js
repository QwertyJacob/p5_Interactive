let ready = false;

let myGrid;

let instruments = [Tone.Synth, Tone.MetalSynth, Tone.MembraneSynth]
let notes = ['C4', 'E4', 'G4', 'B4', 'C5', 'E5', 'G5', 'B5']


let BPMSlider;
let addRowBtn;

let myLoop = new Tone.Loop(loopCallback, '8n');

function loopCallback(transportTime){
    myGrid.nextColumn();
    myGrid.play(transportTime);
}




class GridSquare{

    constructor(initX, initY, width, heigth, instrument, note) {
        this.initX = initX;
        this.initY = initY;
        this.width = width;
        this.heigth = heigth;
        this.selected = false;
        this.instrument = new instrument();
        this.instrument.toDestination();
        this.note = note;
    }

    play(transportTime){
        this.instrument.triggerAttackRelease(this.note, '8n', transportTime);
    }

    render(highlight){
        push();
        if(this.selected) fill('gray');
        else fill('white');
        if(highlight) strokeWeight(6);
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
        this.currentColumn = 0;
    }

    play(transportTime){
        for(let rowIndex = 0 ; rowIndex < (this.rows) ; rowIndex ++)  {
            let currSquare = this.squareMatrix[this.currentColumn][rowIndex];
            if(currSquare.selected){
                currSquare.play(transportTime);
            }
        }
    }

    nextColumn(){
        this.currentColumn += 1;
        this.currentColumn = this.currentColumn % this.cols;
    }

    resetGridGeometry(window_heigth, window_width, rows, cols){
        console.log('resetting grid')
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
                let currInstrument = instruments[colIndex];
                let currNote = notes[rowIndex];
                let currSquare = new GridSquare(current_initPosX,current_initPosY,
                                                this.squareWidth, this.squareHeigth,
                                                currInstrument, currNote);
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
                let highlight = this.currentColumn === colIndex;
                this.squareMatrix[colIndex][rowIndex].render(highlight);
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
    myGrid = new Grid(windowHeight, windowWidth, 6,3 );
    createBPMSlider();
    createAddRowBtn();
}

function createBPMSlider(){
    BPMSlider = createSlider(60,180,120);
    BPMSlider.position(myGrid.initX+(myGrid.width/2)- (BPMSlider.width/2) , myGrid.initY+myGrid.heigth+10);
    BPMSlider.hide()
    BPMSlider.input(changeBPM);
}

function createAddRowBtn(){
    addRowBtn = createButton("Add Row!!");
    let initXForBtn = myGrid.initX + (myGrid.width/2)- (addRowBtn.width/2)
    let initYForBtn = 10
    addRowBtn.position(initXForBtn , initYForBtn);
    addRowBtn.hide()
    addRowBtn.mousePressed(addRow);
}

function changeBPM(){
    Tone.Transport.bpm.value = BPMSlider.value();
}

function addRow(){
    if (myGrid.rows < notes.length){
        myGrid.resetGridGeometry(windowHeight,windowWidth,myGrid.rows+1, myGrid.cols);
    }
}


//-------------------------------------------------------
function initializeAudio() {
    Tone.Master.volume.value = -9; // turn it down a bit
    Tone.start().then(()=>{
        Tone.Transport.start();
        myLoop.start();
        BPMSlider.show();
        addRowBtn.show();
    });

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

