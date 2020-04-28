interface UserInfo {
	city: string;
	country: string;
	headimgurl: string;
	latitude: number | null;
	longitude: number | null;
	nickName: string;
	openid: string;
	province: string;
	sex: number;
	unionid: string;
	userId: number;
	state: -1 | 1; // 用户状态-1：封禁；1：正常
	cart: Array<{
		id: string; // 商品id
		name: string; // 商品名称
		prise: number; // 商品单价
		unit: string; // 商品单位
		number: number; // 购买数量
		images: string[]; // 商品图片
		restNum: number; // 剩余库存
		totalNum: number; // 总库存
		totalPrise: number; // 商品总价
	}>;
	addr: Array<{
		id: string;
		orderName: string;
		orderPhone: string;
		orderAddr: string;
	}>;
}

interface OrderInfo {
	id: string; // 数据库里的id
	orderId: string; // 订单id，显示给客户的订单id。时间+单子数
	payId: string | null; // 支付生成的id。根据情况变化变量名
	createTime: string; // 订单创建时间
	updateTime: string; // 更新时间
	payTime: string | null; // 支付时间
	acceptTime: string | null; // 商家接单时间
	deleverTime: string | null; // 开始配送时间
	dealTime: string | null; // 订单完成时间
	goods: Array<{
		goodsId: string; // 商品id
		goodsName: string; // 商品名称
		goodsNum: number; // 商品数量
		goodsUnit: string; // 商品单位
		goodsPrise: number; // 商品单价
		goodsImage: Array<string>; // 商品图片
		goodsTotalPrise: number; // 商品总价
	}>;
	openid: string; // 用户的openid
	nickName: string; // 用户名称
	orderName: string; // 订单上的姓名
	orderPhone: string; // 订单上的电话号码
	orderAddr: string; // 订单上的地址

	orderGoodsPrise: number; // 商品总价
	orderDeleverPrise: number; // 配送费
	orderDescountPrise: number; // 减免价， 后台修改订单可以配置
	orderPriseAll: number; // 支付总价 = 商品总价 + 配送费 - 减免价
	deleverPhone: number | null; // 配送人电话
	status: 0 | 1 | 2 | 3 | 4 | -1; // 订单状态 0：未支付；1：已支付；2：商家接单；3：正在配送；4：配送完成；-1：关闭
	desc: string; // 订单额外描述
}
