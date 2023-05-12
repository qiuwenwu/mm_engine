const Base = require("../../../lib/base.js");
require("./timer.js");

/**
 * 定时器
 */
class Timer extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/timer".fullname();
		// 文件拓展名
		this.extension = "timer.json";
		// 文件存放目录
		this.dir = "/apps";
		this.init();
	}
}

/**
 * 计时器初始化后
 */
Timer.prototype.init_after = function() {
	for (var k in this.dict) {
		var cs = this.dict[k];
		var key = cs.jsonFile.dirname().basename();
		this[key] = cs;
	}
}

module.exports = new Timer();