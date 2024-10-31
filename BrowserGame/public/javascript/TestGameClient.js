const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled=false;

var current_mouse_x = 0;
var current_mouse_y = 0;
var last_mouse_x = 0;
var last_mouse_y = 0;
var mouse_pressed = false;

var title_logo = new ImageLoader("../img/Sprite-0003.png");
var cursor = new ImageLoader("../img/cursor.png");

const buttons = [];
buttons.push(new ui_button("シングルプレイヤー",canvas.width/2,canvas.height/2,"center",function(){}));
buttons.push(new ui_button("マルチプレイヤー",canvas.width/2,48+canvas.height/2,"center",function(){}));
buttons.push(new ui_button("設定",canvas.width/2,96+canvas.height/2,"center",function(){}));
buttons.push(new ui_button("トップへ戻る",canvas.width-6,canvas.height-36,"right",function(){}));

const setting_buttons = [];
setting_buttons.push(new ui_button(">",canvas.width/2,canvas.height/2,function(){console.log("button pressed");}));
setting_buttons.push(new ui_button("<",canvas.width/2,canvas.height,0,function(){console.log("opencanvas pressed");}));
setting_buttons.push(new ui_button("?",canvas.width-64,canvas.height-64,0,function(){vx=canvas.width/canvas.height;vy=1;bouncearound=true;}));

function update(){

}

let start;
let lasttime = 0;

function draw(time){
    if(!start)start=time;
    const elapsed = time-start;

    context.fillStyle = "yellow";
    context.fillRect(0,0,canvas.width,canvas.height);

    const title_width = title_logo.getImage().width;
    const title_height = title_logo.getImage().height;
    const title_x = (canvas.width/2)-title_width/2;
    const title_y = (canvas.height/3)-title_height/2;

    context.drawImage(title_logo.getImage(),title_x,title_y);

    for(var i = 0;i < buttons.length;i++){
        buttons[i].interact(current_mouse_x,current_mouse_y,mouse_pressed);
        buttons[i].show(context);
    }

    context.drawImage(cursor.getImage(),current_mouse_x,current_mouse_y,cursor.getImage().width*3,cursor.getImage().height*3);

    requestAnimationFrame(draw);
}

function mouse_move(e){
    let rect = canvas.getBoundingClientRect();
    last_mouse_x = current_mouse_x;
    last_mouse_y = current_mouse_y;
    current_mouse_x = e.clientX-rect.x;
    current_mouse_y = e.clientY-rect.y;
}

document.addEventListener('mousemove',mouse_move);
document.addEventListener('mousedown',function(e){mouse_pressed=true;});
document.addEventListener('mouseup',function(e){mouse_pressed=false;});

var updateInterval = 1000.0/60.0;
setInterval(update,updateInterval);
requestAnimationFrame(draw);
