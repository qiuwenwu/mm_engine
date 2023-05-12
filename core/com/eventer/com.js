const Base = require("../../../lib/base.js");
require("./eventer.js");

/**
 * 事件管理器
 */
class Eventer extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/eventer".fullname();
		// 文件拓展名
		this.extension = "eventer.json";
		// 文件存放目录
		this.dir = "/apps";
		this.init();
	}
}

/**
 * 事件初始化后
 */
Eventer.prototype.init_after = function() {
	for (var k in this.dict) {
		var cs = this.dict[k];
		var key = cs.jsonFile.dirname().basename();
		this[key] = cs;
	}
}

module.exports = new Eventer();