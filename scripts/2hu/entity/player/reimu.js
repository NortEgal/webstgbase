/*
	REIMU PLAYER ENTITY
*/

class PlayerReimu extends Player {
	constructor(type, keyscheme) {
		super(0, keyscheme);
		G.NewBaseTextureFrom('player0_bullet_basic', 'player0').texture.frame = new Rectangle(192, 144 + 16, 64, 16);
	}

	Shoot(delta) {
		if (this.shootingCooldown <= 0) {
			new BulletPlayerReimuBasic(this.x - 20, this.y - 35, -90, 30);
			new BulletPlayerReimuBasic(this.x + 20, this.y - 35, -90, 30);
			// for (let index = 0; index <= 2; index++) {
			// 	new BulletPlayerReimuBasic(this.x, this.y - 30, -120 + (30 * index), 20);
			// }
		}
		super.Shoot(delta);
	}
}

class BulletPlayerReimuBasic extends BulletPlayer {
	constructor(_x, _y, _angle, _speed) {
		super(_x, _y, _angle, _speed);

		this.radiusHitbox = 9;

		this.sprite = new Sprite(resources.player0_bullet_basic.texture);
		this.sprite.anchor.set(0.85, 0.5);
		this.sprite.scale.set(2);
		this.sprite.alpha = 0.5;
		stage.addChild(this.sprite);

		this.Update();
	}
}