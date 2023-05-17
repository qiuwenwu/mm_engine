const {
	types
} = require("node:util");

/**
 * 行为器
 */
class Ref {
	/**
	 * 构造函数
	 * @param {Object} obj 对象
	 */
	constructor(obj) {
		this.msg = [];
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

/**
 * 执行脚本
 * @param {String} name 名称
 * @param {String} func_name 执行方法
 * @param {Object} args 参数集合
 * @returns {Object} 返回执行结果
 */
Ref.prototype.exec = async function(name, func_name, ...args) {
	var cs = this.dict[name];
	var ret;
	var key = func_name + "_before";
	if (cs[key]) {
		ret = cs[key](...args);
		if (types.isPromise(ret)) {
			ret = await ret
		}
	}
	key = func_name + "_check";
	if (cs[key]) {
		ret = cs[key](...args);
		if (types.isPromise(ret)) {
			ret = await ret
		}
		if (ret) {
			return ret;
		}
	}
	
	if (cs[func_name]) {
		ret = cs[func_name](...args);
		if (types.isPromise(ret)) {
			ret = await ret
		}
		if (ret) {
			key = func_name + "_after";
			if (cs[key]) {
				ret = cs[key](...args);
				if (types.isPromise(ret)) {
					ret = await ret
				}
			}
		}
	}
	return ret;
}

module.exports = Ref;