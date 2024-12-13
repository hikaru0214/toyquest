<?php session_start();?>
<?php require '../dbConnect/dbconnect.php';?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>ホーム</title>
    <link rel="stylesheet" href="../css/index.css">
    <link rel="manifest" href="../json/ToyQuest.json">
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
        antialias: true
    });
    renderer.setSize(width, height);
    
    document.body.appendChild( renderer.domElement );

    
    // カメラの位置設定
    camera.position.set(4, 6, 0);
    

    // ライトの追加
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff,5);
    directionalLight.position.set(15, 10, 0);
    scene.add(directionalLight);




    // GLTFモデルの読み込み。GLTFLoaderのインポートが必要
    let gltf; // GLTFオブジェクトを格納する変数
    let mixer; // アニメーションミキサー
    var model = null;
    const loader = new GLTFLoader();
    loader.load(
        "../models/ハウス2.glb",
        function (loadedGltf) {
            gltf = loadedGltf;
            model = gltf.scene;
            model.scale.set(0.02,0.02,0.02);
            model.position.set(0, 1, 0);
            model.rotation.set(0, 0, 0);
            model.traverse(function (node) {
                
            });
            scene.add(model);
            camera.lookAt(model.position);//カメラがモデルに注目するようにする

            console.log(gltf.animations.map(clip => clip.name));
            mixer = new THREE.AnimationMixer(model); // アニメーションミキサーをここで作成
            //playAnimation(''); // アニメーションを再生
        },
        undefined,
        function (error) {
            console.error('Error loading the GLTF model:', error);
        }
    );


    // アニメーションの名前を指定して再生する関数
    function playAnimation(name) {
        const clip = gltf.animations.find(clip => clip.name === name);
        if (clip) {
            
            mixer.clipAction(clip).play();  // 指定されたアニメーションを再生
        } else {
            console.error(`アニメーション "${name}" が見つかりません`);
        }
    }
    //アニメーションの名前を指定して停止する関数
    function stopAnimation(name) {
    const clip = gltf.animations.find(clip => clip.name === name);
    if (clip) {
        const action = mixer.clipAction(clip);
        action.stop();  // 特定のアニメーションを停止
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
    let isMovingRight = false;
    let isMovingUp = false;
    let isMovingDown = false;
    

    // キーが押された際にフラグを更新。Arrowは矢印(移動)
    window.addEventListener("keydown", (event) => {
        //stopAnimation('feet.normal');//アニメーション停止
        //playAnimation('Walk'); // アニメーションを再生
        if (event.code === "Space") {
            event.preventDefault();//キーのデフォルトの操作を無効化。ここではスペースキー押下時の下スクロールを制限
        }
        if (event.code === "ArrowLeft") {
            isMovingLeft = true;
            event.preventDefault();
        }
        if (event.code === "ArrowRight") {
            isMovingRight = true;
            event.preventDefault();
        }
        if (event.code === "ArrowUp") {
            isMovingUp = true;
            event.preventDefault();
        }
        if (event.code === "ArrowDown") {
            isMovingDown = true;
            event.preventDefault();
        }
        
    });



    // キーが離された際にフラグをリセット
    window.addEventListener("keyup", (event) => {
        //stopAnimation('Walk');
        //playAnimation('feet.normal'); // アニメーションを再生
        if (event.code === "ArrowLeft") {
            isMovingLeft = false;
            event.preventDefault();
        }
        if (event.code === "ArrowRight") {
            isMovingRight = false;
            event.preventDefault();
        }
        if (event.code === "ArrowUp") {
            isMovingUp = false;
            event.preventDefault();
        }
        if (event.code === "ArrowDown") {
            isMovingDown = false;
            event.preventDefault();
        }
        
    });

    function acitionmix(){
        if(isKey_u){
            stopAnimation('feetrightarm.normal');
            playAnimation('rightarm.greet');
        }
        if(isKey_i){
            stopAnimation('feet.normal');
            playAnimation('feet.walk');
        }
    }


    let posix=0;
    let posiz=0;
    let pageload=true;
    // カメラを移動させる関数
    function moveCamera() {
        if(pageload&&camera.position.y>=3){//ロード時にカメラをy:3まで下げる
        camera.position.y -= 0.1;
        if(model){
        model.rotation.y -= 0.01;
        }
        }
        if (isMovingLeft) {
            //camera.position.x -= 0.1;
            //character.position.x -= 0.1;
            model.position.x -= 0.1;
            posix-=0.1;
        }

        if (isMovingRight) {
            //camera.position.x += 0.1;
            //character.position.x += 0.1;
            model.position.x += 0.1;
            posix+=0.1;
        }
        if (isMovingUp) {
            //camera.position.z += 0.1;
            model.position.z+= 0.1;
            //character.position.z += 0.1;
            posiz+=0.1 
        }
        if (isMovingDown) {
            //camera.position.z -= 0.1;
            model.position.z-= 0.1;
            //character.position.z -= 0.1;
            posiz-=0.1
        }
    if(model)camera.lookAt(model.position);
    }

    function rotate(){
        if(model){
        model.rotation.y += 0.01;
        }
    }


    const clock = new THREE.Clock();
    // アニメーションループ
    function animate() {
        rotate();
        requestAnimationFrame(animate);
        // キーが押されている場合にカメラを動かす
        moveCamera();
        const delta = clock.getDelta(); // delta の取得
        if (mixer) {
        mixer.update(delta); // アニメーションの更新
        }
        // Composerを使用してレンダリング
        composer.render();
        defaultZoom();

        checkOrientation();//画面が縦向きなら横向きにするように警告
    }

    animate();


    document.body.style.overflow = 'hidden';//ページのスクロール無効
    function defaultZoom() {
    document.body.style.zoom = "100%";
    }
    defaultZoom();//画面拡縮無効
    
    function checkOrientation() {//画面が横なら警告
    const isLandscape = window.innerWidth > window.innerHeight;
    if (!isLandscape) {
        const caveat = document.getElementById("caveat");
        caveat.classList.remove("hidden");  
    }
    if (isLandscape) {
        const caveat = document.getElementById("caveat");
        caveat.classList.add("hidden");
    }
    }
    window.addEventListener("orientationchange", () => {//画面の幅に合わせる
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    composer.setSize(width, height);
    dotPass.uniforms["resolution"].value.set(width, height);
    });


    screen.orientation.lock("landscape")
    .then(function() {
        console.log("画面を横向きにロックしました。");
    })
    .catch(function(error) {
        console.log("画面のロックに失敗しました。: " + error.message);
    });//httpsのみ動作可能

    </script>

</head>
<body>
    <div class="container">
    <!--<h3 class="player"><?php echo $_SESSION['user']['user_name'];?></h3>-->
    <div class="player">
    <h3>プレイヤー名 <input type="image" src="../img/pencil_icon.png" class="pencil" onclick=""></h3>
    
    </div>

    <input type="button" class="button" onclick="location.href='../html/chariso.html'" value="チャリ走"></button>
    <input type="button" class="button2" onclick="location.href='../html/brush_dengon.html'" value="ブラシ伝言"></button>
    <input type="button" class="button3" onclick="location.href='../html/wanted_top.html'" value="あいつを探せ"></button>

    

    <input type="image" src="../img/notice_icon.png" class="notice" onclick="location.href=''" value="お知らせ"></button>
    <input type="image" src="../img/friend_icon.png" class="friend" onclick="location.href=''" value="フレンド"></button>
    <input type="image" src="../img/Logout_icon.png" class="Logout" onclick="location.href='logout.php'" value="ログアウト"></button>

    <div class="table">
        <a href="score.php" class="table_title">ランキング</a>
    <table>
        <tr>
        <td>Rank</td><td>name</td><td>score</td>
        </tr>
        <?php
        $sql=$pdo->prepare('SELECT Score.user_id, SUM(Score.score) AS total_score, User.user_name 
            FROM Score JOIN User ON Score.user_id = User.user_id 
            GROUP BY Score.user_id ORDER BY total_score DESC');
        $sql->execute();

        $Rank=0;
        $userRank_in=false;

        foreach($sql as $row) {
        $Rank+=1;
        if($Rank<=10){
        echo "<tr><td>".$Rank;
        echo "</td><td>".$row['user_name'];
        echo "</td><td>".$row['total_score'];
        echo "</td></tr>";
        }
        
        if($row['user_id']==4){
            if($Rank<=10){
            $userRank_in=true;
            }
            $username=$row['user_name'];
            $userRank=$Rank;
            $user_score=$row['total_score'];
            }
        }

        if($Rank<=10){
            for($Rank;$Rank<10;$Rank++){
                echo "<tr><td>---</td><td>---</td><td>---</td></tr>";
            }
        }
        echo "<tr><td></td><td></td><td></td></tr>";

        if($userRank_in==true){
            echo "<tr><td>".$userRank;
            echo "</td><td>あなた(".$username.")</td><td>".$user_score;
            echo "</td></tr>";
        }else{
            echo "<tr><td>圏外";
            echo "</td><td>あなた(".$username.")</td><td>".$user_score;
            echo "</td></tr>";
        }
        ?>
    </table>

    <div class="hidden" id="caveat">
    <img src="../img/backcaveat.png" class="backcaveatimg">
    <img src="../img/caveat.png" class="caveatimg">
    </div>

</div>
</div>

</body>
</html>