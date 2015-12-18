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

        //add stone

    },
    menuPauseCallback: function(){

    }
});

    var GamePlayScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        var layer = new GamePlayLayer;
        this.addChild(layer);
    }

});