
var socket = io.connect('http://52.68.111.88:7000');
let own_id = "";

const characters = "abcdefghijklmnopqrstuvwxy0123456789";
function getRandomString(length){ //ランダム文字列
    var x = "";
    for(var i = 0;i < length;i++){
        var uppercase = Math.random()*2;
        var randomindex = Math.random()*characters.length;
        var randomcharacter = characters.substring(randomindex,randomindex+1);
        x+=(uppercase==0) ? randomcharacter : randomcharacter.toUpperCase();
    }
    return x;
}

let client_name = getCookie('username');
let clientGame = null;

socket.on('connection established',(data)=>{
    console.log("connection established with server! this is my id : "+data.id+" your room index is : "+data.room);
    own_id = data.id;
    var name = client_name;
    socket.emit('return player data',{name});
});

socket.on('player join',(data)=>{
    console.log(data.name+" joined! say hello!");
    var scoreboard = document.getElementById("scoreboard");
    clientGame = data.servegame;
    scoreboard.innerHTML += "<br>"+data.name+"";
});

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled=false;
context.antiAlias = false;

var current_mouse_x = 0;
var current_mouse_y = 0;
var last_mouse_x = 0;
var last_mouse_y = 0;
var mouse_pressed = false;

var paint_color = "black";
var brush_thickness = 8;
var cursor_type = "brush"; //brush か bucket か spray ブラシ、　バケツ、スプレー

function getClientData(){
    var cx = current_mouse_x;
    var cy = current_mouse_y;
    var lx = last_mouse_x;
    var ly = last_mouse_y;
    const client = [cx,cy,lx,ly,mouse_pressed,paint_color,brush_thickness,cursor_type];
}

context.fillStyle = "white";
context.fillRect(0,0,canvas.width,canvas.height);

    var palette_div = document.getElementById("palette");
    var temp = palette_div.innerHTML;
    
    function setColorCallback(color){
        return function(){
            paint_color = color;
            console.log("color set to : "+color);
        }
    }

    palette_div.innerHTML = "パレット<br>";
    var colors = ["red","blue","aqua","yellow","green","burlywood","darkred","darkblue","skyblue",
        "darkkhaki","darkgreen","brown","#ffdbac","pink","magenta","violet","purple","#871F78","white","gainsboro","gray","black"];
    for(var i = 0;i < 22;i++){
        var option = "";
        if(colors[i]=="white")option="border : 1px solid black;";
    palette_div.innerHTML += '<button id=\"color'+i+'\" class=\"palette_color\" style=\"background-color: '+colors[i]+'; '+option+'\"></button>';
    }
    palette_div.innerHTML += temp;

    function clear(){
        context.fillStyle = "white";
        context.fillRect(0,0,canvas.width,canvas.height);
    }

    function colorEqual(color0,color1){
        return color0[0] === color1[0] && color0[1] === color1[1] && color0[2] === color1[2] && color0[3] === color1[3];
    }

    let initialized = false;

    function init(){
        for(var i = 0;i < 22;i++){
            document.getElementById("color"+i).onclick = setColorCallback(colors[i]);
        }
        document.getElementById("thickness_thick").onclick = function(){
            brush_thickness = 32;
        };
        document.getElementById("thickness_medium").onclick = function(){
            brush_thickness = 16;
        };
        document.getElementById("thickness_small").onclick = function(){
            brush_thickness = 8;
        };
        document.getElementById("thickness_thin").onclick = function(){
            brush_thickness = 4;
        };
        document.getElementById("paint_bucket").onclick = function(){
            cursor_type = "bucket";
        }
        document.getElementById("brush").onclick = function(){
            cursor_type = "brush";
        }
        document.getElementById("clear").onclick = function(){
            clear();
        }
        initialized = true;
    }

function update(){
    if(!initialized)init();
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
  context.strokeStyle = paint_color;
  context.lineWidth = brush_thickness;

  if(mouse_pressed&&cursor_type=="brush"){
  context.beginPath();
  context.moveTo(last_mouse_x,last_mouse_y);
  context.lineTo(current_mouse_x,current_mouse_y);
  context.stroke();
  }
}

document.addEventListener('mousemove',mouse_move);
document.addEventListener('mousedown',function(e){
    mouse_pressed=true;
    if(cursor_type=="bucket"){
        FloodFill(current_mouse_x,current_mouse_y);
    }
});
document.addEventListener('mouseup',function(e){mouse_pressed=false;});

var updateInterval = 1000.0/60.0;
setInterval(update,updateInterval);
requestAnimationFrame(draw);
