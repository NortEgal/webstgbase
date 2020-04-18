/*
	ENEMY
*/

class Enemy extends Entity {
	constructor(_x, _y) {
		super(_x, _y);

		this.t = 0;

		this.hpMax = 100;
		this.hp = this.hpMax;
		this.invincible = 0;
		this.budha = 0;

		this.damagedSound = 1;
	}
	
	Update(delta) {
		if(delta == null) delta = 1;
		super.Update(delta);
		this.t += 1 * delta;
		if (this.healthbarEnabled) this.HealthbarUpdate();
		if (this.hp <= 0) this.Explode();
	}

	MovementUpdate(delta) {
		this.vx = this.vec.x * this.speed;
		this.vy = this.vec.y * this.speed;

		super.MovementUpdate(delta);
	}

	HealthbarUpdate() {
		let hpbar = this.healthbar;
		hpbar.position.set(this.x, this.y);

		let hp = (1 - this.hp / this.hpMax) * 90 + (this.hp / this.hpMax) * 450;
		if (hpbar.circle.lasthp == hp) return; 

		hpbar.circle.destroy(true);
		hpbar.circle = new Graphics()
		hpbar.circle.lineStyle(5, 0xff9999, 1);
		hpbar.circle.arc(0, 0, 100 * this.healthbarScale, Math.Deg2Rad(-90), Math.Deg2Rad(-hp), 1);
		hpbar.addChild(hpbar.circle);
		hpbar.circle.lasthp = hp;
	}

	HealthbarDraw(scale) {
		if(scale) this.healthbarScale = scale; else this.healthbarScale = 1
		this.healthbarEnabled = 1;

		this.healthbar = new Container;
		let hpbar = this.healthbar;
		stage.addChild(hpbar);
		hpbar.zIndex = G.zIndex.EffectFront;
		hpbar.position.set(this.x, this.y);

		hpbar.circle = new Graphics()
		hpbar.circle.lineStyle(5, 0xff9999, 1);
		hpbar.circle.arc(0, 0, 100 * this.healthbarScale, Math.Deg2Rad(-90), Math.Deg2Rad(-450), 1);
		hpbar.addChild(hpbar.circle);
		hpbar.circle.lasthp = 0;

		hpbar.circle_out = new Graphics()
		hpbar.circle_out.lineStyle(1, 0xff2929, 0.9);
		hpbar.circle_out.arc(0, 0, 100 * this.healthbarScale + 4, Math.Deg2Rad(0), Math.Deg2Rad(360));
		//hpbar.circle_out.cacheAsBitmap = true;
		hpbar.addChild(hpbar.circle_out);

		hpbar.circle_in = new Graphics()
		hpbar.circle_in.lineStyle(1, 0xff2929, 0.9);
		hpbar.circle_in.arc(0, 0, 100 * this.healthbarScale - 4, Math.Deg2Rad(0), Math.Deg2Rad(360));
		//hpbar.circle_in.cacheAsBitmap = true;
		hpbar.addChild(hpbar.circle_in);
	}

	HealthbarDelete() {
		this.healthbarEnabled = 0;	
		this.healthbar.destroy(true);
	}

	Delete() {
		if (this.healthbarEnabled) this.HealthbarDelete();
		super.Delete();
	}

	TakeDamage(damage) {
		if (this.hp && !this.invincible) this.hp -= damage;
		if (this.hp < 1 && this.budha) this.hp = 1;
		if (!this.damagedSound) return;

		let args = { 'x': this.x, 'y': this.y, 'str': 1, 'muff': 2 }
		if (this.invincible) {
			G.PlaySound('enemy_nodamage', null, args);
			return;
		}
		if (this.hp > this.hpMax * 0.25) G.PlaySound('enemy_damaged0', snd_folder + 'se_damage00.wav', args);
		else G.PlaySound('enemy_damaged1', null, args);
	}

	Explode() {
		this.kill = 1;
		let args = { 'x': this.x, 'y': this.y, 'str': 1, 'muff': 2, 'vol': 0.5 }
		G.PlaySound('enemy_explode', null, args);
	}
}

class EnemyBoss extends Enemy {
	constructor(_x, _y) {
		super(_x, _y);

		this.budha = 1;
		this.hpMax = 500;
		this.casting = 0;

		this.HealthbarDraw(1);
	}

	SpriteUpdate() {
		super.SpriteUpdate();

		let fairy = this.sprite;

		fairy.frame += G.AnimateFrameSpeed;

		if (fairy.frame > 4.5) {
			switch (fairy.row) {
				case 0: fairy.frame = 0; break;
				default: fairy.frame = 2; break;
			}

			if (this.vx) {
				fairy.row = 1;
			} else {
				if (!fairy.row && this.casting) fairy.row = 2;
				if (fairy.row && !this.casting) fairy.row = 0;
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

		let round = fairy.frame;
		if(fairy.row && !this.vx) round = round - fairy.frame;
		fairy.texture.frame = new Rectangle(64 * Math.round(round), fairy.row * 96, 64, 96);
	}

	Explode() {
		if (this.dying) return;
		this.dying =  1;
		this.budha = 1;
		this.hp = 1;
		let args = { 'vol': 1 };
		G.PlaySound('enemy_explode1', null, args);
		this.aura.kill = 1;
		this.HealthbarDelete();

		for (let i = 0; i < 5; i++) {
			let e = new EffectEnemyExplode(this.x + Math.Random(-25, 25), this.y + Math.Random(-25, 25), Math.Deg2Rad(Math.Random(0, 360)), 0xff0949);
			e.sprite.scale.set(3);
		}

		setTimeout(() => {
			this.kill = 1;
			args.vol = 2;
			G.PlaySound('enemy_explode1', null, args);
			new EffectBossExplode(this.x, this.y);
			G.ScreenShake(50, 0.95, 1);
			G.Nuke(1);
		}, 1000)
	}
}