var socket = io.connect('http://52.68.111.88:7000');
let own_id = "";

let client_name = getCookie('username');
let clientGame = null;

var GETParameters = {};

var getval = window.location.search.substring(1).split("&");

for(var v of getval){
    var temp = v.split("=");
    var pname = temp[0];
    var pvalue = temp[1];
    GETParameters[pname] = pvalue;
}

var ol_timer = 0;
var ol_timespan = 0;
var ol_elementId = "";
var ol_timer_onend = function(){};

const canvas_area = document.getElementById("drawing_canvas");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const overlay_canvas = document.getElementById("overlay_canvas");
const overlay_context = overlay_canvas.getContext("2d");
context.imageSmoothingEnabled = false;
context.antiAlias = false;
overlay_context.imageSmoothingEnabled = false;
overlay_context.antiAlias = false;

var current_mouse_x = 0;
var current_mouse_y = 0;
var last_mouse_x = 0;
var last_mouse_y = 0;
var mouse_pressed = false;

var paint_color = "black";
var brush_thickness = 8;
var cursor_type = "brush"; //brush か bucket か spray ブラシ、　バケツ、スプレー

const sfx = {};

sfx["drawstart"] = new Audio("../sfx/drawstart.wav");
sfx["guess"] = new Audio("../sfx/guess.wav");
sfx["drawend"] = new Audio("../sfx/drawend.wav");

for(var i in sfx){
    var sound = sfx[i];
    sound.volume = 0.4;
    sound.load();
}

function playsound(sfxname){
    sfx[sfxname].cloneNode(true).play();
}

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

function hideAllOverlay(){
    var overlays = document.getElementById("overlay").children;
    for(var i = 0;i < overlays.length;i++){
        overlays[i].style.display = "none";
    }
}

function setVisibleElementById(id,visible){
    document.getElementById(id).style.display =  visible?"block":"none";
    console.log(document.getElementById(id));
}

setVisibleElementById("overlay",false);
setVisibleElementById("round",false);
setVisibleElementById("selectword",false);
setVisibleElementById("painternotice",false);
setVisibleElementById("finalscore",true);
console.log("HUH");

function showOverlayByIdWithTimespan(id,timespan,onend){
    ol_timer = Date.now();
    ol_timer_onend = onend;
    ol_timespan = timespan;
    ol_elementId = id;
    setVisibleElementById("overlay",true);
    setVisibleElementById(id,true);
}

function receiveObject(obj,ObjClass){
    const received = JSON.parse(obj);
    const newobj = new ObjClass;
    for(const key in received){
        newobj[key] = received[key];
    }
    return newobj;
}

function showPalette(toggle){

    var palette = document.getElementById("palette");
    palette.style.display = toggle ? "block" : "none";

}

function updateScoreBoard(){ //スコアボード更新
    if(!clientGame)return;
    var scoreboard = document.getElementById("scoreboard");
    var scoreboard_small = document.getElementById("scoreboard_small");

    const players = clientGame.getPlayers;

    var temp = "";

    for(var id in players){
        var player = players[id];
        var scoreboard_color = "white";
        var description = "";
        if(id===own_id)description+="(あなた)";
        if(players[id].guessed)scoreboard_color="#88ff88";
        if(clientGame.state=="drawing"&&clientGame.isDrawing(id)){
            scoreboard_color="#eeeeee";
            //description += "(お絵描き中)";
        }

        temp += '<div class="scoreboard_indiv" style=\"background-color:'+scoreboard_color+'\;">';
        temp += '<br>'+player.name+' '+description;
        if(clientGame.state=="drawing"&&clientGame.isDrawing(id)){
            //temp += '<div style=\"background-image: url(\"../img/brush.png\"); display: block; margin: 0px; padding: 0px; width:64px; height:64; \"></div>';
            temp += '<img src="../img/brush.png" class="icon1">';
        }
        temp += '<br>スコア:'+player.score+'';
        temp += '</div>';
    }

    scoreboard.innerHTML = temp;
    scoreboard_small.innerHTML = temp;
}

socket.on('connection established',(data)=>{
    console.log("connection established with server! this is my id : "+data.id+" your room index is : "+data.room);
    own_id = data.id;
    var name = client_name;
    var rid = getCookie("roomid");
    var hasRoomId = rid!="";
    if(hasRoomId){
        socket.emit('join room',{name:name,roomid:rid});
    }else{
        socket.emit('return player data',{name});
    }
});

socket.on('player join',(name)=>{
    console.log(name+" joined! say hello!");
});

socket.on('game init',(game)=>{
    clientGame = receiveObject(game,Game);
    updateScoreBoard();
});

socket.on('game update',(game)=>{
    clientGame = receiveObject(game,Game);
    updateScoreBoard();
    showPalette(clientGame.isDrawing(own_id));
    switch(clientGame.state){
        case "standby":
            showPalette(true);
            break;
        case "draw":
            break;
        default:
            break;
    }
});

socket.on('update timer',(time)=>{
    if(time<0)time=0;
    document.getElementById("timer").innerHTML = time;
});

function putGap(str){
    var x = "";
    var arr = Array.from(str);
    for(var i = 0;i < str.length;i++){
        x+=" "+arr[i];
    }
    return x;
}

socket.on("get word",(word)=>{
    document.getElementById("word").innerHTML = putGap(word);
});

const points_earned_table = document.getElementById("points_earned");

socket.on("show_client_overlay_timed",function(data){
    hideAllOverlay();
    switch(data.id){
        case "painternotice":
            document.getElementById("painter_name").innerHTML = data.painterName;
            break;
        case "round":
            document.getElementById("round_count").innerHTML = "ラウンド "+(data.roundcount+1)+"/"+(data.totalrounds);
            document.getElementById("round").innerHTML = "ラウンド "+(data.roundcount+1);
            break;
        case "finalscore":
            
            const result_table = document.getElementById("final_result");
            const podium1 = document.getElementById("podium1");
            const podium2 = document.getElementById("podium2");
            const podium3 = document.getElementById("podium3");
            result_table.innerHTML = "";
            podium1.innerHTML = "#1 ";
            podium2.innerHTML = "#2 ";
            podium3.innerHTML = "#3 ";


            var scores = data.result;

            scores = scores.sort(function(a,b){
                return b.score - a.score;
            });

            var index = 0;
            var rank = 1;
            var last_score = 0;
            for(var i of scores){
                
                if(i.score < last_score)rank++;

                if(rank==1)podium1.innerHTML+=(" "+i.name);
                if(rank==2)podium2.innerHTML+=(" "+i.name);
                if(rank==3)podium3.innerHTML+=(" "+i.name);
                var row = result_table.insertRow(index);
                var row_rank = row.insertCell(0);
                var row_name = row.insertCell(1);
                var row_score = row.insertCell(2);
                row_rank.innerHTML = rank;
                row_name.innerHTML = i.name;
                row_score.innerHTML = i.score;
                

                last_score = i.score;
                index++;
            }

            break;
        case "gamescore":
            document.getElementById("wordreveal").innerHTML = data.results.word;
            points_earned_table.innerHTML = "";

            var head = points_earned_table.insertRow(0);
            var head_rank = head.insertCell(0);
            var head_name = head.insertCell(1);
            var head_score = head.insertCell(2);
            head_rank.innerHTML = "順位";
            head_name.innerHTML = "プレイヤー";
            head_score.innerHTML = "スコア";

            var scores = data.results.scores;

            console.log(scores);

            var result = [];

            for(var id in scores){
                var s = scores[id];
                result.push({name:s.name,score:s.score});
            }

            console.log(result);

            result = result.sort(function(a,b){
                return b.score - a.score;
            });

            console.log(result);

            var index = 1;
            var rank = 1;
            var last_score = 0;
            for(var r of result){

                var name = r.name;
                var score = r.score;

                if(score<last_score)rank++;

                var row = points_earned_table.insertRow(index);
                var row_rank = row.insertCell(0);
                var row_name = row.insertCell(1);
                var row_score = row.insertCell(2);
                row_rank.innerHTML = ""+rank;
                row_name.innerHTML = ""+name;
                row_score.innerHTML = ""+score;

                last_score = score;

                index++;
            }
            break;
    }

    showOverlayByIdWithTimespan(data.id,data.time*1000,function(){});
});

socket.on("show_client_overlay",(data)=>{
    setVisibleElementById(data.id,true);
});

socket.on("hide_client_overlay",(data)=>{
    setVisibleElementById(data.id,false);
});

var chatbox = document.getElementById("chatbox");
var chatrows = 0;

function mixStyleColor(c1,c2,ratio){
    var c1r = Number("0x"+c1.substr(1,2));
    var c1g = Number("0x"+c1.substr(3,2));
    var c1b = Number("0x"+c1.substr(5,2));

    var c2r = Number("0x"+c2.substr(1,2));
    var c2g = Number("0x"+c2.substr(3,2));
    var c2b = Number("0x"+c2.substr(5,2));

    var ratio2 = 1-ratio;

    var r = (c1r*ratio)+(c2r*ratio2);
    var g = (c1g*ratio)+(c2g*ratio2);
    var b = (c1b*ratio)+(c2b*ratio2);

    return "rgb("+[r,g,b].join(",")+")";
}

function chat(text,chat_color,background){
    var scrolledup = (chatbox.scrollHeight-chatbox.clientHeight)-chatbox.scrollTop;
    var row_color = (chatrows%2==0)?"#cccccc":"#f5f5f5";
    chatbox.innerHTML += '<p id="chatparagraph" style="color: '+chat_color+'; background-color: '+mixStyleColor(background,row_color,0.2)+';">'+text+'</p>';
    chatrows++;
    if(Math.abs(scrolledup)<24)chatbox.scrollTop = chatbox.scrollHeight;
}


socket.on('chat message',message=>{
    chat(message.name+':'+message.message,"#000000","#FFFFFF");
    console.log(message.message);
    if(message.message=="confetti")addConfetti(100);
});

socket.on('chat message guessed',message=>{
    chat(message.name+':'+message.message,"#000000","#3abe3a");
    console.log(message.message);
    if(message.message=="confetti")addConfetti(100);
});

socket.on('notify in chat',message=>{
    chat(message.message,message.color,message.background);
});

socket.on('confetti',function(){
    addConfetti(100);
});

function getClientData(){
    var cx = current_mouse_x;
    var cy = current_mouse_y;
    var lx = last_mouse_x;
    var ly = last_mouse_y;
    const client = {cx,cy,lx,ly,mouse_pressed,paint_color,brush_thickness,cursor_type};
    return client;
}

context.fillStyle = "white";
context.fillRect(0,0,canvas.width,canvas.height);

function colorToRGBA(hex) {
    const bigint = parseInt(hex.slice(1), 16); // 16進数から整数に変換
    const r = (bigint >> 16) & 255; // 赤
    const g = (bigint >> 8) & 255;  // 緑
    const b = bigint & 255;         // 青
    var color = `${r},${g},${b},255`;
    return color;     // 完全不透明
}

function nonTransparentColor(rgb){
    console.log(rgb);
    return rgb;
}

    var palette_div = document.getElementById("palette");
    var temp = palette_div.innerHTML;
    
    function setColorCallback(color){
        return function(){
            paint_color = color;
            /*
            console.log(colorToRGBA(colorNameToRGB(color)));
            console.log(colorToRGBA(color));
            console.log(colorNameToRGB(color));
            */
            console.log("color set to : "+color);
        }
    }

    palette_div.innerHTML = "パレット<br>";
    var colors = ["red","blue","aqua","yellow","green","burlywood","darkred","darkblue","skyblue",
        "darkkhaki","darkgreen","brown","#ffdbac","pink","magenta","violet","purple","#871F78","white","gainsboro","gray","black"];

    function colorNameToRGB(name){
        var tempcanvas = document.createElement('canvas');
        var c = tempcanvas.getContext('2d');
        c.fillStyle = name;
        c.fillRect(0,0,1,1);
        var temp = c.getImageData(0,0,1,1).data;
        var r = temp[0];
        var g = temp[1];
        var b = temp[2];
        var a = temp[3];
        return `${r},${g},${b},${a}`;
    }

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
        floodFill.replaceColor = colorNameToRGB("black");
        initialized = true;
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
        var path = '../img/bucket_cursor.png';
        canvas.style.cursor = 'url("'+path+'"), default';
    }
    document.getElementById("brush").onclick = function(){
        cursor_type = "brush";
        var path = '../img/brush_cursor.png';
        canvas.style.cursor = 'url("'+path+'"), default';
    }
    document.getElementById("eraser").onclick = function(){
        cursor_type = "eraser";
        var path = '../img/eraser.png';
        canvas.style.cursor = 'url("'+path+'"), default';
    }
    document.getElementById("clear").onclick = function(){
        socket.emit("clear canvas");
    }


    function getRandomColor(){
        var r = parseInt(Math.random()*255);
        var g = parseInt(Math.random()*255);
        var b = parseInt(Math.random()*255);
        return "rgb("+[r,g,b].join(",")+")";
    }

    function magnitude(x,y){
        return Math.sqrt(x*x+y*y);
    }

    function getUnitVector(x1,y1,x2,y2){
        var dx = x1-x2;
        var dy = y1-y2;
        var mag = magnitude(dx,dy);
        return {x:(dx/mag),y:(dy/mag)};
    }

    class confetti {
        constructor(){
            this.x = (overlay_canvas.width/2)+((Math.random()*100)-50);
            this.y = (overlay_canvas.height/3)+((Math.random()*100)-50);
            var vec = getUnitVector(this.x,this.y,overlay_canvas.width/2,overlay_canvas.height/3);
            this.vel = 1+Math.random()*15;
            this.vx = vec.x*this.vel;
            this.vy = vec.y*this.vel;
            this.rotation = Math.random()*(Math.PI*2);
            this.color = getRandomColor();
            this.grav = 0;
            this.life = 60*5;

            this.friction = 0.95+Math.random()*0.05;
            var r = Math.PI/10;
            this.rotate_inc = (Math.random()*r)-r/2;

            this.size = 10+Math.random()*20;
        }

        render(c){
            if(this.isDead())return;

            this.x+=this.vx;
            this.y+=this.vy;
            //this.y+=this.grav;

            this.vy+=0.2;
            this.vx*=this.friction;
            this.vy*=this.friction;

            this.rotate_inc*=0.98;

            this.rotation+=this.rotate_inc;

            this.life--;
            c.save();
            c.translate(this.x,this.y);
            c.rotate(this.rotation);
            c.fillStyle = this.color;
            c.fillRect(-this.size/2,-this.size/2,this.size,this.size);
            c.restore();
        }

        isDead(){
            return this.life<0
        }
    }

    var confettis = [];

    function addConfetti(amount){
        if(amount > 1000)return;
        for(var i = 0;i < amount;i++){
            confettis.push(new confetti());
        }
    }

function update(){
    if(!initialized)init();
    if(ol_timer!=-1){
    if(Date.now()-ol_timer >= ol_timespan&&ol_elementId!=""){
        setVisibleElementById(ol_elementId,false);
        setVisibleElementById("overlay",false);
        ol_timer_onend();
        ol_timer = -1;
    }
    }

    overlay_context.clearRect(0,0,overlay_canvas.width,overlay_canvas.height);

    for(var i = 0;i < confettis.length;i++){
        var c = confettis[i];
        c.render(overlay_context);
        if(c.isDead())confettis.splice(i,1);
    }
}

window.addEventListener('resize',resizeFunc,false);

const gameui = document.getElementById("gameui");

function resizeFunc(){
    overlay_canvas.width = window.innerWidth;
    overlay_canvas.height = window.innerHeight;

    var leftbar = document.getElementById("left-bar");
    var scoreboard = document.getElementById("scoreboard");
    var scoreboard_small = document.getElementById("scoreboard_small");

    if(gameui.clientWidth<900){
        scoreboard_small.style.display = "block";
        scoreboard.style.display = "none";
        leftbar.style.width = "0px";
        canvas_area.style.width = "calc(100% - 295px)";
    }else{
        scoreboard_small.style.display = "none";
        scoreboard.style.display = "block";
        leftbar.style.width = "250px";
        canvas_area.style.width = "calc(100% - 545px)";
    }
}

let matrix = Array.from({ length: canvas.height }, () => Array(canvas.width).fill('0,0,0,255'));
let floodFill = new FloodFill(matrix);

function updateCanvas() {
    const imageData = context.createImageData(canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            var color = matrix[y][x].split(',').map(Number);//???
            var index = (y * canvas.width + x) * 4;
            imageData.data[index] = color[0];     // R
            imageData.data[index + 1] = color[1]; // G
            imageData.data[index + 2] = color[2]; // B
            imageData.data[index + 3] = color[3]; // A
        }
    }
    context.putImageData(imageData, 0, 0);
}

function testfill() {
    const imageData = context.createImageData(canvas.width, canvas.height);
    var color = "darkred";//???
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            var index = (y * canvas.width + x) * 4;
            imageData.data[index] = color[0];     // R
            imageData.data[index + 1] = color[1]; // G
            imageData.data[index + 2] = color[2]; // B
            imageData.data[index + 3] = color[3]; // A
        }
    }
    context.putImageData(imageData, 0, 0);
}

function updateMatrix() {
    var data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 0; i < Math.ceil(data.length / 4); i++) {
        var start = i * 4;
        const point = data.slice(start, start + 4);
        matrix[Math.floor(i / canvas.width)][i % canvas.width] = `${point[0]},${point[1]},${point[2]},${point[3]}`;
    }
}

function mouse_move(e){
    let rect = canvas.getBoundingClientRect();
    last_mouse_x = current_mouse_x;
    last_mouse_y = current_mouse_y;
    current_mouse_x = e.clientX-rect.x;
    current_mouse_y = e.clientY-rect.y;

    var xd = canvas.clientWidth/canvas.width;
    var yd = canvas.clientHeight/canvas.height;

    current_mouse_x/=xd;
    current_mouse_y/=yd;

    //document.getElementById("canvas_cursor").style;

  if(mouse_pressed&&cursor_type=="brush"){
    socket.emit("client draw",getClientData());
  }
}

function mouse_clicked(e){
    let rect = canvas.getBoundingClientRect();
    last_mouse_x = current_mouse_x;
    last_mouse_y = current_mouse_y;
    current_mouse_x = e.clientX-rect.x;
    current_mouse_y = e.clientY-rect.y;

    var xd = canvas.clientWidth/canvas.width;
    var yd = canvas.clientHeight/canvas.height;

    current_mouse_x/=xd;
    current_mouse_y/=yd;

    socket.emit("client draw",getClientData());
}

socket.on("draw relay",function(data){
    console.log("drawing received on client : "+data);
    context.lineCap = "round";
    context.strokeStyle = data.paint_color;
    context.lineWidth = data.brush_thickness;
    context.imageSmoothingEnabled = false;
    context.antiAlias = false;

    var cx = parseInt(data.cx,10);
    var cy = parseInt(data.cy,10);

    var lx = parseInt(data.lx,10);
    var ly = parseInt(data.ly,10);

    if(data.cursor_type=="bucket"){
        floodFill.replaceColor = colorNameToRGB(data.paint_color);
        updateMatrix();
        //floodFill = new FloodFill(matrix);
        floodFill.fill(cx,cy).then(()=>{updateCanvas();});
    }

    if(data.cursor_type=="brush"){
    context.beginPath();
    context.moveTo(lx,ly);
    context.lineTo(cx,cy);
    context.stroke();
    //updateMatrix();
    }

    if(data.cursor_type=="eraser"){
        context.strokeStyle = "white";
        context.beginPath();
        context.moveTo(lx,ly);
        context.lineTo(cx,cy);
        context.stroke();
        //updateMatrix();
    }

});

socket.on("clear canvas",function(){
    clear();
});

socket.on("play sound",playsound);

canvas.addEventListener('mousemove',mouse_move);
canvas.addEventListener('mousedown',function(e){mouse_pressed=true;});
canvas.addEventListener('mouseup',function(e){mouse_pressed=false;});
canvas.addEventListener('click',mouse_clicked);

const chat_input = document.getElementById('textchat');

chat_input.addEventListener('keydown',function(e){
    if(!e.isComposing&&e.key==="Enter"&&this.value!=""){
        e.preventDefault();
        socket.emit("textchat",this.value);
        this.value = "";
    }
});

var updateInterval = 1000.0/60.0;
setInterval(update,updateInterval);
