/*
	BOSS EFFECT ENTITY
*/

class EffectBossAura extends EffectBack {
	constructor(target, softfollow) {
		super(target.x, target.y);

		this.target = target;

		this.sprite = new Container;
		let aura = this.sprite;
		stage.addChild(aura);
		aura.t = 0;

		aura.circle = new Sprite(resources.effect_magiccircle.texture);
		aura.addChild(aura.circle);
		aura.circle.anchor.set(0.5);
		aura.circle.scale.set(2);

		aura.displace = new Sprite(resources.displace_filter.texture);
		aura.addChild(aura.displace);
		aura.displace.anchor.set(0.5);
		aura.displace.height = aura.circle.height;

		aura.displaceFilter = new PIXI.filters.DisplacementFilter(aura.displace);
		aura.displaceFilter.scale.set(110);

		Stage.filters = [aura.displaceFilter];

		aura.arcs = [];
		aura.clouds = [];

		this.Update();
	}

	Update(delta) {
		super.Update(delta);
		if(this.target.kill) this.kill = 1;
	}

	SpriteUpdate(delta) {
		super.SpriteUpdate();

		let aura = this.sprite;
		aura.t += 1 * delta;
		aura.position.set(this.target.x, this.target.y);

		aura.circle.rotation += 0.01 * delta;
		aura.circle.scale.x = 1.6 + Math.sin(aura.t * 0.01) * -0.4;

		aura.displace.rotation = aura.circle.rotation;
		aura.displace.width = aura.circle.width;

		if (Math.round(aura.t) % 7 == 0) {
			this.CreateArc();
			this.CreateCloud();
			aura.t++;
		}

		aura.arcs.forEach(a => {
			a.scale.y += 0.08 * delta;
			a.alpha -= 0.02 * delta;


			if (a.alpha < 0) {
				aura.arcs = aura.arcs.filter(arc => arc != a);
				a.texture.destroy();
				a.destroy();
			}
		});

		aura.clouds.forEach(a => {
			a.scale.set(a.scale.x - 0.1 * delta);
			if (a.alpha < 0.5) a.alpha += 0.01 * delta;


			if (a.scale.x < 0) {
				aura.clouds = aura.clouds.filter(arc => arc != a);
				a.texture.destroy();
				a.destroy();
			}
		});
	}

	CreateArc() {
		let aura = this.sprite;

		let arc = new Sprite(G.BaseTextureFrom('effect_aura'));
		aura.addChild(arc);
		arc.texture.frame = new Rectangle(0, 0, 48, 64);
		arc.anchor.set(0.5, 1);
		arc.scale.x = Math.Random(1.5, 2.5);
		arc.scale.y = Math.Random(0.25, 0.5);
		arc.tint = 0xff3959;
		arc.position.set(Math.Random(-5, 5), 10 + Math.Random(0, 5));
		arc.blendMode = 1;

		aura.arcs.push(arc);
	}

	CreateCloud() {
		let aura = this.sprite;

		let cloud = new Sprite(G.BaseTextureFrom('effect_aura'));
		aura.addChild(cloud);
		cloud.texture.frame = new Rectangle(48, 0, 48, 64);
		cloud.anchor.set(0.5, 0.5);
		cloud.scale.set(Math.Random(4.5, 7.5));
		cloud.alpha = 0;
		cloud.tint = 0xff0949;
		cloud.position.set(Math.Random(-5, 5), 10 + Math.Random(-5, 5));
		cloud.blendMode = 1;
		cloud.rotation = Math.Deg2Rad(Math.Random(0, 360));

		aura.clouds.push(cloud);
	}

	Delete() {
		if (Stage.filters && Stage.filters[0] == this.sprite.displaceFilter) Stage.filters = [];
		this.sprite.arcs.forEach(c => {c.texture.destroy();});
		this.sprite.clouds.forEach(c => { c.texture.destroy(); });
		super.Delete();
	}
}

class EffectBossExplode extends EffectFront {
	constructor(_x, _y) {
		super();

		this.SetPos(_x, _y);

		this.sprite = new Container;
		let e = this.sprite;
		stage.addChild(e);
		e.pivot.set(0.5);
		e.t = 0;

		e.circle = [];
		for (let i = 0; i < 4; i++) {
			e.circle[i] = new Sprite(G.BaseTextureFrom('effect_deadcircle'));
			e.addChild(e.circle[i]);
			e.circle[i].anchor.set(0.5);
			e.circle[i].scale.set(0.1);
			e.circle[i].blendMode = 1;
		}

		e.circle[0].position.set(-64, -64);
		e.circle[0].texture.frame = new Rectangle(0, 0, 64, 64);
		e.circle[1].position.set(64, -64);
		e.circle[1].texture.frame = new Rectangle(64, 0, 64, 64);
		e.circle[2].position.set(-64, 64);
		e.circle[2].texture.frame = new Rectangle(0, 64, 64, 64);
		e.circle[3].position.set(64, 64);
		e.circle[3].texture.frame = new Rectangle(64, 64, 64, 64);

		this.Update(1);
	}

	SpriteUpdate(delta) {
		super.SpriteUpdate();

		let e = this.sprite;
		e.t += 0.5 * delta;

		e.circle.forEach(c => {
			c.scale.set(Math.sin(Math.Deg2Rad(e.t)) * 300);
			c.alpha = 1 - Math.sin(Math.Deg2Rad(e.t));
		})

		if(e.t > 90) this.kill = 1;
	}

	Delete() {
		this.sprite.circle.forEach(c => {
			c.texture.destroy();
		})	
		super.Delete();
	}
}