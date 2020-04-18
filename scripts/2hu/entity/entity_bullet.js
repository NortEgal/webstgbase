/*
	BULLET ENTITY
*/

class Bullet extends Entity{
    constructor(_x, _y, _angle, _speed) {
		super(_x, _y);

		this.t = 0;
		this.radiusHitbox = 5;

		this.rotateToVec = 1;
		this.rotateAdjust = 0;

		this.gravity = [];
		this.gravity.x = 0;
		this.gravity.y = 0;

        if (_angle != null) this.SetAng(_angle);
        if (_speed != null) this.speed = _speed;       
	}

	Update(delta) {
		super.Update(delta);
		this.t += 1;
	}

	MovementUpdate(delta) {
		this.vx = this.vec.x * this.speed + this.gravity.x;
		this.vy = this.vec.y * this.speed + this.gravity.y;

		super.MovementUpdate(delta);

		if (this.y > _h + G.Deadzone ||
			this.x > _w + G.Deadzone ||
			this.y < -G.Deadzone ||
			this.x < -G.Deadzone) {
			this.kill = 1;
		}
	}

	SpriteUpdate() {
		super.SpriteUpdate();

		let sprite = this.sprite;

		if (this.rotateToVec) {
			let rotate = Math.Deg2Rad(this.rotateAdjust);
			if (this.speed) rotate += Math.Vec2Rad(this.vx, this.vy);
			else rotate += Math.Vec2Rad(this.vec.x, this.vec.y);
			if (sprite.rotation != rotate) sprite.rotation = rotate;
		}
	}

	Explode() {
		this.kill = 1;
		let args = { 'x': this.x, 'y': this.y, 'str': 1, 'muff': 2 }
		G.PlaySound('bullet_explode', null, args);
	}
}

class BulletPlayer extends Bullet {
	constructor(_x, _y, _angle, _speed) {
		super(_x, _y, _angle, _speed);
		this.damage = 5;
	}

	Update(delta) {
		super.Update(delta);
		this.CollisionUpdate();
	}

	CollisionUpdate() {
		let enemies = G.Entities.filter(ent => ent instanceof Enemy);
		if(!enemies.length) return;
		enemies.forEach(ent => {
			if (G.CollisionCheckRadius(this, ent)) {
				ent.TakeDamage(this.damage);
				this.kill = 1;
			}
		});
	}
}

class BulletEnemy extends Bullet {
	constructor(_x, _y, _angle, _speed) {
		super(_x, _y, _angle, _speed);
		this.grazed = [];
	}
}