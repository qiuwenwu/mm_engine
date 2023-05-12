const Base = require("../../../lib/base.js");

/**
 * 宠物
 */
class Pet extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.path = "/game/data/pet".fullname(__dirname);
		// 文件拓展名
		this.extension = "pet.json";
		this.dir = "/game";
		this.init();
	}
}

module.exports = new Pet();