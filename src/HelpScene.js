/**
 * Created by Administrator on 2015/11/25.
 */
var HelpLayer = cc.Layer.extend({

    ctor: function(){

        this._super();

        var bg = new cc.TMXTiledMap(res.blue_bg_tmx);
        this.addChild(bg);

        var page = new cc.Sprite("#help.page.png");
        page.x = winSize.width / 2;
        page.y = winSize.height / 2;
        this.addChild(page);

        //OK�˵�
        var okNormal = new cc.Sprite("#button.ok.png");
        var okSelected = new cc.Sprite("#button.ok-on.png");
        var okMenuItem = new cc.MenuItemSprite(
            okNormal,
            okSelected,
            this.menuItemCallback,this);
        okMenuItem.x = 400;
        okMenuItem.y = 80;


        var mu = new cc.Menu(okMenuItem);
        mu.x = 0;
        mu.y = 0;
        this.addChild(mu);

        return true;
    },
    menuItemCallback: function(sender){
        cc.log("Touch Start Menu Item " + sender);
        cc.director.popScene();
        //������Ч
        if (effectStatus == BOOL.YES){
            cc.audioEngine.playEffect(res_platform.effectBlip);
        }

    }
});

var HelpScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelpLayer();
        this.addChild(layer);
    }

})