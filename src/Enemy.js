/**
 * Created by cimn on 2015/11/29.
 */
var Enemy = cc.PhysicsSprite.extend({
    enemyType: 0,
    initialHitPoints: 0,
    hitPoints: 0,
    velocity: null,
    space: null,
    ctor: function(enemyType,space){
        //精灵帧
        var enemyFramName = EnemyName.Enemy_Stone;
        //得分值
        var hitPointsTemp = 0;
        //速度
        var velocityTemp = cc.p(0,0);
        switch (enemyType){
            case  EnemyTypes.Enemy_Stone:
                enemyFramName = EnemyTypes.Enemy_Stone;
                hitPointsTemp = Enemy_initialHitPoints.Enemy_Stone;
                velocityTemp = Sprite_Velocity.Enemy_Stone;
                break;
            case EnemyTypes.Enemy_1:
                enemyFramName = EnemyTypes.Enemy_1;
                hitPointsTemp = Enemy_initialHitPoints.Enemy_1;
                velocityTemp = Sprite_Velocity.Enemy_1;
                break;
            case EnemyTypes.Enemy_2:
                enemyFramName = EnemyTypes.Enemy_2;
                hitPointsTemp = Enemy_initialHitPoints.Enemy_2;
                velocityTemp = Sprite_Velocity.Enemy_2;
                break;
            case EnemyTypes.Enemy_Planet:
                enemyFramName = EnemyTypes.Enemy_Planet;
                hitPointsTemp = Enemy_initialHitPoints.Enemy_Planet;
                velocityTemp = Sprite_Velocity.Enemy_Planet;
                break;
        }

        //根据精灵帧名调用父类构造函数init
        this._super("#"+enemyFramName);
        this.setVisible(false);

        this.initialHitPoints = hitPointsTemp;

        this.velocity = velocityTemp;

        this.enemyType = enemyType;


        this.space = space;



        var shape;

        if(enemyType == EnemyTypes.Enemy_Stone || enemyType == EnemyTypes.Enemy_Planet){

        }




    }
})