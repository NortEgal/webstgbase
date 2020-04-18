Stage = new Container;
stage.addChild(Stage);

Stage.Init = function () {
	Stage.canUpdate = 1;

	G.SetResolution(1920, 1080);
	G.UI.Init();

	Debug.Grid(16, 1, 0xff0909, 0.2, Stage);
	Debug.Grid(32, 1, 0x0909ff, 0.5, Stage);
	Debug.Rect(G.Screenborder, G.Screenborder, _w - G.Screenborder * 2, _h - G.Screenborder * 2, 0x09ff09, 1, 0.5, null, Stage);


	//if (!Stage.Preload) Stage.Init_(); else Stage.Preload();
		
	
	MusicPlaylist = [
		'http://d.zaix.ru/iIgk.mp3', //
		'http://d.zaix.ru/iIyP.mp3', //
		'http://d.zaix.ru/iIAR.mp3', //
		'http://d.zaix.ru/iICc.mp3', //
		'http://d.zaix.ru/iIDg.mp3', //
		'https://i.fiery.me/d73aE.mp3', // Blue Monday
		'https://i.fiery.me/rPPPj.mp3', // [Touhou]- Alice's Theme_ Doll Judgment
		'https://i.fiery.me/rnE5p.mp3', // ベビーメタル BABYMETAL
		'https://i.fiery.me/nyPa0.mp3', // ORAX - Ectoplasmic
		'https://i.fiery.me/CDYsD.mp3', //【東方Synthwave】Phantom Drive
		'https://i.fiery.me/foXXT.mp3', //【東方DarksynthSynthwave】 Violet Delta - Race to the Crescent Moon
	];
	console.log(MusicPlaylist);

	function arrayRandElement(arr) {
		var rand = Math.floor(Math.random() * arr.length);
		return rand;
	};

	playing = false;

	function PlayMusic() {
		if (!playing) {
			var N = arrayRandElement(MusicPlaylist);
			PIXI.sound.Sound.from({
				url: MusicPlaylist[N],
				preload: true,
				speed: 1,
				volume: G.Volume,
				loaded: function (err, sound) {
					const instance = sound.play();
					instance.on('progress', function (progress) {
						playing = true;
						//console.log('Amount played: ', Math.round(progress * 100) + '%');
					});
					instance.on('end', function () {
						playing = false;
						MusicPlaylist.splice(N, 1)
						console.log('Sound finished playing');
						PlayMusic();
					});
				}
			});
		};
	};
	PlayMusic();
	G.UI.BGMShow('d0lbit digital');

	if (!G.p0) {
		G.p0 = new PlayerReimu(0, 'wasd');
		G.p0.SetPos(_w / 2 - 128, _h / 1.2);
	} 

	if (!G.p1) {
		G.p1 = new PlayerMarisa(0, 'arrows');
		G.p1.SetPos(_w / 2, _h / 1.2);
	} 

	Stage.t = 0;
	Stage.tt = 0;

	
	Stage.tets = new randFairy;
		
	//new EffectBossAura(Stage.F1);



}

Stage.Update = function (delta) {

	Stage.tt += 0.01 * delta; 

}

class randFairy extends EnemyFairyBasic {

	constructor(e) {
		super(e);
		this.enemiesCount = 50;
		this.enemies = [];
		this.Create();
	}

	Create() {

		for (let i = 0; i < this.enemiesCount; i++) {
			Stage.F = new EnemyFairyBasic(Math.RandomInt(100, _w - 100), Math.RandomInt(-250, -5000), null, Math.RandomInt(0, 1));
			this.enemies.push(Stage.F);

		}
	}


	Update(delta) {
		for (let i = 0; i < this.enemiesCount; i++) {
			
			Stage.F = this.enemies[i];
			Stage.F.y += (Stage.tt/100 + 0.5) * delta;
			if(i%3){
				Stage.F.SetVel(Stage.tt * 100 + 360 / 3 * 1, 2);
				Stage.F.x += 0.5 * delta;
			}
				
			if(i%4) {
				Stage.F.SetVel(Stage.tt * 100 + 360 / 3 * 2, 2);
				Stage.F.x -= 0.5 * delta;
			}

			if(i%5) {
				Stage.F.y += (Stage.tt / 90 + 0.5) * delta;
			}
				

			if (Stage.F.y > _h)
				Stage.F.y -= (1.5*_h);
			if (Stage.F.x > _w)
				Stage.F.x -= _w/2;
			if (Stage.F.x < 0)
				Stage.F.x += _w/2;

		}
	}
	
	
}