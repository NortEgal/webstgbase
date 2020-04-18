/*
	BASE ENTITY
*/

G.Entities = [];
G.EntitiesUpdate = function (delta) {
	G.Entities.forEach(ent => {
		if(!ent.kill) ent.Update(delta);
	});

	let ents = G.Entities.filter(ent => ent.kill);
	if(ents.length) {
		ents.forEach(ent => {
			ent.Delete();
		});
		G.Entities = G.Entities.filter(ent => !ent.kill);
	}
}

class Entity {
	constructor(_x, _y) {
		G.Entities.push(this);

		this.x = _w / 2;
		this.y = _h / 2;

		this.vx = 0;
		this.vy = 0;

		this.vec = [];
		this.vec.x = 0;
		this.vec.y = 0;

		this.speed = 0;

		this.deleteTexture = 0;

		if (_x != null) this.x = _x;
		if (_y != null) this.y = _y;
	}

	Update(delta) {
		if (delta == null) delta = 1;
		if (G.Timescale) delta = G.Timescale;

		if (this.sprite && !this.sprite.zIndex) {
			if (this instanceof Player) this.sprite.zIndex = G.zIndex.Player;
			if (this instanceof BulletPlayer) this.sprite.zIndex = G.zIndex.PlayerBullet;
			if (this instanceof BulletEnemy) this.sprite.zIndex = G.zIndex.Bullet;
			if (this instanceof Enemy) this.sprite.zIndex = G.zIndex.Enemy;
			if (this instanceof EffectBack) this.sprite.zIndex = G.zIndex.EffectBack;
			if (this instanceof EffectFront) this.sprite.zIndex = G.zIndex.EffectFront;
		}

		this.MovementUpdate(delta);
		this.SpriteUpdate(delta);
	}

	MovementUpdate(delta) {
		this.x += this.vx * delta;
		this.y += this.vy * delta;
	}

	SpriteUpdate(delta) {
		if (this.sprite.x != this.x) this.sprite.x = this.x;
		if (this.sprite.y != this.y) this.sprite.y = this.y;
	}

	Delete() {
		this.kill = 1;

		let options = {
			children: true,
			baseTexture: true,
			//texture: 
		}

		if (this.sprite) {
			if (this.deleteTexture) this.sprite.texture.destroy();
			this.sprite.destroy(options);
		} 
	}

	SetPos(x, y) {
		if (x != null) this.x = x;
		if (y != null) this.y = y;
	}

	SetAng(angle) {
		let rotate = Math.Rad2Vec(Math.Deg2Rad(angle));
		this.vec.x = rotate.x;
		this.vec.y = rotate.y;
	}

	GetAng() {
		return Math.Rad2Deg(Math.Vec2Rad(this.vec.x, this.vec.y));
	}

	SetVel(angle, speed) {
		this.SetAng(angle);
		this.speed = speed;
	}

	SetVelTo(point, speed) {
		if (speed == null) speed = Math.Distance(this, point) * 0.026;

		let v = [];
		v.x = point.x - this.x;
		v.y = point.y - this.y;
		v.d = Math.sqrt(v.x ** 2 + v.y ** 2);
		v.x /= v.d;
		v.y /= v.d;

		this.vec.x = v.x;
		this.vec.y = v.y;
		this.speed = speed;
	}
}