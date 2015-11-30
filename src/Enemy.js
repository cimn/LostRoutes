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
        //����֡
        var enemyFramName = EnemyName.Enemy_Stone;
        //�÷�ֵ
        var hitPointsTemp = 0;
        //�ٶ�
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

        //���ݾ���֡�����ø��๹�캯��
        this._super("#"+enemyFramName);
        this.setVisible(false);



    }
})