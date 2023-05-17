const Base = require("../../../lib/base.js");

/**
 * 物品
 */
class Npc extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.path = "/game/data/npc".fullname(__dirname);
		// 文件拓展名
		this.extension = "npc.json";
		this.dir = "/data";
		this.init();
	}
}

module.exports = new Npc();
