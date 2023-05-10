const Base = require("../../../lib/base.js");

/**
 * 路由
 */
class Routes extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/route".fullname();
		// 文件拓展名
		this.extension = "route.json";
		// 文件存放目录
		this.dir = "/apps";
	}
}

module.exports = new Routes();