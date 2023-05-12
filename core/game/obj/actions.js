const RefBase = require("../../../lib/ref.js");
const ActionsBase = require("../../../lib/actions.js");

class Ref extends RefBase {
	constructor() {
		super()
	}
}

Ref.prototype.attack = function() {
	console.log("攻击");
}

class Actions extends ActionsBase {
	/**
	 * 构造函数
	 * @param {Object} obj
	 */
	constructor(obj) {
		super(obj);
	}
}

/**
 * 实例对象
 * @param {Object} obj
 */
Actions.prototype.ref = function(obj) {
	return new Ref(obj);
}

module.exports = Actions;