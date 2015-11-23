/**
 * Created by cimn on 2015/11/24.
 */
    var musicStatus;
    var effectStatus;

    var winSize;
    var HomeMenuLayer = cc.Layer.extend({

        ctor: function(){
            this._super();

            winSize = cc.director.getWinSize();
            //加载精灵帧缓存*必须是addSpriteFrames复数*
            cc.spriteFrameCache.addSpriteFrames(res_platform.texture_plist,res_platform.texture_res);

            musicStatus = cc.sys.localStorage.getItem(MUSIC_KEY);
            effectStatus = cc.sys.localStorage.getItem(EFFECT_KEY);

            var bg = new cc.TMXTiledMap(res.red_bg_tmx);
            this.addChild(bg);


            var top = new cc.Sprite("#home-top.png");
            top.x = winSize.width/2;
            top.y = winSize.height - top.getContentSize().height /2;
            this.addChild(top);

        }
    });

    var HomeScene = cc.Scene.extend({
        onEnter: function () {
            this._super();
            var layer = new HomeMenuLayer();
            this.addChild(layer);
        }

    })
