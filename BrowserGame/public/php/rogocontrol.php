
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Three.js ドットエフェクトの実装</title>
    <link rel="stylesheet" href="../css/index.css">
    <script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js",
            "three/examples/jsm/loaders/GLTFLoader.js": "https://cdn.jsdelivr.net/npm/three@0.167.0/examples/jsm/loaders/GLTFLoader.js",
            "three/examples/jsm/postprocessing/EffectComposer.js": "https://cdn.jsdelivr.net/npm/three@0.167.0/examples/jsm/postprocessing/EffectComposer.js",
            "three/examples/jsm/postprocessing/RenderPass.js": "https://cdn.jsdelivr.net/npm/three@0.167.0/examples/jsm/postprocessing/RenderPass.js",
            "three/examples/jsm/postprocessing/ShaderPass.js": "https://cdn.jsdelivr.net/npm/three@0.167.0/examples/jsm/postprocessing/ShaderPass.js"
        }
    }
    </script>
    <script type="module">
    import * as THREE from "three";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
    import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
    import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

    // シーン、カメラ、レンダラーの設定
    const width = window.innerWidth;
    const height = window.innerHeight;
    

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#00ffff");//ワールドの背景色を変更

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#myCanvas"),
        antialias: true
    });
    renderer.setSize(width, height);

    

    
    // カメラの位置設定
    camera.position.set(0, 1, 3);
    

    // ライトの追加
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff,5);
    directionalLight.position.set(0, 2, 2);
    scene.add(directionalLight);



    let rogofadeout=false;
    // GLTFモデルの読み込み。GLTFLoaderのインポートが必要
    
    let gltf; // GLTFオブジェクトを格納する変数
    let mixer; // アニメーションミキサー
    var model = null;
    const loader = new GLTFLoader();
    loader.load(
        "../models/rogo.glb",
        function (loadedGltf) {
            gltf = loadedGltf;
            model = gltf.scene;
            model.scale.set(1,1,1);
            model.position.set(0, 1, 0);
            model.rotation.set(0, 0, 0);
            model.traverse(function (node) {
                
            });
            scene.add(model);
            camera.lookAt(model.position);//カメラがモデルに注目するようにする

            console.log(gltf.animations.map(clip => clip.name));
            mixer = new THREE.AnimationMixer(model); // アニメーションミキサーをここで作成
            
            const clip1=gltf.animations.find(clip=>clip.name==='rogoA');
            controlaction=mixer.clipAction(clip1);
            controlaction.play();

            const clip2=gltf.animations.find(clip=>clip.name==='rogoB');
            mixer.clipAction(clip2).play();

            animatecontrol();
            
        },
        undefined,
        function (error) {
            console.error('Error loading the GLTF model:', error);
        }
    );

    
    let controlaction;
    let animatecontrolflag=false;

    const targetFrameTime = 4.7; // 秒

    // アニメーションの更新
    function animatecontrol() {
        requestAnimationFrame(animatecontrol);

        const delta = clock.getDelta();
        mixer.update(delta);

        // アニメーションが特定のフレーム時間に近いかをチェック
        if (!animatecontrolflag&&Math.abs(controlaction.time - targetFrameTime) < 0.1) { // 0.1秒の範囲でチェック
            console.log("特定のフレームに到達しました");
        stopAnimation('rogoA');
        stopAnimation('rogoB');
        rogofadeout=true;
        animatecontrolflag=true;
        }

        
    }

    
    

    //アニメーションの名前を指定して停止する関数
    function stopAnimation(name) {
    const clip = gltf.animations.find(clip => clip.name === name);
    if (clip) {
        const action = mixer.clipAction(clip);
        //action.stop();  // 特定のアニメーションを停止
        //mixer.update(5);
        action.paused=true;
    } else {
        console.error(`アニメーション "${name}" が見つかりません`);
    }
}



    // カスタムドットシェーダーの定義
    const DotShader = {
      uniforms: {
        "tDiffuse": { value: null },
        "resolution": { value: new THREE.Vector2(width, height) },
        "pixelSize": { value: 50 }//初期値。Composerですぐに変更されるのでここでのvalueの値の初期化
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float pixelSize;
        varying vec2 vUv;

        void main() {
          vec2 dxy = pixelSize / resolution;
          vec2 coord = dxy * floor(vUv / dxy);
          gl_FragColor = texture2D(tDiffuse, coord);
        }
      `
    };

    // Composerの設定
    const renderPass = new RenderPass(scene, camera);
    const dotPass = new ShaderPass(DotShader);
    dotPass.uniforms["resolution"].value = new THREE.Vector2(width, height);
    dotPass.uniforms["pixelSize"].value = 3;//ピクセルサイズ変更

    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(dotPass);


    // キーの押下状態を管理するフラグ
    let isMovingLeft = false;
    

    // キーが押された際にフラグを更新。Arrowは矢印(移動)
    window.addEventListener("keydown", (event) => {
        
        if (event.code === "Space") {
            rogofadeout=true;
            event.preventDefault();//キーのデフォルトの操作を無効化。ここではスペースキー押下時の下スクロールを制限
        }
        

        
    });



    let posix=0;
    let posiz=0;
    let rogofadeout2=false;
    // カメラを移動させる関数
    function moveCamera() {
        if (rogofadeout) {
            camera.position.z -= 0.1;
            if(camera.position.z<=-1){
                rogofadeout=false;
                //rogofadeout2=true;
                window.location.replace('top.php');
            }
        }
        if(rogofadeout2){
            camera.position.y-=0.1;
                if(camera.position.y<=-2){
                    //rogofadeout2=false;
                    window.location.replace('top.php');
                }
        }
        //if(model)camera.lookAt(model.position);
    }







    const clock = new THREE.Clock();
    // アニメーションループ
    function animate() {
        requestAnimationFrame(animate);

        // キーが押されている場合にカメラを動かす
        moveCamera();
        

        const delta = clock.getDelta(); // delta の取得
        if (mixer) {
        mixer.update(delta); // アニメーションの更新
        }

        // Composerを使用してレンダリング
        composer.render();
    }

    animate();

    // リサイズ処理の追加
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        composer.setSize(width, height);
        dotPass.uniforms["resolution"].value.set(width, height);
    });

    
    
    </script>

</head>
<body>
    <div class="container">
    <canvas id="myCanvas"></canvas>
    </div>
</body>
</html>
