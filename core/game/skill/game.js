const Base = require("../../../lib/base.js");

/**
 * 技能
 */
class Skill extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.path = "/game/data/skill".fullname(__dirname);
		// 文件拓展名
		this.extension = "skill.json";
		this.dir = "/game";
		this.init();
	}
}

module.exports = new Skill();