const Base = require("../../../lib/base.js");
const Actions = require("./actions.js");

/**
 * 目标对象 - 用于战斗解析
 */
class Obj extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		// 检索的文件路径
		this.path = "/game/cache/obj".fullname(__dirname);
		// 文件拓展名
		this.extension = "obj.json";
		this.dir = "/cache";
		this.init();
	}
}

/**
 * 脚本实例
 * @param {Object} obj 对象
 */
Obj.prototype.script = function(obj) {
	return new Actions(obj);
}

/**
 * 对象刷新，用于刷新玩家、怪物行动和死亡掉落物品
 */
Obj.prototype.refresh = function() {
}

/**
 * 对象刷新器，用于定时刷新玩家、怪物行动和死亡掉落物品
 */
Obj.prototype.refresher = function() {
	if (this.timer) {
		clearInterval(this.timer);
	}
	this.timer = setInterval(() => {
		this.refresh();
	}, 1000);
}

/**
 * 初始化之后
 */
Obj.prototype.init_after = function() {
	this.refresh();
	this.refresher();
}

module.exports = new Obj();