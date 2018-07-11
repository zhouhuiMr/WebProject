/**
 * @author zhouhui
 * @since 2018.06.09
 * @description 主要的应用对象
 * */
(function(window){
    /**------------------------**/
    /**  飞机                  **/
    /**------------------------**/
    let plane = function(){
        this.body = new THREE.Group();

        this.Front = null;
        this.Hind = null;

        this.Sopiler = null;// 尾翼
        this.Wing = new THREE.Group(); // 机翼
        this.airScrew = new THREE.Group();

        this.frontGeometry = null;
        this.hindGeometry = null;

        this.sopilerGeometry = null;
        this.wingGeometry = null;
        this.hindWingGeometry = null;

        this.flyer = null;

        this.frontMaterial = new THREE.MeshPhongMaterial({
            color : 0xd8d0d1,
            side : THREE.FrontSide,
            flatShading:true,
            wireframe : false
        });
        this.hindMaterial = new THREE.MeshPhongMaterial({
            color : 0xf25346,
            side : THREE.FrontSide,
            flatShading:true,
            wireframe : false
        });
        this.airScrewMaterial = new THREE.MeshPhongMaterial({
            color : 0x503116,
            side : THREE.FrontSide,
            flatShading:true,
            wireframe : false
        });
        this.tireMaterial = new THREE.MeshLambertMaterial({
            color : 0x311402,
            side : THREE.FrontSide,
            flatShading:true,
            wireframe : false
        });
        this.glassMaterial = new THREE.MeshLambertMaterial({
            transparent : true,
            opacity : 0.7,
            color : 0xf5f5f5,
            side : THREE.FrontSide,
            flatShading:true,
            wireframe : false
        });

        //this.airScrewRotation = 0;// 螺旋桨转过的角度
        this.init();
    };
    plane.prototype = {
        init : function(){
            //机身的前半部分
            const frontWidth = 1;
            const frontHeight = 2;
            const frontDepth = 2;
            this.frontGeometry = new THREE.BoxGeometry(
                frontWidth,frontHeight,frontDepth,
                1,2,2);
            this.frontGeometry.translate(frontWidth / 2, 0, 0);
            //螺旋桨固定物
            let pointGeometry = new THREE.ConeGeometry(0.2,0.3,4,1);
            pointGeometry.rotateZ(-Math.PI / 2);
            pointGeometry.translate(frontWidth + 0.2 , 0, 0);
            this.frontGeometry.merge(pointGeometry);

            this.Front = new THREE.Mesh(this.frontGeometry,this.frontMaterial);
            this.Front.castShadow = true;
            this.Front.receiveShadow = true;
            this.body.add(this.Front);

            //机身后半部分
            const hindTopSize = 0.4;
            const hindBottomSize = 1.41;
            const hindHeight = 4;
            const hindSegments = 4;
            this.hindGeometry = new THREE.CylinderGeometry(hindTopSize ,hindBottomSize,hindHeight,
                hindSegments,4,false,Math.PI / 4,6.3);
            this.hindGeometry.rotateZ(Math.PI / 2);
            this.hindGeometry.translate( - hindHeight / 2,0,0);
            this.Hind = new THREE.Mesh(this.hindGeometry,this.hindMaterial);
            this.Hind.castShadow = true;
            this.Hind.receiveShadow = true;
            this.body.add(this.Hind);

            //尾翼
            const sopilerWidth = 1;
            const sopilerHeight = 1.5;
            const sopilerDepth = 0.1;
            this.sopilerGeometry = new THREE.BoxGeometry(
                sopilerWidth,sopilerHeight,sopilerDepth,
                1,2,1
            );
            this.sopilerGeometry.translate(
                - hindHeight + sopilerWidth / 2 + 0.2,
                sopilerHeight + 0.1,
                0
            );
            this.sopilerGeometry.rotateZ(Math.PI / 10);
            this.Sopiler = new THREE.Mesh(this.sopilerGeometry,this.hindMaterial);
            this.Sopiler.castShadow = true;
            this.body.add(this.Sopiler);

            //机翼
            const wingWidth = 1.5;
            const wingHeight = 0.2;
            const wingDepth = 3;
            const hindWingWidth = 0.5;
            const hindWingDepth = 1;
            this.wingGeometry = new THREE.BoxGeometry(wingWidth,wingHeight,wingDepth, 1,1,4);
            this.hindWingGeometry = new THREE.BoxGeometry(hindWingWidth,wingHeight,hindWingDepth, 1,1,1);

            let Wing_1 = new THREE.Mesh(this.wingGeometry,this.hindMaterial);
            Wing_1.castShadow = true;
            //Wing_1.rotation.y = -1 * Math.PI / 10;
            Wing_1.position.set(-wingWidth / 2 - 0.5,- wingHeight / 2 + 0.5 , wingDepth / 2);
            this.Wing.add(Wing_1);

            let Wing_2 = new THREE.Mesh(this.wingGeometry,this.hindMaterial);
            Wing_2.castShadow = true;
            //Wing_2.rotation.y =  Math.PI / 10;
            Wing_2.position.set(-wingWidth / 2 - 0.5,- wingHeight / 2 + 0.5 ,-1 * wingDepth / 2);
            this.Wing.add(Wing_2);

            let hindWing_1 = new THREE.Mesh(this.hindWingGeometry,this.hindMaterial);
            hindWing_1.castShadow = true;
            //hindWing_1.rotation.y =  -1 * Math.PI / 10;
            hindWing_1.position.set(-hindHeight+wingWidth / 2 - 0.6,0.5, hindWingDepth / 2);
            this.Wing.add(hindWing_1);

            let hindWing_2 = new THREE.Mesh(this.hindWingGeometry,this.hindMaterial);
            hindWing_2.castShadow = true;
            //hindWing_2.rotation.y =  Math.PI / 10;
            hindWing_2.position.set(-hindHeight+wingWidth / 2 - 0.6,0.5,-1 * hindWingDepth / 2);
            this.Wing.add(hindWing_2);

            this.body.add(this.Wing);

            //螺旋桨
            const airScrewWidth = 0.1;
            const airScrewHeight = 3;
            const airScrewDepth = 0.5;
            let airScrewGeometry_1 = new THREE.BoxGeometry(
                airScrewWidth,airScrewHeight,airScrewDepth,
                1,2,1
            );
            let airScrew_1 =  new THREE.Mesh(airScrewGeometry_1,this.airScrewMaterial);
            airScrew_1.castShadow = true;
            this.airScrew.add(airScrew_1);
            let airScrew_2 =  new THREE.Mesh(airScrewGeometry_1,this.airScrewMaterial);
            airScrew_2.rotation.x = Math.PI / 2;
            airScrew_2.castShadow = true;
            this.airScrew.add(airScrew_2);
            this.airScrew.translateX(frontWidth + 0.15);
            this.body.add(this.airScrew);

            //飞机起落架
            let hindTireGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.1);

            let frontUndercarriageGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
            let frontUndercarriage_1 = new THREE.Mesh(frontUndercarriageGeometry,this.hindMaterial);
            frontUndercarriage_1.rotation.z = Math.PI / 10;
            frontUndercarriage_1.position.set(0, -1, -0.8);
            this.body.add(frontUndercarriage_1);
            let frontUndercarriage_2 = new THREE.Mesh(frontUndercarriageGeometry,this.hindMaterial);
            frontUndercarriage_2.rotation.z = Math.PI / 10;
            frontUndercarriage_2.position.set(0, -1, 0.8);
            this.body.add(frontUndercarriage_2);

            let hindUndercarriageGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
            let hindUndercarriage = new THREE.Mesh(hindUndercarriageGeometry,this.hindMaterial);
            hindUndercarriage.rotation.z = -1 * Math.PI / 8;
            hindUndercarriage.position.set(-hindHeight + 0.2,-0.4,0);
            this.body.add(hindUndercarriage);

            let hindTire1 = new THREE.Mesh(hindTireGeometry,this.tireMaterial);
            hindTire1.position.set(0.05, -1.2, 0.8);
            this.body.add(hindTire1);
            let hindTire2 = new THREE.Mesh(hindTireGeometry,this.tireMaterial);
            hindTire2.position.set(0.05, -1.2, -0.8);
            this.body.add(hindTire2);
            let hindTire3 = new THREE.Mesh(hindTireGeometry,this.tireMaterial);
            hindTire3.position.set(-hindHeight + 0.15,-0.6,0);
            this.body.add(hindTire3);

            //挡风玻璃
            let frontGlassGeometry = new THREE.BoxGeometry(0.05, 0.7, 1.2);
            let frontGlass = new THREE.Mesh(frontGlassGeometry,this.glassMaterial);
            frontGlass.position.set( -1, frontHeight / 2 - 0.1, 0 );
            this.body.add(frontGlass);

            //添加飞行员
            this.flyer = new flyer();
            this.flyer.body.position.set(-1.8,1.2,0);
            this.body.add(this.flyer.build());

            this.body.scale.set(0.7,0.7,0.7);
        },
        build : function(scene){
            scene.add(this.body);
        },
        fly : function(){
            this.airScrew.rotateX(Math.PI / 4);
        }
    };
    window.plane = plane;

    /**------------------------**/
    /** 飞行员                 **/
    /**------------------------**/
    let flyer = function(){
        this.body = new THREE.Group();
        this.head = null;//头
        this.eyes = new THREE.Group();//眼睛
        this.nose = null;// 鼻子
        this.mouth = null;//嘴
        this.hear = new THREE.Group();
        this.hairArray = new Array();
        this.init();
    };
    flyer.prototype = {
        init : function(){
            //人物头部
            let headGeometry = new THREE.BoxGeometry(1,1,1,1,1,1);
            let headMaterial = new THREE.MeshLambertMaterial({
                color : 0xdeb582,
                side : THREE.FrontSide,
                flatShading:true,
                wireframe : false
            });
            this.head = new THREE.Mesh(headGeometry,headMaterial);
            this.body.add(this.head);
            //眼睛
            let eyeGeometry = new THREE.BoxGeometry(0.01,0.1,0.2);
            let eyeMaterial = new THREE.MeshLambertMaterial({
                color : 0x000000,
                side : THREE.FrontSide,
                flatShading:true,
                wireframe : false
            });
            let righteye = new THREE.Mesh(eyeGeometry,eyeMaterial);
            righteye.position.set(0.5,0.2,0.23);
            righteye.rotateX(Math.PI / 8);
            this.eyes.add(righteye);
            let lefteye = righteye.clone();
            lefteye.position.set(0.5,0.2,-0.23);
            lefteye.rotateX(-Math.PI / 4);
            this.eyes.add(lefteye);
            this.body.add(this.eyes);
            //鼻子
            let noseGeometry = new THREE.BoxGeometry(0.2,0.2,0.08);
            this.nose = new THREE.Mesh(noseGeometry,headMaterial);
            this.nose.position.set(0.45,-0.1,0);
            this.nose.rotateZ(Math.PI / 10);
            this.body.add(this.nose);
            //嘴
            let mouthGeometry = new THREE.BoxGeometry(0.1,0.05,0.3);
            let mouthMaterial = new THREE.MeshLambertMaterial({
                color : 0xd17947,
                side : THREE.FrontSide,
                flatShading:true,
                wireframe : false
            });
            this.mouth = new THREE.Mesh(mouthGeometry,mouthMaterial);
            this.mouth.position.set(0.5,-0.4,0);
            this.body.add(this.mouth);
            //头发
            let hairMaterial = new THREE.MeshLambertMaterial({
                color : 0x613600,
                side : THREE.FrontSide,
                flatShading:true,
                wireframe : false
            });
            let hairGeometry_1 = new THREE.BoxGeometry(1,0.06,1.04);
            let hair_1 = new THREE.Mesh(hairGeometry_1,hairMaterial);
            hair_1.position.set(0,0.53,0);
            this.hear.add(hair_1);
            let hairGeometry_2 = new THREE.BoxGeometry(0.72,0.7,1.04);
            let hair_2 = new THREE.Mesh(hairGeometry_2,hairMaterial);
            hair_2.position.set(-0.2,0.21,0);
            this.hear.add(hair_2);
            this.body.add(this.hear);
            const size = 1.04 / 3;
            for(var i = 0;i < 4;i ++){
                for(var j = 0;j < 3 ;j ++){
                    let hairGeometry = new THREE.BoxGeometry(size,0.5,size);
                    let hair = new THREE.Mesh(hairGeometry,hairMaterial);
                    let h = Math.random() * 0.3;
                    hair.position.set(-size * 2 + size * i,h + 0.4,-size + size * j);
                    this.hairArray.push(hair);
                    this.hear.add(hair);
                }
            }
            let partGeometry = new THREE.BoxGeometry(1.4,1,1.4);
            let partMaterial = new THREE.MeshLambertMaterial({
                color : 0x64490c,
                side : THREE.FrontSide,
                flatShading:true,
                wireframe : false
            });
            let part = new THREE.Mesh(partGeometry,partMaterial);
            part.position.set( -0.1, -0.97, 0);
            this.body.add(part);

            this.body.scale.set( 0.6, 0.6, 0.6);
        },
        build : function(){
            return this.body;
        },
        hairAnimate : function(){
            for(var i=0;i<this.hairArray.length;i++){
                let hair = this.hairArray[i];
                let h = Math.random() * 0.3;
                hair.position.y = h + 0.4;
            }
        }

    };

    /**------------------------**/
    /** 陆地                   **/
    /**------------------------**/
    let ground = function(){
        this.body = new THREE.Group();
        this.radius = 60;
        this.height = 30;
        this.radialSegments = 30;
        this.heightSegments = 10;
        this.landGeometry = null;
        this.land = null;
        this.oceanGeometry = null;
        this.ocean = null;
        this.waves = new Array();
        this.landMaterial = new THREE.MeshLambertMaterial({
            color : 0x206510,
            side : THREE.DoubleSide,
            flatShading:true,
            wireframe : false
        });
        this.oceanMaterial = new THREE.MeshPhongMaterial({
            color: 0x00868B,
            side : THREE.FrontSide,
            transparent: true,
            opacity : 0.8,
            flatShading:true,
            wireframe : false,
        });
        this.init();
    };
    ground.prototype = {
        init : function(){
            // this.landGeometry = new THREE.CylinderGeometry(
            //     this.radius + 3, this.radius + 3, this.height ,
            //     this.radialSegments , this.heightSegments ,
            //     false , Math.PI / 2 , Math.PI+0.01
            // );
            // this.land = new THREE.Mesh(this.landGeometry,this.landMaterial);
            // this.land.rotation.x = Math.PI / 2;
            // this.land.receiveShadow = true;
            // this.body.add(this.land);

            this.oceanGeometry = new THREE.CylinderGeometry(
                this.radius , this.radius , this.height ,
                this.radialSegments , this.heightSegments ,
                true , 0, Math.PI *2
            );
            for(var i = 0;i<this.oceanGeometry.vertices.length;i++){
                var v = {
                    x : this.oceanGeometry.vertices[i].x,
                    y : this.oceanGeometry.vertices[i].y,
                    z : this.oceanGeometry.vertices[i].z,
                    ang : Math.random() * Math.PI * 2,
                    amp : Math.random() * 3,
                    speed : 0.016 + Math.random()*0.032
                };
                this.waves.push(v);
            }
            this.ocean = new THREE.Mesh(this.oceanGeometry,this.oceanMaterial);
            this.ocean.rotation.x = Math.PI / 2;
            this.ocean.receiveShadow = true;
            this.body.add(this.ocean);
        },
        build : function(scene){
            scene.add(this.body);
        },
        move : function(){
            this.body.rotateZ(0.005);
            let vert = this.oceanGeometry.vertices;
            this.oceanGeometry.verticesNeedUpdate = true;

            for(var i = 0; i < vert.length;i ++){
                let v = vert[i];
                let wave = this.waves[i];
                v.x = wave.x + Math.cos(wave.ang) * wave.amp;
                v.y = wave.y + Math.sin(wave.ang) * wave.amp;
                wave.ang += wave.speed;
            }
        }
    };
    window.ground = ground;

    /**------------------------**/
    /** 松树                   **/
    /**------------------------**/
    let pine = function(){
        this.body = new THREE.Group();
        this.pineMaterial = new THREE.MeshLambertMaterial({
            color : 0x084106,
            side : THREE.FrontSide,
            flatShading:true,
            wireframe : false
        });
        this.init();
    };
    pine.prototype = {
        init : function(){
            let topSize = 0;
            let bottomSize = 1;
            let pineHeight = 2;
            let siteY = 0;
            for(var i = 0;i < 3;i ++){
                let pineGeometry = new THREE.CylinderGeometry(
                    topSize,bottomSize,pineHeight,4,
                    1,false,0,6.3
                );
                let p = new THREE.Mesh(pineGeometry,this.pineMaterial);
                p.position.set(0,siteY,0);
                p.castShadow = true;
                p.receiveShadow = true;
                this.body.add(p);
                topSize = bottomSize - 0.4;
                bottomSize = bottomSize + 1;
                siteY = siteY -pineHeight + 0.3;
            }
            let trunkGeometry = new THREE.CylinderGeometry(
                0.5,0.5,1,8,
                1,false,0,6.3
            );
            let trunkMaterial = new THREE.MeshLambertMaterial({
                color : 0x402308,
                side : THREE.FrontSide,
                flatShading:true,
                wireframe : false
            });
            let trunk = new THREE.Mesh(trunkGeometry,trunkMaterial);
            trunk.position.set(0,siteY + 0.5,0);
            trunk.castShadow = true;
            trunk.receiveShadow = true;
            this.body.add(trunk);

            this.body.scale.set(2,2,2);
        },
        build : function(scene){
            scene.add(this.body);
        }
    };
    window.pine = pine;

    /**------------------------**/
    /** 云彩                   **/
    /**------------------------**/
    let cloud = function(x,y,z){
        this.body = new THREE.Group();
        this.x = x;
        this.y = y;
        this.z = z;
        this.MoveRadius = 0; //旋转的半径
        this.angle = Math.PI / 2;
        this.pineMaterial = new THREE.MeshLambertMaterial({
            color : 0xFFF0F5,
            side : THREE.FrontSide,
            flatShading:true,
            wireframe : false
        });
        this.CloudNum = Math.ceil(Math.random() * 3)+2;
        this.SPEED = Math.random() / 10 +0.05;
        this.init();
    };
    cloud.prototype = {
        init : function(){
            let preRadius = 0;
            for(let i = 0;i < this.CloudNum;i ++){
                let radius = Math.random() * 3;
                let cloudGeometry = new THREE.DodecahedronGeometry(radius,0);
                cloudGeometry.translate(preRadius / 2 + radius / 2 * i,Math.random() * 2 , Math.random());
                // cloudGeometry.rotateX(Math.random() * Math.PI);
                cloudGeometry.rotateY(Math.random() * Math.PI);
                let c = new THREE.Mesh(cloudGeometry,this.pineMaterial);
                c.castShadow = true;
                this.body.add(c);
                preRadius = radius;
            }
            // this.x = 0;
            // this.y = Math.random() *10 + 25;
            // this.z = Math.random() * 25;
            this.body.position.set(this.x,this.y,this.z);

        },
        build : function(scene){
            scene.add(this.body);
        },
        move : function(){
            if(this.x >= 80){
                this.x = Math.random() * 30 * (-1) - 80;
                this.y = Math.random() *10 + 25;
                this.z = Math.random() * 10 + 20;
                this.body.position.set(this.x,this.y,this.z);
            }else{
                this.x += this.SPEED;
                this.body.position.set(this.x,this.y,this.z);
            }

        }
    };
    window.cloud = cloud;

    /**------------------------**/
    /** 多个云彩               **/
    /**------------------------**/
    var clouds = function(){
        this.body  = new Array();
        this.cloudNum = 8;
        this.init();
    };
    clouds.prototype = {
        init : function(){
            //创建的多个云彩
            for(let i = 0;i < this.cloudNum; i++){
                let x = Math.random() * 100 - 50;
                let y = Math.random() *20 + 25;
                let z = Math.random() * 10 + 20;
                let c = new cloud(x,y,z);
                this.body.push(c);
            }
        },
        build : function(scene){
            for(let i=0;i<this.body.length;i++){
                this.body[i].build(scene);
            }
        },
        move : function(){
            for(let i=0;i<this.body.length;i++){
                this.body[i].move();
            }
        }
    };
    window.clouds = clouds;

    /**------------------------**/
    /** 太阳                   **/
    /**------------------------**/
    var sun = function(){
        this.body = new THREE.Group();
        this.sunMaterial = new THREE.MeshBasicMaterial({
            color : 0xF4A460,
            side : THREE.FrontSide,
            flatShading:true,
            wireframe : false
        });
        this.init();
    };
    sun.prototype = {
        init : function(){
            let sunGeometry = new THREE.CircleGeometry(50,40);
            let sun = new THREE.Mesh(sunGeometry,this.sunMaterial);
            this.body.add(sun);
        },
        build : function(scene){
            scene.add(this.body);
        }
    };
    window.sun = sun;


    /**------------------------**/
    /** 海鸟                   **/
    /**------------------------**/
    let seaBird = function(){
        this.body = new THREE.Group();
        this.leftWing = null;
        this.rightWing = null;
        this.ISDOWN = true;
        this.MoveSpeed = 0.2;
        this.seaBirdMaterial = new THREE.MeshLambertMaterial({
            color : 0xFFFFF0,
            side : THREE.DoubleSide,
            flatShading:true,
            wireframe : false
        });
        this.init();
    };
    seaBird.prototype = {
        init : function(){
            let wingShape = new THREE.Shape();
            wingShape.moveTo(0,0);
            wingShape.lineTo(0.5,0);
            wingShape.lineTo(0,2);
            wingShape.lineTo(-0.5,0);
            wingShape.lineTo(0,0);
            let wingGeometry = new THREE.ShapeGeometry(wingShape,10);
            this.leftWing = new THREE.Mesh(wingGeometry,this.seaBirdMaterial);
            this.leftWing.castShadow = true;
            this.rightWing = new THREE.Mesh(wingGeometry,this.seaBirdMaterial);
            this.rightWing.castShadow = true;
            this.body.add(this.leftWing);
            this.body.add(this.rightWing);
            let birdbodyGeometry = new THREE.BoxGeometry(1.2,0.02,0.02);
            birdbodyGeometry.translate(0,0,0);
            let birdBody = new THREE.Mesh(birdbodyGeometry,this.seaBirdMaterial);
            birdBody.castShadow = true;
            this.body.add(birdBody);
            this.leftWing.rotateX(Math.PI / 6);
            this.rightWing.rotateX(-1 * Math.PI / 6);
        },
        build : function(scene){
            scene.add(this.body);
        },
        move :function(){
            let LRX = Math.round(this.leftWing.rotation.x * 100) / 100;
            const MAX_LRX = Math.round(5 * Math.PI / 6 * 100 ) / 100 ;
            const MIN_LRX = Math.round( Math.PI / 6 * 100 ) / 100;
            let RRX = Math.round(this.rightWing.rotation.x * 100) / 100;
            const MAX_RRX = Math.round(-1 * 5 * Math.PI / 6 * 100 ) / 100 ;
            const MIN_RRX = Math.round( -1 * Math.PI / 6 * 100 ) / 100;
            if(LRX >= MAX_LRX){
                this.ISDOWN = false;
            }
            if(LRX <= MIN_LRX){
                this.ISDOWN = true;
            }
            if(this.ISDOWN){
                this.leftWing.rotateX(this.MoveSpeed);
                this.rightWing.rotateX(-1 * this.MoveSpeed);
            }else{
                this.leftWing.rotateX(-1 * this.MoveSpeed);
                this.rightWing.rotateX(this.MoveSpeed);
            }
        }
    };
    window.seaBird = seaBird;

    let seaBirds = function(){
        this.body = new THREE.Group();
        this.NUMBER = 20;
    };
    seaBirds.prototype = {
        init : function(){

        }
    };
    window.seaBirds = seaBirds;
})(window);