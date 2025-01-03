class FloodFill {
    constructor(data) {
        this.buffer = [];
        this.data = data;
        this.count = 1;
        this._totalStack = 0;
        this._replaceColor = null;
        this.targetColor = null;
        this.setSize();
    }

    get replaceColor() {
        return this._replaceColor;
    }

    set replaceColor(value) {
        this._replaceColor = value;
    }

    setSize() {
        this.height = this.data.length;
        this.width = this.data[0].length;
    }

    async fill(x, y) {
        this.targetColor = this.data[y][x];
        this.push(x, y);

        while (this.buffer.length > 0) {
            const { x, y } = this.buffer.pop();

            // 塗りつぶし色とターゲット色の確認
            if (this.data[y][x] === this.replaceColor || this.data[y][x] !== this.targetColor) {
                continue;
            }

            // 塗りつぶし処理
            this.data[y][x] = this.replaceColor;
            //console.log(this.replaceColor);

            // 隣接するピクセルをスタックに追加
            this.push(x, y - 1);
            this.push(x, y + 1);
            this.push(x - 1, y);
            this.push(x + 1, y);
        }

        return this.data;
    }

    push(x, y) {
        if (this.checkRange(x, y) && this.data[y][x] === this.targetColor) {
            this.buffer.push({ x, y });
        }
    }

    checkRange(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
}

/*

// 初期設定
const maxWidth = 640;
const maxHeight = 480;
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = maxWidth;
canvas.height = maxHeight;

let drawing = false;
let mode = 'draw';
let matrix = Array.from({ length: maxHeight }, () => Array(maxWidth).fill('0,0,0,255')); // 黒色で初期化

// 描画ボタンのイベント
document.getElementById('draw').addEventListener('click', () => {
    mode = 'draw';
});

// 塗りつぶしボタンのイベント
document.getElementById('fill').addEventListener('click', () => {
    mode = 'fill';
});

// 色選択のイベント
document.getElementById('colorPicker').addEventListener('input', (e) => {
    const color = e.target.value;
    floodFill.replaceColor = colorToRGBA(color); // RGBA形式に変換して設定
});


// RGBをRGBAに変換する関数
function colorToRGBA(hex) {
    const bigint = parseInt(hex.slice(1), 16); // 16進数から整数に変換
    const r = (bigint >> 16) & 255; // 赤
    const g = (bigint >> 8) & 255;  // 緑
    const b = bigint & 255;         // 青
    return `${r},${g},${b},255`;     // 完全不透明
}

// 塗りつぶしの処理
canvas.addEventListener('click', (e) => {
    if (mode === 'fill') {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);

        const floodFill = new FloodFill(matrix);
        floodFill.replaceColor = colorToRGBA(document.getElementById('colorPicker').value); // 塗りつぶし色を選択した色に設定
        floodFill.fill(x, y).then(() => {
            updateCanvas();
        });
    }
});

// canvasの更新
function updateCanvas() {
    const imageData = context.createImageData(maxWidth, maxHeight);
    for (let y = 0; y < maxHeight; y++) {
        for (let x = 0; x < maxWidth; x++) {
            const color = matrix[y][x].split(',').map(Number);
            const index = (y * maxWidth + x) * 4;
            imageData.data[index] = color[0];     // R
            imageData.data[index + 1] = color[1]; // G
            imageData.data[index + 2] = color[2]; // B
            imageData.data[index + 3] = color[3]; // A
        }
    }
    context.putImageData(imageData, 0, 0);
}

// 描画処理
canvas.addEventListener('mousedown', (e) => {
    if (mode === 'draw') {
        drawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        context.beginPath();
        context.moveTo(x, y);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing && mode === 'draw') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        context.lineTo(x, y);
        context.strokeStyle = 'rgba(0, 0, 0, 255)';
        context.stroke();
        updateMatrix(); // マトリクスの更新
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});

// マトリクスの更新
function updateMatrix() {
    const data = context.getImageData(0, 0, maxWidth, maxHeight).data;
    for (let i = 0; i < Math.ceil(data.length / 4); i++) {
        const start = i * 4;
        const point = data.slice(start, start + 4);
        matrix[Math.floor(i / maxWidth)][i % maxWidth] = `${point[0]},${point[1]},${point[2]},${point[3]}`;
    }
}

*/