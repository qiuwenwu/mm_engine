class Msger {
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
Msger.prototype.model = function() {
	return {
		// 定时器ID
		id: 0,
		// 消息类型
		type,
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
 * 监听
 * @param {String} type
 * @param {Function} func
 * @param {Object} param
 * @param {Number} count
 */
Msger.prototype.on = function(type, func, param, count = -1) {
	var id = this.autoId;
	var info = {
		id,
		type,
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
 * 执行消息监听前
 */
Msger.prototype.do_before = function() {
	var list = this.list_add;
	for (var i = 0; i < list.length; i++) {
		var o = list[i];
		var lt = this.dict[o.type];
		if (!lt) {
			this.dict[o.type] = [];
			lt = this.dict[o.type];
		}
		lt.add(o);
	}
	this.list_add.clear();

	var list = this.list_del;
	for (var i = 0; i < list.length; i++) {
		var o = list[i];
		var lt = this.dict[o.type];
		if (lt) {
			lt.del({
				id: o.id
			});
			if (lt.length === 0) {
				delete this.dict[o.type];
			}
		}
	}
	this.list_del.clear();
}

/**
 * 执行消息监听后
 */
Msger.prototype.do_after = function() {

}

/**
 * 执行消息监听
 */
Msger.prototype.doing = async function(o, msg) {
	o.num++;
	try {
		await o.func(msg, o.param, o.num);
	} catch (err) {
		console.error(err);
	}
	if (o.num === o.count) {
		this.list_del.push(o.id);
	}
}

/**
 * 发送消息
 * @param {String} type 类型
 * @param {Object} msg 消息主体
 */
Msger.prototype.send = function(type, msg) {
	this.do_before();
	var list = this.dict[type];
	if (list) {
		for (var i = 0; i < list.length; i++) {
			var o = list[i];
			// 判断是否启用状态
			if (o.state == 1) {
				// 判断是否还需要执行
				if (o.count < 0 || o.num < o.count) {
					this.doing(o, msg);
				}
			} else if (!o.state) {
				this.list_del.push({
					id: o.id,
					type: o.type
				});
			}
		}
		this.do_after();
	}
}

/**
 * 设置消息监听状态
 * @param {Number} id 类型
 * @param {String} type 类型
 * @param {Number} state 状态
 */
Msger.prototype.setState = function(id, type, state) {
	if (type) {
		var lt = this.dict[type];
		var obj;
		if (lt) {
			if (id) {
				obj = lt.getObj({
					id
				});
				if (obj) {
					obj.state = state;
				}
			} else {
				for (var i = 0; i < lt.length; i++) {
					var o = lt[i];
					o.state = state;
				}
			}
		}
		if (!obj) {
			if (id) {
				obj = this.list_add.getObj({
					id
				});
				if (obj) {
					obj.state = state;
				}
			} else {
				var lt = this.list_add.get({
					type
				});
				if (lt) {
					for (var i = 0; i < lt.length; i++) {
						var o = lt[i];
						o.state = state;
					}
				}
			}
		}
	} else {
		var obj;
		for (var k in this.dict) {
			var lt = this.dict[k];
			if (lt) {
				obj = lt.getObj({
					id
				});
				if (obj) {
					obj.state = state;
					break;
				}
			}
		}
		obj = this.list_add.getObj({
			id
		});
		if (obj) {
			obj.state = state;
		}
	}
}

/**
 * 开启监听
 * @param {Number|String} id 名称或ID
 * @param {String} type 消息类型
 */
Msger.prototype.start = function(id, type) {
	this.setState(id, type, 1);
}

/**
 * 暂停监听
 * @param {Number|String} id 名称或ID
 * @param {String} type 消息类型
 */
Msger.prototype.stop = function(id, type) {
	this.setState(id, type, 2);
}

/**
 * 结束监听
 * @param {Number|String} id 名称或ID
 * @param {String} type 消息类型
 */
Msger.prototype.end = function(id, type) {
	this.setState(id, type, 0);
}

/**
 * 移除监听
 * @param {Number|String} id 名称或ID
 * @param {String} type 消息类型
 */
Msger.prototype.remove = function(id, type) {
	if (type) {
		if (id) {
			this.list_del.push({
				id,
				type
			});
		} else {
			var lt = this.dict[type];
			if (lt) {
				for (var i = 0; i < lt.length; i++) {
					var o = lt[i];
					this.list_del.push({
						id: o.id,
						type: o.type
					})
				}
			} else {
				this.list_add.del({
					type
				});
			}
		}
	} else if (id) {
		var obj;
		for (var k in this.dict) {
			var lt = this.dict[k];
			if (lt) {
				obj = lt.getObj({
					id
				});
				if (obj) {
					break
				}
			}
		}
		if (obj) {
			obj.state = 0;
			this.list_del.push({
				id: obj.id,
				type: obj.type
			});
		} else {
			this.list_add.del({
				id
			});
		}
	}
}


if (!$.msger || !$.msger.dict) {
	$.msger = new Msger();
}

module.exports = Msger;