/**
 * Created by cimn_HJ on 2015/12/9.
 */
var Bullet = new cc.PhysicsSprite.extend({
    space: null,        //所在的物理空间
    velocity: 0,        //速度
    ctor: function(spriteFrameName,space){
        this._super(spriteFrameName);   //以精灵帧名来初始化父类函数
        this.spriteFrameName = spriteFrameName;
        this.space = space;
        this.body = new cp.Body(1,cp.momentForBox(1,this.getContentSize().width,this.getContentSize().height));
        this.space.addBody(this.body);


        this.shape = new cp.BoxShape(this.body,this.getContentSize().width,this.getContentSize().height);
        shape.setElasticity(0.5);
        shape.setFriction(0.);
        shape.setCollisionType(Collision_Type.Bullet);
        this.space.addShape(shape);
        this.setBody(this.body);
        this.body.data = this;
    },
    shootBulletFromFighter: function(p){

    }
})