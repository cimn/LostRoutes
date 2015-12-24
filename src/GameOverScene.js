/**
 * Created by cimn_HJ on 2015/12/24.
 */
var GameOverLayer = cc.Layer.extend({
    score: 0,
    touchListener: null,
    ctor: function () {
        this._super();

    }
});

var GameOverScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
    }
});