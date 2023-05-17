const {
	types
} = require("node:util");

class Eventer {
	/**
	 * 构造函数
	 * @param {Object} config 配置参数
	 */
	constructor(config) {
		this.dict = {};
		this.list_add = [];
		this.list_del = [];
		this.autoId = 1;
	}
}

/**
 * 模型
 */
Eventer.prototype.model = function() {
	return {
		// 定时器ID
		id: 0,
		// 消息类型
		type: "发动攻击时",
		// 时态
		tense: "main",
		// 总执行次数 -1为无限次
		count: 0,
		// 执行次数
		num: 0,
		// 状态 1启用，2暂停，0结束
		state: 1,
		// 参数
		param: {},
		// 回调函数
		func: function() {}
	}
}

/**
 * 添加事件
 * @param {String} type 事件类型
 * @param {Function} func 回调函数
 * @param {Object} param 回调附加参数
 * @param {String} tense 时态 before执行前|check确认是否执行|main执行|after执行后
 * @param {Number} count 执行次数
 */
Eventer.prototype.add = function(type, func, param, tense, count = -1) {
	var id = this.autoId;
	var info = {
		id,
		type,
		tense: tense || "main",
		num: 0,
		state: 1,
		count,
		param,
		func
	};
	this.list_add.push(info);
	this.autoId++;
	return id;
}

/**
 * 执行全部事件前
 */
Eventer.prototype.do_before = function() {
	// 追加事件
	var list = this.list_add;
	for (var i = 0; i < list.length; i++) {
		var o = list[i];
		var dt = this.dict[o.type];
		if (!dt) {
			this.dict[o.type] = {
				before: [],
				check: [],
				main: [],
				after: []
			};
			dt = this.dict[o.type];
		}
		var lt = dt[o.tense];
		if (lt) {
			lt.add(o);
		}
	}
	this.list_add.clear();

	// 移除事件
	var list = this.list_del;
	for (var i = 0; i < list.length; i++) {
		var o = list[i];
		var dt = this.dict[o.type];
		if (dt) {
			var lt = dt[o.tense];
			if (lt) {
				lt.del({
					id: o.id
				});
			}
			if (!dt.before.length && !dt.check.length && !dt.main.length && !dt.after.length) {
				delete this.dict[o.type];
			}
		}
	}
	this.list_del.clear();
}

/**
 * 执行全部事件后
 */
Eventer.prototype.do_after = function() {

}

/**
 * 执行事件
 */
Eventer.prototype.doing = async function(o, msg) {
	o.num++;
	var ret;
	try {
		ret = o.func(msg, o.param, o.num);
		if (types.isPromise(ret)) {
			ret = await ret;
		}
	} catch (err) {
		console.error(err);
	}
	if (o.num === o.count) {
		this.list_del.push(o.id);
	}
	return ret;
}

/**
 * 运行事件
 * @param {Array} list 列表
 * @param {String} type 类型
 * @param {Object} msg 事件消息
 * @param {Boolean} isBreak 是否中断
 */
Eventer.prototype.run_sub = async function(list, msg, isBreak = false) {
	var ret;
	if (list) {
		for (var i = 0; i < list.length; i++) {
			var o = list[i];
			// 判断是否启用状态
			if (o.state == 1) {
				// 判断是否还需要执行
				if (o.count < 0 || o.num < o.count) {
					ret = await this.doing(o, msg);
					if (ret && isBreak) {
						break;
					}
				}
			} else if (!o.state) {
				this.list_del.push({
					id: o.id,
					type: o.type,
					tense: o.tense
				});
			}
		}
	}
	return ret;
}

/**
 * 运行事件
 * @param {String} type 类型
 * @param {Object} msg 事件消息
 */
Eventer.prototype.run = async function(type, msg) {
	this.do_before();
	var ret;
	var dt = this.dict[type];
	if (dt) {
		ret = await this.run_sub(dt.before, msg, false);
		ret = await this.run_sub(dt.check, msg, true);
		if (ret) {
			return ret
		}
		ret = await this.run_sub(dt.main, msg, false);
		if (ret) {
			var ret_new = await this.run_sub(dt.after, msg, false);
			ret = ret_new || ret;
		}
	}
	this.do_after();
	return ret;
}

Eventer.prototype.setState_sub = function(lt, id, state) {
	var obj;
	if (lt) {
		if (id) {
			// 如果传入了ID，处理该ID事项
			obj = lt.getObj({
				id
			});
			if (obj) {
				obj.state = state;
			}
		} else {
			// 否则全部处理
			for (var i = 0; i < lt.length; i++) {
				var o = lt[i];
				o.state = state;
			}
		}
	}
	return obj;
}

/**
 * 设置事件状态
 * @param {Number} id 类型
 * @param {String} type 类型
 * @param {String} tense 时态 before执行前|check确认是否执行|main执行|after执行后
 * @param {Number} state 状态
 */
Eventer.prototype.setState = function(id, type, tense, state) {
	if (type) {
		// 如果传入了类型，处理该类事件
		var dt = this.dict[type];
		var obj;
		if (dt) {
			if (tense) {
				// 如果传入了时态，处理该事件下该时态的事
				obj = this.setState_sub(dt[tense], id, state);
			} else {
				obj = this.setState_sub(dt.before, id, state);
				if (!obj) {
					obj = this.setState_sub(dt.check, id, state);
					if (!obj) {
						obj = this.setState_sub(dt.main, id, state);
						if (!obj) {
							obj = this.setState_sub(dt.after, id, state);
						}
					}
				}
			}
		}
		if (obj) {
			obj.state = state;
		} else {
			if (id) {
				obj = this.list_add.getObj({
					id
				});
				if (obj) {
					obj.state = state;
				}
			} else if (tense) {
				var lt = this.list_add.get({
					type,
					tense
				});
				for (var i = 0; i < lt.length; i++) {
					var o = lt[i];
					o.state = state;
				}
			} else {
				var lt = this.list_add.get({
					type
				});
				for (var i = 0; i < lt.length; i++) {
					var o = lt[i];
					o.state = state;
				}
			}
		}
	} else {
		var obj;
		for (var k in this.dict) {
			var dt = this.dict[k];
			if (dt) {
				if (tense) {
					obj = this.setState_sub(dt[tense], id, state);
				} else {
					obj = this.setState_sub(dt.before, id, state);
					if (!obj) {
						obj = this.setState_sub(dt.check, id, state);
						if (!obj) {
							obj = this.setState_sub(dt.main, id, state);
							if (!obj) {
								obj = this.setState_sub(dt.after, id, state);
							}
						}
					}
				}
				if (obj) {
					break;
				}
			}
		}
		if (!obj) {
			if (id) {
				obj = this.list_add.getObj({
					id
				});
			}
		}
		if (obj) {
			obj.state = state;
		}
	}
}

/**
 * 开启
 * @param {Number|String} id 名称或ID
 * @param {String} type 事件类型
 * @param {String} tense 时态 before执行前|check确认是否执行|after执行后
 */
Eventer.prototype.start = function(id, type, tense) {
	this.setState(id, type, tense, 1);
}

/**
 * 暂停
 * @param {Number|String} id 名称或ID
 * @param {String} type 事件类型
 * @param {String} tense 时态 before执行前|check确认是否执行|after执行后
 */
Eventer.prototype.stop = function(id, type, tense) {
	this.setState(id, type, tense, 2);
}

/**
 * 结束
 * @param {Number|String} id 名称或ID
 * @param {String} type 事件类型
 * @param {String} tense 时态 before执行前|check确认是否执行|after执行后
 */
Eventer.prototype.end = function(id, type, tense) {
	this.setState(id, type, tense, 0);
}

/**
 * 删除事件-子程序
 * @param {Object} lt
 */
Eventer.prototype.del_sub = function(lt) {
	if (lt) {
		for (var i = 0; i < lt.length; i++) {
			var o = lt[i];
			this.list_del.push({
				id: o.id,
				type: o.type,
				tense: o.tense
			})
		}
	}
}

/**
 * 删除事件
 * @param {Number|String} id 名称或ID
 * @param {String} type 事件类型
 * @param {String} tense 时态 before执行前|check确认是否执行|after执行后
 */
Eventer.prototype.del = function(id, type, tense) {
	if (type) {
		if (id) {
			if (tense) {
				this.list_del.push({
					id,
					type,
					tense
				});
			} else {
				this.list_del.push({
					id,
					type,
					tense: "before"
				});
				this.list_del.push({
					id,
					type,
					tense: "check"
				});
				this.list_del.push({
					id,
					type,
					tense: "main"
				});
				this.list_del.push({
					id,
					type,
					tense: "after"
				});
			}
		} else {
			var dt = this.dict[type];
			if (dt) {
				if (tense) {
					this.del_sub(dt[tense]);
				} else {
					this.del_sub(dt.before);
					this.del_sub(dt.check);
					this.del_sub(dt.main);
					this.del_sub(dt.after);
				}
			}
		}
	} else if (id) {
		var obj;
		for (var k in this.dict) {
			var dt = this.dict[k];
			if (dt) {
				for (var t in dt) {
					var lt = dt[t];
					if (lt) {
						obj = lt.getObj({
							id
						});
						if (obj) {
							break
						}
					}
				}
			}
		}
		if (!obj) {
			obj = this.list_add.getObj({
				id
			});
		}
		if (obj) {
			obj.state = 0;
			this.list_del.push({
				id: obj.id,
				type: obj.type
			});
		}
	}
}

if (!$.eventer || !$.eventer.dict) {
	$.eventer = new Eventer();
}

module.exports = Eventer;