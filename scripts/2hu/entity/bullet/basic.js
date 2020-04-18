/*
	BASIC BULLET ENTITY
*/

class BulletEnemyBasic extends BulletEnemy {
	constructor(_x, _y, _angle, _speed, type, color) {
		super(_x, _y, _angle, _speed);

		if (type != null) this.type = Math.Clamp(type, 0, 11); else this.type = 1;
		if (type != null) this.color = Math.Clamp(color, 0, 15); else this.color = 0;

		this.rotateAdjust = 90;
		this.deleteTexture = 1;

		this.sprite = new Sprite(G.BaseTextureFrom('bullet1'));
		let bullet = this.sprite;
		bullet.texture.frame = new Rectangle(16 * this.color, 16 * this.type, 16, 16);
		bullet.anchor.set(0.5);
		bullet.scale.set(2);
		stage.addChild(bullet);
	
		this.Update();
	}

	SetSkin(type, color) {
		if (type != null) this.type = Math.Clamp(type, 0, 11);
		if (type != null) this.color = Math.Clamp(color, 0, 15);
		this.sprite.texture.frame = new Rectangle(16 * this.color, 16 * this.type, 16, 16);
	}

	Explode() {
		super.Explode();
		new EffectBulletExplode(this.x, this.y, 0xffffff, 1);
	}
}