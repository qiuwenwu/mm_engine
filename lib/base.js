const conf = require("mm_config");
const Actions = require("./actions.js");

/**
 * 系统基础类
 */
class Base {
	/**
	 * 构造函数
	 */
	constructor() {
		// 字典
		this.dict = {};
		// 检索路径
		this.path = "";
		// 文件拓展名
		this.extension = "*.json";
		// 检索路径
		this.dir = "/data";
		// 重新加载
		this.reload = true;
	}
}

Base.prototype.init_after = function() {

}

/**
 * 初始化地区
 * @param {Boolean} reset 是否重新初始化，true则全部重新初始化
 */
Base.prototype.init = function(reset = false) {
	var files = this.getFiles();
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		this.load(file, reset);
	}
	this.init_after(reset);
}

/**
 * 获取文件
 */
Base.prototype.getFiles = function() {
	var files = [];
	if (this.path) {
		// 模块自带路径
		var path = "../core".fullname(__dirname);
		files = $.file.getAll(path, this.extension);
		// 自定义路径
		var path_2 = this.path.fullname(__dirname);
		path_2.addDir();
		var files_2 = $.file.getAll(path_2, this.extension);
		files.addList(files_2);
	}
	return files;
}

/**
 * 脚本实例
 * @param {Object} obj 对象
 */
Base.prototype.script = function(obj) {
	return new Actions(obj);
}

/**
 * 加载配置及脚本程序
 * @param {String} jsonFile 配置文件名
 * @param {Boolean} reload 是否重载，true为重载
 */
Base.prototype.load = function(jsonFile, reload = false) {
	if (jsonFile.indexOf($.slash + "tpl") !== -1) {
		return
	}
	// 加载json配置
	var m = this.loadJson(jsonFile);
	if (m) {
		var cache = {};
		var methods = {};
		var jsFile;
		// 加载脚本
		if (m.script) {
			if (m.script.indexOf(this.dir) === 0) {
				jsFile = ("." + m.script).fullname($.gamePath);
			} else {
				jsFile = m.script.fullname(jsonFile.dirname());
			}
			if (!jsFile.hasFile()) {
				jsFile = "";
			}
			var js;
			if (reload) {
				js = this.reLoadJS(jsFile);
			} else {
				js = this.loadJS(jsFile);
			}
			cache = js.cache;
			methods = js.methods;
		}
		var action = this.script({
			data: m,
			methods
		});
		for (var k in cache) {
			action[k] = cache[k]
		}
		action.jsonFile = jsonFile;
		this.dict[m.name] = action;
		return this.dict[m.name];
	}
	return null;
}

/**
 * 加载JSON配置
 * @param {String} file 文件名
 */
Base.prototype.loadJson = function(file) {
	return conf(file.loadJson(), file);
}

/**
 * 加载JS
 * @param {String} file 文件名
 */
Base.prototype.loadJS = function(file) {
	var cache = {};
	var methods = {};
	if (file && file.hasFile()) {
		try {
			var js = require(file);
			if (js) {
				for (var k in js) {
					var val = js[k];
					if (typeof(val) == "function") {
						methods[k] = val
					} else {
						cache[k] = val
					}
				}
				cache.jsFile = file;
			}
		} catch (err) {
			console.error("loadJS error", file);
			console.error(err);
		}
	}
	return {
		cache,
		methods
	}
}

/**
 * 重新加载JS
 * @param {String} file 文件名
 */
Base.prototype.reLoadJS = function(file) {
	// 用完后卸载模块
	var name = require.resolve(file);
	delete require.cache[name];
	return this.loadJS(file);
}

/**
 * 查询索引
 */
Base.prototype.index = function() {
	var arr = [];
	var rx = /[\u4e00-\u9fa5]/g;
	for (var k in this.dict) {
		if (rx.test(k)) {
			arr.push(k);
		}
	}
	return arr;
}

/**
 * 查询
 * @param {String} name 名称或ID
 * @param {Object} model 默认对象
 */
Base.prototype.get = function(name, model) {
	var obj = this.dict[name];
	if (!obj) {
		if (model) {
			return this.add(name, model);
		} else {
			return null;
		}
	}
	return obj.info;
}

/**
 * 获取类
 * @param {String} query 查询条件
 */
Base.prototype.getClass = function(query) {
	var cs;
	for (var k in this.dict) {
		var o = this.dict[k];
		if ($.as(o, query)) {
			cs = o;
			break;
		}
	}
	return cs;
}

/**
 * 运行脚本
 * @param {String} name 名称
 * @param {String} func_name 执行方法
 * @param {Object} args 参数集合
 * @returns {Object} 返回执行结果
 */
Base.prototype.run = function(name, func_name, ...args) {
	var tip;
	var cs = this.dict[name];
	if (cs) {
		if (!cs.jsFile) {
			return "执行错误！原因：脚本文件不存在！\n" + cs.script;
		}
		try {
			tip = cs.run(func_name, ...args);
		} catch (e) {
			console.error(e);
			tip = "执行错误！原因：" + e.message;
		}

		if (this.reload) {
			if (process.env.NODE_ENV == "development" || $.config.mode == "dev") {
				// 用完后重载模块
				var {
					methods,
					cache
				} = this.reLoadJS(cs.jsFile);
				cs.methods = methods;
				for (var k in cache) {
					cs[k] = cache[k]
				}
			}
		}
	} else {
		tip = `【${name}】不存在！`
	}
	return tip;
}

/**
 * 创建
 * @param {String} name 名称
 * @param {Object} model 数据模型
 */
Base.prototype.add = function(name, model) {
	var file = ("./" + name + "/" + this.extension).fullname(this.path);
	file.addDir();
	var f = file.replace($.slash + name + $.slash, $.slash + 'tpl' + $.slash);
	var m = f.loadJson();
	if (model) {
		model = Object.assign(m || {}, model, {
			name
		});
	} else {
		model = Object.assign(m || {}, {
			name
		});
	}
	file.saveJson(model);
	return this.load(file);
};

/**
 * 删除
 * @param {String} idOrName 唯一标识或名称
 * @returns 返回ID
 */
Base.prototype.del = function(idOrName) {
	var obj = this.dict[idOrName];
	if (!obj) {
		return idOrName + " 不存在！";
	}
	var dir = obj.file.dirname();
	obj.file.delFile();
	delete this.dict[idOrName];
	dir.delDir();
}

/**
 * 修改
 * @param {String} idOrName 唯一标识或名称
 * @param {Object} model 模型
 * @returns 返回true或false
 */
Base.prototype.set = function(idOrName, model) {
	if (model) {
		var obj = this.dict[idOrName];
		if (obj) {
			Object.assign(obj, model);
			return null;
		}
		return `【${idOrName}】不存在！`;
	}
	return "要修改的数据不能为空！";
}

module.exports = Base;