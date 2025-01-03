import * as THREE from 'three';

var fov = 90;
var gamewidth = window.innerWidth;
var gameheight = window.innerHeight;
var aspectratio = 4/3;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( fov, aspectratio, 0.1, 1000 );

camera.rotation.order = "YXZ";

const renderer = new THREE.WebGLRenderer();
renderer.setSize( gamewidth, gameheight );
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', () => {

    gamewidth = window.innerWidth;
    gameheight = window.innerHeight;
    camera.fov = fov;
    camera.aspect = aspectratio;

    renderer.setSize(gamewidth, gameheight);
    camera.updateProjectionMatrix();
    camera.fov = fov;
    camera.aspect = aspectratio;
});

const geometry = new THREE.BoxGeometry( 3, 3, 3 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.y=5;
scene.add( cube );

scene.add(new THREE.GridHelper(100,50));

const keys = {};

document.addEventListener("keydown",(e)=>{
    keys[e.code]=true;
});
document.addEventListener("keyup",(e)=>{
    keys[e.code]=false;
});

    var player_pos = new THREE.Vector3(0,5,5);
    var player_vel = new THREE.Vector3(0,0,0);
    var forward_vel = 0.3;
    var player_horizontal_look = 0;
    var player_vertical_look = 0;
    var pause = false;
    var look_velocity = 0.05;
    
    document.addEventListener("mousemove",function(e){
        var reduce = 600.0;
        if(document.pointerLockElement){
        player_horizontal_look-=e.movementX/reduce;
        player_vertical_look-=e.movementY/reduce;
        }
    });

    document.addEventListener("click",async()=>{
        console.log("test");
        if(!document.pointerLockElement){
            await document.body.requestPointerLock({
                unadjustedMovement:true,
            });
        }
    });

    function update(){
        if(keys["KeyW"]){
            player_pos.x+=Math.sin(player_horizontal_look)*-forward_vel;
            player_pos.z+=Math.cos(player_horizontal_look)*-forward_vel;
        }
        if(keys["KeyS"]){
            player_pos.x+=Math.sin(player_horizontal_look)*forward_vel;
            player_pos.z+=Math.cos(player_horizontal_look)*forward_vel;
        }
        if(keys["KeyA"]){
            player_pos.x+=Math.sin(player_horizontal_look+Math.PI/2)*-forward_vel;
            player_pos.z+=Math.cos(player_horizontal_look+Math.PI/2)*-forward_vel;
        }
        if(keys["KeyD"]){
            player_pos.x+=Math.sin(player_horizontal_look+Math.PI/2)*forward_vel;
            player_pos.z+=Math.cos(player_horizontal_look+Math.PI/2)*forward_vel;
        }

        if(keys["ArrowLeft"])player_horizontal_look += look_velocity;
        if(keys["ArrowRight"])player_horizontal_look -= look_velocity;
        if(keys["ArrowUp"])player_vertical_look += look_velocity;
        if(keys["ArrowDown"])player_vertical_look -= look_velocity;

        //player_vel.addScalar(0.9);
        //player_pos.add(player_vel);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

    }

    setInterval(update,1000/60);

    function animate() {
        camera.position.x = player_pos.x;
        camera.position.y = player_pos.y;
        camera.position.z = player_pos.z;

        camera.rotation.set(player_vertical_look,player_horizontal_look,0);
	    renderer.render( scene, camera );
    }
renderer.setAnimationLoop( animate );