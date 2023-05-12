var MM_engine = require("../index.js");

var engine = new MM_engine({
	runPath: __dirname
});

engine.run();

async function test() {
	var ret = await engine.lib.com.eventer.exec("战斗事件", "attack", {
		name: "怪物1"
	});
	console.log(ret);
	
	var ret = engine.lib.com.eventer.fight.attack({
		name: "怪物2"
	});
	console.log(ret);
	
	console.log($.game.skill.get("罗烟步"));
	console.log($.game.obj.get("爱旋律"));
	console.log($.game.obj)
}

test();