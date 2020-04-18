Stage = new Container;
stage.addChild(Stage);

Stage.Init = function () {
	Stage.canUpdate = 1;
	G.SetResolution(1920, 979);
	G.UI.Init();

	//Debug.Line({ 'x': _w/ 2, 'y': 0}, { 'x': 0, 'y': _h }, 1, 0xff0909, 1)

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
	Stage.ttt = 0;
	Stage.a = 0;

	new EnemyFairyBasic(_w / 2 + 90 * -1, _h / 5, null, 0);
	new EnemyFairyBasic(_w / 2 + 90 * -2, _h / 5, 'b', 0);
	new EnemyFairyBasic(_w / 2 + 90 * -3, _h / 5, 'g', 0);

	new EnemyFairyBasic(_w / 2 + 90 * 1, _h / 5, null, 1);
	new EnemyFairyBasic(_w / 2 + 90 * 2, _h / 5, 'b', 1).budha = 1;
	new EnemyFairyBasic(_w / 2 + 90 * 3, _h / 5	, 'g', 1).invincible = 1;

	Stage.F = new EnemyFairyBasic(null, null, null, Math.RandomInt(0, 1));
	Stage.F2 = new EnemyFairyBasic(null, null, 'b', Math.RandomInt(0, 1));
	Stage.F3 = new EnemyFairyBasic(null, null, 'g', Math.RandomInt(0, 1));

	// new BulletEnemyBasic(null, null, 0, 5, 1, 1);
	// new BulletEnemyBasic(null, null, 0, 10, 1, 1);

	//G.PlaySound('music', '');

	Stage.renderTexture = PIXI.RenderTexture.create(_w, _h);
	Stage.renderTexture2 = PIXI.RenderTexture.create(_w, _h);
	Stage.currentTexture = Stage.renderTexture;

	Stage.outputSprite = new PIXI.Sprite(Stage.currentTexture);
	Stage.outputSprite.x = _w / 2;
	Stage.outputSprite.y = _h / 2;
	Stage.outputSprite.anchor.set(0.5);
	//Stage.outputSprite.zIndex = G.zIndex.EffectBack;
	Stage.outputSprite.scale.set(1.005);
	stage.addChild(Stage.outputSprite);

	// Debug.Grid(16, 1, 0xff0909, 0.2);
	// Debug.Grid(32, 1, 0x0909ff, 0.5);
	// Debug.Rect(G.Screenborder, G.Screenborder, _w - G.Screenborder * 2, _h - G.Screenborder * 2, 0x09ff09, 1, 0.5);

}

Stage.Update = function(delta) {
	// swap the buffers ...
	const temp = Stage.renderTexture;
	Stage.renderTexture = Stage.renderTexture2;
	Stage.renderTexture2 = temp;

	// set the new texture
	Stage.outputSprite.texture = Stage.renderTexture;
	//Stage.outputSprite.scale.set(1.2 + Math.sin(Stage.tt) * 0.2);

	render.render(stage, Stage.renderTexture2, false);

	Stage.t += 0.001 * delta;
	Stage.a += Stage.t;
	Stage.tt += 0.01 * delta;
	Stage.ttt += 1 * delta;

	let t = Stage.t,
		tt = Stage.tt,
		ttt = Stage.ttt,
		a = Stage.a;

	let args = [];
	args.x = _w / 2 + Math.sin(t) * 200;
	args.y = _h / 5.5 + Math.cos(t) * 100;
	args.str = 1;
	args.muff = 2;
	args.single = 1;

	Stage.F.SetVel(Stage.tt * 100, 2);
	Stage.F2.SetVel(Stage.tt * 100 + 360/ 3 * 1, 2);
	Stage.F3.SetVel(Stage.tt * 100 + 360/ 3 * 2, 2);

	if (Math.round(ttt) > 1) {
		//G.PlaySound('lol', snd_folder + 'se_tan00.wav', args);
		Stage.ttt = 0;
		for (let index = 1; index <= 15; index++) {
			//new BulletEnemyBasic(args.x, args.y, -tt + (360 / 15) * index, 6, Math.RandomInt(1,11), Math.RandomInt(0,15));
		}
	}
}