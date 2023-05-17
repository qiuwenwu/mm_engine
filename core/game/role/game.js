const Base = require("../../../lib/base.js");
const Actions = require("./actions.js");

/**
 * 角色
 */
class Role extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.path = "/game/data/role".fullname(__dirname);
		// 文件拓展名
		this.extension = "role.json";
		this.dir = "/data";
		this.init();
	}
}

/**
 * 脚本实例
 * @param {Object} obj 对象
 */
Role.prototype.script = function(obj) {
	return new Actions(obj);
}

module.exports = new Role();