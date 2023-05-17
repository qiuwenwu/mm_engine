const Base = require("../../../lib/base.js");
require("./driver.js");

/**
 * 行为驱动管理器
 */
class Driver extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/driver".fullname();
		// 文件拓展名
		this.extension = "driver.json";
		// 文件存放目录
		this.dir = "/apps";
		this.init();
	}
}

/**
 * 行为驱动初始化后
 */
Driver.prototype.init_after = function() {
	for (var k in this.dict) {
		var cs = this.dict[k];
		var key = cs.jsonFile.dirname().basename();
		this[key] = cs;
	}
}

module.exports = new Driver();