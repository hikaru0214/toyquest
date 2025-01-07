console.log("test");
import * as THREE from 'three';
import * as Game from '/src/cl_game.js';
import * as utils from '/src/gameUtils.js';
import * as Entity from '/src/cl_entity.js';
import { GLTFLoader } from 'three/addons/Addons.js';

const models = {};

const socket = io();

const screen = document.getElementById("screen");

var settings = {
    field_of_view: 90,
    aspectratio: 4/3,
    mouse_sensitivity: 3.4,
    controller_sensitivity: 0.1,
    render_scale: 2.0
};

var world_unit = 10;

const screen_width = screen.clientWidth;
const screen_height = screen.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(settings.field_of_view,settings.aspectratio,0.1,1000);
camera.rotation.order = "YXZ";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(screen_width,screen_height);
renderer.setPixelRatio(1.0/settings.render_scale);
screen.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xFFFFFFFF);
scene.add(light);

const modelloader = new GLTFLoader();

modelloader.load('res/models/greenp.glb',function(gltf){
    gltf.scene.scale.set(10,10,10);
    models['player'] = gltf.scene;
    models['player'].rotation.order = "YXZ";
    scene.add(models['player']);
});

modelloader.load('res/models/tf2nailgun.glb',function(gltf){
    models['nailgun'] = gltf.scene;
    models['nailgun'].scale.set(0.5,0.5,0.5);
    models['nailgun'].rotation.order = "YXZ";
    scene.add(models['nailgun']);
});

modelloader.load('res/models/ps1GrenadeLauncher.glb',function(gltf){
    models['grenadelauncher'] = gltf.scene;
    models['grenadelauncher'].scale.set(1.8,1.8,1.8);
    models['grenadelauncher'].rotation.order = "YXZ";
    scene.add(models['grenadelauncher']);
});

modelloader.load('res/models/animatetest4.glb',function(gltf){
    models['spectator'] = gltf.scene();
    models['spectator'].scale(1,1,1);
    models['grenadelauncher'].rotation.order = "YXZ";
});

var gridsize = 100;
scene.add(new THREE.GridHelper(gridsize,gridsize/world_unit)); //world

const camera_geom = new THREE.BoxGeometry(2,2,16);
const graymat = new THREE.MeshBasicMaterial({color:0xaaaaaa});
const camera_model = new THREE.Mesh(camera_geom,graymat);
scene.add(camera_model);

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
    '../res/pos-x.jpg',
    '../res/neg-x.jpg',
    '../res/pos-y.jpg',
    '../res/neg-y.jpg',
    '../res/pos-z.jpg',
    '../res/neg-z.jpg'
]);
scene.background = texture;

var spectator = new Game.ViewPoint(0,10,10);
var firstperson = new Game.ViewPoint(0,10,-10);

var viewSwitch = "follow";
var viewpoint = spectator;

var spectate = false;

function setModelToViewPoint(m,vp){
    utils.setVector3(m.position,vp.pos);
    utils.setVector3(m.rotation,vp.dir);
}

var weaponmodel = 'nailgun';

function tick(){

    models['grenadelauncher'].rotation.y+=0.01;
    models['grenadelauncher'].position.y=5;

    updateController();

    if(viewSwitch=="follow"){
        models['player'].visible = true;
        var interp_div = 10;
        Game.CameraViewPointInterp(camera,viewpoint,interp_div);
        if(camera.position.distanceTo(viewpoint.pos)<1)viewSwitch="instant";
    }

    if(keys["keyW"])viewpoint.dir.y+=0.01;

    if(keytypes["BracketLeft"]||(gamepad&&buttonToggled("L1"))){
        spectate=!spectate;
        if(spectate){
            viewpoint = firstperson;
        }else{
            viewpoint = spectator;
        }
        viewSwitch="follow";
    }

    if(keys["KeyW"]){
        firstperson.pos.x+=Math.sin(firstperson.dir.y)*-1;
        firstperson.pos.z+=Math.cos(firstperson.dir.y)*-1;
    }
    if(keys["KeyS"]){
        firstperson.pos.x+=Math.sin(firstperson.dir.y)*1;
        firstperson.pos.z+=Math.cos(firstperson.dir.y)*1;
    }
    if(keys["KeyD"]){
        firstperson.pos.x+=Math.sin(firstperson.dir.y+Math.PI/2)*1;
        firstperson.pos.z+=Math.cos(firstperson.dir.y+Math.PI/2)*1;
    }
    if(keys["KeyA"]){
        firstperson.pos.x+=Math.sin(firstperson.dir.y+Math.PI/2)*-1;
        firstperson.pos.z+=Math.cos(firstperson.dir.y+Math.PI/2)*-1;
    }

    if(gamepad){
        if(buttonPressed("cross"))spectator.pos.y--;
        if(buttonPressed("square"))spectator.pos.y++;
        var aimX = gamepad.axes[2];
        var aimY = gamepad.axes[3];
        var stepX = gamepad.axes[0];
        var stepY = gamepad.axes[1];
        var sensi = settings.controller_sensitivity;
        spectator.dir.y-=aimX*sensi;
        spectator.dir.x-=aimY*sensi;
        spectator.pos.x+=Math.sin(spectator.dir.y)*stepY;
        spectator.pos.z+=Math.cos(spectator.dir.y)*stepY;
        spectator.pos.x+=Math.sin(spectator.dir.y+Math.PI/2)*stepX;
        spectator.pos.z+=Math.cos(spectator.dir.y+Math.PI/2)*stepX;
        if(gamepad.buttons[6].pressed){
            camera.fov = 90-gamepad.buttons[6].value*60;
            camera.updateProjectionMatrix();
        }else{
            camera.fov+=(90-camera.fov)*0.5;
            camera.updateProjectionMatrix();
        }
    }
    spectator.ContinueHorizontalAngle();
    spectator.limitVerticalLook();

    setModelToViewPoint(models['player'],firstperson);
    setModelToViewPoint(models[weaponmodel],firstperson);
    models['player'].rotation.x = 0;

    models['nailgun'].position.y-=5;

    models['nailgun'].position.y += Math.sin(firstperson.dir.x)*7;


    models['nailgun'].position.x += Math.sin(firstperson.dir.y)*-8;
    models['nailgun'].position.z += Math.cos(firstperson.dir.y)*-8;

    models['nailgun'].position.x += Math.sin(firstperson.dir.y+Math.PI/2)*3;
    models['nailgun'].position.z += Math.cos(firstperson.dir.y+Math.PI/2)*3;

    models['player'].rotation.y += Math.PI/2;

    utils.setVector3(camera_model.position,spectator.pos);
    utils.setVector3(camera_model.rotation,spectator.dir);
    camera_model.rotation.order = "YXZ";

    inputToggleReset();
}

function render(){
    if(viewSwitch=="instant"){
        utils.setVector3(camera.position,viewpoint.pos);
        utils.setVector3(camera.rotation,viewpoint.dir);
        if(viewpoint===firstperson){
            models['player'].visible = false;
            camera.position.y+=5;
        }
    }
    renderer.render(scene,camera);
}

setInterval(tick,1000.0/60.0);
renderer.setAnimationLoop(render);

screen.onclick = async function(){
    if(!document.pointerLockElement){
        await document.body.requestPointerLock({
            unadjustedMovement:true,
        });
    }
};
document.addEventListener("mousemove",function(e){
    if(document.pointerLockElement){
        firstperson.dir.y -= (e.movementX/1000.0)*settings.mouse_sensitivity;
        firstperson.dir.x -= (e.movementY/1000.0)*settings.mouse_sensitivity;
        firstperson.limitVerticalLook();
        firstperson.ContinueHorizontalAngle();
    }
});