const Base = require("../../../lib/base.js");

/**
 * 用户管理器
 */
class User extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/user".fullname();
		// 文件拓展名
		this.extension = "user.json";
		// 文件存放目录
		this.dir = "/apps";
		this.init();
	}
}

module.exports = new User();