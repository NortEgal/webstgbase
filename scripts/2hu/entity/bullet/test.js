/*
	TEST BULLET ENTITY
*/

class BulletEnemyTest extends BulletEnemy {
	constructor(_x, _y, _angle, _speed, tt) {
		super(_x, _y, _angle, _speed);

		this.t = 0;
		if(tt) this.t = tt;

		this.sprite = new Graphics();
		let sprite = this.sprite;
		sprite.lineStyle(0, 0x000000);
		sprite.beginFill(0xFFFFFF, 1);
		sprite.drawCircle(0, 0, 10);
		sprite.endFill();
		sprite.pivot.set(0.5);
		sprite.position.set(this.x, this.y);
		sprite.rotation = Math.Deg2Rad(90);
		stage.addChild(sprite);

		sprite.scale.set(0.5);
		this.Update();
	}

	Update() {
		super.Update();

		this.sprite.tint = Math.Rainbow(200, this.t);
		this.sprite.scale.set(this.sprite.scale.x + 0.1);
		this.sprite.alpha -= 0.005;

		this.t += 2;
		//this.SetAngle(this.GetAngle() + Math.cos(this.t * 0.05));
		//this.speed -= 0.1;
		this.gravity.y -= 0.1;
	}
}