const Base = require("../../../lib/base.js");

/**
 * 控制器
 */
class Controller extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/controller".fullname();
		// 文件拓展名
		this.extension = "controller.json";
		// 文件存放目录
		this.dir = "/apps";
	}
}

module.exports = Controller