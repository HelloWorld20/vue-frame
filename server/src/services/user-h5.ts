/*
 * @Author: jianghong.wei
 * @Date: 2019-11-22 17:51:01
 * @Last Modified by: jianghong.wei
 * @Last Modified time: 2019-12-02 16:41:22
 * H5用户相关服务
 */

import { ServiceError } from '../modules';
import * as db_auth_h5 from '../db/user-h5';
import * as db_goods from '../db/goods';
import { getWxUserInfo } from './auth';
import { Request } from 'express';
import * as _ from 'lodash';
const Hashids = require('hashids/cjs');

const hashids = new Hashids('user-h5 salt', 10);

// H5端的获取微信用户信息
// 这里还是去读取数据库的用户信息。
// 微信授权交给，判断登录中间件来调用。一旦未登录，则调用微信用户信息接口
export async function getUserInfo(req: Request): Promise<UserInfo> {
	// 从微信获取用户信息
	const wxUserInfo = await getWxUserInfo();
	// 添加登录标记
	try {
		if (req.session) {
			req.session.openid = wxUserInfo.openid;
		}

		const openid = wxUserInfo.openid;

		const userInfoArr = await db_auth_h5.find({ openid });
		let userInfo: UserInfo | {} = {};
		if (userInfoArr.length === 0) {
			// 不存在用户，新增.
			// 在获取用户数据时，如果没有，则直接获取微信数据，并”注册“
			userInfo = { ...wxUserInfo, cart: [], addr: [] };
			db_auth_h5.insert(userInfo);
		} else {
			userInfo = userInfoArr[0];
		}
		if (_.isEmpty(userInfo)) {
			throw new ServiceError('403', '获取用户信息失败');
		}
		return userInfo as UserInfo;
	} catch {
		throw new ServiceError('403', '获取用户信息失败');
	}
}
///////////////////地址
// 获取所有配送地址
export async function getAddr(req: Request) {
	const openid: string = req.session && req.session.openid;

	const userInfoArr = await db_auth_h5.find({ openid });

	if (userInfoArr.length === 0) {
		throw new ServiceError('403', '获取用户信息失败');
	}
	const userInfo: any = userInfoArr[0];

	return (userInfo as UserInfo).addr;
}
/**
 * 添加地址
 * @param openid openid
 * @param params
 * @param params.orderName  配送姓名
 * @param params.orderPhone 配送手机号
 * @param params.orderAddr  配送地址
 */
export const addOrUpdateAddr = async (
	req: Request,
	params: {
		orderName: string;
		orderPhone: string;
		orderAddr: string;
	},
	addrId?: string
) => {
	const openid: string = req.session && req.session.openid;
	const userInfoArr = await db_auth_h5.find({ openid });
	const userInfo: UserInfo = userInfoArr[0];
	const addressArr = userInfo.addr;

	if (addrId) {
		// 修改指定记录

		const addrIndex = addressArr.findIndex(item => item.id === addrId);
		const addrInfo = addressArr[addrIndex];

		addrInfo.orderName = params.orderName || addrInfo.orderName;
		addrInfo.orderPhone = params.orderPhone || addrInfo.orderPhone;
		addrInfo.orderAddr = params.orderAddr || addrInfo.orderAddr;

		addressArr[addrIndex] = addrInfo;
	} else {
		let addrInfo: {
			orderName: string;
			orderPhone: string;
			orderAddr: string;
			id?: string;
		} = { ...params };
		// 没有地址，新增记录
		addrInfo.id = hashids.encode(new Date().getTime());
		addressArr.push(
			addrInfo as {
				orderName: string;
				orderPhone: string;
				orderAddr: string;
				id: string;
			}
		);
	}

	userInfo.addr = addressArr;
	return db_auth_h5.update({ openid }, userInfo);
};

export async function delAddr(req: Request, addrId: string) {
	const openid: string = req.session && req.session.openid;

	const userInfoArr = await db_auth_h5.find({ openid });
	const userInfo: UserInfo = userInfoArr[0];
	const addressArr = userInfo.addr;

	const addrIndex = addressArr.findIndex(v => v.id === addrId);

	if (addrIndex !== -1) {
		addressArr.splice(addrIndex, 1);
	} else {
		throw new ServiceError('404', '没有对应地址');
	}

	return db_auth_h5.update(
		{ openid },
		{
			addr: addressArr
		}
	);
}

//////////////////购物车
// 获取购物车数据
export async function getCart(req: Request) {
	const openid: string = req.session && req.session.openid;

	const userInfoArr = await db_auth_h5.find({ openid });

	if (userInfoArr.length === 0) {
		throw new ServiceError('403', '获取用户信息失败');
	}
	const userInfo: any = userInfoArr[0];

	const cart = (userInfo as UserInfo).cart;
	let totalPrise = 0;
	cart.forEach(v => (totalPrise += v.totalPrise));
	return {
		cart,
		totalPrise
	};
}

/**
 * 新增或修改购物车
 * @param req
 * @param number    商品数量
 * @param priseId   商品id
 */
export async function addOrUpdateCart(
	req: Request,
	goodsId: string,
	number?: number // 不传number的话，就是加1
) {
	if (_.isNumber(number) && number <= 0)
		throw new ServiceError('400', '数量不能小于1');

	const openid: string = req.session && req.session.openid;
	const userInfoArr = await db_auth_h5.find({ openid });
	const userInfo: UserInfo = userInfoArr[0];
	const cartArr = userInfo.cart;

	const goodsIndex = cartArr.findIndex(item => item.id === goodsId);
	if (goodsIndex !== -1) {
		// 找到对应商品
		const goods = cartArr[goodsIndex];
		if (_.isNumber(number)) {
			if (goods.restNum <= number)
				throw new ServiceError('403', '库存不足');
			goods.number = number;
		} else {
			if (goods.restNum <= goods.number)
				throw new ServiceError('403', '库存不足');
			goods.number = goods.number + 1;
		}
		goods.totalPrise = goods.number * goods.prise;
		cartArr[goodsIndex] = goods;
	} else {
		// 没在购物车里找到对应商品，新增一条记录
		const goodsModal = db_goods.getModal();
		const goodsInfo = (await goodsModal.findOne({ id: goodsId })) as any;

		const {
			id,
			name,
			prise,
			unit,
			images,
			restNum,
			totalNum
		} = goodsInfo as {
			id: string;
			name: string;
			prise: number;
			unit: string;
			images: string[];
			restNum: number;
			totalNum: number;
		};
		number = _.isNumber(number) ? number : 1;
		const goods = {
			id,
			name,
			prise,
			unit,
			number,
			images,
			restNum,
			totalNum,
			totalPrise: prise * number
		};

		cartArr.push(goods);
	}

	userInfo.cart = cartArr;
	return db_auth_h5.update({ openid }, userInfo);
}

// 根据id删除购物车条目
export async function delCart(req: Request, goodsId: string) {
	const openid: string = req.session && req.session.openid;

	const userInfoArr = await db_auth_h5.find({ openid });
	const userInfo: UserInfo = userInfoArr[0];
	const cartArr = userInfo.cart;

	const goodsIndex = cartArr.findIndex(v => v.id === goodsId);

	if (goodsIndex !== -1) {
		cartArr.splice(goodsIndex, 1);
	} else {
		throw new ServiceError('404', '没有对应商品');
	}

	return db_auth_h5.update(
		{ openid },
		{
			cart: cartArr
		}
	);
}
// 清空购物车
export async function clearCart(req: Request) {
	const openid: string = req.session && req.session.openid;
	return db_auth_h5.update(
		{ openid },
		{
			cart: []
		}
	);
}
