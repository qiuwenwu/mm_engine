const Base = require("../../../lib/base.js");

/**
 * 目标对象 - 用于战斗解析
 */
class Team extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		// 检索的文件路径
		this.path = "/cache/team".fullname(__dirname);
		// 文件拓展名
		this.extension = "team.json";
		this.dir = "/game";
		this.init();
	}
}

module.exports = new Team();