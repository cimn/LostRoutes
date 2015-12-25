/**
 * Created by cimn_HJ on 2015/12/24.
 */
var GameOverLayer = cc.Layer.extend({
    score: 0,   //last score
    touchListener: null,
    ctor: function (score) {
        cc.log("GameOverLayer ctor");
        //init first
        this._super();
        this.score = score;

        var bg = new cc.TMXTiledMap(res.blue_bg_tmx);
        this.addChild(bg);
        //bg--particle
        var ps = new cc.ParticleSystem(res.light_plist);
        ps.x = winSize.width / 2;
        ps.y = winSize.height / 2 - 100;
        this.addChild(ps);

        //bg--png
        var page = new cc.Sprite("#gameover.page.png");
        page.x = winSize.width /2;
        page.y = winSize.height -300;
        this.addChild(page);

        var highscore =  cc.sys.localStorage.getItem(HIGHSCORE_KEY);
        highscore = highscore == null ? 0 : highscore;
        if(highscore < this.score){
            highscore = this.score;
            cc.sys.localStorage.setItem(HIGHSCORE_KEY,highscore);  //setItem(KEY,value);
        }

        //最高分UI
        var hscore = new cc.Sprite("#Score.png");
        hscore.x = 300;
        hscore.y = winSize.height - 650;
        this.addChild(hscore);

        var highScoreLabel = new cc.LabelBMFont(highscore,res.BMFont_fnt);
        highScoreLabel.x = hscore.x;
        highScoreLabel.y = hscore.y - 80;
        this.addChild(highScoreLabel);

        var tap = new cc.Sprite("#Tap.png");
        tap.x = winSize.width /2;
        tap.y = winSize.height - 860;
        this.addChild(tap);

        //创建监听器
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if(effectStatus == BOOL.YES){
                    cc.audioEngine.playEffect(res_platform.effectBlip);
                }
                cc.director.popScene();

                return false;
            }
        });
        //注册监听器
        cc.eventManager.addListener(this.touchListener,this);
        this.touchListener.retain();  //if in jsb
        return true;
    },
    onEnter: function () {
        this._super();
        cc.log("GameOverLayer onEnter");
    },
    onExit: function () {
        this._super();
        cc.log("GameOverLayer onExit");
        //注销监听器
        if(this.touchListener != null){
            cc.eventManager.removeListener(this.touchListener);
            this.touchListener.release();
            this.touchListener == null;
        }
    },
    onExitTransitionDidStart: function () {
        this._super();
        cc.log("GameOverLayer onExitTransitionDidStart");
        cc.audioEngine.stopMusic(res_platform.musicGame);
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        cc.log("GameOverLayer onEnterTransitionDidFinish");
        if(musicStatus == BOOL.YES){
            cc.audioEngine.playMusic(res_platform.musicGame);
        }
    }
});

var GameOverScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
    }
});