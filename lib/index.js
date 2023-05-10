var Com = require("./com.js");
var Game = require("./game.js");

/**
 * 游戏系统公共类
 */
class Lib {
	/**
	 * 构造函数
	 */
	constructor() {
		this.init();
	}
}

Lib.prototype.init = function() {
	$.com = new Com();
	$.game = new Game();
}

module.exports = Lib;