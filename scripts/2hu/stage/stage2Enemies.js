class stageFairy extends EnemyFairyBasic {
	constructor(_x, _y, type, skin) {
		super(_x, _y, type, skin);

		this.SetVel(90 + Math.Random(-10,10), Math.Random(0.1, 1));
		this.rand = Math.RandomInt(0, 1);

		this.ShootDelay = Math.RandomInt(100, 200);;
		this.canShoot = 1;
	}

	Update(delta) {
		super.Update(delta);
		if(this.canShoot) this.ShootingUpdate(delta);
	}

	ShootingUpdate(delta) {
		let t = Math.round(this.t);
		if (t > this.ShootDelay) {
			this.t = 0;
			this.ShootDelay = Math.RandomInt(50, 155);

			let args = { 'x': this.x, 'y': this.y, 'str': 1, 'muff': 2, 'vol': 0.5, 'single': 0 }
			G.PlaySound('lol', snd_folder + 'se_tan00.wav' , args);
			new BulletEnemyBasic(this.x, this.y, 0, 3, 2, 1).SetVelTo(G.p0, 3);
		}
	}

	MovementUpdate(delta) {
		super.MovementUpdate(delta);
		this.speed+=0.1*delta;
		this.vec.y*=0.99;

		if (this.y > _h + G.Deadzone ||
			this.x > _w + G.Deadzone ||
			this.y < -G.Deadzone ||
			this.x < -G.Deadzone) {
			this.kill = 1;
		}
	}
}
