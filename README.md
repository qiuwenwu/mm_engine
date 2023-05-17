# mm_engine
	超级美眉游戏引擎，用于游戏、通讯应用开发

## 核心模块
+ com类
	+ 事件管理器 eventer
	+ 行为驱动器 driver
	+ 通讯器 msger
	+ 存储器 storer
	+ 定时器 timer
	

+ app类
	+ 指令 cmd
	+ 用户 user

+ game类
	+ 物品 item
	+ 地图 map
	+ 怪物 monster
	+ 技能 skill
	+ 宠物 pet
	+ 角色 role
	+ 等级 level
	+ 任务 quest
	+ 特效 effect
	+ NPC npc

备注：所有角色、NPC、宠物、怪物继承obj对象，具有技能、属性、状态、等级特点。


## COM类模块【说明】
	主要用于程序间交互和数据存取
	
### 通讯器 msger
	用于一次请求的多方通讯，可同时将消息发送到mqtt、web、第三方应用

### 存储器 storer
	用于通用存取数据，可同时存取文件、mysql、sqlite、redis、mongodb等
	
### 定时器 timer
	用于一个定时器管理多个定时需求，方便动态增卸和交互。
	
### 事件管理器 eventer
	用于事件触发，在调用函数时触发事件，实现连锁效应。

### 行为驱动器 driver
	用于行为树设计，决定程序自动操作。
	行为驱动通过行为树决定行为，行为树由Json格式构成，每个行为下6个节点属性，分别mode行为模式、name行为名称、method行为方法、priority优先级、weight权重、sub子节点行为数组

## app类模块【说明】
### 指令 cmd
	用于玩家操作行为
	
### 用户管理器 user
	用于管理用户信息，尽心账户统一管理


## GAME类模块【说明】
	主要用于游戏相关业务的处理
	
### 物品 item
	用于游戏中的物品，分为：
+ 普通物品
+ 消耗物品
+ 特殊物品
+ 装备
+ 宠物
	
### 地图 map
	用于游戏中的行动地图，根据其场所大小可划分为：
+ 房间
+ 楼屋
+ 城镇
+ 郊外
+ 大陆

### 怪物 monster
	用于游戏中的战斗对立对象，根据其种类可划分为：
+ 人类
+ 飞禽
+ 走兽
+ 昆虫
+ 植物
+ 精灵
+ 妖魔

### 技能 skill
	用于游戏中的对象属性改变，根据其效果可划分为：
+ 攻击
+ 防御
+ 增强
+ 减弱

### 宠物 pet
	与怪物相同，具有AI特性，不同的是怪物攻击玩家，宠物攻击怪物
	
### 角色 role
	用于玩家控制角色
	
### 等级 level
	用于游戏中的各种等级划分，可划分为：
+ 基础等级
+ 修仙等级
+ 修武等级
+ 炼药等级
+ 炼器等级
+ 炼阵等级
+ 烹饪等级
+ 驯兽等级

### 任务 quest
	用于游戏中的活动，根据奖励可划分为：
+ 主线任务
+ 支线任务
+ 循环任务

### NPC npc
+ 剧情NPC
+ 服务NPC
+ 战斗NPC

### 特效 effect
	用于游戏对象的状态变化，决定对象的属性增减和持续性