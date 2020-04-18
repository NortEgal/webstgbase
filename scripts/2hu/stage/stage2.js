Stage = new Container;
stage.addChild(Stage);

Stage.Init = function() {
	//G.SetResolution(1920, 979);
	G.SetResolution(window.innerWidth, window.innerHeight);

	G.UI.Init();
	if(!Stage.Preload) Stage.Init_(); else Stage.Preload();
}

Stage.Preload = function() {
	let arr = [
		{ name: 'seiran', url: 'https://i.fiery.me/YegMV.png' },
		{ name: 'lol', url: snd_folder + 'se_tan00.wav'}
	];

	if(resources['seiran']) arr = [];

	loader.add(arr).load(() =>{
		Stage.Preload = undefined;

		let script_arr = [
			'entity/enemy/seiran.js',
			'stage/stage2Enemies.js'
		]
		GetScripts(script_arr, 'scripts/2hu/', function () {
			Stage.Init_();
		});
	})

	Debug.Grid(16, 1, 0xff0909, 0.2, Stage);
	Debug.Grid(32, 1, 0x0909ff, 0.5, Stage);
	Debug.Rect(G.Screenborder, G.Screenborder, _w - G.Screenborder * 2, _h - G.Screenborder * 2, 0x09ff09, 1, 0.5, null, Stage);
}

Stage.Init_ = function () {
	Stage.canUpdate = 1;

	if(!G.p0 || G.p0.kill) G.p0 = new PlayerReimu(0, 'wasd');
	G.p0.SetPos(_w / 2 - 128, _h / 1.2);

	for (let i = 0; i < 15; i++) {
		new stageFairy(_w * Math.random(), -32, null, Math.RandomInt(0,1));
	}

	G.UI.TimerStart(1, () => {
		G.UI.BossName('Seiran');
		G.UI.BossStarsAdd(1);
		G.UI.SpellcardShow('cool name lelelelelele');

		G.Nuke(1);
		Stage.F = new Seiran(null, -G.Deadzone);
		Stage.F.SetVelTo({ 'x': _w / 2, 'y': _h / 2 });

		G.UI.TimerStart(30, () => {
			if(!Stage.F.kill) {
				Stage.F.Explode();
				//G.UI.TimerStart(5, G.RestartStage);
				//
			} //else G.RestartStage();
		})
	})
}

Stage.Update = function(delta) {

}