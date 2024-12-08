var socket = io.connect('http://52.68.111.88:7000');
let own_id = "";

let client_name = getCookie('username');
let clientGame = null;

var ol_timer = 0;
var ol_timespan = 0;
var ol_elementId = "";
var ol_timer_onend = function(){};

const canvas_area = document.getElementById("drawing_canvas");
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

    const players = clientGame.getPlayers;

    var temp = "";

    for(var id in players){
        var player = players[id];
        var scoreboard_color = "white";
        var description = "";
        if(id===own_id)description+="(あなた)";
        if(clientGame.isDrawing(id)){
            scoreboard_color="#88ff88";
            description += "(お絵描き中)";
        }

        temp += '<div style=\"background-color:'+scoreboard_color+'\;">';
        temp += '<br>'+player.name+' '+description;
        temp += '<br>スコア:'+player.score+'';
        temp += '</div>';
    }

    scoreboard.innerHTML = temp;
}

socket.on('connection established',(data)=>{
    console.log("connection established with server! this is my id : "+data.id+" your room index is : "+data.room);
    own_id = data.id;
    var name = client_name;
    socket.emit('return player data',{name});
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
    updateScoreBoard();
});

socket.on("get word",(word)=>{
    document.getElementById("word").innerHTML = word;
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
            for(var data of scores){
                if(data.score < last_score)rank++;
                if(rank==1)podium1.innerHTML+=(" "+data.name);
                if(rank==2)podium2.innerHTML+=(" "+data.name);
                if(rank==3)podium3.innerHTML+=(" "+data.name);
                var row = result_table.insertRow(index);
                var row_rank = row.insertCell(0);
                var row_name = row.insertCell(1);
                var row_score = row.insertCell(2);
                row_rank.innerHTML = rank;
                row_name.innerHTML = data.name;
                row_score.innerHTML = data.score;

                last_score = data.score;
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


socket.on('message to everyone in room',message=>{
    
    var scrolledup = (chatbox.scrollHeight-chatbox.clientHeight)-chatbox.scrollTop;

    var row_color = (chatrows%2==0)?"#cccccc":"white";
    chatbox.innerHTML += '<p id="chatparagraph" style="background-color: '+row_color+';">'+message+'</p>';
    chatrows++;

    if(Math.abs(scrolledup)<24)chatbox.scrollTop = chatbox.scrollHeight;
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
            socket.emit("clear canvas");
        }
        initialized = true;
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
}

let start;
let lasttime = 0;

function draw(time){
    if(!start)start=time;
    const elapsed = time-start;

    requestAnimationFrame(draw);
}

function mouse_move(e){
    let rect = canvas_area.getBoundingClientRect();
    last_mouse_x = current_mouse_x;
    last_mouse_y = current_mouse_y;
    current_mouse_x = e.clientX-rect.x;
    current_mouse_y = e.clientY-rect.y;

    var xd = canvas_area.clientWidth/640;
    var yd = canvas_area.clientHeight/480;

    current_mouse_x/=xd;
    current_mouse_y/=yd;

  if(mouse_pressed&&cursor_type=="brush"){
    socket.emit("client draw",getClientData());
  }
}

socket.on("draw relay",function(data){
    console.log("drawing received on client : "+data);
    context.lineCap = "round";
    context.strokeStyle = data.paint_color;
    context.lineWidth = data.brush_thickness;

    context.beginPath();
    context.moveTo(data.lx,data.ly);
    context.lineTo(data.cx,data.cy);
    context.stroke();

});

socket.on("clear canvas",function(){
    clear();
});

document.addEventListener('mousemove',mouse_move);
document.addEventListener('mousedown',function(e){
    mouse_pressed=true;
    if(cursor_type=="bucket"){
    }
});

document.addEventListener('mouseup',function(e){mouse_pressed=false;});

const chat_input = document.getElementById('textchat');

chat_input.addEventListener('keydown',function(e){
    if(!e.isComposing&&e.key==="Enter"&&this.value!=""){
        e.preventDefault();
        socket.emit("textchat",this.value);
        this.value = "";
    }
});

var updateInterval = 1000.0/30.0;
setInterval(update,updateInterval);
requestAnimationFrame(draw);
