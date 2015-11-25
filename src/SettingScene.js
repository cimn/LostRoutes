/**
 * Created by cimn on 2015/11/26.
 */
    var SettingLayer = cc.Layer.extend({

    ctor: function(){
        this._super();

        var bg = new cc.TMXTiledMap(res.red_bg_tmx);
        this.addChild(bg);

        var settingPage = new cc.Sprite("#setting.page.png");
        settingPage.x = winSize.width / 2;
        settingPage.y = winSize.height / 2;
        this.addChild(settingPage);


        //“Ù–ß
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
    }
})