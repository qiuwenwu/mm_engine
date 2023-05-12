const Base = require("../../../lib/base.js");

/**
 * 指令
 */
class Cmd extends Base {
	constructor() {
		super();

		// 检索的文件路径
		this.path = "/apps/cmd".fullname(__dirname);
		// 文件拓展名
		this.extension = "cmd.json";
		// 文件存放目录
		this.dir = "/apps";
		this.init();
	}
}

/**
 * 获取指令对应对象
 * @param {String} content 消息内容
 * @returns {Object} 对象
 */
Cmd.prototype.getClass = function(content) {
	if (!content) {
		return;
	}
	var ret = {};
	var dict = this.cmd.dict;
	for (var k in dict) {
		var o = dict[k];
		var list = o.info.cmd;
		if (list) {
			for (var i = 0; i < list.length; i++) {
				var kv = list[i];
				if (content.matchs(kv.rule || "#" + kv.name + "*")) {
					ret.cmd_name = kv.name;
					ret.obj = o;
					break;
				}
			}
		}
	}
	return ret;
}

module.exports = new Cmd();