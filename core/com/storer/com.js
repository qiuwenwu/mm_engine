const Base = require("../../../lib/base.js");

/**
 * 仓储器
 */
class Storer extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/storer".fullname();
		// 文件拓展名
		this.extension = "storer.json";
		// 文件存放目录
		this.dir = "/apps";
		this.init();
	}
}

/**
 * 仓储器初始化后
 */
Storer.prototype.init_after = function() {
	for (var k in this.dict) {
		var cs = this.dict[k];
		var key = cs.jsonFile.dirname().basename();
		this[key] = cs;
	}
}


/**
 * 写入
 * @param {String} type
 * @param {String} key
 * @param {Object} value
 */
Storer.prototype.write = function(type, key, value) {
	
}

/**
 * 读取
 * @param {String} type
 * @param {String} key
 */
Storer.prototype.read = function(type, key) {
	
}

module.exports = new Storer();