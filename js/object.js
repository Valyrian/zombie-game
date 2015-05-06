function CreateObject (options) {
	var that = {};
	that.role = "object";

	that.id = nextId++;
	that.context = options.context;
	that.width = options.width || 64;
	that.height = options.height || 64;

	that.buffer = {};
	that.buffer.up = 20;
	that.buffer.left = 20;
	that.buffer.right = 20;
	that.buffer.down = 0;

	that.image = options.image;
	that.x = options.x;
	that.y = options.y;

	that.offset = {};

	var getCanvasPos = function (offset) {
		result = {};
		result.x = that.x - offset.x
		result.y = that.y - offset.y
		return result;
	}

	that.render = function (offset) {
		var canvasPos = getCanvasPos(offset);
		that.context.drawImage(
			that.image,
			0,
			0,
			that.width,
			that.height,
			canvasPos.x,
			canvasPos.y,
			that.width,
			that.height);
	};

	return that;
}
