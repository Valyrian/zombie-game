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

	that.render = function () {
		that.context.drawImage(
			that.image,
			0,
			0,
			that.width,
			that.height,
			that.x,
			that.y,
			that.width,
			that.height);
	};

	return that;
}
