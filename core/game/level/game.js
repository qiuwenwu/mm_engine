const Base = require("../../../lib/base.js");

/**
 * 其他类型
 */
class Level extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.path = "/game/data/level".fullname(__dirname);
		// 文件拓展名
		this.extension = "level.json";
		this.dir = "/game";
		this.init();
	}
}

/**
 * 获取下一个等级
 * @param {String} name 等级名称
 * @param {Number|String} lv_now 当前等级
 */
Level.prototype.getNext = function(name, lv_now = 1) {
	var obj;
	var info = this.get(name);
	if (info) {
		var list = info.list;
		for (var i = 0; i < list.length - 1; i++) {
			if (list[i].lv == lv_now) {
				obj = list[i + 1];
				break;
			}
		}
		info.list = list;
	}
	return obj;
}

/**
 * 批量设置等级
 * @param {String} name 等级名称
 * @param {Array} arr_lv 等级组
 * @param {Array} arr_exp 组
 */
Level.prototype.batchSet = function(name, arr_lv, arr_exp) {
	var info = this.get(name);
	if (info) {
		var list = [];
		for (var i = 0; i < arr_lv.length; i++) {
			list.push({
				lv: arr_lv[i],
				exp: arr_exp[i]
			});
		}
		info.list = list;
	}
}

/**
 * 规则设置等级
 * @param {String} name 等级名称
 * @param {Function} func 规则设置
 */
Level.prototype.ruleSet = function(name, func) {
	var info = this.get(name);
	if (info) {
		var list = info.list;
		for (var i = 0; i < list.length; i++) {
			var o = list[i];
			func(o, i);
		}
		info.list = list;
	}
}

/**
 * 新建等级列表
 * @param {String} name 等级名称
 * @param {Number} count 创建数量
 */
Level.prototype.newList = function(name, count) {
	var info = this.get(name);
	if (info) {
		var list = [];
		for (var i = 0; i < count; i++) {
			var lv = i + 1;
			list.push({
				lv,
				exp: lv * 100 * Math.ceil(lv / 10)
			});
		}
		info.list = list;
	}
}

/**
 * 新建境界列表
 * @param {String} name 境界名称
 */
Level.prototype.newListOf = function(name) {
	var arr = [1500, 4000, 13000, 18000, 34500, 42000, 66000, 76000, 107500, 120000, 159000, 174000, 220500, 238000,
		292000, 312000, 373500, 396000, 465000, 490000, 566500, 594000, 678000, 708000, 799500, 832000, 931000,
		966000, 1072500, 1110000, 1224000, 1264000, 1385500, 1428000, 1557000, 1602000, 1738500, 1786000,
		1930000, 1980000, 2131500, 2184000, 2343000, 2398000
	];

	var info = this.get(name);
	if (info) {
		var list = info.list;
		for (var i = 0; i < list.length; i++) {
			var o = list[i];
			if (arr.length > i) {
				o.exp = arr[i];
			}
		}
		info.list = list;
	}
}

module.exports = new Level();