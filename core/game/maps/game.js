const Base = require("../../../lib/base.js");

/**
 * 地图
 */
class Maps extends Base {
	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this.path = "/game/data/map".fullname(__dirname);
		// 文件拓展名
		this.extension = "map.json";
		this.dir = "/game";
		this.init();
	}
}

/**
 * 查看位置信息
 * @param {String} name 地图名称
 * @param {String} located 方位
 * @returns {Object} 范围位置详细信息
 */
Maps.prototype.address = function(name, located) {
	var map = this.get(name);
	if (map) {
		var addr = map.address.getObj({
			located
		});
		if (addr && !addr.roles) {
			addr.roles = {};
		}
		return addr
	}
	return null;
}

/**
 * 刷新怪物
 * @param {Object} addr 地址
 */
Maps.prototype.refreshMonster = function(map, addr) {
	var list = addr.monster;
	if (list) {
		if (!addr.monsters) {
			addr.monsters = {}
		}

		for (var i = 0; i < list.length; i++) {
			var o = list[i];
			// 循环判断当前有几个怪物
			for (var n = 1; n <= o.num; n++) {
				// 设定读取每个怪物的名称
				var name = o.name + n;
				// 读取怪物信息
				var obj = addr.monsters[name];
				// 判断怪物是否存在
				if (!obj) {
					// 如果不存在则创建怪物
					var monster = $.game.monster.create(o.name, {
						name,
						map,
						located: addr.located
					});
					if (monster) {
						addr.monsters[name] = 1;
					}
				} else if (!addr.monsters[name]) {
					// 如果不存在则创建怪物
					var monster = $.game.monster.create(o.name, {
						name,
						map,
						located: addr.located
					});
					addr.monsters[name] = 1;
				}
			}
		}

		// 重新赋值，写入文件中
		// addr.monsters = addr.monsters;
	}
}

/**
 * 刷新地图的怪物Monster和物品item
 * @param {String} name 地图名称
 * @param {String} located 方位
 * @returns {Object} 刷新完成返回true
 */
Maps.prototype.refresh = function(name, located) {
	if (located) {
		var addr = this.address(name, located);
		this.refreshMonster(name, addr);
	} else if (name) {
		var map = this.get(name);
		if (map) {
			var list = map.address;
			for (var i = 0; i < list.length; i++) {
				this.refreshMonster(name, list[i]);
			}
		}
	} else {
		for (var k in this.dict) {
			var map = this.dict[k];
			var list = map.address;
			if (list) {
				for (var i = 0; i < list.length; i++) {
					this.refreshMonster(map.name, list[i]);
				}
			}
		}
	}
}

/**
 * 地区刷新器，用于刷新怪物和物品
 */
Maps.prototype.refresher = function() {
	if (this.timer) {
		clearInterval(this.timer);
	}
	this.timer = setInterval(() => {
		this.refresh();
	}, 60000);
}

/**
 * 初始化之后
 */
Maps.prototype.init_after = function() {
	setTimeout(() => {
		this.refresh();
		this.refresher();
	}, 1000)
}

module.exports = new Maps();