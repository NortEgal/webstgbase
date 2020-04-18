/*
	LOADER
*/
let img_folder = 'img/';
let snd_folder = 'snd/';

let loadlist = [
	//img
	{ name: 'logo', url: img_folder + 'menu/logo.png' },
	{ name: 'fullscreen', url: img_folder + 'fullscreen.png' },
	{ name: 'ascii', url: img_folder + 'ui/ascii_1280.png' },
	{ name: 'front', url: img_folder + 'ui/front00.png' },
	{ name: 'winner', url: img_folder + 'menu/pause_title.png'},

	{ name: 'focus', url: img_folder + 'effect/eff_sloweffect.png' },
	{ name: 'player0', url: img_folder + 'player/pl00/pl00.png' },
	{ name: 'player1', url: img_folder + 'player/pl01/pl01.png' },
	{ name: 'player2', url: img_folder + 'player/pl02/pl02.png' },

	{ name: 'enemy', url: img_folder + 'enemy/enemy.png' },
	{ name: 'enemy_b', url: img_folder + 'enemy/enemy_b.png' },
	{ name: 'enemy_g', url: img_folder + 'enemy/enemy_g.png' },

	{ name: 'bullet1', url: img_folder + 'bullet/bullet1.png' },

	{ name: 'effect_aura', url: img_folder + 'effect/eff_aura.png' },
	{ name: 'effect_magiccircle', url: img_folder + 'effect/eff_magicsquare.png' },
	{ name: 'effect_breakwave', url: img_folder + 'effect/eff_breakwave2.png' },	
	{ name: 'effect_etbreak', url: img_folder + 'effect/etbreak.png' },
	{ name: 'effect_deadcircle', url: img_folder + 'effect/eff_deadcircle.png' },
	
	{ name: 'displace_filter', url: img_folder + 'displace.png' },	

	//snd
	{ name: 'player_graze', url: snd_folder + 'se_graze.wav' },

	{ name: 'enemy_explode', url: snd_folder + 'se_enep00.wav' },
	{ name: 'enemy_explode1', url: snd_folder + 'se_enep01.wav' },
	{ name: 'enemy_damaged0', url: snd_folder + 'se_damage00.wav' },
	{ name: 'enemy_damaged1', url: snd_folder + 'se_damage01.wav' },
	{ name: 'enemy_nodamage', url: snd_folder + 'se_nodamage.wav' },

	{ name: 'bullet_explode', url: snd_folder + 'se_etbreak.wav' },

	{ name: 'timer_warning', url: snd_folder + 'se_timeout.wav' },
	{ name: 'timer_warning1', url: snd_folder + 'se_timeout2.wav' },

	{ name: 'changeitem', url: snd_folder + 'se_changeitem.wav'},
	{ name: 'item00', url: snd_folder + 'se_item00.wav' },

	//{ name: 'bunny', url: 'https://pixijs.io/examples/examples/assets/bunny.png'}
];

loader.add(loadlist)
	.on("progress", function() {
		console.log(Math.Round(loader.progress, 2) + '%')
	})
	.load(function() {
		console.log("Loading complete");

		var script_arr = [
			'ui.js',
			'menu.js',
			'debug.js',

			'entity/entity_bullet.js',
			'entity/entity_player.js',
			'entity/entity_enemy.js',
			'entity/entity_effect.js',

			'entity/player/reimu.js',
			'entity/player/marisa.js',
			'entity/player/youmu.js',

			'entity/bullet/basic.js',

			'entity/enemy/fairy.js',

			'entity/effect/bullet.js',
			'entity/effect/enemy.js',
			'entity/effect/boss.js',
		];

		GetScripts(script_arr, 'scripts/2hu/', function () {
			console.log('Scripts loaded');
			G.Init();
		});
	});

console.log('Loading assets');