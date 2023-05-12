/**
 * 计时器
 */
class Timer {
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

/**
 * 模型
 */
Timer.prototype.model = function() {
	return {
		// 定时器ID
		id: 0,
		// 总执行次数 -1为无限次
		count: 0,
		// 执行次数
		num: 0,
		// 执行间隔时长
		interval: 1000,
		// 等待执行事件
		wait: 1000,
		// 经过的时间
		passedTime: 0,
		// 状态 1启用，2暂停，0结束
		state: 1,
		// 参数
		param: {},
		// 回调函数
		func: function() {}
	}
}

/**
 * 添加定时器
 * @param {Function} func 回调函数
 * @param {Object} param 参数
 * @param {Function} interval 每次执行间隔时长
 * @param {Function} count 执行次数 -1为不限次数
 * @param {Function} wait 延迟执行
 */
Timer.prototype.add = function(func, param = {}, interval = 1000, count = -1, wait = 0) {
	var id = this.autoId;
	var info = {
		id,
		count,
		num: 0,
		state: 1,
		interval,
		wait,
		passedTime: 0,
		param,
		func
	};
	this.list_add.push(info);
	this.autoId++;
	return id;
}

/**
 * 删除定时器
 * @param {Number|String} id 名称或ID
 */
Timer.prototype.del = function(id) {
	this.list_del.push(id);
}

/**
 * 删除定时器
 * @param {Object} query 查询条件
 */
Timer.prototype.delOf = function(query) {
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
 * 执行定时器后
 */
Timer.prototype.do_after = function() {
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
 * 执行定时器
 */
Timer.prototype.doing = async function(o) {
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
 * 执行定时器
 */
Timer.prototype.do = async function(millisecond) {
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
 * 执行定时器
 */
Timer.prototype.run = async function(millisecond = 10) {
	this.timer = setInterval(() => {
		this.do(millisecond);
	}, millisecond);
}

/**
 * 开启
 * @param {Number|String} id 名称或ID
 */
Timer.prototype.start = function(id) {
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
Timer.prototype.stop = function(id) {
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
Timer.prototype.end = function(id) {
	var obj = this.list.getObj({
		id
	});
	if (obj) {
		obj.state = 0;
	}
}

if (!$.timer || !$.timer.list) {
	$.timer = new Timer();
}

module.exports = Timer;