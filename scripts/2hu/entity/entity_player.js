/*
	PLAYER ENTITY
*/

class Player extends Entity {
	constructor(skin, keyscheme) {
		super();

		if (skin == null) skin = 0;
		if (keyscheme) this.Control(keyscheme);

		this.dir = [];
		this.dir.x = 0;
		this.dir.y = 0;

		this.focused = 0;
		this.shooting = 0;
		this.shootingCooldown = 0		
		this.dead = 0;
		this.invincible = 0;
		this.graze = 0;

		this.speedDefault = 8;
		this.speedFocused = 4;
		this.radiusHitbox = 3;
		this.radiusGraze = 40;

		this.sprite = new Container;
		let player = this.sprite;
		player.scale.set(2);
		stage.addChild(player);

		player.sprite = new Sprite(resources['player' + skin].texture);
		player.sprite.texture.frame = new Rectangle(0, 0, 32, 48);
		player.sprite.anchor.set(0.5);
		player.sprite.zIndex = 1;
		player.addChild(player.sprite);
		player.sprite.frame = 0;
		player.sprite.frameround = 0;
		player.sprite.row = 0;

		player.focus = new Container;
		player.focus.scale.set(0.5);
		player.addChild(player.focus);
		player.focus.anim = 0;
		player.focus.sprite = [];
		for (let i = 0; i < 2; i++) {
			player.focus.sprite[i] = new Sprite(resources['focus'].texture);
			player.focus.sprite[i].texture.frame = new Rectangle(0, 0, 64, 64);
			player.focus.sprite[i].anchor.set(0.5);
		}
		player.focus.sprite[0].zIndex = G.zIndex.PlayerFocus;
		player.focus.sprite[1].alpha = 0.5;
		stage.addChild(player.focus.sprite[0]);
		player.focus.addChild(player.focus.sprite[1]);
	}

	Update(delta) {
		super.Update(delta);

		if (this.dead) {
			if (this.y > _h / 1.2) this.y -= 5 * delta ; else this.dead = 0;
			return;
		}

		this.CollisionUpdate();

		if (this.shooting) this.Shoot(delta);

		if(this.invincible > 0) this.invincible -= delta;
		if(this.invincible < 0) this.invincible = 0;	
	}

	MovementUpdate(delta) {
		if (this.dead) return;

		if (this.focused && this.speed != this.speedFocused) this.speed = this.speedFocused;
		if (!this.focused && this.speed != this.speedDefault) this.speed = this.speedDefault;

		if (this.vec.x != this.dir.x) this.vec.x = this.dir.x;
		if (this.vec.y != this.dir.y) this.vec.y = this.dir.y;

		let length = Math.sqrt((this.dir.x * this.dir.x) + (this.dir.y * this.dir.y));
		if (length) {
			this.vec.x /= length;
			this.vec.y /= length;
		}

		this.vx = this.vec.x * this.speed;
		this.vy = this.vec.y * this.speed;

		super.MovementUpdate(delta);

		this.x = Math.Clamp(this.x, G.Screenborder, _w - G.Screenborder);
		this.y = Math.Clamp(this.y, G.Screenborder, _h - G.Screenborder);
	}

	SpriteUpdate(delta) {
		super.SpriteUpdate(delta);

		let player = this.sprite;

		if(this.invincible) {
			if (player.sprite.tint != 0xff0909) player.sprite.tint = 0xff0909;
			else player.sprite.tint = 0xffffff;
		} else if (player.sprite.tint != 0xffffff) player.sprite.tint = 0xffffff;

		if (this.vx == 0 && player.sprite.row != 0) player.sprite.row = 0;
		if (this.vx < 0 && player.sprite.row != 1) { player.sprite.row = 1; player.sprite.frame = 0 }
		if (this.vx > 0 && player.sprite.row != 2) { player.sprite.row = 2; player.sprite.frame = 0 }

		player.sprite.frame += G.AnimateFrameSpeed;
		if (player.sprite.frame > 7.5) {
			switch (player.sprite.row) {
				case 0: player.sprite.frame = 0; break;
				case 1: player.sprite.frame = 4; break;
				case 2: player.sprite.frame = 4; break;
			}
		}

		player.sprite.frameround = Math.min(Math.round(player.sprite.frame), 7);
		player.sprite.texture.frame = new Rectangle(player.sprite.frameround * 32, player.sprite.row * 48, 32, 48);

		player.focus.sprite[0].position.set(this.x, this.y);

		if (this.focused) {
			player.focus.sprite[0].rotation -= 0.03 * delta;
			player.focus.sprite[1].rotation += 0.02 * delta;

			if (player.focus.anim < 2.1){
				player.focus.anim = Math.Clamp(player.focus.anim + 0.12 * delta, 0, 2.1);
				for (let i = 0; i <= 1; i++) player.focus.sprite[i].scale.set(Math.sin(player.focus.anim) * 1.3 * 2);
			} 
		}else {
			if (player.focus.anim) player.focus.anim = 0;
			if (player.focus.sprite[0].scale.x > 0) {
				for (let i = 0; i <= 1; i++) player.focus.sprite[i].scale.set(player.focus.sprite[i].scale.x - 0.2 * delta);
			}
		}
	}

	CollisionUpdate() {
		let enemies = G.Entities.filter(ent => ent instanceof Enemy),
			bullets = G.Entities.filter(ent => ent instanceof BulletEnemy);
	
		if(enemies.length) {
			enemies.forEach(ent => {
				if (G.CollisionCheckRadius(this, ent) && !this.invincible) this.Die();
			});
		}

		if (bullets.length) {
			bullets.forEach(ent => {
				if(ent.radiusHitbox == -1) return;
				let d = G.CollisionCheckRadius(this, ent, 1);
				if (d > this.radiusGraze) return;
				if (d <= 0) {
					ent.Explode();
					if (!this.invincible) this.Die();
					return;
				}
				if (d <= this.radiusGraze && !ent.grazed[G.EntId(this)]) {
					ent.grazed[G.EntId(this)] = 1;
					this.Graze(ent);
				}
			});
		}		
	}

	Delete() {
		this.sprite.focus.sprite[0].destroy();
		super.Delete();
	}

	Shoot(delta) {
		if (this.shootingCooldown <= 0) {
			let args = { 'x': this.x, 'y': this.y, 'str': 1, 'muff': 2, 'single': 1 }
			G.PlaySound('player_shoot' + G.EntId(this), snd_folder + 'se_plst00.wav', args);

			this.shootingCooldown = 4;
		}
		this.shootingCooldown -= delta;
	}

	Graze(ent) {
		let args = { 'x': this.x, 'y': this.y, 'str': 1, 'muff': 2, 'vol': 0.5, 'single': 1 }
		G.PlaySound('player_graze', null, args);
		this.graze += 1;
	}

	Die() {
		this.dead = 1;
		this.invincible = 300;
		this.SetPos(_w / 2, _h + 80);
	}

	Control(keyscheme) {
		if (keyscheme == 'wasd') {
			var key_up = 'KeyW',
				key_right = 'KeyD',
				key_down = 'KeyS',
				key_left = 'KeyA',
				key_focus = 'ShiftLeft',
				key_shoot = 'Space',
				key_bomb = 'KeyV';
		} else if (keyscheme == 'arrows') {
			var key_up = "ArrowUp",
				key_right = "ArrowRight",
				key_down = "ArrowDown",
				key_left = "ArrowLeft";
				key_focus = 'ControlRight',
				key_shoot = 'Numpad0',
				key_bomb = 'NumpadDecimal';
		}

		let left = keyboard(key_left),
			up = keyboard(key_up),
			right = keyboard(key_right),
			down = keyboard(key_down),
			shoot = keyboard(key_shoot),
			focus = keyboard(key_focus),
			bomb = keyboard(key_bomb);

		shoot.press = () => {
			this.shooting = 1;
		};
		shoot.release = () => {
			this.shooting = 0;
			this.shootingCooldown = 0;
		};

		focus.press = () => {
			this.focused = 1;
		};
		focus.release = () => {
			this.focused = 0;
		};

		left.press = () => {
			this.dir.x = -1;
		};
		left.release = () => {
			this.dir.x = 0;
			if (right.isDown) this.dir.x = 1;
		};

		up.press = () => {
			this.dir.y = -1;
		};
		up.release = () => {
			this.dir.y = 0;
			if (down.isDown) this.dir.y = 1;
		};

		right.press = () => {
			this.dir.x = 1;
		};
		right.release = () => {
			this.dir.x = 0;
			if (left.isDown) this.dir.x = -1;
		};

		down.press = () => {
			this.dir.y = 1;
		};
		down.release = () => {
			this.dir.y = 0;
			if (up.isDown) this.dir.y = -1;
		};
	}
}

function keyboard(value) {
	let key = {};
	key.value = value;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
	//The `downHandler`
	key.downHandler = event => {
		if (event.code === key.value) {
			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
			event.preventDefault();
		}
	};

	//The `upHandler`
	key.upHandler = event => {
		if (event.code === key.value) {
			if (key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;
			event.preventDefault();
		}
	};

	//Attach event listeners
	const downListener = key.downHandler.bind(key);
	const upListener = key.upHandler.bind(key);

	window.addEventListener(
		"keydown", downListener, false
	);
	window.addEventListener(
		"keyup", upListener, false
	);

	// Detach event listeners
	key.unsubscribe = () => {
		window.removeEventListener("keydown", downListener);
		window.removeEventListener("keyup", upListener);
	};

	return key;
}