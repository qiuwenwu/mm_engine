const util = require("util");
const segment = require("icqq");

class Actions {
	/**
	 * 构造函数
	 */
	constructor(info, cs) {
		Object.assign(this, info, cs);

		this.message = "";
	}
}

/**
 * 1. 安装程序时
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.install = async function(e) {

}

/**
 * 2. 初始化时
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.init = async function(e) {

}

/**
 * 3. 启动程序时
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.start = async function(e) {}

/**
 * 4. 暂停程序时
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.stop = async function(e) {}

/**
 * 5. 结束程序时
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.end = async function(e) {

}

/**
 * 6. 卸载程序时
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.unInstall = async function(e) {

}

/**
 * 7. 运行程序前
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.run = async function(name, ...args) {
	var ret;
	var func = this[name + "_before"];
	if (func) {
		await func(...args);
	}
	func = this[name + "_check"];
	if (func) {
		ret = await func(...args);
		if (ret) {
			return ret;
		}
	}
	
	func = this[name];
	if (func) {
		ret = await func(...args);
		if (ret) {
			func = this[name + "_after"];
			if (func) {
				ret = await func(...args);
			}
		}
	}
	return ret;
}

/**
 * 7. 运行程序前
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.run = async function(e, ...args) {
	await this.run_before(e, ...args);
	var ret = await this.run_check(e, ...args);
	if (ret) {
		return ret;
	}
	ret = await this.main(e, ...args);
	if (ret) {
		e.ret = ret;
		ret = await this.run_after(e, ...args);
	}
	return ret;
}

/**
 * 7-1. 运行程序后
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.run_before = async function(e, ...args) {
	return null;
}

/**
 * 7-2. 运行程序后
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.run_before = async function(e, ...args) {
	return null;
}

/**
 * 7-3. 运行程序后
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.run_after = async function(e, ...args) {
	return null;
}

/**
 * 7-4. 运行主程序
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.main = async function(e, ...args) {
	return null;
}

/**
 * 运行主程序
 * @param {Object} e 事件管理器
 * @returns {String} 执行结果
 */
Actions.prototype.use = async function(e, ...args) {

}

module.exports = Actions;