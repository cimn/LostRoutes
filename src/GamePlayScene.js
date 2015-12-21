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
            this.collisionBegin.bind(this), null, null, null
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

        //创建---事件监听
        this.touchFighterlistener = new cc.EventListener.create({
            evnet: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch,event){
                return true;
            },
            onTouchMoved: function(touch,evnet){
                cc.log("onTouchMoved!");
                var target = evnet.getCurrentTarget();
                var delta = touch.getDelta();
                //移动当前按钮精灵的坐标位置
                var pos_x = target.body.getPos().x + delta.x;
                var pos_y = target.body.getPos().y + delta.y;
                target.body.setPos(cc.p(pos_x,pos_y));
            }
        });
        //注册---事件监听
        cc.eventManager.addListener(this.touchFighterlistener,this.fighter);
        this.touchFighterlistener.retain();

        //every 0.3 second one bullet
        this.schedule(this.shootBullet, 0.2);

        //this.updateStatusBarFighter();

        //this.updateStatusBarScore();
    },
    collisionBegin:function(arbiter, space){
        var shapes = arbiter.getShape();
        var bodyA = shapes.getBody();
        var bodyB = shapes.getBody();

        var spriteA = bodyA.data;
        var spriteB = bodyB.data;




    },
    menuPauseCallback: function(){

    },
    shootBullet: function(){

    }
});

    var GamePlayScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        var layer = new GamePlayLayer;
        this.addChild(layer);
    }

});