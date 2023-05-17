const Base = require("../../../lib/base.js");

/**
 * 任务
 */
class Quest extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.path = "/game/data/quest".fullname(__dirname);
		// 文件拓展名
		this.extension = "quest.json";
		this.dir = "/data";
		this.init();
	}
}

/**
 * 任务刷新活动任务
 */
Quest.prototype.refresh = function() {
	
}

/**
 * 任务刷新器，用于定时刷新活动任务
 */
Quest.prototype.refresher = function() {
	this.timer = setInterval(() => {
		this.refresh();
	}, 1000);
}

module.exports = new Quest();