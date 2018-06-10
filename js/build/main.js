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
    scene.background = new THREE.Color(0xffffff);

    //设置摄像机
    camera = new THREE.PerspectiveCamera( 75, sceneWidth/sceneHeight, 1, 1000 );
    camera.position.set(0,5,5);

    //设置渲染方式
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true } );
    renderer.setSize( sceneWidth, sceneHeight );
    if(isUseShadow){
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    document.getElementById("container").appendChild(renderer.domElement);

    //添加光照
    var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0xffffff, .9);
    scene.add( hemisphereLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 ,100);
    directionalLight.position.set(2, 5, 0 );
    directionalLight.target.position.set( 0, 0, 0 );
    directionalLight.castShadow = true;
    scene.add( directionalLight );

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = -100;
    directionalLight.shadow.camera.far = 500;

    //添加辅助工具
    let tool = new helpersTools();
    tool.gridHelperBuild(scene);
    tool.axesHelperBuild(scene);

    //视角控制器
    var controls = new cameraControls(camera,renderer.domElement);
    controls.build();

    var floorGeometry = new THREE.PlaneGeometry(100,100,50,50);
    var material = new THREE.MeshLambertMaterial({
        color : 0x628cb7,
        side : THREE.DoubleSide,
        wireframe : false
    });
    var floor = new THREE.Mesh(floorGeometry,material);
    floor.rotation.x = Math.PI / 2;
    floor.position.set(0,1,0);
    floor.receiveShadow = true;
    scene.add(floor);


    var myPlane = new plane();
    myPlane.body.position.set(0,3,0);
    myPlane.build(scene);


    let animate = function(){
        window.requestAnimationFrame(animate);

        controls.build();

        myPlane.fly();

        renderer.render(scene,camera);
    };
    animate();
};
(function(obj){
    // 辅助工具
    let helpersTools = function(){
        this.gridHelper = null;
        this.axesHelper = null;

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
})(window);


