/**
 * @author zhouhui
 * @since 2018.06.09
 * @description 主要的应用对象
 * */
(function(window){
    var plane = function(){
        this.body = new THREE.Group();

        this.Front = null;
        this.Center = null;
        this.Hind = null;

        this.Sopiler = null;// 尾翼
        this.Wing = null; // 机翼
        this.airScrew = new THREE.Group();

        this.frontGeometry = null;
        this.centerGeometry = null;
        this.hindGeometry = null;

        this.sopilerGeometry = null;
        this.wingGeometry = null;

        this.frontMaterial = new THREE.MeshLambertMaterial({
            color : 0xd8d0d1,
            side : THREE.FrontSide,
            wireframe : true
        });
        this.centerMaterial = new THREE.MeshLambertMaterial({
            color : 0xf25346,
            side : THREE.FrontSide,
            wireframe : true
        });
        this.hindMaterial = new THREE.MeshLambertMaterial({
            color : 0xf25346,
            side : THREE.FrontSide,
            wireframe : true
        });
        this.airScrewMaterial = new THREE.MeshLambertMaterial({
            color : 0x503116,
            side : THREE.FrontSide,
            wireframe : true
        });

        this.airScrewRotation = 0;// 螺旋桨转过的角度
        this.init();
    };
    plane.prototype = {
        init : function(){
            const frontWidth = 1;
            const frontHeight = 3;
            const frontDepth = 3;
            this.frontGeometry = new THREE.BoxGeometry(
                frontWidth,frontHeight,frontDepth,
                1,2,2);
            this.frontGeometry.translate(frontWidth / 2, 0, 0);
            //螺旋桨固定物
            let pointGeometry = new THREE.ConeGeometry(0.4,0.6,4,1);
            pointGeometry.rotateZ(-Math.PI / 2);
            pointGeometry.translate(frontWidth + 0.3 , 0, 0);
            this.frontGeometry.merge(pointGeometry);

            this.Front = new THREE.Mesh(this.frontGeometry,this.frontMaterial);
            this.Front.castShadow = true;
            this.Front.receiveShadow = true;
            this.body.add(this.Front);

            const centWidth = 2;
            const centHeight = 3;
            const centDepth = 3;
            this.centerGeometry = new THREE.BoxGeometry(
                centWidth,centHeight,centDepth,
                1.5,2,2);
            this.centerGeometry.translate(-centWidth / 2, 0, 0);
            this.Center = new THREE.Mesh(this.centerGeometry,this.centerMaterial);
            this.Center.castShadow = true;
            this.Center.receiveShadow = true;
            this.body.add(this.Center);


            const hindTopSize = 0;
            const hindBottomSize = 2;
            const hindHeight = 8;
            const hindSegments = 4;
            this.hindGeometry = new THREE.CylinderGeometry(hindTopSize ,hindBottomSize,hindHeight,
                hindSegments,2,false,Math.PI / 4);
            this.hindGeometry.rotateZ(1.38);
            this.hindGeometry.translate(-centWidth - hindHeight / 2+0.5,hindBottomSize / 2 - 0.1,0);
            this.Hind = new THREE.Mesh(this.hindGeometry,this.hindMaterial);
            this.Hind.castShadow = true;
            this.Hind.receiveShadow = true;
            this.body.add(this.Hind);

            const sopilerWidth = 1.5;
            const sopilerHeight = 1.5;
            const sopilerDepth = 0.2;
            this.sopilerGeometry = new THREE.BoxGeometry(
                sopilerWidth,sopilerHeight,sopilerDepth,
                2,2,1
            );
            this.sopilerGeometry.translate(
                -centWidth - hindHeight + 0.3 + sopilerWidth / 2,
                (centHeight + sopilerHeight) / 2,
                0);
            this.Sopiler = new THREE.Mesh(this.sopilerGeometry,this.hindMaterial);
            this.Sopiler.castShadow = true;
            this.body.add(this.Sopiler);

            const wingWidth = 3.5;
            const wingHeight = 0.2;
            const wingDepth = 12;
            this.wingGeometry = new THREE.BoxGeometry(wingWidth,wingHeight,wingDepth, 1,1,5);
            this.wingGeometry.translate(-wingWidth / 2 - 0.5, (centHeight - wingHeight) / 2 - 0.1, 0);
            this.Wing = new THREE.Mesh(this.wingGeometry,this.centerMaterial);
            this.Wing.castShadow = true;
            this.Wing.receiveShadow = true;
            this.body.add(this.Wing);

            //螺旋桨
            const airScrewWidth = 0.2;
            const airScrewHeight = 4.5;
            const airScrewDepth = 0.6;
            let airScrewGeometry_1 = new THREE.BoxGeometry(
                airScrewWidth,airScrewHeight,airScrewDepth,
                1,2,1
            );
            let airScrewGeometry_2 = new THREE.BoxGeometry(
                airScrewWidth,airScrewHeight,airScrewDepth,
                1,2,1
            );
            airScrewGeometry_2.rotateX(Math.PI / 2);
            this.airScrew.add(new THREE.Mesh(airScrewGeometry_1,this.airScrewMaterial));
            this.airScrew.add(new THREE.Mesh(airScrewGeometry_2,this.airScrewMaterial));
            this.airScrew.translateX(frontWidth + 0.3);
            this.airScrew.castShadow = true;
            this.body.add(this.airScrew);

            // this.body.scale.set(0.3,0.3,0.3);
        },
        build : function(scene){
            scene.add(this.body);
        },
        fly : function(){
            this.airScrew.rotateX(Math.PI / 6);
        }
    };
    window.plane = plane;
})(window);