const Base = require("../../../lib/base.js");

/**
 * 控制器
 */
class Stores extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/data".fullname();
		// 文件拓展名
		this.extension = "data.json";
		// 文件存放目录
		this.dir = "/apps";
	}
}

module.exports = new Stores();