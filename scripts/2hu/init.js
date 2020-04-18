/*
	INIT
*/

G.Init = function() {
	ResizeCanvas();
	G.SetResolution(window.innerWidth, window.innerHeight);

	G.UI = new GUI({ 'debug': 1});
	G.Menu = new Menu();
	
	//Stage.Init();
	Stage = [];
	G.LoadStage('stageMenu');

	G.Update = function (delta) {
		if (G.Timescale) {
			delta = G.Timescale;
			ticker.deltaMS *= G.Timescale;
		} 
		G.AnimateFrameSpeed = Math.abs(0.2 * delta);

		if(!G.Menu.active)G.EntitiesUpdate(delta);
		if(G.UI) G.UI.Update(delta);
		if(G.Menu) G.Menu.Update(delta);
		if(G.Shake) G.Shake();

		if (Stage.canUpdate && !G.Menu.active) Stage.Update(delta);
	}

	ticker.add(delta => {
		G.Update(delta)
	});	
}
