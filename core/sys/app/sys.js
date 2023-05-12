const Base = require("../../../lib/base.js");

/**
 * 应用
 */
class App extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/app".fullname(__dirname);
		// 文件拓展名
		this.extension = "app.json";
		// 文件存放目录
		this.dir = "/apps";
		this.init();
	}
}

module.exports = new App();