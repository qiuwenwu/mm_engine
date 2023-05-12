const Base = require("./base.js");

/**
 * 公共开发
 */
class Com extends Base {
	constructor() {
		super();
		this.path = "/com".fullname();
		// 文件拓展名
		this.extension = "com.json";
		// 文件存放目录
		this.dir = "/com";
		// 重新加载
		this.reload = false;
		this.init();
	}
}

/**
 * 公共初始化后
 */
Com.prototype.init_after = function() {
	for (var k in this.dict) {
		var cs = this.dict[k];
		var key = cs.jsonFile.dirname().basename();
		this[key] = cs;
	}
}



// /**
//  * 应用程序处理
//  */
// Com.prototype.runCmd = async function(e) {
// 	var msg;
// 	var cs = this.getCmdClass(e.content);

// 	if (cs && cs.cmd_name) {
// 		var ret = await $.app.cmd.request(e, cs, e.from, e.to, e.type, e.content);
// 		var content = ret.tip || ret.message;
// 		if (content) {
// 			if (typeof(content) == 'string') {
// 				if (content.indexOf("<") === 0) {
// 					msg = await $.reply.h5(content);
// 				} else if (content.indexOf('data:') === 0) {
// 					msg = await $.reply.img(content);
// 				} else if (content.length > $.config.toImg_length) {
// 					msg = await $.reply.md(content);
// 				} else {
// 					msg = content;
// 				}
// 			} else {
// 				msg = content;
// 			}
// 		}
// 	}
// 	return msg;
// }

module.exports = Com;