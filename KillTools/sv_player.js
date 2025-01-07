import * as THREE from 'three';

class Player {
    constructor(){
        this.pos = THREE.Vector3(0,0,0);
        this.dir = THREE.Vector3(0,0,0);
    }

    setdir(vertical,horizontal){

    }
    
    move(forward,backward,left,right){
        if(forward){
            this.pos.x+=Math.sin(this.dir.y)*-1;
            this.pos.z+=Math.cos(this.dir.y)*-1;
        }
        if(backward){
            this.pos.x+=Math.sin(this.dir.y)*1;
            this.pos.z+=Math.cos(this.dir.y)*1;
        }
        if(right){
            this.pos.x+=Math.sin(this.dir.y+Math.PI/2)*1;
            this.pos.z+=Math.cos(this.dir.y+Math.PI/2)*1;
        }
        if(left){
            this.pos.x+=Math.sin(this.dir.y+Math.PI/2)*-1;
            this.pos.z+=Math.cos(this.dir.y+Math.PI/2)*-1;
        }
    }
}