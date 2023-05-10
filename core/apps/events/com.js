const Base = require("../../../lib/base.js");

/**
 * 控制器
 */
class Events extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/event".fullname();
		// 文件拓展名
		this.extension = "event.json";
		// 文件存放目录
		this.dir = "/apps";
	}
}

module.exports = new Events();