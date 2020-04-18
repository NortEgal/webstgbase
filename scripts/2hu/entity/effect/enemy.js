/*
	ENEMY EXPLODE EFFECT ENTITY
*/

class EffectEnemyExplode extends EffectFront {
	constructor(x, y, angle, tint) {
		if (tint == null) tint = 0xffffff;

		super();

		this.SetPos(x, y);

		this.sprite = new Container;
		let effect = this.sprite;
		stage.addChild(effect);
		effect.rotation = angle;

		effect.wave = new Sprite(G.BaseTextureFrom('effect_breakwave'));
		effect.addChild(effect.wave);
		effect.wave.anchor.set(0, 0.5);
		effect.wave.texture.frame = new Rectangle(0, 0, 0, 0);
		effect.wave.tint = tint;
		effect.wave.frame = 0;
		effect.wave.row = 0;

		effect.circles = [];

		for (let i = 0; i <= Math.RandomInt(0, 3); i++) {
			effect.circle = new Graphics()
			effect.circle.lineStyle(1, tint, 1);
			effect.circle.arc(0, 0, 100, Math.Deg2Rad(0), Math.Deg2Rad(360));
			//effect.circle.cacheAsBitmap = true;
			effect.addChild(effect.circle);
			effect.circle.position.set(Math.Random(-15, 15), Math.Random(-15, 15));
			effect.circle.scale.set(0);
			effect.circles.push(effect.circle);
		}

		this.Update();
	}

	SpriteUpdate(delta) {
		super.SpriteUpdate(delta);

		let effect = this.sprite;
		effect.wave.frame += G.AnimateFrameSpeed;

		if (effect.wave.frame > 2.5) {
			effect.wave.frame = 0;
			if (effect.wave.row < 3) effect.wave.row += 1; else this.kill = 1;
		}

		effect.wave.texture.frame = new Rectangle(160 * Math.round(effect.wave.frame), 80 * effect.wave.row, 160, 80);

		effect.circles.forEach(c => {
			c.scale.set(c.scale.x + 0.02 * delta);
			c.alpha -= 0.02 * delta;
		});
	}

	Delete() {
		let effect = this.sprite;
		effect.wave.texture.destroy();
		super.Delete();
	}
}