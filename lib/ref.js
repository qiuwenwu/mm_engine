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
Ref.prototype.exec = function(name, func_name, ...args) {
	var tip;
	var cs = this.dict[name];
	if (cs) {
		if (!cs.jsFile) {
			return "执行错误！原因：脚本文件不存在！\n" + cs.script;
		}
		try {
			tip = cs.run(func_name, ...args);
		} catch (e) {
			console.error(e);
			tip = "执行错误！原因：" + e.message;
		}
	
		if (this.reload) {
			if (process.env.NODE_ENV == "development" || $.config.mode == "dev") {
				// 用完后重载模块
				var {
					methods,
					cache
				} = this.reLoadJS(cs.jsFile);
				cs.methods = methods;
				for (var k in cache) {
					cs[k] = cache[k]
				}
			}
		}
	} else {
		tip = `【${name}】不存在！`
	}
	return tip;
}

module.exports = Ref;