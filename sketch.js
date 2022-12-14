let ready = false;


let rows = 3;
let cols = 4;
let gridHeigth;
let gridWidth;


//-------------------------------------------------------
// Create a new canvas to match the browser size
function setup() {
    createCanvas(windowWidth, windowHeight);

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

        gridWidth = width/2;
        gridHeigth =  height/2;
        let squareWidth = gridWidth/cols
        let squareHeight = gridHeigth/rows
        let initPosX = width/4
        let initPosY = height/4
        for(let colIndex = 0 ; colIndex < (cols) ; colIndex ++)  {
            for(let rowIndex = 0 ; rowIndex < (rows) ; rowIndex ++)  {
                rect(initPosX,initPosY, squareWidth, squareHeight);
                initPosY += squareHeight
            }
            initPosX += squareWidth
            initPosY -= (squareHeight*rows)
        }

    }
}

//-------------------------------------------------------
function mousePressed() {
    if (!ready) {
        initializeAudio();
        ready = true;
    } else {
        // click again to start/stop...
        if (Tone.Transport.state === "paused") Tone.Transport.start();
        else if (Tone.Transport.state === "started") Tone.Transport.pause();
    }
}

