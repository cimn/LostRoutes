/**
 * Created by cimn on 2015/11/26.
 */
    var SettingLayer = cc.Layer.extend({

    ctor: function(){
        this._super();

        //var winSize = cc.director.getWinSize();
        //cc.spriteFrameCache.addSpriteFrames(res_platform.texture_plist,res_platform.texture_res);

        var bg = new cc.TMXTiledMap(res.red_bg_tmx);
        this.addChild(bg);

        var settingPage = new cc.Sprite("#setting.page.png");
        settingPage.x = winSize.width / 2;
        settingPage.y = winSize.height / 2;
        this.addChild(settingPage);


        //音效
        var soundOnMenuItem = new cc.MenuItemImage(
            "#check-on.png",
            "#check-on.png");
        var soundOffMenuItem = new cc.MenuItemImage(
            "#check-off.png",
            "#check-off.png");
        var soundToggleMenuItem = new cc.MenuItemImage(
            soundOnMenuItem,
            soundOffMenuItem,
            this.menuSoundToggleCallback,this);
        soundToggleMenuItem.x = winSize.width /2 + 100;
        soundToggleMenuItem.y = winSize.height /2 + 180;

        //音乐
        var musicOnMenuItem = new cc.MenuItemImage(
            "#check-on.png",
            "#check-on.png");
        var musicOffMenuItem = new cc.MenuItemImage(
            "#check-off.png",
            "#check-off.png");
        var musicToggleMenuItem = new cc.MenuItemImage(
            musicOnMenuItem,
            musicOffMenuItem,
            this.menuMusicToggleCallback,this);
        musicToggleMenuItem.x = soundToggleMenuItem.x;
        musicToggleMenuItem.y = soundToggleMenuItem.y - 110;

        //OK菜单
        var okNormal = new cc.Sprite("#button.ok.png");
        var okSelected = new cc.Sprite("#button.ok-on.png");
        var okMenuItem = new cc.MenuItemSprite(
            okNormal,
            okSelected,
            this.menuOkCallback,this);
        okMenuItem.x = 410;
        okMenuItem.y = 75;


        var mu = new cc.Menu(soundToggleMenuItem,musicToggleMenuItem,okMenuItem);
        mu.x = 0;
        mu.y = 0;
        this.addChild(mu);

        //设置音效和音乐选中状态
        if(musicStatus == BOOL.YES){
            musicToggleMenuItem.setSelectedIndex(0);
        }else{
            musicToggleMenuItem.setSelectedIndex(1);
        }

        if(effectStatus == BOOL.YES){
            soundToggleMenuItem.setSelectedIndex(0);
        }else{
            soundToggleMenuItem.setSelectedIndex(1);
        }

        return true;

    },

    menuSoundToggleCallback: function(sender){
        cc.log("menuSoundToggleCallback!");
        if(effectStatus == BOOL.YES){

        }
    }

});


    var SettingScene = cc.Scene.extend({
        onEnter: function(){
            this._super();
            var layer = new SettingLayer();
            this.addChild(layer);
        }
    });