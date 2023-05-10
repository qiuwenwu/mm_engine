const Base = require("../../../lib/base.js");

/**
 * 计时器
 */
class Timers extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/timer".fullname();
		// 文件拓展名
		this.extension = "timer.json";
		// 文件存放目录
		this.dir = "/apps";
	}
}

module.exports = new Timers();