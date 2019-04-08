/**
 * @author zhouhui
 * @since 2018.06.09
 * @description 主要的应用对象
 * */

(function(window){
    'user strict'
    /**------------------------**/
    /**  飞机                  **/
    /**------------------------**/
    let plane = function(){
        this.body = new THREE.Group();

        //飞机前半部分
        this.frontBody_X = 1;//大小
        this.frontBody_Y = 1.5;
        this.frontBody_Z = 1.5;
        this.frontBody_X_Segments = 1;//分段数
        this.frontBody_Y_Segments = 1;
        this.frontBody_Z_Segments = 1;
        this.frontBodyGeometry = null;
        this.frontBody = null; //飞机前半部分
        this.frontBodyMaterial = new THREE.MeshPhongMaterial({
            color : 0xd8d0d1,
            side : THREE.FrontSide,
            flatShading : false,
            wireframe : false
        });

        //飞机的后半部分
        this.backBody_X = 3;
        this.backBody_Y = 1.5;
        this.backBody_Z = 1.5;
        this.backBody_X_Segments = 1;
        this.backBody_Y_Segments = 1;
        this.backBody_Z_Segments = 1;
        this.backBodyGeometry = null;
        this.backBody = null;//飞机后半部分
        this.backBodyMaterial = new THREE.MeshPhongMaterial({
            color : 0xf25346,
            side : THREE.FrontSide,
            clearCoatRoughness : 1,
            reflectivity : 1,
            flatShading:false,
            wireframe : false
        });

        //飞机的尾翼
        this.sopilerBody_X = 0.6;
        this.sopilerBody_Y = 1.2;
        this.sopilerBody_Z = 0.1;
        this.sopilerBody_X_Segments = 1;
        this.sopilerBody_Y_Segments = 1;
        this.sopilerBody_Z_Segments = 1;
        this.sopilerBodyGeometry = null;
        this.sopilerBody = null;// 尾翼

        this.wingBody_X = 1.8;
        this.wingBody_Y = 0.2;
        this.wingBody_Z = 2.6;
        this.wingBody_X_Segments = 1;
        this.wingBody_Y_Segments = 1;
        this.wingBody_Z_Segments = 1;
        //飞机后尾翼
        this.backWingBody_X = 0.5;
        this.backWingBody_Y = 0.2;
        this.backWingBody_Z = 1;


        //飞机前端的螺旋桨
        this.airScrewBody_X = 0.1;
        this.airScrewBody_Y = 3;
        this.airScrewBody_Z = 0.5;
        this.airScrew = new THREE.Group();
        this.airScrewMaterial = new THREE.MeshPhongMaterial({
            color : 0x503116,
            side : THREE.FrontSide,
            flatShading:true,
            wireframe : false
        });


        this.hindGeometry = null;

        this.sopilerGeometry = null;
        this.wingGeometry = null;
        this.hindWingGeometry = null;

        this.flyer = null;

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

        //移动时候的参数
        this.MaxAngle = Math.PI / 4;//最大角度
        this.CenterAngle = 0;//中间角度
        this.MinAngle = -1 * Math.PI / 4;//最小的角度
        this.ChangeAngle = 0.08;//角度变化率
        this.ChangeSpeed_X = 0.2;//X轴速度变化率
        this.ChangeSpeed_Y = 0.1;//Y轴速度变化率
        this.ChangeSpeed_Z = 0.2;//Z轴速度变化率
        this.Max_X = 11;
        this.Center_X = 5;
        this.Min_X = -1;
        this.Max_Y = 35;
        this.Center_Y = 32;
        this.Min_Y = 29;
        this.Max_Z = 35;
        this.Center_Z = 29;
        this.Min_Z = 27;

        /**--------------------------------------------**/
        /** direction >0 向正方向移动，<0 向负方向移动 **/
        /** =0没有移动                                 **/
        /** targetSite >0最近点，<0最远点 =0中间位置   **/
        /**--------------------------------------------**/
        this.statusX = {
            direction : 0,
            targetSite : 0
        };
        this.statusY = {
            direction : 0,
            targetSite : 0
        };
        this.statusZ = {
            direction : 0,
            targetSite : 0
        };

        //this.airScrewRotation = 0;// 螺旋桨转过的角度
        this.init();
    };
    plane.prototype = {
        init : function(){
            //机身的前半部分
            this.frontBodyGeometry = new THREE.BoxGeometry(
                this.frontBody_X,this.frontBody_Y,this.frontBody_Z,
                this.frontBody_X_Segments,this.frontBody_Y_Segments,this.frontBody_Z_Segments
            );

            //螺旋桨固定物
            const point_radius = 0.2;
            const point_height = 0.3;
            let pointGeometry = new THREE.ConeGeometry(point_radius,point_height,6,1);
            pointGeometry.rotateZ(-Math.PI / 2);
            pointGeometry.translate(this.frontBody_X / 2 + point_height / 2, 0, 0);
            this.frontBodyGeometry.merge(pointGeometry); // 图形结合

            this.frontBody = new THREE.Mesh(this.frontBodyGeometry,this.frontBodyMaterial);
            this.frontBody.castShadow = true;
            this.frontBody.receiveShadow = true;

            this.body.add(this.frontBody);


            //机身后半部分
            this.backBodyGeometry = new THREE.BoxGeometry(
                this.backBody_X ,this.backBody_Y, this.backBody_Z,
                this.backBody_X_Segments ,this.backBody_Y_Segments ,this.backBody_Z_Segments
            );
            //重新定义点的位置
            const backVertices = this.backBodyGeometry.vertices;
            const min_back_X =  - this.backBody_X / 2;
            for(var i = 0;i < backVertices.length; i ++){
                const item = backVertices[i];
                if( item.x === min_back_X ){
                    if(item.y < 0){
                        item.y = 0.5;
                        item.x = item.x + 0.2;
                    }
                    item.z = item.z / 10;
                }
            }
            this.backBodyGeometry.translate(( -this.frontBody_X - this.backBody_X ) / 2,0,0);
            this.backBody = new THREE.Mesh(this.backBodyGeometry,this.backBodyMaterial);

            this.backBody.castShadow = true;
            this.backBody.receiveShadow = true;

            this.body.add(this.backBody);

            //尾翼
            this.sopilerBodyGeometry = new THREE.BoxGeometry(
                this.sopilerBody_X ,this.sopilerBody_Y ,this.sopilerBody_Z,
                this.sopilerBody_X_Segments , this.sopilerBody_Y_Segments, this.sopilerBody_Z_Segments
            );
            const sopilerVertices = this.sopilerBodyGeometry.vertices;
            for(var i = 0;i < sopilerVertices.length ; i++){
                const item = sopilerVertices[i];
                if(item.x > 0 && item.y < 0){
                    item.x = item.x + 0.6;
                }
                if(item.x < 0 && item.y < 0){
                    item.x = item.x + 0.2;
                }
            }
            const sopilerSite_X = -this.frontBody_X / 2 - this.backBody_X + this.sopilerBody_X / 2 - 0.1;
            const sopilerSite_Y = ( this.backBody_Y + this.sopilerBody_Y ) / 2;
            this.sopilerBodyGeometry.translate(sopilerSite_X , sopilerSite_Y,0);
            this.sopilerBody = new THREE.Mesh(this.sopilerBodyGeometry,this.backBodyMaterial);
            this.sopilerBody.castShadow = true;
            this.sopilerBody.receiveShadow = true;

            this.body.add(this.sopilerBody);

            //机翼
            const wingBodyGeometry = new THREE.BoxGeometry(
                this.wingBody_X ,this.wingBody_Y ,this.wingBody_Z,
                this.wingBody_X_Segments, this.wingBody_Y_Segments ,this.wingBody_Z_Segments
            );
            const wingBodyVertices = wingBodyGeometry.vertices;
            for(var i =0 ;i < wingBodyVertices.length; i++){
                const item = wingBodyVertices[i];
                if(item.z > 0 && item.x < 0){
                    item.x = item.x - 0.5;
                }
                if(item.z > 0 && item.x > 0 ){
                    item.x = item.x - 1.6;
                }
            }
            const wingBody_1 = new THREE.Mesh(wingBodyGeometry,this.backBodyMaterial);
            wingBody_1.position.x = 0 - this.backBody_X  / 2 + 0.4;
            wingBody_1.position.y = 0.3;
            wingBody_1.position.z = ( this.wingBody_Z + this.backBody_Z ) / 2 - 0.6;
            wingBody_1.castShadow = true;
            wingBody_1.receiveShadow = true;
            this.body.add(wingBody_1);

            const wingBody_2 = new THREE.Mesh(wingBodyGeometry,this.backBodyMaterial);
            wingBody_2.rotateX(Math.PI);
            wingBody_2.position.x = 0 - this.backBody_X  / 2 + 0.4;
            wingBody_2.position.y = 0.3;
            wingBody_2.position.z = -( this.wingBody_Z + this.backBody_Z ) / 2 + 0.6;
            wingBody_2.castShadow = true;
            wingBody_2.receiveShadow = true;
            this.body.add(wingBody_2);

            const backWingBodyGeometry = new THREE.BoxGeometry(
                this.backWingBody_X ,this.backWingBody_Y ,this.backWingBody_Z,
                this.wingBody_X_Segments, this.wingBody_Y_Segments ,this.wingBody_Z_Segments
            );
            const backWingBodyVertices = backWingBodyGeometry.vertices;
            for(var i =0 ;i < backWingBodyVertices.length; i++){
                const item = backWingBodyVertices[i];
                if(item.z > 0 && item.x < 0){
                    item.x = item.x - 0.2;
                }
                if(item.z > 0 && item.x > 0 ){
                    item.x = item.x - 0.5;
                }
            }
            const backWingBody_1 = new THREE.Mesh(backWingBodyGeometry,this.backBodyMaterial);
            backWingBody_1.position.x = 0 - this.backBody_X - this.frontBody_X / 2 + this.backWingBody_X / 2;
            backWingBody_1.position.y = 0.8;
            backWingBody_1.position.z = ( this.backWingBody_Z + this.backBody_Z ) / 2 - 0.9;
            backWingBody_1.castShadow = true;
            backWingBody_1.receiveShadow = true;
            this.body.add(backWingBody_1);

            const backWingBody_2 = new THREE.Mesh(backWingBodyGeometry,this.backBodyMaterial);
            backWingBody_2.rotateX(Math.PI);
            backWingBody_2.position.x = 0 - this.backBody_X - this.frontBody_X / 2 + this.backWingBody_X / 2;
            backWingBody_2.position.y = 0.8;
            backWingBody_2.position.z = -( this.backWingBody_Z + this.backBody_Z ) / 2 + 0.9;
            backWingBody_2.castShadow = true;
            backWingBody_2.receiveShadow = true;
            this.body.add(backWingBody_2);

            //螺旋桨
            // const airScrewWidth = 0.1;
            // const airScrewHeight = 3;
            // const airScrewDepth = 0.5;
            // let airScrewGeometry_1 = new THREE.BoxGeometry(
            //     airScrewWidth,airScrewHeight,airScrewDepth,
            //     1,2,1
            // );
            // let airScrew_1 =  new THREE.Mesh(airScrewGeometry_1,this.airScrewMaterial);
            // airScrew_1.castShadow = true;
            // this.airScrew.add(airScrew_1);
            // let airScrew_2 =  new THREE.Mesh(airScrewGeometry_1,this.airScrewMaterial);
            // airScrew_2.rotation.x = Math.PI / 2;
            // airScrew_2.castShadow = true;
            // this.airScrew.add(airScrew_2);
            // this.airScrew.translateX(frontWidth + 0.15);
            // this.body.add(this.airScrew);

            //飞机起落架
            // let hindTireGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.1);
            //
            // let frontUndercarriageGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
            // let frontUndercarriage_1 = new THREE.Mesh(frontUndercarriageGeometry,this.hindMaterial);
            // frontUndercarriage_1.rotation.z = Math.PI / 10;
            // frontUndercarriage_1.position.set(0, -1, -0.8);
            // this.body.add(frontUndercarriage_1);
            // let frontUndercarriage_2 = new THREE.Mesh(frontUndercarriageGeometry,this.hindMaterial);
            // frontUndercarriage_2.rotation.z = Math.PI / 10;
            // frontUndercarriage_2.position.set(0, -1, 0.8);
            // this.body.add(frontUndercarriage_2);
            //
            // let hindUndercarriageGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
            // let hindUndercarriage = new THREE.Mesh(hindUndercarriageGeometry,this.hindMaterial);
            // hindUndercarriage.rotation.z = -1 * Math.PI / 8;
            // hindUndercarriage.position.set(-hindHeight + 0.2,-0.4,0);
            // this.body.add(hindUndercarriage);
            //
            // let hindTire1 = new THREE.Mesh(hindTireGeometry,this.tireMaterial);
            // hindTire1.position.set(0.05, -1.2, 0.8);
            // this.body.add(hindTire1);
            // let hindTire2 = new THREE.Mesh(hindTireGeometry,this.tireMaterial);
            // hindTire2.position.set(0.05, -1.2, -0.8);
            // this.body.add(hindTire2);
            // let hindTire3 = new THREE.Mesh(hindTireGeometry,this.tireMaterial);
            // hindTire3.position.set(-hindHeight + 0.15,-0.6,0);
            // this.body.add(hindTire3);

            //挡风玻璃
            // let frontGlassGeometry = new THREE.BoxGeometry(0.05, 0.7, 1.2);
            // let frontGlass = new THREE.Mesh(frontGlassGeometry,this.glassMaterial);
            // frontGlass.position.set( -1, frontHeight / 2 - 0.1, 0 );
            // this.body.add(frontGlass);

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
        },
        checkstatus : function(){

        },
        move : function(){
            this.checkstatus();
            //在X轴的移动
            let position = this.body.position; // 当前的位置
            let rotation = this.body.rotation; // 转过的角度

            if(this.statusX.direction > 0){
                //向‘+’方向移动
                if(this.statusX.targetSite == 0){
                    //移动到中间位置
                    if(position.x <= this.Center_X){
                        position.x += this.ChangeSpeed_X;
                    }
                }else{
                    //移动到最右边
                    if(position.x <= this.Max_X){
                        position.x += this.ChangeSpeed_X;
                    }
                }
            }else if(this.statusX.direction < 0){
                //向‘-’方向移动
                if(this.statusX.targetSite == 0){
                    //移动到中间位置
                    if(position.x >= this.Center_X){
                        position.x -= this.ChangeSpeed_X;
                    }
                }else{
                    //移动到最左边
                    if(position.x >= this.Min_X){
                        position.x -= this.ChangeSpeed_X;
                    }
                }
            }

            //在Y轴的移动
            if(this.statusY.direction > 0){
                //向Y轴正方向移动(向上移动)
                if(this.statusY.targetSite == 0){
                    if(position.y <= this.Center_Y){
                        position.y += this.ChangeSpeed_Y;
                    }
                }else{
                    if(position.y <= this.Max_Y){
                        position.y += this.ChangeSpeed_Y;
                    }
                }
            }else if (this.statusY.direction < 0){
                //向Y轴负方向移动（向下移动）
                if(this.statusY.targetSite == 0){
                    if(position.y >= this.Center_Y){
                        position.y -= this.ChangeSpeed_Y;
                    }
                }else{
                    if(position.y >= this.Min_Y){
                        position.y -= this.ChangeSpeed_Y;
                    }
                }
            }
            //在Z轴进行移动
            if(this.statusZ.direction > 0){
                //向Z轴正方向移动（近处）
                if(this.statusZ.targetSite == 0){
                    if(position.z <= this.Center_Z){
                        position.z += this.ChangeSpeed_Z;
                    }
                    if(rotation.x <= this.CenterAngle){
                        this.body.rotation.x += this.ChangeAngle;
                    }
                }else{
                    if(position.z <= this.Max_Z){
                        position.z += this.ChangeSpeed_Z;
                    }
                    if(rotation.x <= this.MaxAngle){
                        this.body.rotation.x += this.ChangeAngle;
                    }
                }
            }else if(this.statusZ.direction < 0){
                //向Z轴负方向移动（远处）
                if(this.statusZ.targetSite == 0){
                    if(position.z >= this.Center_Z){
                        position.z -= this.ChangeSpeed_Z;
                    }
                    if(rotation.x >= this.CenterAngle){
                        this.body.rotation.x -= this.ChangeAngle;
                    }
                }else{
                    if(position.z >= this.Min_Z){
                        position.z -= this.ChangeSpeed_Z;
                    }
                    if(rotation.x >= this.MinAngle){
                        this.body.rotation.x -= this.ChangeAngle;
                    }
                }
            }
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
            for(let i=0;i<this.hairArray.length;i++){
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
        this.MoveSpeed = 0.1 + Math.random() * 0.2;
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
            this.body.scale.set(0.8,0.8,0.8);
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

    let seaBirds = function(scene){
        this.scene = scene;
        this.body = new Array();
        this.position = null;// x,y,z
        this.preStartTime = new Date().getTime();
        this.FIXEDINTERVAL = 7;
        this.INTERVAL = (this.FIXEDINTERVAL + Math.round(Math.random() * 2)) * 1000;
        this.MIN_POSX = -40;
    };
    seaBirds.prototype = {
        createBird :function(num){
            let y = this.position.y;
            let z = this.position.z;
            switch (num){
                case 0:
                    //生成单个
                    let bird = new seaBird();
                    bird.body.position.set(Math.random() * 20 + 30,y,z);
                    bird.build(this.scene);
                    this.body.push(bird);
                    break;
                case 1:
                    //生成多个
                    let num = Math.ceil(Math.random() * 3) + 1;
                    let x1 = Math.random() * 20 + 30;
                    for(let i = 0;i < num;i ++){
                        let bird = new seaBird();
                        bird.body.position.set(x1 + 3 * i,y,z);
                        bird.build(this.scene);
                        this.body.push(bird);
                    }
                    break;
                case 2:
                    //
                    let num2 = 6;
                    let x2 = Math.random() * 20 + 30;
                    for(let i = 0;i < num2;i ++){
                        let bird = new seaBird();
                        bird.body.position.set(x2 + 3 * i,y + Math.sin(Math.PI / 2 *i) * 2,z);
                        bird.build(this.scene);
                        this.body.push(bird);
                    }
                    break;
                case 3:
                    let num3 = 5;
                    let x3 = Math.random() * 20 + 30;
                    let P = Math.pow(-1,Math.floor(Math.random() * 2));
                    for(let i = 0;i < num3;i ++){
                        let bird = new seaBird();
                        bird.body.position.set(x3 + P * 3 * i,y + 2 *i - 5,z);
                        bird.build(this.scene);
                        this.body.push(bird);
                    }
                    break;

            }
        },
        move : function(){
            //获取当前系统时间
            this.position = {
                x : 0,
                y : Math.random() * 7 + 26,
                z : 25
            };
            let curTime = new Date().getTime();
            let calculateTime = this.preStartTime + this.INTERVAL;
            if(curTime >= calculateTime){
                let num = Math.floor(Math.random() * 4);
                this.createBird(num);
                this.preStartTime = curTime;
                this.INTERVAL = (this.FIXEDINTERVAL + Math.round(Math.random() * 2)) * 1000;
            }
            for(let j = 0;j < this.body.length;j ++){
                let bird = this.body[j];
                bird.body.position.x -= 0.1;
                bird.move();
                let x = bird.body.position.x;
                if(x < this.MIN_POSX){
                    this.scene.remove(bird.body);
                    this.body.splice(j,1);
                    break;
                }
            }
        }
    };
    window.seaBirds = seaBirds;
})(window);