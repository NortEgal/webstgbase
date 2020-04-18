/*
	DEBUG

*/

Debug = [];

Debug.Line = function (posStart, posEnd, width, color, alpha) {
	let graphics = new Graphics;
	stage.addChild(graphics);
	graphics.position.set(posStart.x, posStart.y);
	graphics.lineStyle(width, color, alpha);
	graphics.lineTo(posEnd.x, posEnd.y);
	return graphics;
}

Debug.Grid = function (size, width, color, alpha, parent) {
	if(parent == null) parent = stage;
	let graphics = new Graphics;
	parent.addChild(graphics);
	stage.position.set(0, 0);
	graphics.lineStyle(width, color, alpha);

	let w = _w / size,
		h = _h / size;

	for (let i = 1; i < w; i+=2) {
		graphics.lineTo(size * i, -1);
		graphics.lineTo(size * i, _h+1);
		graphics.lineTo(size * (i + 1), _h+1);
		graphics.lineTo(size * (i + 1), -1);
	}

	graphics.lineTo(-1, -1);

	for (let i = 1; i < h; i+=2) {
		graphics.lineTo(-1, size * i);
		graphics.lineTo(_w + 1, size * i);
		graphics.lineTo(_w + 1, size * (i + 1));
		graphics.lineTo(-1, size * (i + 1));
	}
}

Debug.Rect = function (pos_x, pos_y, size_x, size_y, color, width, alpha, zIndex, parent) {
	if(parent == null) parent = stage;
	let graphics = new Graphics;
	graphics.lineStyle(width, color, alpha);
	graphics.drawRect(pos_x, pos_y, size_x, size_y);
	if (zIndex != null) graphics.zIndex = zIndex;
	parent.addChild(graphics);
	return graphics;
}

Debug.Circle = function (pos_x, pos_y, radius, width, color, alpha, zIndex, parent, scaleOffset) {
	let graphics = new Graphics;
	graphics.lineStyle(width, color, alpha);
	graphics.drawCircle(0, 0, radius);
	graphics.zIndex = zIndex;
	if (parent == null) stage.addChild(graphics); else {
		parent.addChild(graphics);
		graphics.scale.set(scaleOffset);
	}
	graphics.position.set(pos_x, pos_y);
	return graphics;
}