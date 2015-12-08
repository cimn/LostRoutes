/**
 * Created by cimn on 2015/12/8.
 */
var Figether = cc.PhysicsSprite.extend({
    hitPoints: true,        //当前的生命值
    space: null,            //所在的物理空间
    ctor: function(spriteFrameName,space){
        this._super(spriteFrameName);
        this.space = space;

        var verts = [
            -94,31.5,
            -52,64.5,
            57,66.5,
            96,33.5,
            0,-80.5
        ];

        this.body = new cc.Body(1,cp.momentForPoly(1,verts,cp.vzero));
        this.body.data = this;
        this.space.addBody(this.body);

        var shape = new cp.PolyShape(this.body,verts,cp.vzero);
        shape.setElasticity(0.5);
        shape.setFriction(0.5);
        shape.setCollisionType(Collision_Type);
        this.space.addShape(shape);

        this.hitPoints = Fighter_hitPoints;

        var ps = new cc.ParticleSystem(res.fire_plist);
        //飞机下面
        ps.x = this.getContentSize().width / 2;
        ps.y = 0;
        ps.setScale(0.5);
        this.addChild(ps);
    },
    setPosition: function(newPosition){

    }
})