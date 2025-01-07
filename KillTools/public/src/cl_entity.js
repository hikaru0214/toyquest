import * as THREE from 'three';

export const playermat = new THREE.MeshBasicMaterial({color:0xff00ff});
export const headgeom = new THREE.SphereGeometry(10,10,10);
export const bodygeom = new THREE.BoxGeometry(10,20,10);

class Entity {
    constructor(x,y,z){
        this.pos = new THREE.Vector3(x,y,z);
        this.velocity = new THREE.Vector3(0,0,0);
        this.rotation = new THREE.Vector3(0,0,0);
    }
    update(){
        this.pos.add(this.velocity);
    }
}

export class Mob extends Entity {
    constructor(){
        super(0,0,0);
        this.life = 60*1000;
        this.landed = false;
        this.horizontal_look;
        this.vertial_look;
        this.stepspeed = 1;

        this.head = new THREE.Mesh(headgeom,playermat);
        this.body = new THREE.Mesh(bodygeom,playermat);
        this.model = {head:this.head,body:this.body};
    }
    jump(){
        
    }
    setAim(h,v){
        this.horizontal_look = h;
        this.vertial_look = v;
    }
    move(x){
        var speed = (x<0)?this.stepspeed:-this.stepspeed;
        this.velocity.x+=Math.sin(this.horizontal_look)*speed;
        this.velocity.z+=Math.cos(this.horizontal_look)*speed;
    }
    strafe(x){
    }
    update(){
        //if(this.landed){
            this.velocity.x*=0.9;
            this.velocity.y*=0.9;
        //}
        super.update();
    }
}