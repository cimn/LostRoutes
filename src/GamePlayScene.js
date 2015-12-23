/**
 * Created by cimn_HJ on 2015/11/28.
 */
var GamePlayLayer = cc.Layer.extend({
    score: 0,           //分数
    scorePlaceholder: 0,        //记录0-999分数
    fighter: null,
    touchFighterlistener: null,
    menu: null,
    space: null,

    ctor: function(){
        cc.log("GamePlayLayer ctor");
        //init
        this._super();
        this.initPhysics();
        this.initBG();
        this.scheduleUpdate();
        return true;
    },
    initPhysics: function(){
        //init物理空间
        this.space = new cp.Space();
        //this.setupDebugNode();
        // 设置重力
        this.space.gravity = cp.v(0, 0);//cp.v(0, -100);
        this.space.addCollisionHandler(Collision_Type.Bullet, Collision_Type.Enemy,
            this.collisionBegin.bind(this), null, null, null    //回调开始前，回调开始时，回调结束时，回调结束后
        );


    },
    initBG: function(){
        //loading bg
        var bg = new cc.TMXTiledMap(res.blue_bg_tmx);
        this.addChild(bg,0,GameSceneNodeTag.BatchBackground);

        //bg Effects---Particle---
        var ps = new cc.ParticleSystem(res.light_plist);
        ps.x = winSize.width / 2;
        ps.y = winSize.height / 2;
        this.addChild(ps,0,GameSceneNodeTag.BatchBackground);

        //bg---sprite
        var sprite1 = new cc.Sprite("#gameplay.bg.sprite-1.png");
        sprite1.setPosition(cc.p(-50,-50));
        this.addChild(sprite1,0,GameSceneNodeTag.BatchBackground);

        var ac1 = cc.MoveBy(20,cc.p(500, 600));
        var ac2 = ac1.reverse();
        var as1 = cc.sequence(ac1,ac2);
        sprite1.runAction(cc.repeatForever(new cc.EaseBackInOut(as1)));

        //bg---sprite2
        var sprite2 = new cc.Sprite("#gameplay.bg.sprite-2.png");
        sprite2.setPosition(cc.p(winSize.width,0));
        this.addChild(sprite2,0,GameSceneNodeTag.BatchBackground);

        var ac3 = cc.MoveBy(10,cc.p(-600,600));
        var ac4 = ac3.reverse();
        var as2 = cc.sequence(ac3,ac4);
        sprite2.runAction(cc.repeatForever(new cc.EaseExponentialInOut(as2)));

        //init Btn_pause
        var pauseMenuItem = new cc.MenuItemImage(
            "#button.pause.png", "#button.pause.png",
            this.menuPauseCallback,this);

        var pauseMenu = new cc.Menu(pauseMenuItem);
        pauseMenu.setPosition(cc.p(30,winSize.height-30));
        this.addChild(pauseMenu);

        //add stone1
        var stone1 = new Enemy(EnemyTypes.Enemy_Stone,this.space);
        this.addChild(stone1,10,GameSceneNodeTag.BatchBackground);

        //add planet
        var planet = new Enemy(EnemyTypes.Enemy_Planet,this.space);
        this.addChild(planet,10,GameSceneNodeTag.Enemy);

        //add EnemyFighter1
        var enemyFighter1 = new Enemy(EnemyTypes.Enemy_1,this.space);
        this.addChild(enemyFighter1,10,GameSceneNodeTag.Enemy);

        //add EnemyFighter2
        var enemyFighter2 = new Enemy(EnemyTypes.Enemy_2,this.space);
        this.addChild(enemyFighter2,10,GameSceneNodeTag.Enemy);

        //player
        this.fighter = new Figether("#gameplay.fighter.png", this.space);
        this.fighter.body.setPos(cc.p(winSize.width / 2, 70));
        this.addChild(this.fighter,10,GameSceneNodeTag.Fighter);

        //创建触摸飞机事件监听
        this.touchFighterlistener = new cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch,event){
                return true;
            },
            onTouchMoved: function(touch,evnet){
                var target = evnet.getCurrentTarget();
                var delta = touch.getDelta();
                //移动当前精灵的坐标位置
                var pos_x = target.body.getPos().x + delta.x;
                var pos_y = target.body.getPos().y + delta.y;
                target.body.setPos(cc.p(pos_x,pos_y));
            }
        });
        //注册监听器
        cc.eventManager.addListener(this.touchFighterlistener,this.fighter);
        this.touchFighterlistener.retain(); //if in jsb

        //状态栏中设置玩家生命值
        this.updataStatusBarFighter();
        //状态栏中显示得分
        this.updataStatusBarScore();

        //每0.2s 调用shootBullet函数发射1发炮弹.
        this.schedule(this.shootBullet, 0.2);


    },
    menuPauseCallback: function(sender){
        //播放音效
        if(effectStatus == BOOL.YES){
            cc.audioEngine.playEffect(res_platform.effectBlip);
        }
        var nodes = this.getChildren();
        for(var i=0;i < nodes.length;i++){
            var node = nodes[i];
            node.unscheduleUpdate();
            this.unschedule(this.shootBullet);
        }
        //暂停touchEvent
        cc.eventManager.pauseTarget(this.fighter);

        //返回主菜单
        var backNormal =new cc.Sprite("#button.back.png");
        var backSelected = new cc.Sprite("#button.back-on.png");

        var backMenuItem = new cc.MenuItemSprite(backNormal,backSelected,
            function (sender) {
                //play effect
                if(effectStatus == BOOL.YES){
                    cc.audioEngine.playEffect(res_platform.effectBlip);
                }
                cc.director.popScene();
            },this);

        //继续游戏菜单
        var resumeNormal = new cc.Sprite("#button.resume.png");
        var resumeSelected = new cc.Sprite("#button.resume-on.png");
        var resumeMenuItem = new cc.MenuItemSprite(resumeNormal,resumeSelected,
            function (sender) {
                //play effect
                if(effectStatus == BOOL.YES){
                    cc.audioEngine.playEffect(res_platform.effectBlip);
                }
                var nodes = this.getChildren();
                for(var i =0;i < nodes.length; i++){
                    var node = nodes[i];
                    node.scheduleUpdate();
                    this.schedule(this.shootBullet,0.2);
                }
                cc.eventManager.resumeTarget(this.fighter);
                this.removeChild(this.menu);

            },this);
        this.menu = new cc.Menu(backMenuItem,resumeMenuItem);
        this.menu.alignItemsVertically();
        this.menu.x = winSize.width / 2;
        this.menu.y = winSize.height / 2;
        this.addChild(this.menu,20,1000)
    },
    //Fighter shoot bullet
    shootBullet:function(dt){
        if(this.fighter && this.fighter.isVisible()){
            var bullet = Bullet.create("#gameplay.bullet.png",this.space);
            bullet.velocity = Sprite_Velocity.Bullet;
            if(bullet.getParent() == null){
                this.addChild(bullet, 0, GameSceneNodeTag.Bullet);
                cc.pool.putInPool(this.bullet);
            }
            bullet.shootBulletFromFighter(cc.p(this.fighter.x, this.fighter.y + this.fighter.getContentSize().height/2));
        }
    },
    //////////////////////////////////Begin//////////////////////////////////
    collisionBegin: function(arbiter,space){
        var shapes = arbiter.getShapes();
        var bodyA = shapes[0].getBody();
        var bodyB = shapes[1].getBody();

        var spriteA = bodyA.data;
        var spriteB = bodyB.data;

        //bullet.prototype 是否存在于参数 spriteA 的原型链上 && enemy.prototype是否存在于参数 spriteB 的原型链上
        if(spriteA instanceof Bullet && spriteB instanceof Enemy && spriteB.isVisible()){
            spriteA.setVisible(false);      //bullet 消失
            cc.pool.putInPool(spriteA);
            this.handleBulletCollidingWithEnemy(spriteA);
            return false;
        }
        if(spriteA instanceof Enemy && spriteA.isVisible() && spriteB instanceof Bullet){
            spriteB.setVisible(false);
            cc.pool.putInPool(spriteB);
            this.handleBulletCollidingWithEnemy(spriteB);
            return false;
        }
        return false;
    },
    handleBulletCollidingWithEnemy: function () {

    },
    onExit: function(){
        cc.log("GamePlayLayer onExit");
        this.unscheduleUpdate();
        //停止shootBullet
        this.unschedule(this.shootBullet);
        //注销监听器
        if(this.touchFighterlistener != null){
            cc.eventManager.removeListener(this.touchFighterlistener);
            this.touchFighterlistener.release(); //release内存
            this.touchFighterlistener = null;
        }
        this.removeAllChildren(true);
        cc.pool.drainAllPools();
        this._super();
    },
    onEnterTransitionDidFinish: function(){
        this._super();
        cc.log("GamePlayLayer onEnterTransitionDidFinish");
        if(musicStatus == BOOL.YES){
            //play bg
            cc.audioEngine.playMusic(res_platform.musicGame,true);
        }
    }
});

var GamePlayScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        var layer = new GamePlayLayer;
        this.addChild(layer);
    }

});