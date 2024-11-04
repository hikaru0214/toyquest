
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

module.exports = ImageLoader;

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function getRandomString(length){ //ランダム文字列
  const characters = "abcdefghijklmnopqrstuvwxy0123456789";
    var x = "";
    for(var i = 0;i < length;i++){
        var uppercase = Math.random()*2;
        var randomindex = Math.random()*characters.length;
        var randomcharacter = characters.substring(randomindex,randomindex+1);
        x+=(uppercase==0) ? randomcharacter : randomcharacter.toUpperCase();
    }
    return x;
}

module.exports = function() { 
  this.sum = function(a,b) { return a+b };
  this.multiply = function(a,b) { return a*b };
  this.getCookie = getCookie;
  this.getRandomString = getRandomString;
}