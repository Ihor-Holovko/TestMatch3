
Phaser.Plugin.MySimplePlugin = function (game, parent) {
	Phaser.Plugin.call(this, game, parent);
	this.sprite = null;
};

Phaser.Plugin.MySimplePlugin.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.MySimplePlugin.prototype.constructor = Phaser.Plugin.MySimplePlugin;

Phaser.Plugin.MySimplePlugin.prototype.addSprite = function (sprite) {
	this.sprite = sprite;
};

Phaser.Plugin.MySimplePlugin.prototype.update = function () {
	if (this.sprite)
	{
		this.sprite.angle += 0.3;
	}
};
