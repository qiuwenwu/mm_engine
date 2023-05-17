const Base = require("../../../lib/base.js");

/**
 * 门派
 */
class Sect extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		// 检索的文件路径
		this.path = "/game/cache/sect".fullname(__dirname);
		// 文件拓展名
		this.extension = "sect.json";
		this.dir = "/cache";
		this.init();
	}
}

module.exports = new Sect();