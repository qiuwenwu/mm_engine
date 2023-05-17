const Ref = require("./ref.js");

class Action {
	constructor(obj) {
		return this.init(obj);
	}
}

/**
 * 实例对象
 * @param {Object} obj
 */
Action.prototype.ref = function(obj) {
	return new Ref(obj);
}

/**
 * 初始化
 * @param {Object} obj
 */
Action.prototype.init = function(obj) {
	var act = this.ref(obj);
	return new Proxy(act, {
		get: (target, prop) => {
			var value = target[prop];
			if (value !== undefined) {
				return value;
			}
			value = target.data[prop];
			if (value !== undefined) {
				return value;
			}
			return target.methods[prop];
		},
		set: function(target, prop, value) {
			if (target[prop] !== undefined) {
				target[prop] = value;
			} else if (target.data[prop] !== undefined) {
				target.data[prop] = value;
			} else if (target.methods[prop] !== undefined) {
				target.methods[prop] = value;
			} else {
				target[prop] = value;
			}
			return true
		}
	});
}

module.exports = Action;