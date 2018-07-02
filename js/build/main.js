/**
 * @author zhouhui
 * @since 2018.06.09
 * @description 主要运行的方法
 * */
'user strict'

window.onload = function(){
    let scene = null;
    let camera = null;
    let renderer = null;
    let isUseShadow = true;
    // 获取高度和宽度
    let sceneWidth = document.documentElement.clientWidth;
    let sceneHeight = document.documentElement.clientHeight;

    //设置场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1dcac);
    // scene.fog = new THREE.Fog(0xf2db6e,20,40);

    //设置摄像机
    camera = new THREE.PerspectiveCamera( 75, sceneWidth/sceneHeight, 1, 300 );
    camera.position.set(0,30,40);

    //设置渲染方式
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true } );
    renderer.setSize( sceneWidth, sceneHeight );
    if(isUseShadow){
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    document.getElementById("container").appendChild(renderer.domElement);

    //帧数显示
    let stats = new Stats();
    document.getElementById("container").appendChild(stats.dom);

    //添加光照
    var light = new sceneLight(scene,camera);
    light.build();

    //视角控制器
    var controls = new cameraControls(camera,renderer.domElement);
    controls.build();

    // var floorGeometry = new THREE.PlaneGeometry(100,100,50,50);
    // var material = new THREE.MeshLambertMaterial({
    //     color : 0x628cb7,
    //     side : THREE.DoubleSide,
    //     wireframe : false
    // });
    // var floor = new THREE.Mesh(floorGeometry,material);
    // floor.rotation.x = Math.PI / 2;
    // floor.position.set(0,-0.1,0);
    // floor.receiveShadow = true;
    // scene.add(floor);

    var myGround = new ground();
    myGround.body.position.set(0,-40,30);
    myGround.build(scene);


    var myPlane = new plane();
    myPlane.body.position.set(0,30,30);
    myPlane.build(scene);

    // var p = new pine();
    // p.body.position.set(10,20,0);
    // p.body.rotation.z = -Math.PI / 4;
    // p.build(scene);


    //添加辅助工具
    let tool = new helpersTools();
    // tool.gridHelperBuild(scene);
    tool.axesHelperBuild(scene);

    //tool.directionalLightHelperBuild(scene,light.directionalLight);
    tool.cameraHelperBuild(scene,light.directionalLight.shadow.camera);


    let animate = function(){
        window.requestAnimationFrame(animate);

        controls.build();

        myPlane.fly();
        myPlane.flyer.hairAnimate();
        myGround.move();

        stats.update();

        renderer.render(scene,camera);
    };
    animate();
};
(function(obj){
    // 辅助工具
    let helpersTools = function(){
        this.gridHelper = null;
        this.axesHelper = null;
        this.cameraHelper = null;
        this.directionalLightHelper = null;

        this.SIZE = 100;
        this.init();
    };
    helpersTools.prototype = {
        init : function(){
            //初始化工具
            //网格
            this.gridHelper = new THREE.GridHelper( this.SIZE, 20, 0x444444, 0x333333);
            this.axesHelper = new THREE.AxesHelper( this.SIZE );
        },
        gridHelperBuild : function(scene){
            scene.add(this.gridHelper);
        },
        axesHelperBuild : function(scene){
            scene.add(this.axesHelper);
        },
        cameraHelperBuild : function(scene,camera){
            this.cameraHelper = new THREE.CameraHelper(camera);
            scene.add(this.cameraHelper);
        },
        directionalLightHelperBuild : function(scene,light){
            this.directionalLightHelper = new THREE.DirectionalLightHelper( light, 5 , 0x000000 );
            scene.add(this.directionalLightHelper);
        }
    };
    obj.helpersTools = helpersTools;

    //视角控制
    let cameraControls = function(camera,dom){
        this.camera = camera;
        this.doc = dom;
        this.controls = null;
        this.init();
    };
    cameraControls.prototype = {
        init : function(){
            //初始化
            this.controls = new THREE.OrbitControls(this.camera,this.dom);

            //受到的阻力
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.25;

            this.controls.screenSpacePanning = false;

            //距离原点最大或者最小距离
            this.controls.minDistance = 1;
            this.controls.maxDistance = 200;

            this.controls.maxPolarAngle = Math.PI;

            this.controls.keys = {
                LEFT: 65, //left a
                UP: 87, // up w
                RIGHT: 68, // right d
                BOTTOM: 83 // down s
            }
        },
        build : function(){
            return this.controls.update();
        }
    };
    obj.cameraControls = cameraControls;

    let sceneLight = function(scene,camera){
        this.scene = scene;
        this.camera = camera;
        this.hemisphereLight = null;
        this.directionalLight = null;
        this.init();
    };
    sceneLight.prototype = {
        init : function(){
            this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0xffffff, 0.9);

            this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
            this.directionalLight.position.set(15, 30, 0 );
            this.directionalLight.target.position.set( 0, 0, 0 );
            this.directionalLight.castShadow = true;

            this.directionalLight.shadow.camera.left = -60;
            this.directionalLight.shadow.camera.bottom = -60;
            this.directionalLight.shadow.camera.right = 60;
            this.directionalLight.shadow.camera.top = 60;
            this.directionalLight.shadow.camera.near = 0.1;
            this.directionalLight.shadow.camera.far = 60;
            this.directionalLight.shadow.mapSize.width = 2048;  // default
            this.directionalLight.shadow.mapSize.height = 2048; // default

        },
        build : function(){
            this.scene.add(this.hemisphereLight);
            this.scene.add(this.directionalLight);
        }
    };
    obj.sceneLight = sceneLight;
})(window);


