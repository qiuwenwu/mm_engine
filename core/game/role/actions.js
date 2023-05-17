const ActionsBase = require("../../../lib/actions.js");
const Role = require("./role.js");

class Actions extends ActionsBase {
	/**
	 * 构造函数
	 * @param {Object} obj
	 */
	constructor(obj) {
		super(obj);
		return this.init(obj);
	}
}

/**
 * 实例对象
 * @param {Object} obj
 */
Actions.prototype.ref = function(obj) {
	return new Role(obj);
}

module.exports = Actions;