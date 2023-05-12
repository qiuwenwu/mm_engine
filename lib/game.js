const Base = require("./base.js");

/**
 * 游戏开发
 */
class Game extends Base {
	constructor() {
		super();
		this.path = "/game".fullname();
		// 文件拓展名
		this.extension = "game.json";
		// 文件存放目录
		this.dir = "/game";
		// 重新加载
		this.reload = false;
		this.init();
	}
}

/**
 * 游戏初始化后
 */
Game.prototype.init_after = function() {
	for (var k in this.dict) {
		var cs = this.dict[k];
		var key = cs.jsonFile.dirname().basename();
		this[key] = cs;
	}
}

module.exports = Game;