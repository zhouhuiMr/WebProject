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
    let isUseShadow = true;//是否开启阴影
    let isUseTool = false; //是否显示辅助工具
    let isShowFPS = false;//是否显示帧数
    let isUseController = false;//是否使用视角控制
    // 获取高度和宽度
    let sceneWidth = document.documentElement.clientWidth;
    let sceneHeight = document.documentElement.clientHeight;

    //鼠标的坐标状态
    let mousePreX = 0;
    let mousePreY = 0;
    let mouseCurX = 0;
    let mouseCurY = 0;

    //飞机的厨师坐标
    let initPlanePostion = {
        "x" : 5,
        "y" : 32,
        "z" : 29
    };

    //设置场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFEC8B);
    scene.fog = new THREE.Fog(0xFFF68F,5,40);

    //设置摄像机
    camera = new THREE.PerspectiveCamera( 75, sceneWidth/sceneHeight, 1, 300 );
    camera.position.set(8,30,45);

    //设置渲染方式
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true } );
    renderer.setSize( sceneWidth, sceneHeight );
    if(isUseShadow){
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    document.getElementById("container").appendChild(renderer.domElement);

    //帧数显示
    let stats = null;
    if(isShowFPS){
        stats = new Stats();
        document.getElementById("container").appendChild(stats.dom);
    }


    //添加光照
    let light = new sceneLight(scene,camera);
    light.build();

    //视角控制器
    let controls = null;
    if(isUseController){
        controls = new cameraControls(camera,renderer.domElement);
        controls.build();
    }


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

    let mysun = new sun();
    mysun.body.position.set(30,10,-20);
    mysun.build(scene);

    let myGround = new ground();
    myGround.body.position.set(0,-40,30);
    myGround.build(scene);


    let myPlane = new plane();
    myPlane.body.position.set(initPlanePostion.x,initPlanePostion.y,initPlanePostion.z);
    myPlane.build(scene);

    // var p = new pine();
    // p.body.position.set(10,20,0);
    // p.body.rotation.z = -Math.PI / 4;
    // p.build(scene);

    let myClouds = new clouds();
    myClouds.build(scene);

    let birds = new seaBirds(scene,myPlane);

    let raycaster = new THREE.Raycaster();

    let autopilot = new Autopilot(raycaster,myPlane,birds);

    //添加辅助工具
    if(isUseTool){
        let tool = new helpersTools();
        tool.gridHelperBuild(scene);
        tool.axesHelperBuild(scene);

        tool.directionalLightHelperBuild(scene,light.directionalLight);
        tool.cameraHelperBuild(scene,light.directionalLight.shadow.camera);
    }

    //标签绑定事件
    let tagContainer = document.getElementById("topcontainer");
    tagContainer.addEventListener('mousemove',function(e){
        mousePreX = mouseCurX;
        mousePreY = mouseCurY;
        mouseCurX = e.pageX;
        mouseCurY = e.pageY;
    });

    tagContainer.addEventListener('touchmove',function(e){
        mousePreX = mouseCurX;
        mousePreY = mouseCurY;
        mouseCurX = event.targetTouches[0].pageX;
        mouseCurY = event.targetTouches[0].pageY;
    });

    let animate = function(){
        window.requestAnimationFrame(animate);

        if(controls != null){
            controls.build();
        }

        myPlane.fly();
        myPlane.flyer.hairAnimate();
        myGround.move();

        myClouds.move();
        birds.move();

        autopilot.planMove();

        //飞机根据鼠标移动进行移动
        // planeMoveByMouse(mousePreX,mousePreY,mouseCurX,mouseCurY,myPlane);
        // mousePreX = mouseCurX;
        // mousePreY = mouseCurY;

        if(stats != null){
            stats.update();
        }

        renderer.render(scene,camera);
    };
    animate();
};
(function(obj){
    /**------------------------**/
    /** 辅助工具               **/
    /**------------------------**/
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

    /**------------------------**/
    /** 视角控制               **/
    /**------------------------**/
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

    /**------------------------**/
    /** 场景中的光源           **/
    /**------------------------**/
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
            this.directionalLight.position.set(15, 40, 0 );
            this.directionalLight.target.position.set( 0, 0, 0 );
            this.directionalLight.castShadow = true;

            this.directionalLight.shadow.camera.left = -60;
            this.directionalLight.shadow.camera.bottom = -60;
            this.directionalLight.shadow.camera.right = 60;
            this.directionalLight.shadow.camera.top = 60;
            this.directionalLight.shadow.camera.near = 0.1;
            this.directionalLight.shadow.camera.far = 60;
            this.directionalLight.shadow.mapSize.width = 1024;  // default
            this.directionalLight.shadow.mapSize.height = 1024; // default

        },
        build : function(){
            this.scene.add(this.hemisphereLight);
            this.scene.add(this.directionalLight);
        }
    };
    obj.sceneLight = sceneLight;

    /**------------------------**/
    /** 鼠标控制               **/
    /**------------------------**/
    obj.planeMoveByMouse = function(mousePreX,mousePreY,mouseCurX,mouseCurY,plane){
        if(mousePreX - mouseCurX < 0 ){
            //鼠标向右移动

        }else if(mousePreX - mouseCurX > 0){
            //鼠标向左移动

        }else{
            //鼠标不移动
        }

        if(mousePreY - mouseCurY < 0 ){
            //鼠标向下移动

        }else if(mousePreY - mouseCurY > 0){
            //鼠标向上移动

        }else{
            //鼠标不移动
        }
        plane.move();
    };
    /**------------------------**/
    /** 鼠标控制               **/
    /**------------------------**/
    let Autopilot = function(raycaster,plane,seabirds){
        this.raycaster = raycaster;
        this.plane = plane;
        this.seabirds = seabirds;
        this.currentTime = new Date().getTime();
        this.previuseTime = new Date().getTime();
        this.intervalTime = (Math.random() * 5 + 5) * 1000;
        this.animationContainer = new Array();
        this.init();
    };
    Autopilot.prototype = {
        init : function(){
            // 初始化动画
            let ani_1 = {
                x : {
                    direction : 0,
                    targetSite : 0
                },
                y : {
                    direction : 0,
                    targetSite : 0
                },
                z : {
                    direction : 1,
                    targetSite : 1
                }
            };
            this.animationContainer.push(ani_1);

            let ani_2 = {
                x : {
                    direction : 0,
                    targetSite : 0
                },
                y : {
                    direction : -1,
                    targetSite : -1
                },
                z : {
                    direction : -1,
                    targetSite : -1
                }
            };
            this.animationContainer.push(ani_2);

            let ani_3 = {
                x : {
                    direction : 0,
                    targetSite : 0
                },
                y : {
                    direction : 0,
                    targetSite : 0
                },
                z : {
                    direction : 0,
                    targetSite : 0
                }
            };
            this.animationContainer.push(ani_3);

        },
        collision : function(){

        },
        planMove : function(){
            this.currentTime = new Date().getTime();
            if(this.previuseTime + this.intervalTime <= this.currentTime){
                let randomNum = Math.floor(Math.random() * (this.animationContainer.length));
                let ani = this.animationContainer[randomNum];
                this.plane.statusX = ani.x;
                this.plane.statusY = ani.y;
                this.plane.statusZ = ani.z;
                this.previuseTime = this.currentTime;
                this.intervalTime = (Math.random() * 5 +5) * 1000;
            }
            this.plane.move();
        }
    };
    obj.Autopilot = Autopilot;
})(window);


