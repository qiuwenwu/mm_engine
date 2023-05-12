const Base = require("../../../lib/base.js");
require("./msger.js");

/**
 * 消息处理器
 */
class Msger extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/msger".fullname();
		// 文件拓展名
		this.extension = "msger.json";
		// 文件存放目录
		this.dir = "/apps";
		this.init();
	}
}

/**
 * 事件初始化后
 */
Msger.prototype.init_after = function() {
	for (var k in this.dict) {
		var cs = this.dict[k];
		var key = cs.jsonFile.dirname().basename();
		this[key] = cs;
	}
}

module.exports = new Msger();