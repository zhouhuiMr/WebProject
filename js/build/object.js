/**
 * @author zhouhui
 * @since 2018.06.09
 * @description 主要的应用对象
 * */
(function(window){
    var plane = function(){
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

        this.airScrewRotation = 0;// 螺旋桨转过的角度
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
            Wing_1.rotation.y = -1 * Math.PI / 10;
            Wing_1.position.set(-wingWidth / 2 - 0.5,- wingHeight / 2 + 0.5 , wingDepth / 2);
            this.Wing.add(Wing_1);

            let Wing_2 = new THREE.Mesh(this.wingGeometry,this.hindMaterial);
            Wing_2.castShadow = true;
            Wing_2.rotation.y =  Math.PI / 10;
            Wing_2.position.set(-wingWidth / 2 - 0.5,- wingHeight / 2 + 0.5 ,-1 * wingDepth / 2);
            this.Wing.add(Wing_2);

            let hindWing_1 = new THREE.Mesh(this.hindWingGeometry,this.hindMaterial);
            hindWing_1.castShadow = true;
            hindWing_1.rotation.y =  -1 * Math.PI / 10;
            hindWing_1.position.set(-hindHeight+wingWidth / 2 - 0.6,0.2, hindWingDepth / 2);
            this.Wing.add(hindWing_1);

            let hindWing_2 = new THREE.Mesh(this.hindWingGeometry,this.hindMaterial);
            hindWing_2.castShadow = true;
            hindWing_2.rotation.y =  Math.PI / 10;
            hindWing_2.position.set(-hindHeight+wingWidth / 2 - 0.6,0.2,-1 * hindWingDepth / 2);
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
            this.airScrew.translateX(frontWidth + 0.1);
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

            //

            // this.body.scale.set(0.3,0.3,0.3);
        },
        build : function(scene){
            scene.add(this.body);
        },
        fly : function(){
            this.airScrew.rotateX(Math.PI / 4);
        }
    };
    window.plane = plane;
})(window);