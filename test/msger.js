require("mm_expand");

const Msger = require("../core/com/msger/msger.js");

async function test() {
	var param = {
		name: "测试",
		age: 18
	};

	var id1 = $.msger.on("system_message", (msg, pm, times) => {
		console.log("定时", msg, pm, times);
	}, {
		config: "配置1"
	}, 1);

	console.log("消息ID", id1);

	var id2 = $.msger.on("system_message", (msg, pm, times) => {
		console.log("定时", msg, pm, times);
	}, {
		config: "配置2"
	}, 2);

	console.log("消息ID", id2);

	var id3 = $.msger.on("system_message", (msg, pm, times) => {
		console.log("定时", msg, pm, times);
	}, {
		config: "配置3"
	});

	console.log("消息ID", id3);
	
	// $.msger.remove(null, "system_message");
	// $.msger.end(id3, "system_message");
	// $.msger.end(id2);
	// $.msger.end(null, "system_message");
	// $.msger.stop(null, "system_message");

	var msg = {
		from: {},
		to: {},
		type: "",
		content: "你好！"
	}
	await $.msger.send("system_message", msg);
	await $.msger.send("system_message", msg);
	// $.msger.start(null, "system_message");
	await $.msger.send("system_message", msg);
}

test();