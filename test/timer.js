require("mm_expand");

const Timer = require("../core/com/timer/timer.js");

$.timer.run();
var param = {
	name: "测试",
	age: 18
};
var id = $.timer.add((pm, times) => {
	console.log("定时", times, pm);
}, param, 3000, 10, 4000);


setTimeout(() => {
	console.log(id);
	$.timer.del(id);
}, 7000)