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

        this.space = new cp.Space();
        //this.setupDebugNode();
        // 设置重力
        this.space.gravity = cp.v(0, 0);//cp.v(0, -100);
        this.space.addCollisionHandler(Collision_Type.Bullet, Collision_Type.Enemy,
            this.collisionBegin.bind(this), null, null, null
        );


    },
    initBG: function(){

    }
});

    var GamePlayScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        var layer = new GamePlayLayer;
        this.addChild(layer);
    }

});