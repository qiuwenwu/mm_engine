const Base = require("../../../lib/base.js");

/**
 * 怪物
 */
class Monster extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.path = "/game/data/monster".fullname(__dirname);
		// 文件拓展名
		this.extension = "monster.json";
		this.dir = "/data";
		this.init();
	}
}

Monster.prototype.create_after = function(monster) {
	return monster
}

/**
 * 创建怪物
 * @param {Object} info 怪物信息
 * @param {Object} info 怪物信息
 * @returns {String} 返回null或错误提示
 */
Monster.prototype.create = function(name, info) {
	var name_new;
	if (typeof(info) === "string") {
		name_new = info;
		info = {
			name: name_new
		}
	} else {
		name_new = info.name;
	}
	// 如果不存在则创建怪物
	var monster = $.game.obj.get(name_new);
	if (monster) {
		return this.create_after(monster);
	}
	var m = this.get(name);
	if (!m) {
		// console.error(`不存在【${name}】怪物！`);
		return null;
	}
	var attr = m.attr;
	var model = Object.assign({}, m, attr, info);
	delete model.attr;
	monster = $.game.obj.add(name_new, model);
	return this.create_after(monster);
}

module.exports = new Monster();