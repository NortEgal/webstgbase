class Seiran extends EnemyBoss {
	constructor(_x, _y) {
		super(_x, _y);

		this.radiusHitbox = 60;
		this.hpMax = 500;
		this.hp = this.hpMax;
		this.budha = 0;
		this.tt = 0;
		this.aura = new EffectBossAura(this);

		this.sprite = new Sprite(resources['seiran'].texture);
		let s = this.sprite;
		stage.addChild(s);
		s.texture.frame = new Rectangle(0, 0, 64, 96);
		s.scale.set(2);
		s.anchor.set(0.5);
		s.frame = 0;
		s.row = 0;

		this.Update();
	}

	Update(delta) {
		super.Update(delta);
		if (!this.dying && this.canShoot) this.ShootingUpdate(delta);

		if (this.t > 100 && !this.canShoot) this.canShoot = 1;

		this.t += this.tt;
	}

	MovementUpdate(delta) {
		super.MovementUpdate(delta);
		if (this.speed > 1) this.speed *= 0.98;
		else {
			this.speed = 0;
			this.SetVelTo({ 'x': _w/2 + Math.random() * _w / 4, 'y': _h/10 + Math.random() * _h/5 });
		}
	}

	ShootingUpdate(delta) {
		let t = Math.round(this.t);
		if(t % 11 == 0 && t <= 11 * 3) {
			let args = { 'x': this.x, 'y': this.y, 'str': 1, 'muff': 2, 'vol': 0.5 , 'single': 1}
			G.PlaySound('lol', snd_folder + 'se_tan00.wav', args);

			for (let index = 1; index <= 15; index++) {
				new BulletEnemyBasic(this.x, this.y, this.t + (360 / 15) * index, 6, 8, 8);
			}
		}

		if(t > 60 && t % 5 == 0 && t < 60 + 5*5) {

			let args = { 'x': this.x, 'y': this.y, 'str': 1, 'muff': 2, 'vol': 0.5, 'single': 1 }
			G.PlaySound('lol', snd_folder + 'se_tan00.wav', args);

			for (let index = 1; index <= 15; index++) {
				new BulletEnemyBasic(this.x, this.y, (360 / 15) * index, 3, 8, 6);
			}		
		}

		if(t > 100) {
			this.t = 0;
			this.tt += 0.015;
		} 
	}

	Explode() {
		if (this.dying) return;
		super.Explode();
		G.UI.TimerEnd();

		G.UI.BossName('');
		G.UI.BossStarsRemove();
		G.UI.SpellcardHide();
	}
}