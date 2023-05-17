const Obj = require("../obj/obj.js");

/**
 * 角色
 */
class Role extends Obj {
	/**
	 * @param {String} 对象
	 */
	constructor(obj) {
		super(obj);
	}
}

/**
 * 角色指令
 * @return {String} npc_name NPC名称
 * @return {String} content 指令内容
 * @return {String} 返回函数提示
 */
Role.prototype.command = function(npc_name, content) {
	return $.game.npc.run(npc_name, 'command', this, content);
}

/**
 * 使用道具
 * @param {String} name 物品名称
 * @param {String} target 目标对象，如果没有传则是对自己使用
 * @returns {Object} 结果
 */
Role.prototype.useItem = function(name, target, num = 1) {
	if (this.haveItem(name) < num) {
		this.msg.push(`【${name}】不足！`);
		return false;
	}
	var obj = $.game.item.get(name);
	if (obj) {
		if (obj.type == '消耗') {
			this.gainItem(name, -num);
		}
	}
	return $.game.item.run(name, this, target);
}

/**
 * 召唤宠物
 * @param {String} name 宠物名称
 * @returns {Object} 结果
 */
Role.prototype.call = function(name) {
	if (!this.bag_list || !list.length) {
		this.msg.push("背包没有东西");
		return false
	}
	var obj = list.getObj({
		name
	});
	if (!obj) {
		this.msg.push(`没有宠物【${name}】`);
		return false
	}
	list.del({
		name
	});
	var pet = $.game.pet.get(name, obj);
	pet.map = this.map;
	pet.located = this.located;
	pet.master = this.name;
	pet.show();
	return true;
}

/**
 * 召回宠物
 * @param {String} name 宠物名称
 * @returns {Object} 结果
 */
Role.prototype.recall = function(name) {
	var pet = $.game.pet.get(name);
	if (!pet) {
		this.msg.push(`没有召唤宠物@${name} `);
		return false
	}
	if (pet.master !== this.name) {
		this.msg.push(`不是宠物@${name} 的主人`);
		return false;
	}
	$.game.pet.del(name);
	pet.hide();
	delete pet.map;
	delete pet.located;
	delete pet.master;

	var list = this.bag_list;
	if (!list) {
		list = [];
	}
	list.push(pet);
	this.bag_list = list;
	return true;
}

/**
 * 采集物品
 * @param {String} name 物品名称
 * @param {Number} num 数量
 * @returns {Object} 结果
 */
Role.prototype.gather = function(name, num) {
	var addr = this.getAddress();
	if (addr.item.indexOf(name) === -1) {
		this.msg.push(`没有发现【${name}】！`);
		return false
	}
	this.gainItem(name, num);
}

/**
 * 查询任务
 * @param {String} name 任务名称
 * @returns {Object} 结果
 */
Role.prototype.getQuest = function(name) {
	if (!this.quest) {
		this.quest = {};
	}
	return this.quest[name];
}

/**
 * 开始任务
 * @param {String} name 任务名称
 * @returns {Object} 结果
 */
Role.prototype.startQuest = function(name) {
	if (!this.quest) {
		this.quest = {};
	}
	var quest;
	if (typeof(name) == 'string') {
		quest = $.game.quest.get(name);
		if (!quest) {
			this.msg.push(`任务【$name】不存在！`);
			return false;
		}
		this.quest[name] = {
			name,
			state: 1,
			desc: quest.desc,
			npc: quest.npc,
			startTime: (new Date()).toStr('yyyy-MM-dd hh:mm:ss')
		}
	} else {
		quest = name;
		name = quest.name;
		this.quest[name] = Object.assign({}, quest, {
			state: 1
		});
	}
	if (quest) {
		var msg = `开启任务【${quest.name}】\n` + quest.desc;
		this.msg.push(msg);
		return true;
	}
	return false
}

/**
 * 完成任务
 * @param {String} name 任务名称
 * @param {String} record 任务名称
 * @returns {Object} 结果
 */
Role.prototype.completeQuest = function(name, record) {
	if (!this.quest) {
		this.quest = {};
	}
	var quest = this.quest;
	if (quest[name]) {
		quest[name].state = 3;
		if (record) {
			quest[name].endTime = (new Date()).toStr('yyyy-MM-dd hh:mm:ss');
		}
		this.quest = this.quest;
		this.msg.push(`完成任务【${name}】`);
		return true;
	} else {
		this.msg.push(`未开始【${name}】任务`);
		return false;
	}
}

/**
 * 解除任务
 * @param {String} name 任务名称
 * @returns {Object} 结果
 */
Role.prototype.forfeitQuest = function(name) {
	if (!this.quest) {
		this.quest = {};
	}
	var quest = this.quest;
	delete quest[name];
	this.quest = quest;
	return true;
}

/**
 * 地图切换
 * @param {String} map 地图或地图ID
 * @param {String} portal 入口或方位 默认为：0，即"中"
 */
Role.prototype.warp = function(map, portal) {
	var obj = $.game.map.get(map);
	if (obj) {
		var addr = this.getAddress();
		delete addr.roles[this.name];

		this["map"] = map;
		this["located"] = portal;
		var list = obj.address;
		var address = "未知地区";
		for (var i = 0; i < list.length; i++) {
			var o = list[i];
			if (o.located == portal) {
				address = o.name;
				var addr = this.getAddress();
				addr.roles[this.name] = 1;
				break
			}
		}
		this.msg.push(`@${this.name} 到达【${map}】${portal}的【${address}】`);
		return true;
	}
	this.msg.push(`目标地点不存在！`);
	return false;
}

/**
 * 获得（等级提升|游戏币等）
 * @param {String} name 角色特性
 * @param {Number} num 数量
 */
Role.prototype.gain = function(name, num) {
	var key = $.dict_name[name];
	if (key) {
		if (typeof(num) == "number") {
			var msg;
			num = Math.round(num);
			this[key] += num;
			if (num > 0) {
				msg = `${name}+${num}`;
			} else {
				msg = `${name}${num}`;
			}
			this.msg.push(msg);
			return true;
		} else {
			this.msg.push("传入参数非数量");
		}
	} else {
		this.msg.push(`${name} 不存在！`);
	}
	return false;
}

/**
 * 学习技能
 * @param {String} name 技能名称
 * @param {Number} lv 技能提升等级，负数为降低等级
 * @param {Number} lv_max 最高可提升等级
 */
Role.prototype.teachSkill = function(name, lv = 1, lv_max = 0) {
	var obj = $.game.skill.get(name);
	if (!obj) {
		this.msg.push(`${name} 技能不存在！`);
		return false;
	}
	var list = this.skill;
	var has = false;
	var lv_now = 0;
	for (var i = 0; i < list.length; i++) {
		var o = list[i];
		if (o.name == name) {
			has = true;
			o.lv += lv;
			lv_now = o.lv;
			if (o.lv <= 0) {
				list.splice(i, 1);
			} else {
				if (lv_max > 0) {
					if (lv_max > obj.lv_max) {
						lv_max = obj.lv_max;
					}
					o.lv_max = lv_max
				}

				if (o.lv > o.lv_max) {
					o.lv = o.lv_max;
				}
				o.type = obj.type;
			}

			this.skill = list;
			break;
		}
	}
	if (!has) {
		if (lv <= 0) {
			return;
		}
		if (lv_max == 0 || lv_max > obj.lv_max) {
			lv_max = obj.lv_max;
		}
		if (lv > lv_max) {
			lv = lv_max;
		}
		lv_now = lv;
		list.push({
			name,
			type: obj.type,
			lv,
			lv_max
		});
		this.skill = list;
	}
	if (lv_now === 1) {
		this.msg.push(`学会了【${name}】`);
	} else if (lv_now === 0) {
		this.msg.push(`遗忘了【${name}】`);
	} else if (lv > 0) {
		this.msg.push(`【${name}】提升至${lv_now}级`);
	} else {
		this.msg.push(`【${name}】降低至${lv_now}级`);
	}
	return true;
}

/**
 * 管理员
 * @returns {Boolean}
 */
Role.prototype.GM = function(level) {
	if (level !== undefined) {
		this.gm = level;
	}
	return this.gm;
}

/**
 * 是否会员
 */
Role.prototype.VIP = function(level) {
	if (level !== undefined) {
		this.vip = level;
	}
	return this.vip;
}

/**
 * 提升角色等级
 * @param {Number} level 提升的等级
 * @param {Boolean} down 是否进行属性下降
 */
Role.prototype.levelUp = function(level, down = false) {
	this.lv += level;
	if (level > 0) {
		this.msg.push(`等级提升了${level}`);
		this.gain("sp", 3 * level);
		this.gain("ap", 5 * level);
	} else if (level < 0 && this.get('lv') > -level) {
		this.msg.push(`等级下降了${level}`);
		if (down) {
			var sp = this.get('sp', 'info');
			if (sp > -5 * level) {
				this.gain('sp', 5 * level);
			} else {
				cha = -5 * level - sp;
				this.gain('sp', -sp);
				var DEF = this.attr.get('DEF');
				if (DEF > cha) {
					this.attr.change('DEF', -cha);
				} else {
					this.attr.change('DEF', -DEF);
					cha -= DEF;
					this.attr.change('ATK', -cha);
				}
			}
		}
	}

	return true;
}

/**
 * 提升角色技能（用于玩家自己技能点，主动提升技能）
 * @param {String} name 技能名称
 * @param {Number} lv 提升的等级
 */
Role.prototype.skillUp = function(name, lv = 1) {
	if (!this.skill) {
		this.msg.push(`未学习过任何技能！`);
		return false;
	}
	var obj = this.skill.getObj({
		name
	});
	if (!obj) {
		this.msg.push(`未学习过【${name}】！`);
		return false;
	}

	var skill = $.game.skill.get(name);
	if (!skill) {
		this.msg.push(`${name} 技能不存在！`);
		return false;
	}
	if (lv > 0) {
		if (obj.lv == obj.lv_max) {
			this.msg.push(`【${name}】已升至满级，无需再升级!`);
		}
		obj.lv += lv;
		if (obj.lv > obj.lv_max) {
			obj.lv = obj.lv_max;
			this.msg.push(`【${name}】已升至${obj.lv}，满级!`);
		} else {
			this.msg.push(`【${name}】已升至${obj.lv}级!`);
		}
	} else {
		if (obj.lv == 1) {
			this.msg.push(`【${name}】已是最低级了，无法在降级!`);
		}
		obj.lv += lv;
		if (obj.lv < 1) {
			obj.lv = 1;
			this.msg.push(`【${name}】已降至最低级!`);
		} else {
			this.msg.push(`【${name}】已降至${obj.lv}级!`);
		}
	}

	return true;
}


/**
 * 角色修炼，角色进入修炼状态，可以不断提升修为
 * @param {String} selection 选择
 * @param {String} skill_name 修炼的功法
 */
Role.prototype.practice = function(selection = 0, skill_name = '') {
	var address = $.game.map.address(this.map, this.located);
	if (!address || !address.mana) {
		return `此处灵气浓度为：0，无法进行修炼`;
	}
	if (selection == 0) {
		if (this.state == '修炼') {
			this.msg.push(`已处于修炼状态！`);
			return false;
		} else if (this.state !== "正常") {
			this.msg.push(`状态异常，无法修炼！`);
			return false;
		}
		var skill = $.game.skill.get(skill_name);
		if (!skill) {
			this.msg.push(`${skill_name} 技能不存在！`);
			return false;
		} else if (skill.type !== '修炼') {
			this.msg.push(`${skill_name} 非修炼功法！`);
			return false;
		}
		this.practice = {
			skill_name,
			state: 1,
			time: (new Date()).toStr('yyyy-MM-dd hh:mm:ss')
		};

		this.state = '修炼';
		this.action = 0;

		this.msg.push(`@${this.name} 进入修炼状态！`);
	} else {
		var practice = this.practice;
		if (!practice) {
			this.msg.push(`@${this.name} 未曾修炼`);
			return false;
		}
		if (practice.state == 0) {
			this.msg.push(`@${this.name} 非修炼中`);
			return false;
		}
		var skill = this.skill.getObj({
			name: practice.skill_name
		});
		this.skill_lv = skill.lv;
		var msg = $.game.skill.run(practice.skill_name, this, "");
		this.action = 3;
		this.state = '正常';
		practice.state = 0;

		if (this.mana === undefined) {
			this.mana = 0;
		}
		var n = this.elements.length - 5;

		var now = new Date();
		var long = -now.interval(practice.time, "minutes");

		// 灵力计算公式为 所在地图灵气浓度 * 精神力 / 灵根数 * 时间
		var mana = Math.floor(address.mana * this.INT / n * long);

		if (selection == 1) {
			if (long > 0) {
				this.mana += mana;
				this.msg.push(`@${this.name} 已结束修炼，本次修炼获得${mana}灵力，目前灵力${this.mana}`);
			} else {
				this.msg.push(`@${this.name} 修炼中断！`);
			}
		} else if (selection == 2) {
			this.mana -= mana;
			if (this.mana < 0) {
				this.mana = 0;
			}
			this.msg.push(`@${this.name} 修炼被中断！灵力下降${mana}，目前灵力${this.mana}`);
		}
	}
	return true;
}


/** 角色物品处理 **/
$.dict_type = {
	// 物品
	"消耗": "consume",
	"装备": "equip",
	"宠物": "pet",
	"特殊": "special",
	"普通": "ordinary",
	"consume": "consume",
	"equip": "equip",
	"pet": "pet",
	"special": "special",
	"ordinary": "ordinary",
	"Consume": "consume",
	"Equip": "equip",
	"Pet": "pet",
	"Special": "special",
	"Ordinary": "ordinary",

	// 装备
	"左手": "left_handed",
	"右手": "right_handed",
	"双手": "two_handed",
	"帽子": "cap",
	"衣服": "clothes",
	"披风": "cloak",
	"鞋子": "shoe",
	"left_handed": "left_handed",
	"right_handed": "right_handed",
	"two_handed": "two_handed",
	"cap": "cap",
	"clothes": "clothes",
	"cloak": "cloak",
	"shoe": "shoe"
}

/**
 * 背包
 */
/**
 * 背包查询
 * @param {String} 物品名称
 * @returns {Object} 返回物品
 */
Role.prototype.getItem = function(name) {
	var list = this.bag_list;
	var obj = null;
	if (typeof(name) === "number") {
		var index = name;
		if (index >= list.length - 1) {
			return null;
		}
		return list[index];
	} else {
		for (var i = 0; i < list.length; i++) {
			var o = list[i];
			if (o.name === name) {
				obj = o;
				break;
			}
		}
	}
	return obj;
}

/**
 * 获取角色拥有某物品的数量
 * @param {String} name 物品名称
 * @returns {Number} 返回数量
 */
Role.prototype.haveItem = function(name) {
	var item = this.getItem(name);
	if (item) {
		return item.num || 1;
	} else {
		return 0;
	}
}

/**
 * 新增一个物品
 * @param {Object} item 物品属性
 */
Role.prototype.addNewItem = function(item) {
	return Object.assign({}, item);
}

/**
 * 新增一个物品
 * @param {Object} item 物品属性
 */
Role.prototype.addItem = function(item) {
	if ($.dict_type[item.type] === "pet" || $.dict_type[item.type] === "equip") {
		item = this.addNewItem(item);
	} else {
		item = Object.assign({}, item);
	}

	var list = this.bag_list;
	var name = item.name;
	var obj = list.getObj({
		name
	});
	if (obj) {
		// 判断物品名称是否已存在
		var has = true;
		var i = 2;
		while (has) {
			var obj = list.getObj({
				name: name + i
			});
			if (!obj) {
				has = false;
				break
			}
			i++;
		}
		item.name = name + i;
	}
	return item;
}

/**
 * 给予或取走指定物品
 * @param {String} name 物品名称
 * @param {Number} num 物品数量 
 */
Role.prototype.gainItem = function(name, num) {
	var list = this.bag_list;
	if (num > 0) {
		var item = $.game.item.get(name);
		if (!item) {
			this.msg.push(`【${name}】不存在！`);
			return false;
		}
		if ($.dict_type[item.type] === "ordinary" || $.dict_type[item.type] === "consume") {
			var has = false;
			for (var i = 0; i < list.length; i++) {
				var o = list[i];
				if (o.name === name) {
					o.num += num;
					if (o.num > item.num_max) {
						o.num = item.num_max;
					}
					has = true;
					break;
				}
			}
			if (!has) {
				list.push(Object.assign({}, item, {
					num
				}));
			}
		} else {
			for (var i = 0; i < num; i++) {
				list.push(this.addItem(item));
			}
		};
		this.msg.push(`获得【${name}】*${num}`);
	} else if (num < 0) {
		var n = -num;
		var item = list.getObj({
			name
		});
		if (!item) {
			this.msg.push(`背包里没有【${name}】！`);
			return false;
		}
		if ($.dict_type[item.type] === "ordinary" || $.dict_type[item.type] === "consume") {
			for (var i = list.length - 1; i >= 0; i--) {
				var o = list[i];
				if (o.name === name) {
					if (o.num >= n) {
						o.num -= n;
						n = 0;
						if (o.num == 0) {
							list.splice(i, 1);
						}
					}
					break;
				}
			}
		} else {
			var indexs = [];
			for (var i = 0; i < list.length; i++) {
				var o = list[i];
				if (o.name === name) {
					n -= 1;
					indexs.push(i);
					if (n === 0) {
						break;
					}
				}
			}
			if (n === 0) {
				for (var i = 0; i < indexs.length; i++) {
					list.splice(indexs[i], 1);
				}
			}
		}

		if (n) {
			this.msg.push(`【${name}】数量不足${-num}`);
			return false;
		}
		this.msg.push(`失去【${name}】*${-num}`);
	}
	this.bag_list = list;
	return true;
}

/** 角色装备 **/
/**
 * 卸下装备
 * @param {String} 装备名称或ID
 * @returns {Object} 返回卸下的装备
 */
Role.prototype.takeEquip = function(body_name) {
	body = this.body;
	if (!body) {
		return null;
	}
	var key = $.dict_type[body_name];
	if (key) {
		// 获取到身体穿着的装备
		var equip = body[key];
		// 获取背包
		var list = this.bag_list;
		if (!list) {
			list = [];
		}
		// 把卸下的装备放入背包
		list.push(equip);
		// 保存背包
		this.bag_list = list;
		// 保存身上的装备
		body[key] = null;
		this.body = body;
		return equip;
	}
	return null;
}

/**
 * 穿上装备
 * @param {Object} name 装备名称
 * @param {String} body_name 装备名称
 * @returns {Object} 返回装备的身体部位
 */
Role.prototype.putEquip = function(name, body_name = "left_handed") {
	var list = this.bag_list;
	if (!list || list.length) {
		this.msg.push(`没有【${name}】`);
		return false;
	}
	var equip = list.getObj({
		name
	});
	if (!equip) {
		this.msg.push(`没有【${name}】`);
		return false;
	}
	body = this.body;
	if (!body) {
		this.body = {};
		body = this.body;
	}
	var key = $.dict_type[body_name];
	if (key) {
		// 先卸下装备
		this.takeEquip(body_name);
		// 在穿上装备
		body[key] = equip;

		this.body = body;
	} else {
		this.msg.push(`穿戴部位错误！`);
		return false;
	}
	return true;
}

/**
 * 计算装备附加属性
 * @returns {Object} 返回属性值
 */
Role.prototype.computeAttr = function() {
	var attr; = this.attr;
	for (var k in info) {
		var m = info[k];
		for (var name in attr) {
			attr[name] += m[name] || 0
		}
	}
	this.attr = attr;
	return attr;
}

/** 角色属性设置 **/
/**
 * 随机五行
 * @param {Number} num 最大灵根数
 */
Role.prototype.rand_elements = function(num = 4) {
	if (num < 1 || num > 5) {
		return "";
	}
	var len = Math.round(Math.random() * (num - 1) + 1);
	var elements = "";
	var arr = ['金', '木', '水', '火', '土'];
	while (elements.length < len) {
		var idx = Math.round(Math.random() * 4);
		var el = arr[idx];
		if (elements.indexOf(el) === -1) {
			elements += el;
		}
	}
	switch (len) {
		case 1:
			elements += "(天灵根)";
			break;
		case 2:
			elements += "(异灵根)";
			break;
		case 3:
			elements += "(真灵根)";
			break;
		case 4:
			elements += "(伪灵根)";
			break;
		default:
			elements += "(无)";
			break;
	}
	return elements;
}

/**
 * 删除属性
 * @param {String} name 属性名称
 * @returns {String} 返回最新属性
 */
Role.prototype.delAttr = function(name) {
	var key = $.dict_name[name];
	if (key) {
		delete this[key];
	}
	return this;
}