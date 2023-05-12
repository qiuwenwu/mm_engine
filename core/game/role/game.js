const Base = require("../../../lib/base.js");

/**
 * 角色
 */
class Role extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.path = "/game/data/quest".fullname(__dirname);
		// 文件拓展名
		this.extension = "quest.json";
		this.dir = "/game";
		this.init();
	}
}

module.exports = new Role();