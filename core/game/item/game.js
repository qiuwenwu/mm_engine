const Base = require("../../../lib/base.js");

/**
 * 物品
 */
class Item extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		// 检索的文件路径
		this.path = "/game/data/item".fullname();
		// 文件拓展名
		this.extension = "item.json";
		this.dir = "/game";
		this.init();
	}
}

module.exports = new Item();
