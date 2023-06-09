const Lib = require("./lib");

/**
 * 超级美眉游戏引擎
 */
class MM_engine {
	/**
	 * 构造函数
	 * @param {Object} config 配置参数
	 */
	constructor(config) {
		this.config = {};

		if (config.path) {
			$.runPath = config.path + $.slash;
			$.gamePath = $.runPath + "game" + $.slash;
		}

		this.init(config);
	}
}

/**
 * 加载模块
 */
MM_engine.prototype.loadMod = function(config) {
	this.lib = new Lib(config);
}

/**
 * 初始化
 * @param {Object} config 配置参数
 */
MM_engine.prototype.init = function(config) {
	this.config = Object.assign(this.config, config);
	this.loadMod(config);
}

/**
 * 运行
 */
MM_engine.prototype.run = function() {

}

module.exports = MM_engine;