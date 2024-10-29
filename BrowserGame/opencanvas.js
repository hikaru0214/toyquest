
let last_mouse_x = 0;
let last_mouse_y = 0;

let current_mouse_x = 0;
let current_mouse_y = 0;

var mouse_pressed = 0;

document.body.onmousedown = function(){
        mouse_pressed=1;
}

document.body.onmouseup = function(){
        mouse_pressed=0;
}

function init(){
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        context.fillStyle="white";
        context.fillRect(0,0,320,240);
}



function draw(e){
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");

        let rect = canvas.getBoundingClientRect();

        last_mouse_x = current_mouse_x;
        last_mouse_y = current_mouse_y;

        current_mouse_x = e.clientX-rect.x;
        current_mouse_y = e.clientY-rect.y;

        /*

        let rx1 = Math.random()*320;
        let ry1 = Math.random()*240;

        let rx2 = Math.random()*320;
        let ry2 = Math.random()*240;

        */

        if(mouse_pressed){

        context.beginPath();
        context.moveTo(last_mouse_x,last_mouse_y);
        context.lineTo(current_mouse_x,current_mouse_y);
        context.stroke();
        }

}

function clear(){
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        context.fillStyle="white";
        context.fillRect(0,0,320,240);
}

const clear_button = document.getElementById("button_canvas_clear").onclick = clear;

init();

document.addEventListener("mousemove",draw);