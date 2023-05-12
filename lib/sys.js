const Base = require("./base.js");

/**
 * 系统开发
 */
class Sys extends Base {
	constructor() {
		super();
		this.path = "/sys".fullname();
		// 文件拓展名
		this.extension = "sys.json";
		// 文件存放目录
		this.dir = "/sys";
		// 重新加载
		this.reload = false;
		this.init();
	}
}

/**
 * 系统初始化后
 */
Sys.prototype.init_after = function() {
	for (var k in this.dict) {
		var cs = this.dict[k];
		var key = cs.jsonFile.dirname().basename();
		this[key] = cs;
	}
}

module.exports = Sys;