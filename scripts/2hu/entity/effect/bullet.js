/*
	BULLET EXPLODE EFFECT ENTITY
*/

class EffectBulletExplode extends EffectFront {
	constructor(x, y, tint, scale) {
		if (tint == null) tint = 0xffffff;
		if (scale == null) scale = 1;
		super(x, y);

		this.deleteTexture = 1;

		this.sprite = new Sprite(G.BaseTextureFrom('effect_etbreak'));
		let eff = this.sprite;
		stage.addChild(eff);
		eff.anchor.set(0.5);
		eff.texture.frame = new Rectangle(0, 0, 0, 0);
		eff.tint = tint;
		eff.scale.set(scale);
		eff.rotation = Math.Deg2Rad(Math.Random(0, 360));
		eff.frame = 0;
		eff.row = 0;

		this.Update();
	}

	SpriteUpdate(delta) {
		super.SpriteUpdate(delta);

		let effect = this.sprite;
		effect.frame += G.AnimateFrameSpeed;

		if (effect.frame > 3.5) {
			effect.frame = 0;
			if (effect.row < 1) effect.row += 1; else this.kill = 1;
		}

		effect.texture.frame = new Rectangle(64 * Math.round(effect.frame), 64 * effect.row, 64, 64);
	}
}