import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/Addons.js';

var PITIMES2 = Math.PI*2.0;

export class ViewPoint{
    constructor(x,y,z){
        this.pos = new THREE.Vector3(x,y,z);
        this.dir = new THREE.Vector3(0,0,0);
    }

    limitVerticalLook(){
        if(this.dir.x>Math.PI/2)this.dir.x=Math.PI/2;
        if(this.dir.x<-Math.PI/2)this.dir.x=-Math.PI/2;
    }
    ContinueHorizontalAngle(){
        this.dir.y%=PITIMES2;
    }
}

export function CameraViewPointInterp(camera,v,interp_div){
    camera.position.x += (v.pos.x-camera.position.x)/interp_div;
    camera.position.y += (v.pos.y-camera.position.y)/interp_div;
    camera.position.z += (v.pos.z-camera.position.z)/interp_div;
    camera.rotation.x += (v.dir.x-camera.rotation.x)/interp_div;
    camera.rotation.y += (v.dir.y-camera.rotation.y)/interp_div;
    camera.rotation.z += (v.dir.z-camera.rotation.z)/interp_div;
}