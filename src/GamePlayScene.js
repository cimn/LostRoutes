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
        sprite1.setPosition(cc.p(-50, -50));
        this.addChild(sprite1,0,GameSceneNodeTag.BatchBackground);

        var ac1 = cc.moveBy(20,cc.p(500, 600));
        var ac2 = ac1.reverse();
        var as1 = cc.sequence(ac1,ac2);
        sprite1.runAction(cc.repeatForever(new cc.EaseSineInOut(as1)));

        //bg---sprite2
        var sprite2 = new cc.Sprite("#gameplay.bg.sprite-2.png");
        sprite2.setPosition(cc.p(winSize.width, 0));
        this.addChild(sprite2,0,GameSceneNodeTag.BatchBackground);

        var ac3 = cc.moveBy(10,cc.p(-600,600));
        var ac4 = ac3.reverse();
        var as2 = cc.sequence(ac3,ac4);
        sprite2.runAction(cc.repeatForever(new cc.EaseExponentialInOut(as2)));

        //init Btn_pause
        var pauseMenuItem = new cc.MenuItemImage(
            "#button.pause.png", "#button.pause.png",
            this.menuPauseCallback,this);

        var pauseMenu = new cc.Menu(pauseMenuItem);
        pauseMenu.setPosition(cc.p(30,winSize.height - 30));
        this.addChild(pauseMenu, 200, 999);

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
        this.fighter = new Fighter("#gameplay.fighter.png", this.space);
        this.fighter.setPosition(cc.p(winSize.width / 2, 100));
        this.addChild(this.fighter,10,GameSceneNodeTag.Fighter);

        //创建触摸飞机事件监听
        this.touchFighterlistener = new cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch,event){
                return true;
            },
            onTouchMoved: function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                //移动当前精灵的坐标位置
                var pos_x = target.body.getPos().x + delta.x;
                var pos_y = target.body.getPos().y + delta.y;
                target.setPosition(cc.p(pos_x,pos_y));
            }
        });
        //注册监听器
        cc.eventManager.addListener(this.touchFighterlistener,this.fighter);
        this.touchFighterlistener.retain(); //if in jsb

        //状态栏中设置玩家生命值
        this.updateStatusBarFighter();
        //状态栏中显示得分
        this.updateStatusBarScore();

        //每0.2s 调用shootBullet函数发射1发炮弹.
        this.schedule(this.shootBullet, 0.2);


    },

    //////////////////////////////////Begin//////////////////////////////////
    collisionBegin: function(arbiter,space){
        var shapes = arbiter.getShapes();
        var bodyA = shapes[0].getBody();
        var bodyB = shapes[1].getBody();

        var spriteA = bodyA.data;
        var spriteB = bodyB.data;
        //enemy collision bullet
        //bullet.prototype 是否存在于参数 spriteA 的原型链上 && enemy.prototype是否存在于参数 spriteB 的原型链上
        if(spriteA instanceof Bullet && spriteB instanceof Enemy && spriteB.isVisible()){
            spriteA.setVisible(false);      //bullet 消失
            cc.pool.putInPool(spriteA);
            this.handleBulletCollidingWithEnemy(spriteB);
            return false;
        }
        //enemy.prototype 是否存在于参数 spriteA 的原型链上 && bullet.prototype是否存在于参数 spriteB 的原型链上
        if(spriteA instanceof Enemy && spriteA.isVisible() && spriteB instanceof Bullet){
            spriteB.setVisible(false);
            cc.pool.putInPool(spriteB);
            this.handleBulletCollidingWithEnemy(spriteA);
            return false;
        }
        //fighter collision enemy
        //Fighter.prototype 是否存在于参数 spriteA 的原型链上 && enemy.prototype是否存在于参数 spriteB 的原型链上
        if(spriteA instanceof Fighter && spriteB instanceof Enemy && spriteB.isVisible()){
            this.handleFighterCollidingWithEnemy(spriteB);
            return false;
        }
        //enemy.prototype 是否存在于参数 spriteA 的原型链上 && Fighter.prototype是否存在于参数 spriteB 的原型链上
        if(spriteA instanceof Enemy && spriteA.isVisible() && spriteB instanceof Fighter){
            this.handleFighterCollidingWithEnemy(spriteA);
        }
        return false;
    },
    update: function (dt) {
        var timeStep = 0.03;
        this.space.step(timeStep);
    },
    handleBulletCollidingWithEnemy: function (enemy) {
        enemy.hitPoints--;
        if(enemy.hitPoints == 0){
            var node = this.getChildByTag(GameSceneNodeTag.ExplosionParticleSystem);
            if(node){
                this.removeChild(node);
            }
            //爆炸粒子特效
            var explosion = new cc.ParticleSystem(res.explosion_plist);
            explosion.x = enemy.x;
            explosion.y = enemy.y;
            this.addChild(explosion,2,GameSceneNodeTag.ExplosionParticleSystem);
            //爆炸音效
            if(effectStatus ==BOOL.YES){
                cc.audioEngine.playEffect(res_platform.effectExplosion);
            }

            switch (enemy.enemyType){
                case EnemyTypes.Enemy_Stone:
                    this.score += EnemyScores.Enemy_Stone;
                    this.scorePlaceholder += EnemyScores.Enemy_Stone;
                    break;
                case EnemyTypes.Enemy_1:
                    this.score += EnemyScores.Enemy_1;
                    this.scorePlaceholder += EnemyScores.Enemy_1;
                    break;
                case EnemyTypes.Enemy_2:
                    this.score += EnemyScores.Enemy_2;
                    this.scorePlaceholder += EnemyScores.Enemy_2;
                    break;
                case EnemyTypes.Enemy_Planet:
                    this.score += EnemyScores.Enemy_Planet;
                    this.scorePlaceholder += EnemyScores.Enemy_Planet;
                    break;
            }
            //每获得1000分，生命值+1，scorePlaceholder = 0;
            if(this.scorePlaceholder >= 1000){
                this.fighter.hitPoints++;
                this.scorePlaceholder -= 1000;
                this.updateStatusBarFighter();
            }
            this.updateStatusBarScore();
            //敌人消失
            enemy.setVisible(false);
            enemy.spawn();
        }
    },
    //处理玩家与敌人的碰撞检测
    handleFighterCollidingWithEnemy: function (enemy) {
        var node = this.getChildByTag(GameSceneNodeTag.ExplosionParticleSystem);
        if(node){
            this.removeChild(node);
        }
        var explosion = new cc.ParticleSystem(res.explosion_plist);
        explosion.x = this.fighter.x;
        explosion.y = this.fighter.y;
        this.addChild(explosion, 2, GameSceneNodeTag.ExplosionParticleSystem);
        if(effectStatus ==BOOL.YES){
            cc.audioEngine.playEffect(res_platform.effectExplosion);
        }
        //--enemy 消失
        enemy.setVisible(false);
        enemy.spawn();
        //--fighter 消失
        this.fighter.hitPoints--;
        this.updateStatusBarFighter();
        //--game over
        if(this.fighter.hitPoints <= 0){
            cc.log("GameOver");
            var scene = new GameOverScene();
            var layer = new GameOverLayer(this.score);
            scene.addChild(layer);
            cc.director.pushScene(new cc.TransitionFade(1.0,scene));
        }else{
            this.fighter.setPosition(cc.p(winSize.width / 2, 100));     //引用重写setPosition*相当于.body.setPos*
            var blink = cc.blink(0.8,4);
            this.fighter.setCascadeOpacityEnabled(true);
            this.fighter.runAction(blink);
        }
    },
    ////////////////////////////////// End //////////////////////////////////
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
            //var bullet = new Bullet("#gameplay.bullet.png", this.space);
            var bullet = Bullet.create("#gameplay.bullet.png",this.space);
            bullet.velocity = Sprite_Velocity.Bullet;
            if(bullet.getParent() == null){
                this.addChild(bullet, 0, GameSceneNodeTag.Bullet);
                cc.pool.putInPool(this.bullet);
            }
            bullet.shootBulletFromFighter(cc.p(this.fighter.x, this.fighter.y + this.fighter.getContentSize().height/2));
        }
    },
    //在状态栏中设置玩家的生命值
    updateStatusBarFighter: function () {
        //生命值UI
        var n = this. getChildByTag(GameSceneNodeTag.StatusBarFighterNode);
        if(n){
            this.removeChild(n);
        }
        var fg = new cc.Sprite("#gameplay.life.png");
        fg.x = winSize.width - 80;
        fg.y = winSize.height -28;
        this.addChild(fg, 20, GameSceneNodeTag.StatusBarFighterNode);
        //UI x 生命值
        var n2 = this.getChildByTag(GameSceneNodeTag.StatusBarLifeNode);
        if(n2){
            this.removeChild(n2);
        }
        if(this.fighter.hitPoints<0){
            this.fighter.hitPoints = 0;
        }
        var lifeLabel = new cc.LabelBMFont("X" + this.fighter.hitPoints, res.BMFont_fnt);
        lifeLabel.x = fg.x + 40;
        lifeLabel.y = fg.y;
        lifeLabel.setScale(0.5);
        this.addChild(lifeLabel, 20, GameSceneNodeTag.StatusBarLifeNode);
    },
    //在状态栏中显示得分
    updateStatusBarScore: function () {
        cc.log("this.score =  " + this.score);
        //移除上一次的精灵
        var n = this.getChildByTag(GameSceneNodeTag.StatusBarScore);
        if(n){
            this.removeChild(n);
        }
        //更新分数
        var scoreLabel = new cc.LabelBMFont(this.score,res.BMFont_fnt);
        scoreLabel.setScale(0.8);
        scoreLabel.x = winSize.width / 2;
        scoreLabel.y = winSize.height -30;

        this.addChild(scoreLabel, 20, GameSceneNodeTag.StatusBarScore);
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
    onExitTransitionDidStart: function () {
        this._super();
        cc.log("GamePlayLayer onExitTransitionDidStart");
        //stop bgm
        cc.audioEngine.stopMusic(res_platform.musicGame);
    },
    onEnter: function () {
        this._super();
        cc.log("GamePlayLayer onEnter");
    },
    onEnterTransitionDidFinish: function(){
        this._super();
        cc.log("GamePlayLayer onEnterTransitionDidFinish");
        if(musicStatus == BOOL.YES){
            //play bgm
            cc.audioEngine.playMusic(res_platform.musicGame,true);
        }
    }
});

var GamePlayScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        var layer = new GamePlayLayer();
        this.addChild(layer);
    }

});