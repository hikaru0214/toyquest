const keys = {};
const keytypes = {};

var gamepad = null;

const button_map = {
    home:16,
    start:9,
    select:8,
    cross:0,
    circle:1,
    square:2,
    triangle:3,
    up:12,
    down:13,
    left:14,
    right:15,
    L1:4,
    R1:5,
    L2:6,
    R2:7,
    leftstick:10,
    rightstick:11
}

const button_pressed = [];
const button_toggled = [];

function updateController(){
    gamepad = navigator.getGamepads()[0];
    if(!gamepad)return;
    for(var i = 0;i < gamepad.buttons.length;i++){
        var pressed = gamepad.buttons[i].pressed;
        if(pressed&&!button_pressed[i])button_toggled[i]=true;
    }
}

function buttonPressed(name){
    return gamepad.buttons[button_map[name]].pressed;
}
function buttonToggled(name){
    return button_toggled[button_map[name]];
}

document.addEventListener('keydown',function(e){
    if(!keys[e.code])keytypes[e.code]=true;
    keys[e.code]=true;
});
document.addEventListener('keyup',function(e){keys[e.code]=false;});

function inputToggleReset(){
    for(var code in keytypes){
        keytypes[code] = false;
    }
    if(!gamepad)return;
    for(var i = 0;i < gamepad.buttons.length;i++){button_pressed[i]=gamepad.buttons[i].pressed};
    for(var i = 0;i < button_toggled.length;i++){button_toggled[i]=false};
}

window.addEventListener("gamepadconnected", (e) => {
    console.log(
      "Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length,
    );
    for(var i = 0;i < e.gamepad.buttons.length;i++){button_toggled[i]=false};
    console.log(navigator.getGamepads()[0]);
});