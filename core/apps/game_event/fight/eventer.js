module.exports = {
	/**
	 * 行动
	 * @param {Object} msg 消息主体
	 * @param {Number} times 执行次数
	 * @param {Object} param 附加参数
	 */
	action(msg, times, param) {
		console.log(this.name, msg);
		return "测试"
	},
	/**
	 * 攻击
	 * @param {Object} msg 消息主体
	 * @param {Number} times 执行次数
	 * @param {Object} param 附加参数
	 */
	attack(msg, times, param) {
		console.log(this.name, msg);
		return "测试"
	},
	/**
	 * 普通攻击
	 * @param {Object} msg 消息主体
	 * @param {Number} times 执行次数
	 * @param {Object} param 附加参数
	 */
	attackOfBase(msg, times, param) {
		console.log(this.data, msg);
		return "测试"
	},
	/**
	 * 使用物品攻击
	 * @param {Object} msg 消息主体
	 * @param {Number} times 执行次数
	 * @param {Object} param 附加参数
	 */
	attackOfItems(msg, times, param) {
		console.log(this.data, msg);
		return "测试"
	},
	/**
	 * 技能攻击
	 * @param {Object} msg 消息主体
	 * @param {Number} times 执行次数
	 * @param {Object} param 附加参数
	 */
	attackOfSkill(msg, times, param) {
		console.log(this.data, msg);
		return "测试"
	},
	
	/**
	 * 使用技能
	 */
	useSkill(msg, times, param) {
		
	},
	
	/**
	 * 使用物品
	 */
	useItem(msg, times, param) {
	
	},
	
	/**
	 * 受到伤害
	 */
	hurt(msg, times, param) {
	
	},
	
	/**
	 * 受到物品伤害
	 */
	hurtOfItem(msg, times, param) {
	
	},
	
	/**
	 * 受到技能伤害
	 */
	hurtOfSkill(msg, times, param) {
	
	},
	
	/**
	 * 锁定目标
	 */
	lock(msg, times, param) {
	
	},
	/**
	 * 防御
	 */
	defense(msg, times, param) {
	
	},
	/**
	 * 保护
	 */
	protect(msg, times, param) {
	
	},
	/**
	 * 保护
	 */
	escape(msg, times, param) {
	
	},
}