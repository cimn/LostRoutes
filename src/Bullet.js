/**
 * Created by cimn_HJ on 2015/12/9.
 */
var Bullet =  cc.PhysicsSprite.extend({
    space: null,        //所在的物理空间
    velocity: 0,        //速度
    ctor: function(spriteFrameName,space){
        this._super(spriteFrameName);   //以精灵帧名来初始化父类函数
        //this.spriteFrameName = spriteFrameName;
        this.space = space;
        this.body = new cp.Body(1,cp.momentForBox(1,this.getContentSize().width,this.getContentSize().height));
        this.space.addBody(this.body);


        var shape = new cp.BoxShape(this.body,this.getContentSize().width,this.getContentSize().height);
        shape.setElasticity(0.5);
        shape.setFriction(0.5);
        shape.setCollisionType(Collision_Type.Bullet);
        this.space.addShape(shape);
        this.setBody(this.body);
        this.body.data = this;
    },
    shootBulletFromFighter: function(p){
        this.body.data = this;
        this.body.setPos(p);
        this.scheduleUpdate();
    },
    update: function(dt){
        //计算移动距离
        this.body.setPos(cc.p(this.body.getPos().x + this.velocity.x * dt,this.body.getPos().y + this.velocity.y * dt));
        if(this.body.getPos().y > winSize.height){
            this.unscheduleUpdate();
            this.body.data = null;
            this.removeFromParent();
        }
    },
    unuse: function(){
        this.retain();  //if in jsb
        this.setVisible(false);
    },
    reuse: function(spriteFrameName,space){
        this.spriteFrameName = spriteFrameName;
        this.space = space;
        this.setVisible(true);
    }
});

    //pool对象缓冲池的使用
Bullet.create = function(spriteFrameName,space){
    if(cc.pool.hasObject(Bullet)) {
        return cc.pool.getFromPool(Bullet, spriteFrameName, space);
    } else {
        return new Bullet(spriteFrameName, space);
    }
};