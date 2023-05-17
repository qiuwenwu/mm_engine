var MM_engine = require("../index.js");

var engine = new MM_engine({
	path: __dirname
});

engine.run();

async function test() {
	// 获取到事件管理器
	var event = engine.lib.com.eventer;
	// 通过定义的事件名操作
	var ret = await event.exec("战斗事件", "attack", {
		name: "怪物1"
	});
	console.log("结果1", ret);
	
	// 通过事件唯一标识操作
	var ret = event.fight.attack({
		name: "怪物2"
	});
	console.log("结果2", ret);
	
	// 通过获取事件后进行操作
	var cs = event.get("战斗事件");
	var ret = cs.attack({
		name: "怪物3"
	});
	console.log("结果3", ret);
	
	// 通过执行方式进行操作
	var ret = await cs.run("attack", {
		name: "怪物3"
	});
	console.log("结果4", ret);
	
	// console.log($.game.skill.get("罗烟步"));
	console.log($.game.obj.get("自由人"));
	// console.log($.game.obj)
}

test();