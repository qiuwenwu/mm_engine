const Ref = require("../../../lib/ref.js");

$.dict_name = {
	"状态": "state",
	"五行": "elements",
	"攻击力": "ATK",
	"防御力": "DEF",
	"敏捷": "DEX",
	"速度": "SPD",
	"命中": "HIT",
	"灵力": "MP",
	"体力": "HP",
	"内力": "LP",
	"活力": "LP",
	"精神力": "INT",
	"生命力": "HP",
	"魔法力": "MP",
	"法力": "MP",
	"生命力上限": "HP_max",
	"魔法力上限": "MP_max",
	"活力上限": "LP_max",
	"体力上限": "HP_max",
	"法力上限": "MP_max",
	"内力上限": "LP_max",
	"state": "state",
	"elements": "elements",
	"ATK": "ATK",
	"DEF": "DEF",
	"DEX": "DEX",
	"SPD": "SPD",
	"HIT": "HIT",
	"MP": "MP",
	"HP": "HP",
	"LP": "LP",
	"INT": "INT",
	"HP": "HP",
	"HP_max": "HP_max",
	"MP_max": "MP_max",
	"LP_max": "LP_max",
	"atk": "ATK",
	"def": "DEF",
	"dex": "DEX",
	"spd": "SPD",
	"hit": "HIT",
	"mp": "MP",
	"hp": "HP",
	"lp": "LP",
	"int": "INT",
	"hp": "HP",
	"hp_max": "HP_max",
	"mp_max": "MP_max",
	"lp_max": "LP_max",


	// 中文
	"角色名": "name",
	"职业": "job",
	"组队": "team",
	"师傅": "teacher",
	"徒弟": "student",
	"门派": "sect",
	"伴侣": "companion",
	"伴侣亲密度": "companion_intimacy",
	"道侣": "couple",
	"道侣亲密度": "couple_intimacy",
	"经验值": "exp",
	"经验": "exp",
	"修为": "exp",
	"经验值上限": "exp_max",
	"修为上限": "exp_max",
	"灵力": "mana",
	"灵力上限": "mana_max",
	"现金": "money",
	"元宝": "money",
	"点券": "money",
	"银两": "coin",
	"货币": "coin",
	"金币": "coin",
	"铜钱": "coin",
	"灵石": "stone",
	"灵晶": "stone",
	"等级": "lv",
	"基础等级": "lv_base",
	"修武等级": "lv_wushu",
	"修武境界": "lv_wushu",
	"修仙等级": "lv_immortal",
	"修仙境界": "lv_immortal",
	"用户": "username",
	"所属用户": "username",
	"地图": "map",
	"所在地图": "map",
	"位置": "address",
	"所在位置": "address",
	"方位": "located",
	"入口": "portal",
	"会员": "vip",
	"管理员": "gm",
	"属性点": "ap",
	"技能点": "sp",
	"功绩": "exploit",

	// 英文
	"name": "name",
	"job": "job",
	"team": "team",
	"family": "family",
	"sect": "sect",
	"companion": "companion",
	"companion_intimacy": "companion_intimacy",
	"couple": "couple",
	"couple_intimacy": "couple_intimacy",
	"EXP": "exp",
	"exp": "exp",
	"EXP_max": "exp_max",
	"exp_max": "exp_max",
	"Mana": "mana",
	"mana": "mana",
	"Mana_max": "mana_max",
	"mana_max": "mana_max",
	"lv": "lv",
	"lv_base": "lv_base",
	"lv_wushu": "lv_wushu",
	"lv_immortal": "lv_immortal",
	"money": "money",
	"coin": "coin",
	"stone": "stone",
	"username": "username",
	"map": "map",
	"portal": "portal",
	"located": "located",
	"address": "address",
	"vip": "vip",
	"VIP": "vip",
	"gm": "gm",
	"GM": "gm",
	"ap": "ap",
	"sp": "sp",
	"exploit": "exploit"
}

class Obj extends Ref {
	constructor(obj) {
		super(obj);
	}
}

/**
 * 查询角色属性
 * @param {String} name 名称
 * @param {String} value 默认值
 * @param {String|Number} 返回值
 */
Obj.prototype.get = function(name, value = 0) {
	var key = $.dict_name[name];
	if (key) {
		return this[key] || value;
	}
	return value
}

/**
 * 修改角色信息
 * @param {String} name 信息名称
 * @param {String|Number} name
 */
Obj.prototype.set = function(name, value) {
	var key = $.dict_name[name];
	if (key) {
		this[key] = value;
		return value
	}
	return null;
}

/**
 * 查找当前地图
 * @returns {Object} 结果
 */
Obj.prototype.getMap = function() {
	return $.game.map.get(this.map);
}

/**
 * 查找当前地图
 * @returns {Object} 结果
 */
Obj.prototype.getAddress = function() {
	var {
		map,
		located
	} = this;
	return $.game.map.address(map, located);
}

/**
 * 隐藏
 */
Obj.prototype.hide = function() {
	var addr = this.getAddress();
	if (addr) {
		delete addr.roles[this.name];
	}
}

/**
 * 暴露
 */
Obj.prototype.show = function() {
	var addr = this.getAddress();
	if (addr) {
		addr.roles[this.name] = 1;
	}
}

/**
 * 移动/隐藏
 * @returns {Object} 结果
 */
Obj.prototype.move = function(located) {
	// 在原有位置行踪消失
	var addr = this.getAddress();
	if (addr) {
		delete addr.roles[this.name];

		if (located) {
			this.located = located;
			// 在新地图暴露行踪
			addr = this.getAddress();
			if (addr) {
				this.address = addr.name;
				addr.roles[this.name] = 1;
				return addr;
			}
		}
	}
	return null;
}

/**
 * 移动到
 * @param {String} target 名称
 * @returns {Object} 结果
 */
Obj.prototype.moveTo = function(target) {
	var obj = $.game.obj.get(target);
	if (!obj) {
		this.msg.push(`目标@${target} 对象不存在！`);
		return null;
	}
	if (obj.map !== this.map) {
		return null;
	}
	// 在原有位置行踪消失
	var addr = this.getAddress();
	if (addr) {
		delete addr.roles[this.name];

		if (located) {
			this.located = located;
			// 在新地图暴露行踪
			addr = this.getAddress();
			if (addr) {
				this.address = addr.name;
				addr.roles[this.name] = 1;
				return addr;
			}
		}
	}
	return null;
}

/**
 * 改变状态
 * @param {String} name 名称
 * @param {Number} num 值
 */
Obj.prototype.change = function(name, num) {
	var key = $.dict_name[name];
	var value = this[key];
	value += parseInt(num);
	if (value < 0) {
		value = 0;
	} else if (num > 0) {
		if (key == "HP" || key == "MP" || key == "LP" || key == "EXP") {
			var max = this[key + "_max"];
			if (value > max) {
				value = max;
			}
		}
	}
	this[key] = value;
	return value;
}

/**
 * 锁定目标
 * @param {Number} value 改变的数值
 * @param {Number} longTime 时长 单位：秒
 * @returns {Object} 结果
 */
Obj.prototype.lock = function(targets = []) {
	this.targets = targets;
}

/**
 * 脱离锁定目标
 * @param {String} target 目标
 * @returns {Object} 结果
 */
Obj.prototype.unlock = function(target) {
	var arr = this.targets;
	if (arr) {
		var index = arr.indexOf(target);
		arr.splice(index, 1);
		this.targets = arr;
	}
}

/**
 * 保护
 * @param {String} target 目标对象
 * @param {Boolean} cancel 是否取消保护
 * @returns {Object} 结果
 */
Obj.prototype.protect = function(target, cancel) {
	var role = $.game.obj.get(target);
	if (role) {
		if (cancel) {
			// 保护对象
			if (!role.protectFrom) {
				role.protectFrom = {};
			}
			delete role.protectFrom[this.name];
			this.protectTo = {};
			return target;
		} else {
			// 保护对象
			if (!role.protectFrom) {
				role.protectFrom = {};
			}
			role.protectFrom[this.name] = 1;
			if (!this.protectTo) {
				this.protectTo = {};
			}
			this.protectTo[target] = 1;
			return target;
		}
	}
	return null;
}

/**
 * 查找友军
 * @param {String} type 默认查找队伍成员
 * @returns {Object} 结果
 */
Obj.prototype.findFriends = function() {
	var {
		map,
		located
	} = this;

	if (!team) {
		return []
	}

	var teams = this.getTeam();
	if (!teams || !teams.list.length) {
		return []
	}
	var addr = $.game.map.address(map, located);
	var arr = [];
	var roles = addr.roles;
	var list = teams.list;
	for (var i = 0; i < list.length; i++) {
		var name = list[i];
		if (roles.indexOf(name) !== -1) {
			arr.push(name);
		}
	}
	return arr;
}

/**
 * 查找附近的友军
 * @returns {Object} 结果
 */
Obj.prototype.findNearestFriends = function() {

}

/**
 * 查找附近的敌人
 * @returns {Object} 结果
 */
Obj.prototype.findNearestEnemy = function() {
	var {
		team,
		map,
		located
	} = this;
	if (!enemy) {
		this.enemy = [];
		return [];
	}
	var addr = $.game.map.address(map, located);
	var arr = [];
	var roles = addr.roles;
	for (var i = 0; i < enemy.length; i++) {
		var name = enemy[i];
		if (roles.indexOf(name) !== -1) {
			arr.push(name);
		}
	}
	return arr;
}

/**
 * 判断技能是否已经冷却（未完成）
 * @param {String} name 技能名称
 * @returns {Object} 结果
 */
Obj.prototype.isReady = function(skill_name) {
	if (this.skill) {
		var info = this.skill[skill_name];
		if (info && info.lastTime) {
			var now = new Date();
			if (now > info.lastTime.toTime().add(info.waitTime)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * 技能
 * @param {String} name 技能名称
 * @param {String} target 目标对象
 * @returns {Object} 结果
 */
Obj.prototype.useSkill = function(name, target) {
	var skill = this.skill.getObj({
		name
	});
	this.skill_lv = skill.lv;
	return $.game.skill.run(name, this, target);
}

/**
 * 拾取物品
 * @param {String} name 物品名称
 * @returns {Object} 结果
 */
Obj.prototype.pickup = function(name) {
	var {
		map,
		located
	} = this;
	var addr = $.game.map.address(map, located);
	var items = addr.items;

	if (items) {
		var info = items.getObj({
			name
		});
		if (!info) {
			this.msg.push(`没有发现【${name}】`);
			return false;
		}
		var bag = this.bag;
		if (!bag) {
			bag = {};
		}
		if (!bag.list) {
			bag.list = [];
		}
		bag.list.push(info);
		this.bag = bag;
		return true;
	}
	return false
}

/**
 * 掉落物品
 * @param {String} name 物品名称
 * @returns {Object} 结果
 */
Obj.prototype.drop = function(name) {

}

/**
 * 添加状态
 * @param {String} state 状态名称
 * @param {Object} info 状态信息
 * @returns {Object} 结果
 */
Obj.prototype.addState = function(state, info) {
	var dict = this.states;
	if (!dict) {
		dict = {};
	}
	var arr = dict[state];
	if (!arr) {
		dict[state] = [];
		arr = dict[state];
	}
	arr.push(info);
	this.states = dict;
}

/**
 * 清除状态
 * @param {String} state 被清除的状态
 * @returns {Object} 结果
 */
Obj.prototype.clearState = function(state) {
	var list = this.states[state];
	if (!this.states) {
		this.states = {};
	}
	delete this.states[state];
	return list || [];
}

/**
 * 判断角色是否已处于某种状态
 * @param {String} state 状态名称
 */
Obj.prototype.isState = function(state = '中毒') {
	return this.states[state];
}

/**
 * 角色死亡
 */
Obj.prototype.die = function() {
	this.states = {};
	this.action = -1;
	this.HP = 0;
}

/**
 * 获取角色的团队
 * @returns {Object} 返回团队成员
 */
Obj.prototype.getTeam = function() {
	return $.game.team.get(this.team);
}

module.exports = Obj;