
/**
 * 攻击
 * @param {String} target 目标对象
 * @returns {Object} 结果
 */
Obj.prototype.attack = function(target) {
	$.com.eventer.run();
}

/**
 * 扫荡攻击（对周围多个目标进行普通攻击）（未完成）
 * @param {String} targets 目标对象
 * @returns {Object} 结果
 */
Obj.prototype.attackRange = function(targets) {
	$.com.eventer.run();
}

/**
 * 防御
 * @returns {Object} 结果
 */
Obj.prototype.defense = function() {
	
}

/**
 * 闪避
 * @returns {Object} 结果
 */
Obj.prototype.jouk = function() {
	
}

/**
 * 靠近(敌人或队友)
 * @param {String} target 目标对象
 * @returns {Object} 结果
 */
Obj.prototype.distanceTo = function(target) {
	
}

/**
 * 判断此处能否释放该技能
 * @param {String} skill_name 技能名称
 * @param {String} target 目标对象
 * @returns {Object} 结果
 */
Obj.prototype.canSkill = function(skill_name, target) {
	
}

// 不需要

/**
 * 查找附近的物品（未完成）
 * @param {String} type 物品类型 可以为空，为空则查找所有物品
 * @returns {Object} 结果
 */
Obj.prototype.findNearestItem = function(type) {

}

/**
 * 查找物品（未完成）
 * @param {String} type 物品类型 可以为空，为空则查找所有物品
 * @returns {Object} 结果
 */
Obj.prototype.findItems = function(type) {
	var {
		map,
		located
	} = this;
	var addr = $.game.map.address(map, located);
	
	addr.item
}

/**
 * 召唤怪物（一般用于怪物召唤同伴）（未完成）
 * @param {String} name 怪物名称
 * @param {Number} num_max 最大召唤数量
 * @returns {Object} 结果
 */
Obj.prototype.summon = function(name, num_max = 1) {
	
}


/**
 * 判断角色能否进行某种行动
 * @return {Boolean} 返回true则表示能行动，反之则无法行动。
 */
Obj.prototype.canAction = function(action, name, target) {
	// -1为已死亡；0为不可行动；1可行动，不可战斗；2可行动，可战斗，但不能放技能和使用物品；3可行动，可战斗，可放技能；
	var msg;
	// 先判断角色是否可行动
	switch (this.action) {
		case -1:
			msg = `@${this.name} 已死亡, 无法${action}`;
			break;
		case 0:
			msg = `@${this.name} 处于${this.state}状态, 无法${action}`;
			break;
		case 1:
			if (action == "战斗") {
				msg = `@${this.name} 处于${this.state}, 无法${action}`;
			} else if (action == "使用技能") {
				var skill = $.game.skill.get(name);
				var type = skill.type.substring(0, 2);
				if (type == "攻击" || type == "防御" || type == "增强" || type == "减弱") {
					msg = `@${this.name} 处于${this.state}, 无法使用技能`;
				}
			} else if (action == "使用物品") {
				var item = $.game.item.get(name);
				var category = item.category.substring(0, 2);
				if (category == "攻击" || category == "防御" || category == "增强" || category == "减弱") {
					msg = `@${this.name} 处于${this.state}, 无法使用物品`;
				}
			}
			break;
		case 2:
			if (action == "使用技能") {
				msg = `@${this.name} 处于${this.state}, 无法${action}`;
			} else if (action == "使用" || action == "使用物品") {
				msg = `@${this.name} 处于${this.state}, 无法使用物品`;
			}
			break;
		default:
			break;
	}

	if (msg) {
		return msg;
	}

	if (this) {
		// 在判断角色所在地方能否战斗
		var address = $.game.map.address(this.map, this.located);
		if (address) {
			switch (address.fight) {
				case 0:
					if (action == "战斗") {
						msg = `@${this.name} 位于${this.map}的【${address.name}】, 此处无法${action}`;
					} else if (action == "使用技能") {
						var skill = $.game.skill.get(name);
						var type = skill.type.substring(0, 2);
						if (type == "攻击" || type == "防御" || type == "减弱") {
							msg = `@${this.name} 位于${this.map}的【${address.name}】, 此处无法使用战斗技能`;
						}
					} else if (action == "使用" || action == "使用物品") {
						var item = $.game.item.get(name);
						var category = item.category.substring(0, 2);
						if (category == "攻击" || category == "防御" || category == "减弱") {
							msg = `@${this.name} 位于${this.map}的【${address.name}】, 此处无法使用战斗物品`
						}
					}
					break;
				case 1:
				case 2:
				case 3:
					break;
				default:
					break;
			}
		}
	}
	return msg;
}

/**
 * 特效
 * @param {Number} value 改变的数值
 * @param {Number} longTime 时长 单位：秒
 * @returns {Object} 结果
 */
Obj.prototype.effect = function(name, value, longTime = 10) {
	this.change(name, value);
	var timer = setTimeout(() => {
		this.change(name, -value);
	}, longTime * 1000);
	return timer;
}

/**
 * 获取属性名
 */
Role.prototype.getName = function() {
	return {
		"lv": "等级",
		"lv_wushu": "修武境界",
		"lv_immortal": "修仙境界"
	}
}

/**
 * 输出属性信息文本
 * @param {String} type 属性类型
 * @returns {String} 返回最新属性
 */
Role.prototype.text = function(type = "info") {
	var str = "";
	var dict = this[type];
	var names = this.getName();
	for (var k in names) {
		str += names[k] + "：" + (dict[k] || '无') + "\n"
	}
	return str;
}

/**
 * 更新角色缓存属性
 */
Role.prototype.update_cache = function() {
	this = $.game.obj.get(this.name, (attr) => {
		var {
			base,
			addition
		} = this.attr;

		for (var key in base) {
			if (!attr[key]) {
				var value = base[key];
				if (typeof(value) === "string") {
					attr[key] = value + (addition[key] || '');
				} else {
					attr[key] = value + (addition[key] || 0);
				}
			}
		}
		// 增加上线
		if (!attr.MP_max) {
			attr.MP_max = attr.MP;
		}
		if (!attr.HP_max) {
			attr.HP_max = attr.HP;
		}
		if (!attr.LP_max) {
			attr.LP_max = attr.LP;
		}
	});
}

/**
 * 创建角色之后
 */
Role.prototype.create_after = function() {
	var name = this.name;
	// 发送消息，用于同步
	this.msg = new Msg(name);

	// 角色背包
	this.bag = new Bag(name);
	this.bag.create();

	// 角色装备
	this.equip = new Equip(name);
	this.equip.create();

	// 角色属性
	this.attr = new Attr(name);
	this.attr.create();

	this.update_cache();
}

/**
 * 创建角色
 * @param {Object} info 角色信息
 * @returns {String} 返回null或错误提示
 */
Role.prototype.create = function(info, username) {
	if (typeof(info) == "string") {
		info = {
			name: info
		};
	}
	if (!username) {
		username = this.username;
	}
	if (!info.username) {
		info.username = username;
	}
	var name = info.name;
	if (!name) {
		return "角色名称不能为空";
	}
	this.name = name;
	var file = `./${name}/info.json`.fullname(path);
	if (file.hasFile()) {
		return "角色已存在！";
	}
	var tpl = "./info.json".fullname(path.replace($.slash + "info", $.slash + "tpl"));
	var user = tpl.loadJson();
	if (user) {
		$.push(user, info);
		file.addDir();
		file.saveJson(user);
		this.create_after();
	}
	return null;
}

/**
 * 登录
 * @param {String} name 角色名称
 * @param {String} 返回角色ID
 */
Role.prototype.login = function(name) {
	var file = `./${name}/info.json`.fullname(path);
	if (!file.hasFile()) {
		return "角色不存在！";
	}
	var info = file.loadJson();
	if (info.username !== this.username) {
		return "该角色非当前玩家所有！";
	}
	this.init(name);
	return null;
}