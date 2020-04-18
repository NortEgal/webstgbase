Stage = new Container;
stage.addChild(Stage);

Stage.Init = function () {
	G.SetResolution(1920, 979);
	G.UI.Init();
	if (!Stage.Preload) Stage.Init_(); else Stage.Preload();
}

Stage.Preload = function () {
	Stage.Preload = undefined;
	Stage.Init_();
}

Stage.Init_ = function () {
	Stage.canUpdate = 1;

	if (!G.p0) G.p0 = new PlayerReimu(0, 'wasd');
	G.p0.SetPos(_w / 2 - 128, _h / 1.2);

}

Stage.Update = function (delta) {

}

//шаблон кароче