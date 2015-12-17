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

        //bg Effects---Particle
        var ps = new cc.ParticleSystem(res.light_plist);
        ps.x = winSize.width / 2;
        ps.y = winSize.height / 2;
        this.addChild(ps,0,GameSceneNodeTag.BatchBackground);
    }
});

    var GamePlayScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        var layer = new GamePlayLayer;
        this.addChild(layer);
    }

});