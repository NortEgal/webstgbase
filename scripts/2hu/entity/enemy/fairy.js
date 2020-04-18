/*
	FAIRY ENEMY ENTITY
*/

class EnemyFairyBasic extends Enemy {
	constructor(_x, _y, type, skin) {
		super(_x, _y);

		if (skin != null) this.skin = skin; else this.skin = 0;
		if (type != null) type = '_' + type; else type = '';

		let path = img_folder + 'enemy/enemy' + type + '.png'

		this.radiusHitbox = 30;
		this.hp = 25;

		this.sprite = new Sprite(G.BaseTextureFrom('enemy' + type));
		let fairy = this.sprite;
		fairy.texture.frame = new Rectangle(0, 0, 48, 32);
		fairy.anchor.set(0.5);
		fairy.scale.set(2);
		stage.addChild(fairy);
		fairy.frame = 0;
		fairy.row = 0;

		this.Update();
	}

	SpriteUpdate() {
		super.SpriteUpdate();

		let fairy = this.sprite;

		fairy.frame += G.AnimateFrameSpeed;

		if (fairy.frame > 3.5) {
			fairy.frame = 0;

			if (this.vx) {
				switch (fairy.row) {
					case 0: fairy.row = 1; break;
					case 1: fairy.row = 2; break;
				}
			} else {
				if (fairy.row) fairy.row = 0;
			}
		}

		if (this.vx > 0 && fairy.scale.x != 2) {
			fairy.scale.x = 2;
			fairy.row = 0;
		}
		if (this.vx < 0 && fairy.scale.x != -2) {
			fairy.scale.x = -2;
			fairy.row = 0;
		}
		fairy.texture.frame = new Rectangle(48 * Math.round(fairy.frame), fairy.row * 32 + (this.skin * 96), 48, 32);
	}

	Explode() {
		super.Explode();

		let tint = 0x4040ff;
		if (this.skin) tint = 0xff4040;

		for (let i = 0; i < 2; i++) new EffectEnemyExplode(this.x + Math.Random(-5, 5), this.y + Math.Random(-5, 5), Math.Deg2Rad(Math.Random(0, 360)), tint);
	}
}