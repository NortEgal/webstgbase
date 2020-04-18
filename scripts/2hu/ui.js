/*
	USER INTERFACE
*/

class GUI {
	constructor(a) {
		for (var prop in a) this[prop] = a[prop];

		this.container = new Container;
		let ui = this.container;
		ui.zIndex = G.zIndex.UI;
		stage.addChild(ui);

		ui.fps = G.DrawText('fps', ui);
		//ui.fps.position.set(_w, _h);
		ui.fps.anchor.set(1, 1);

		ui.bgm = G.DrawText('𝅘𝅥𝅮BGM: Буерак - Спортивные очки', ui);
		ui.bgm.anchor.set(1, 1);
		ui.bgm.alpha = 0;

		ui.spell = [];

		ui.spell.card = new Sprite(G.BaseTextureFrom('ascii'));
		ui.addChild(ui.spell.card);
		ui.spell.card.texture.frame = new Rectangle(0, 384, 512, 96);
		ui.spell.card.anchor.set(1,0);
		//ui.spell.card.position.set(_w, -16);

		ui.spell.bonus = new Sprite(G.BaseTextureFrom('ascii'));
		ui.spell.card.addChild(ui.spell.bonus);
		ui.spell.bonus.texture.frame = new Rectangle(0, 364, 256, 20);
		ui.spell.bonus.anchor.set(1, 0);
		ui.spell.bonus.position.set(-64, 70);

		ui.spell.bonus.score = G.DrawText('1234567890', ui.spell.card, G.Fonts.SpellcardBonus);
		ui.spell.bonus.score.position.set(-250, 67);

		ui.spell.name = G.DrawText('Sample Sign 「Generic Text」', ui.spell.card);
		ui.spell.name.anchor.set(1, 0);
		ui.spell.name.position.set(-32, 32);

		ui.timer = [];

		ui.timer.display = G.DrawText('99.', ui, G.Fonts.TimerBig);
		ui.timer.display.anchor.set(1, 1);
		//ui.timer.display.position.set(_w / 2 + 8, 80);

		ui.timer.display1 = G.DrawText('99', ui.timer.display, G.Fonts.TimerSmall);
		ui.timer.display1.anchor.set(0, 1);
		ui.timer.display1.position.set(-5, 0);

		ui.boss = [];

		ui.boss.name = G.DrawText('[VALVe] NIGGERNIGGERNIGGERNIGGERNIGGERNIGGERNIGGERNIGGERNIGGER', ui, G.Fonts.BossName);
		ui.boss.name.scale.set(0.5);
		ui.boss.stars = [];

		ui.fullscreenButton = new Sprite(resources['fullscreen'].texture);
		let fullscrBtn = ui.fullscreenButton
		ui.addChild(fullscrBtn);
		fullscrBtn.anchor.set(0.5);
		fullscrBtn.alpha = 0.1;
		fullscrBtn.interactive = true;
		fullscrBtn.buttonMode = true;
		//fullscrBtn.position.set(0, _h);
		fullscrBtn
			.on('pointerover', () => {
				fullscrBtn.alpha = 1;
				fullscrBtn.scale.set(1.1);
			})
			.on('pointerout', () => {
				fullscrBtn.alpha = 0.1;
				fullscrBtn.scale.set(0.9);
			})
			.on('pointerdown', () => {
				document.body.webkitRequestFullScreen();
			});

		if(!this.noinit) this.Init();

		if(!this.debug) return;

		ui.entcount = G.DrawText('ent count', ui);
		ui.entcount.position.set(0, _h * 0.1);

		ui.winner = new Sprite(G.BaseTextureFrom('winner'));
		ui.addChild(ui.winner);
		ui.winner.texture.frame = new Rectangle(25,0,25,0);
		ui.winner.position.set(_w/2, _h/2);
	}

	Init() {
		this.SpellcardHide();
		this.TimerEnd(1);
		this.BossName('');

		let ui = this.container;
		ui.fps.position.set(_w, _h - 32);
		ui.bgm.position.set(_w, _h);		
		ui.fullscreenButton.position.set(16, _h - 16);
		ui.timer.display.position.set(_w / 2 + 8, 80);
		ui.spell.card.position.set(_w, -16);
	}

	Delete() {
		let options = {
			children: true,
			baseTexture: true,
			//texture: 
		}

		this.container.destroy(options);
	}

	Update(delta) {
		let ui = this.container;

		ui.fps.text = Math.round(ticker.FPS);

		if(ui.bgm.showing) {
			if (ui.bgm.t > 180) ui.bgm.showing = 0;
			if (ui.bgm.t > 90 && ui.bgm.t < 91) ui.bgm.speed = 0;
			if (ui.bgm.speed == 0) ui.bgm.tt += 1 * delta;
			if (ui.bgm.tt > 300) ui.bgm.speed = 1;

			ui.bgm.t += ui.bgm.speed * delta;
			ui.bgm.sin = Math.abs(Math.sin(Math.Deg2Rad(ui.bgm.t)))
			ui.bgm.pos = -ui.bgm.sin * (_w / 2) + (_w / 2) ;
			ui.bgm.position.x = _w + ui.bgm.pos;
			ui.bgm.alpha = ui.bgm.sin;
		}

		if(ui.spell.declaring) {
			ui.spell.t -= 2 * delta;
			ui.spell.card.alpha += 0.05 * delta;
			ui.spell.card.position.y = -24 + _h/2 + Math.sin(Math.Deg2Rad(ui.spell.t)) * _h/2;

			if (ui.spell.card.position.y <= -23) ui.spell.declaring = 0;
		}

		if(ui.timer.counting) {
			ui.timer.time -= ticker.deltaMS * 0.001;
			if (ui.timer.time <= 0) this.TimerEnd();

			let n = Math.trunc(ui.timer.time);
			if(ui.timer.prev != n) {
				if (n < 3) {
					ui.timer.display.tint = 0xff2929;
					ui.timer.display1.tint = 0xff2929;
					ui.timer.display.scale.set(2);
					G.PlaySound('timer_warning1');
				}else if(n < 5) {
					ui.timer.display.tint = 0xff5959;
					ui.timer.display1.tint = 0xff5959;
					ui.timer.display.scale.set(1.5);
					G.PlaySound('timer_warning');
				}
				ui.timer.prev = n;
			}

			n = String(n)
			if(n.length == 1) n = '0' + n;
			ui.timer.display.text = n + '.';
	
			n = String(Math.Round(ui.timer.time % 1, 2)).slice(2, 4);
			if (n.length == 1) n += '0';
			ui.timer.display1.text = n;

			if (ui.timer.display.alpha < 1) ui.timer.display.alpha += 0.05 * delta;
			if (ui.timer.display.scale.x > 1) ui.timer.display.scale.set(ui.timer.display.scale.x - 0.1 * delta);			
		}

		if(!this.debug) return;

		ui.entcount.text = "Entities: " + G.Entities.length +
			"\nPlayers: " + G.Entities.filter(ent => ent instanceof Player).length +
			"\nEnemies: " + G.Entities.filter(ent => ent instanceof Enemy).length +
			"\nBullets: " + G.Entities.filter(ent => ent instanceof Bullet).length +
			" (P: " + G.Entities.filter(ent => ent instanceof BulletPlayer).length +
			" + E: " + G.Entities.filter(ent => ent instanceof BulletEnemy).length +
			")\nEffects: " + G.Entities.filter(ent => ent instanceof Effect).length;
	}

	BGMShow(name) {
		let ui = this.container;
		ui.bgm.showing = 1;
		ui.bgm.t = 0;
		ui.bgm.tt = 0;
		ui.bgm.speed = 2;
		ui.bgm.text = '𝅘𝅥𝅮BGM: ' + name;
	}

	SpellcardShow(name) {
		let ui = this.container;
		ui.spell.name.text = name;

		ui.spell.card.position.y = _h;
		ui.spell.card.alpha = 0;		

		ui.spell.declaring = 1;
		ui.spell.t = 90;
	}

	SpellcardHide() {
		let ui = this.container;
		ui.spell.declaring = 0;	
		ui.spell.card.alpha = 0;	
	}

	BossName(name) {
		let ui = this.container;
		ui.boss.name.text = name;
	}

	BossStarsAdd(num) {
		let ui = this.container;
		//let n = num - ui.boss.stars.length;

		for (let i = ui.boss.stars.length; i < num; i++) {
			ui.boss.stars[i] = new Sprite(G.BaseTextureFrom('front'));
			ui.addChild(ui.boss.stars[i]);
			ui.boss.stars[i].texture.frame = new Rectangle(786, 159, 20, 20);
			//ui.boss.stars[i].anchor.set(1, 0);
			ui.boss.stars[i].position.set(21 * i, 24);	
		}
	}

	BossStarsRemove() {
		let ui = this.container;
		ui.boss.stars.forEach(star => {
			let options = {
				children: true,
				baseTexture: true,
			}
			star.texture.destroy();
			star.destroy(options);
		});
		ui.boss.stars = [];
	}

	BossStarRemove() {
		let ui = this.container,
		star = ui.boss.stars.pop(),
		options = {
			children: true,
			baseTexture: true,
		}
		star.texture.destroy();
		star.destroy(options);
	}

	TimerStart(time, callback) {
		let ui = this.container;
		ui.timer.counting = 1;
		ui.timer.time = time;
		ui.timer.display.tint = 0xffffff;
		ui.timer.display1.tint = 0xffffff;
		ui.timer.display.scale.set(1);
		ui.timer.callback = callback;
	}

	TimerEnd(nocallback) {
		let ui = this.container;
		ui.timer.counting = 0;
		ui.timer.display.alpha = 0;
		if (!nocallback && ui.timer.callback) ui.timer.callback();
	}
}