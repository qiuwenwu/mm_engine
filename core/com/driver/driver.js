/**
 * 行为驱动器
 */
class Driver {
	/**
	 * 构造函数
	 * @param {Object} config 配置参数
	 */
	constructor(config) {
		this.list = [];
		this.list_add = [];
		this.list_del = [];
		this.autoId = 1;
	}
}

Driver.prototype.BTnode = function(type) {
	var node = {}
	switch (type) {
		// 组合节点 Composite
		case -1:
		case "重复":
		case "loop":
		case "repeat":
			node = {
				mode: -1,
				name: "重复"
			}
			break;
			// 所有返回true，才为true
		case 1:
		case "顺序":
		case "sequence":
			node = {
				mode: 1,
				name: "顺序",
				sub: [{
						name: "恢复HP",
						methods: "restoreHP"
					},
					{
						name: "攻击",
						methods: "attack"
					}, {
						name: "逃跑",
						methods: "escape"
					}
				]
			}
			break;
		case 2:
		case "并行":
		case "parallel":
			node = {
				mode: 3,
				name: "顺序",
				sub: [{
					name: "通知玩家本人",
					methods: "notice_player",
					priority: 1
				}, {
					name: "通知玩家队伍",
					methods: "notice_team",
					priority: 2
				}, {
					name: "通知地图所有玩家",
					methods: "notice_address",
					priority: 3
				}]
			}
			break;
			// 一个返回true，就返回true
		case 3:
		case "选择":
		case "selector":
			node = {
				mode: 3,
				name: "使用技能",
				sub: [{
					name: "大招",
					methods: "skill_big",
					weight: 0.5
				}, {
					name: "三技能",
					methods: "skill_3",
					weight: 0.3
				}, {
					name: "二技能",
					methods: "skill_2",
					weight: 0.1
				}, {
					name: "一技能",
					methods: "skill_1",
					weight: 0.1
				}]
			}
			break;
			// 条件节点 Precondition
		case 4:
		case "&&":
		case "且":
		case "and":
			node = {
				mode: 4,
				name: "且",
				sub: [{
						name: "检测角色是否死亡",
						methods: "check_state"
					},
					{
						name: "检测能否行动",
						methods: "check_action"
					}, {
						name: "检测能否攻击",
						methods: "check_attack"
					}
				]
			}
			break;
		case 5:
		case "!":
		case "非":
		case "not":
			node = {
				mode: 5,
				name: "非"
			}
			break;
		case 6:
		case "||":
		case "或":
		case "or":
			node = {
				mode: 6,
				name: "或"
			}
			break;
		case 7:
		case "^":
		case "xor":
			node = {
				mode: 7,
				name: "异或"
			}
			break;
			// 行为节点 Action
		case 8:
		case "行为":
		case "aleaf":
		case "action":
			node = {
				mode: 8,
				name: "叶子"
			}
			break;
		default:
			break;
	}
	return
}

/**
 * 模型
 */
Driver.prototype.model = function() {
	return {
		// 驱动器ID
		id: 0,
		// 类型
		type,
		// 执行间隔时长
		interval: 1000,
		// 经过的时间
		passedTime: 0,
		// 状态 1启用，2暂停，0结束
		state: 1,
		// 参数
		param: {},
		// 行为树
		tree: [{
			// -1循环repeat，1顺序sequence，2并行parallel，3选择selector
			mode: -1,
			name: "怪物活动",
			sub: [{
				mode: 3,
				name: "攻击",
				sub: [{
						mode: 1,
						name: "技能攻击",
						method: "skillAttack",
						sub: [{

						}]
					},
					{
						mode: 1,
						name: "物品攻击",
						method: "canUse_itemAttack"
					},
					{
						mode: 1,
						name: "普通攻击",
						method: "canUse_baseAttack"
					}
				]
			}]
		}],
		// 回调函数
		func: function() {}
	}
}

/**
 * 添加行为
 * @param {String} type 行为类型
 * @param {Function} func 回调函数
 * @param {Object} param 参数
 * @param {Object} tree 行为树
 */
Driver.prototype.add = function(type, func, param, tree, interval) {
	var id = this.autoId;
	var info = {
		id,
		type,
		interval,
		passedTime: 0,
		tree,
		state: 1,
		param,
		func
	};
	this.list_add.push(info);
	this.autoId++;
	return id;
}

/**
 * 删除驱动器
 * @param {Number|String} id 名称或ID
 */
Driver.prototype.del = function(id) {
	this.list_del.push(id);
}

/**
 * 删除驱动器
 * @param {Object} query 查询条件
 */
Driver.prototype.delOf = function(query) {
	if (typeof(query) == "name") {
		query = {
			name: query
		}
	}
	var lt = [];
	var list = this.list;
	for (var i = 0; i < list.length; i++) {
		var o = list[i];
		if (o.param && $.as(o.param, query)) {
			lt.push(o.id);
		}
	}
	this.list_del.addList(lt);
}

/**
 * 执行驱动器后
 */
Driver.prototype.do_after = function() {
	var list = this.list_del;
	for (var i = 0; i < list.length; i++) {
		var id = list[i];
		this.list.del({
			id
		});
	}

	this.list_del.clear();
	this.list.addList(this.list_add);
	this.list_add.clear();
}


/**
 * 执行驱动器
 */
Driver.prototype.doing = async function(o) {
	o.passedTime = 0;
	o.num++;
	try {
		await o.func(o.param, o.num);
	} catch (err) {
		console.error(err);
	}
	if (o.num === o.count) {
		this.list_del.push(o.id);
	}
}

/**
 * 执行驱动器
 */
Driver.prototype.do = async function(millisecond) {
	var list = this.list;
	for (var i = 0; i < list.length; i++) {
		var o = list[i];
		// 判断是否启用状态
		if (o.state == 1) {
			// 判断是否还需要执行
			if (o.count < 0 || o.num < o.count) {
				o.passedTime += millisecond;
				// 判断是否有延迟，消除延迟
				if (o.wait) {
					// 判断是否到了要执行的时候
					if (o.passedTime % o.wait === 0) {
						o.wait = 0;
						this.doing(o);
					}
				} else {
					// 判断是否到了要执行的时候
					if (o.passedTime % o.interval === 0) {
						this.doing(o);
					}
				}
			}
		} else if (!o.state) {
			this.list_del.push(o.id);
		}
	}
	this.do_after();
}

/**
 * 执行驱动器
 */
Driver.prototype.run = async function(millisecond = 10) {
	this.timer = setInterval(() => {
		this.do(millisecond);
	}, millisecond);
}

/**
 * 开启
 * @param {Number|String} id 名称或ID
 */
Driver.prototype.start = function(id) {
	var obj = this.list.getObj({
		id
	});
	if (obj) {
		obj.state = 1;
	}
}

/**
 * 暂停
 * @param {Number|String} id 名称或ID
 */
Driver.prototype.stop = function(id) {
	var obj = this.list.getObj({
		id
	});
	if (obj) {
		obj.state = 2;
	}
}

/**
 * 结束
 * @param {Number|String} id 名称或ID
 */
Driver.prototype.end = function(id) {
	var obj = this.list.getObj({
		id
	});
	if (obj) {
		obj.state = 0;
	}
}


if (!$.driver || !$.driver.dict) {
	$.driver = new Driver();
}

module.exports = Driver;