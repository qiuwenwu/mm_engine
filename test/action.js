var Actions = require("../lib/actions.js");

var data = {
	name: "测试",
	num: 0
};
var methods = {
	add(key, num) {
		this[key] += num;
	},
	set(key, num) {
		this[key] = num;
	},
	get(key) {
		return this[key];
	},
	del(key) {
		delete this[key];
	}
};

var act = new Actions({
	data,
	methods
});

console.log("初始", act.num);
act.num = 4;
console.log(data, act.data);

act.add("num", 1);
act.add("num", 1);
act.add("num", 1);
console.log(data);

act.set("num", 1);
console.log(data);

console.log("查询", act.get("num"));

act.jian = function() {
	this.num--;
}

act.jian();

console.log(data);

act.del("num");

act.main = function(...args){
	console.log(args);
}
act.run("main", "这个传说");
console.log(act);