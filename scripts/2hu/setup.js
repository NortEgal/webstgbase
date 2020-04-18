/*
	VARIABLES
*/

let _w = render.screen.width,
	_h = render.screen.height;

var G = G || {};

if (!isNaN(localStorage.G_Volume)) G.Volume = Number(localStorage.G_Volume); else G.Volume = 0.1;
G.Timescale = 0;
G.AnimateFrameSpeed = 0.2;
G.Screenborder = 32;
G.Deadzone = 64;

G.Fonts = {
	'Standart': {
		'fontFamily': 'RussellSquare',
		'fontSize': 24,
		'fill': 0xffffff,
		'lineJoin': 'round',
		'strokeThickness': 5
	},

	'SpellcardBonus': {
		'fontFamily': 'RussellSquare',
		'fontSize': 18,
		'fill': 0xffffff,
		'lineJoin': 'round',
		'strokeThickness': 3
	},

	'TimerBig': {
		'fontFamily': 'RussellSquare',
		'fontSize': 32,
		'fill': 0xffffff,
		'lineJoin': 'round',
		'strokeThickness': 7
	},

	'TimerSmall': {
		'fontFamily': 'RussellSquare',
		'fontSize': 18,
		'fill': 0xffffff,
		'lineJoin': 'round',
		'strokeThickness': 4
	},

	'BossName': {
		'fontFamily': 'RussellSquare',
		'fontSize': 20 * 2,
		'fill': 0x9bff9b,
		'lineJoin': 'round',
		'strokeThickness': 0
	},	

	'Menu': {
		'fontFamily': 'RussellSquare',
		'fontSize': 54,
		'fontWeight': 'bold',
		'fill': 0xffffff,
		'lineJoin': 'round',
		'strokeThickness': 10
	},

	'MenuSelected': {
		'fontFamily': 'RussellSquare',
		'fontSize': 54,
		'fontWeight': 'bold',
		'fill': 0x787878,
		'lineJoin': 'round',
		'strokeThickness': 10
	}
}

G.zIndex = {
	'EffectBack': 1,
	'Player': 3,
	'PlayerBullet': 5,
	'Bullet': 7,
	'PlayerFocus': 9,
	'Enemy': 11,
	'EffectFront': 13,
	'UI': 100,
	'Menu': 101,
}

/*
	FUNCTIONS
*/

G.RestartStage = function() {
	G.KillEntities(1);
	if (Stage.Restart) Stage.Restart(); else Stage.Init();
	G.Menu.Resume();
}

G.LoadStage = function (name, keepPlayer) {
	if(Stage.destroy) Stage.destroy();
	for (var prop in Stage) Stage[prop] = undefined;
	$.getScript("scripts/2hu/stage/"+name+".js").done(function (script, textStatus) {
		G.KillEntities(keepPlayer);
		//Sound.pauseAll();
		Sound.stopAll();
		Stage.Init();
		G.Menu.Resume();
		G.Menu.canCall = 1;
	})
}

G.ScreenShake = function (magnitude, decay, duration) {
	let mag = magnitude,
		dec = decay;

	G.Shake = function() {
		stage.position.set(Math.Random(-mag, mag), Math.Random(-mag, mag));
		mag *= dec;
	}

	setTimeout(() => {
		G.Shake = null;
		stage.position.set(0);
	}, duration * 1000)
}

G.Nuke = function (spareBoss) {
	let a = G.Entities.filter(ent => ent instanceof BulletEnemy);
		a = a.concat(G.Entities.filter(ent => ent instanceof Enemy));
	if(spareBoss) a = a.filter(ent => (ent instanceof EnemyBoss) === false);

	a.forEach(ent => {
		ent.Explode();
	})	
}

G.KillEntities = function (sparePlayers) {
	let arr = G.Entities;
	if (sparePlayers) arr = G.Entities.filter(ent => (ent instanceof Player) === false);
	arr.forEach(ent => {
		ent.kill = 1;
	})
}

G.CollisionCheckRadius = function(ent1, ent2, mode) {
	let distance  = Math.sqrt((ent2.x - ent1.x) ** 2 + (ent2.y - ent1.y) ** 2) - ent1.radiusHitbox - ent2.radiusHitbox;
	if(mode) return distance;
	if(distance <= 0) return true;
	return false;
}

G.SetResolution = function(x, y) {
	_ScrW = x,
	_ScrH = y;
	render.view.width = _ScrW;
	render.view.height = _ScrH;
	_w = _ScrW,
	_h = _ScrH;
	ResizeCanvas();
}

G.EntId = function(ent) {
	return G.Entities.indexOf(ent);
}

G.BaseTextureFrom = function (id) {
	return new Texture(new BaseTexture.from(resources[id].url));
}

G.NewBaseTextureFrom = function (new_id, old_id) {
	//console.log('Copied texture from ' + old_id + ' to ' + new_id + ' (' + resources[old_id].url + ')');
	resources[new_id] = new BaseTexture.from(resources[old_id].url);
	resources[new_id].texture = new Texture(resources[new_id]);
	return resources[new_id];
}

G.PrecacheTexture = function(id, file) {
	if(resources[id] || !file) return resources[id].texture;

	loader.add(id, file);
	loader.load(function (loader, resources) {
		console.log('Cached texture ' + file + ' as ' + id);
		return resources[id].texture;
	});
}

G.PrecacheSound = function(id, file, args) {
	if (Sound.exists(id) || !file) return resources[id].sound;

	loader.add(id, file);
	loader.load(function (loader, resources) {
		console.log('Cached sound ' + file + ' as ' + id);
		return G.PlaySound(id, file, args);
	});
}

G.PlaySound = function (id, sound, args) {
	if (!Sound.exists(id) && sound) return G.PrecacheSound(id, sound, args);

	sound = resources[id].sound;
	sound.volume = G.Volume;

	if(args == null) {
		sound.play();
		return sound;
	}

	let filters = [];

	if(args.str) {
		let pos = Math.Clamp(Math.Round( (args.x / _w * 2) - 1, 2), -1, 1);
		filters.push(new PIXI.sound.filters.StereoFilter(pos));
	}

	if (args.muff == 1 || (args.muff == 2 && (args.x < 0 || args.x > _w || args.y < 0 || args.y > _h))) {
		filters.push(new PIXI.sound.filters.TelephoneFilter());
	} 

	sound.filters = filters;

	if (args.vol) sound.volume = G.Volume * args.vol;

	if (args.single) sound.singleInstance = true;

	sound.play();
	return sound;
}

G.DrawText = function (t, parent, settings) {
	let font = settings;
	if (font == null) font = G.Fonts.Standart;

	let text = new Text(t, font);
	parent.addChild(text);

	return text;
}

Math.Distance = function(p1, p2) {
	const a = p1.x - p2.x;
	const b = p1.y - p2.y;
	return Math.hypot(a, b);
}

Math.Round = function(value, precision) {
	var aPrecision = Math.pow(10, precision);
	return Math.round(value * aPrecision) / aPrecision;
}

Math.Clamp = function (val, min, max) {
	return val > max ? max : val < min ? min : val;
}

Math.RandomInt = function (min, max) {
	return Math.round(Math.Random(min, max));
}

Math.Random = function (min, max) {
	return Math.random() * (max - min) + min;
}

Math.Deg2Rad = function (angle) {
	return angle * (Math.PI/180);
}

Math.Rad2Deg = function (radian) {
	return radian * (180/Math.PI);
}

Math.Rad2Vec = function (radian) {
	return {
		x: Math.cos(radian),
		y: Math.sin(radian)
	}
}

Math.Vec2Rad = function (x, y) {
	return Math.atan2(y, x);
}

Math.Rainbow = function(numOfSteps, step) {
	var r, g, b;
	 var h = step / numOfSteps;
	 var i = ~~(h * 6);
	 var f = h * 6 - i;
	 var q = 1 - f;
	 switch(i % 6){
		 case 0: r = 1; g = f; b = 0; break;
		 case 1: r = q; g = 1; b = 0; break;
		 case 2: r = 0; g = 1; b = f; break;
		 case 3: r = 0; g = q; b = 1; break;
		 case 4: r = f; g = 0; b = 1; break;
		 case 5: r = 1; g = 0; b = q; break;
	 }
	 var c = '0x' + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
	 return c
}