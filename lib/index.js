var Com = require("./com.js");
var Sys = require("./sys.js");
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
	$.sys = new Sys();
	this.com = $.com;
	this.game = $.game;
	this.sys = $.sys;
}

module.exports = Lib;