const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled=false;


function update(){

}

let start;
let lasttime = 0;

function draw(time){
    if(!start)start=time;

    const elapsed = time-start;

    requestAnimationFrame(draw);
}

var updateInterval = 1000.0/60.0;
setInterval(update,updateInterval);
requestAnimationFrame(draw);