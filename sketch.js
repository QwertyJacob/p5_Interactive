let ready = false;

let myPlayGround;
let resetBtn;

let notes = ['C1', 'E1', 'G1', 'B1',
                'C2','E2', 'G2', 'B2',
                'C3', 'E3', 'G3', 'B3',
                'C4', 'E4', 'G4', 'B4',
                'C5', 'E5', 'G5', 'B5',
                'C6', 'E6', 'G6', 'B6',
                'C7', 'E7', 'G7', 'B7']


let BPMSlider;


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

    constructor(initX, initY, width, height, rows, cols, instrument) {
        this.instrument =  instrument;
        this.currentColumn = 0;
        this.rows = rows;
        this.cols = cols;
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

    resetGridGeometry(initX, initY, width, height){
        this.initX = initX;
        this.initY = initY;
        this.width = width
        this.heigth = height;
        this.setSquareDimentions();
        this.setupSquares();
    }

    setupSquares(){
        let current_initPosX = this.initX;
        let current_initPosY = this.initY;
        this.squareMatrix = []
        for(let colIndex = 0 ; colIndex < (this.cols) ; colIndex ++)  {
            let squareColumn = []
            for(let rowIndex = 0 ; rowIndex < (this.rows) ; rowIndex ++)  {
                let currNote = notes[rowIndex];
                let currSquare = new GridSquare(current_initPosX,current_initPosY,
                                                this.squareWidth, this.squareHeigth,
                                                this.instrument, currNote);
                squareColumn.push(currSquare);
                current_initPosY += this.squareHeigth;
            }
            this.squareMatrix.push(squareColumn);
            current_initPosX += this.squareWidth;
            current_initPosY -= (this.squareHeigth * this.rows);
        }
    }

    setSquareDimentions(){
        this.squareWidth = this.width / this.cols;
        this.squareHeigth  = this.heigth / this.rows;
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

    resetSelection(){
        for(let colIndex = 0 ; colIndex < (this.cols) ; colIndex ++)  {
            for(let rowIndex = 0 ; rowIndex < (this.rows) ; rowIndex ++)  {
                this.squareMatrix[colIndex][rowIndex].selected = false;
            }
        }
    }

}

class Playground{
    constructor(grids, initInterval, window_width,window_heigth) {
        this.grids = grids;
        this.resetGeometry(window_width,window_heigth)
        this.loop = new Tone.Loop(this.loopCallback, initInterval);
        this.loop.playground = this;
    }

    setGridsSize(){
        this.gridWidth = this.width;
        this.gridHeight = this.height / this.grids.length;
    }

    renderPlayground(){
        this.grids.forEach(function (item, index) {
            item.renderGrid()
        });
    }

    loopCallback(transportTime){
        this.playground.grids.forEach(function (item, index) {
            item.nextColumn();
            item.play(transportTime);
        });
    }

    resetSelection(){
        this.grids.forEach(function (item, index) {
            item.resetSelection();
        });
    }

    resetGeometry(window_width,window_heigth){
        this.width = window_width / 1.25;
        this.height = window_heigth / 1.5;
        this.initX = (window_width/2) - (this.width/2);
        this.initY = (window_heigth/2) - (this.height/2);
        this.setGridsSize();
        let currX = this.initX;
        let currY = this.initY;

        for(let item of this.grids){
            item.resetGridGeometry(currX, currY, this.gridWidth, this.gridHeight);
            currY = currY + this.gridHeight + 10;
        }
    }

    selectOnClick(xCoord, yCoord){
        this.grids.forEach(function (item, index) {
            item.checkSquareClick(xCoord,yCoord);
        });
    }

}

//-------------------------------------------------------
// Create a new canvas to match the browser size
function setup() {
    createCanvas(windowWidth, windowHeight);

    myPlayGround = new Playground([new Grid(windowHeight, windowWidth, 10,3 , 15,15 ,Tone.Synth),
                                        new Grid(windowHeight, windowWidth, 10,3 , 15,15 ,Tone.MembraneSynth)],
                                '8n',
                                windowWidth, windowHeight)
    createBPMSlider();
    //createAddRowBtn();
    createResetButton();
}

function createBPMSlider(){
    BPMSlider = createSlider(60,180,120);
    BPMSlider.position(myPlayGround.initX+(myPlayGround.width/2)- (BPMSlider.width/2) ,40);
    BPMSlider.hide()
    BPMSlider.input(changeBPM);
}

function resetPositions(){
    resetBtn.position( myPlayGround.initX + (myPlayGround.width/2)- (resetBtn.width/2) , 10);
    BPMSlider.position(myPlayGround.initX+(myPlayGround.width/2)- (BPMSlider.width/2) , 40);

}

function createResetButton(){
    resetBtn = createButton("Reset");
    let initXForBtn = myPlayGround.initX + (myPlayGround.width/2)- (resetBtn.width/2)
    let initYForBtn = 10
    resetBtn.position(initXForBtn , initYForBtn);
    resetBtn.hide()
    resetBtn.mousePressed(resetSelection);
}

function resetSelection(){
    myPlayGround.resetSelection()
}

function changeBPM(){
    Tone.Transport.bpm.value = BPMSlider.value();
}



//-------------------------------------------------------
function initializeAudio() {
    Tone.Master.volume.value = -9; // turn it down a bit
    Tone.start().then(()=>{
        Tone.Transport.start();
        myPlayGround.loop.start();
        BPMSlider.show();
        //addRowBtn.show();
        resetBtn.show();

    });

}


//-------------------------------------------------------
// On window resize, update the canvas size
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    myPlayGround.resetGeometry(windowWidth,windowHeight);
    resetPositions();
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
        myPlayGround.renderPlayground();
    }
}

function mousePressed(event) {
    if (!ready) {
        initializeAudio();
        ready = true;
    } else {
        myPlayGround.selectOnClick(event.clientX,event.clientY);

    }
}

