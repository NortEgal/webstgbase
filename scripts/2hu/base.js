/*
	BASE

	tile size					- 32 x 32	(scale by 2)
	window size 40x30 tiles		- 1280 x 960
	field aspect 				- 24 : 28			
	768 x 896 					original
	839.14 x 979 				chrome
	925.71 x 1080				fullscreen
*/

let _ScrW = 925.71,
	_ScrH = 1080;

const Application = PIXI.Application,
	Settings = PIXI.settings,
	Container = PIXI.Container,
	Sprite = PIXI.Sprite,
	Texture = PIXI.Texture,
	BaseTexture = PIXI.BaseTexture,
	Rectangle = PIXI.Rectangle,
	Graphics = PIXI.Graphics,
	Text = PIXI.Text,
	Sound = PIXI.sound;

const canvas = document.getElementsByTagName('canvas')[0];

const render = new PIXI.Renderer({
	view: canvas,
	width: _ScrW,
	height: _ScrH,
	resolution: window.devicePixelRatio,
	//autoResize: true,
	antialias: false,
	//transparent: true
});

//Settings.ROUND_PIXELS = true;
Settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
Settings.PRECISION_FRAGMENT = 'highp';
Settings.SORTABLE_CHILDREN = true;

const stage = new PIXI.Container();

const ticker = new PIXI.Ticker();
ticker.add(() => {
	render.render(stage)
});
ticker.minFPS = 59.99;
// ticker.maxFPS = 60;
ticker.start();

const loader = new PIXI.Loader();
const resources = loader.resources;

/*
	BASE FUNCTIONS
*/

$(window).resize(ResizeCanvas)
window.onorientationchange = ResizeCanvas;
function ResizeCanvas() {
	var width = $(window).width();
	var height = $(window).height();
	var ratioX = width / _ScrW;
	var ratioY = height / _ScrH;
	ratio = Math.min(ratioX, ratioY);

	var view = render.view;

	var new_ScrW = Math.min(_ScrW * ratio, _ScrW);
	var new_ScrH = Math.min(_ScrH * ratio, _ScrH);
	view.style.width = new_ScrW + "px";
	view.style.height = new_ScrH + "px";
}

function GetScripts(scripts, path, callback) {
	var progress = 0;
	scripts.forEach(function (script) {
		$.getScript(path + script, function () {
			if (++progress == scripts.length) callback();
		});
	});
}

function GetURL (string) {
	let url = new URLSearchParams(window.location.search);
	return url.get(string)
}