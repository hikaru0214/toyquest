class GameState { //ゲーム状態　(タイトル画面、設定画面、ゲーム画面などの状態)

}

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

        context.font = "24px serif";
        this.width = context.measureText(this.text).width;

        context.fillStyle = "gray";
        context.fillRect(this.x,this.y,this.width,this.height);

        context.fillStyle = "white";
        context.fillText(this.text,this.x,this.y+24);
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