
class ImageLoader { //超テキトーに書いた画像読み込みを簡単にするクラス、適切でないかも
    constructor(filename){
        this.img = new Image();
        this.filename = filename;
        this.image = null;
        const self = this;
        this.img.onload = function(){self.image = this;};
        this.img.src = this.filename;
    }
    getImage(){
        return this.image;
    }
}

class ui_button { //Canvasボタンクラス
    constructor(name,x,y,alignment,job){
        this.x = x;
        this.y = y;
        this.width = name.length*16; //0の場合テキストによって自動で横幅が決まるようにする
        this.height = 32;

        this.text = name;

        this.alignment = alignment; //center, left, right, top-left
        this.hover = false;
        this.stroke = 0;
        this.job = job;
    }

    setJob(j){
        this.job = j;
    }

    show(context){
        if(this.stroke<0)this.stroke++;

        var position_x = this.x;
        var position_y = this.y;

        context.font = "24px serif";
        this.width = context.measureText(this.text).width;

        if(this.alignment=="center")position_x-=this.width/2;
        if(this.alignment=="right")position_x-=this.width;

        context.fillStyle = "gray";
        context.fillRect(position_x,position_y,this.width,this.height);

        context.fillStyle = "white";
        context.fillText(this.text,position_x,position_y+24);
    }

    interact(x,y,pressed){
        var xin = x > this.x && x < this.x+this.width;
        var yin = y > this.y && y < this.y+this.height;
        if(xin&&yin){
            this.hover = true;
            if(pressed){
                this.stroke=-30;
                this.job();
            }
        }
    }
}