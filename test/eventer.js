require("mm_expand");

const Eventer = require("../core/com/eventer/eventer.js");


// 注册攻击事件
var id1 = $.eventer.add("attack", (msg, param, times) => {
	console.log("事件", msg, param, times);
	return "受到攻击";
}, {
	// 名称
	name: "攻击",
	desc: "用于计算伤害"
}, "main", 10);

console.log("事件1", id1);

// 注册普通攻击事件
var id2 = $.eventer.add("attackOfBase", (msg, param, times) => {
	console.log("事件", msg, param, times);
}, {
	// 名称
	name: "普通攻击",
	// 伤害追加
	hurt_add: 0
}, "main", 10);

console.log("事件2", id2);

// 注册技能攻击事件
var id3 = $.eventer.add("attackOfSkill", (msg, param, times) => {
	console.log("事件", msg, param, times);
}, {
	// 名称
	name: "技能攻击",
	// 伤害追加
	hurt_add: 0
}, "main", 10);
console.log("事件3", id3);

// 注册物品攻击事件
var id4 = $.eventer.add("attackOfItems", (msg, param, times) => {
	console.log("事件", msg, param, times);
}, {
	// 名称
	name: "物品攻击",
	// 伤害追加
	hurt_add: 0
}, "main", 10);
console.log("事件4", id4);

// 注册被攻击事件
var id5 = $.eventer.add("attacked", (msg, param, times) => {
	console.log("事件", msg, param, times);
}, {
	// 名称
	name: "被攻击"
}, "main", 10);
console.log("事件5", id5);

// 注册受到伤害事件
var id6 = $.eventer.add("hurted", (msg, param, times) => {
	console.log("事件", msg, param, times);
}, {
	// 名称
	name: "受到伤害"
}, "main", 10);
console.log("事件6", id6);

// 注册其他事件
var id7 = $.eventer.add("other", (msg, param, times) => {
	console.log("事件", msg, param, times);
}, {
	// 名称
	name: "其他事件"
}, "main", 10);
console.log("事件7", id7);
var id8 = $.eventer.add("other", (msg, param, times) => {
	console.log("事件", msg, param, times);
}, {
	// 名称
	name: "其他事件2",
	mode: "check"
}, "check", 1);
console.log("事件8", id8);

async function test(){
	var ret = await $.eventer.run("attack", {
		// 发动者
		from: {
			name: "小明"
		},
		// 目标对象
		to: {
			name: "小白"
		},
		action: "技能攻击",
		// 触发from攻击前
		skill: {
			name: "白虎咆哮"
		},
		// 触发to被攻击事件后，受到伤害前
		effect: {
			hurt: 100
		}
	});
	console.log("结果", ret);
	
	// 暂停其他指定事件
	// $.eventer.stop(id8);
	// 暂停其他的校验事件
	// $.eventer.stop(null, "other", "check");
	// 暂停其他事件
	// $.eventer.stop(null, "other");
	
	await $.eventer.run("other", {
		name: "其他"
	});
	
	// 启动事件
	// $.eventer.start(null, "other");
	// $.eventer.start(null, "other", "main");
	// $.eventer.start(id8, "other", "check");
	
	// 删除其他指定事件
	// $.eventer.del(id8);
	// 删除其他的主事件
	// $.eventer.del(null, "other", "main");
	
	// 删除其他事件
	// $.eventer.del(null, "other");
	
	// 结束其他指定事件
	// $.eventer.end(id8);
	// 结束其他的校验事件
	// $.eventer.end(null, "other", "check");
	// 结束其他事件
	// $.eventer.end(null, "other");
	await $.eventer.run("other", {
		name: "其他"
	});
}

test();