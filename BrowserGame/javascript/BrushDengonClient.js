const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled=false;

var current_mouse_x = 0;
var current_mouse_y = 0;
var last_mouse_x = 0;
var last_mouse_y = 0;
var mouse_pressed = false;

    context.fillStyle = "white";
    context.fillRect(0,0,canvas.width,canvas.height);

function update(){

}

let start;
let lasttime = 0;

function draw(time){
    if(!start)start=time;
    const elapsed = time-start;

    requestAnimationFrame(draw);
}

function mouse_move(e){
    let rect = canvas.getBoundingClientRect();
    last_mouse_x = current_mouse_x;
    last_mouse_y = current_mouse_y;
    current_mouse_x = e.clientX-rect.x;
    current_mouse_y = e.clientY-rect.y;

    context.lineCap = "round";
  context.strokeStyle = "black";
  context.lineWidth = 24;

  if(mouse_pressed){
  context.beginPath();
  context.moveTo(last_mouse_x,last_mouse_y);
  context.lineTo(current_mouse_x,current_mouse_y);
  context.stroke();
  }
}

document.addEventListener('mousemove',mouse_move);
document.addEventListener('mousedown',function(e){mouse_pressed=true;});
document.addEventListener('mouseup',function(e){mouse_pressed=false;});

var updateInterval = 1000.0/60.0;
setInterval(update,updateInterval);
requestAnimationFrame(draw);
