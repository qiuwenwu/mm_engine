const {
	types
} = require("node:util");

if (!global.$) {
	global.$ = {}
}
/**
 * 行为器
 */
class Ref {
	/**
	 * 构造函数
	 * @param {Object} obj 对象
	 */
	constructor(obj) {
		this.init(obj);
	}
}

/**
 * 初始化
 * @param {Object} config 配置参数
 * @returns {Object} 执行结果
 */
Ref.prototype.init = function(obj) {
	Object.assign(this, obj);
	this.data = this.data || {};
	this.methods = this.methods || {};
	return this;
}

/**
 * 主程序
 * @param {Object} args 参数集合
 * @returns {Object} 执行结果
 */
Ref.prototype.main = async function(...args) {
	return null;
}

/**
 * 使用
 * @param {Object} args 参数集合
 * @returns {Object} 执行结果
 */
Ref.prototype.use = async function(...args) {
	return null;
}

/**
 * 指令
 * @param {Object} args 参数集合
 * @returns {Object} 执行结果
 */
Ref.prototype.cmd = async function(...args) {
	return null;
}

/**
 * 运行程序
 * @param {String} name 函数名
 * @param {Object} args 参数集合
 * @returns {Object} 执行结果
 */
Ref.prototype.run = async function(name, ...args) {
	var ret;
	var key = name + "_before";
	if (this[key]) {
		ret = this[key](...args);
		if (types.isPromise(ret)) {
			ret = await ret
		}
	}
	key = name + "_check";
	if (this[key]) {
		ret = this[key](...args);
		if (types.isPromise(ret)) {
			ret = await ret
		}
		if (ret) {
			return ret;
		}
	}

	if (this[name]) {
		ret = this[name](...args);
		if (types.isPromise(ret)) {
			ret = await ret
		}
		if (ret) {
			key = name + "_after";
			if (this[key]) {
				ret = this[key](...args);
				if (types.isPromise(ret)) {
					ret = await ret
				}
			}
		}
	}
	return ret;
}

class Action {
	constructor(obj) {
		var act = new Ref(obj);
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
}

module.exports = Action;