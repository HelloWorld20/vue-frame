/*
 * @Author: jianghong.wei
 * @Date: 2019-12-13 10:59:48
 * @Last Modified by: jianghong.wei
 * @Last Modified time: 2020-04-28 18:02:20
 * H5端用户身份信息相关
 */

import { createRouter, response, catchError } from '../modules';
// import * as userSrv from '../services/user-h5';
// import { authH5 } from '../middlewares/auth';
import * as _ from 'lodash';
const router = createRouter();

// // H5获取用户信息
// router.get(
// 	'/userInfo',
// 	catchError(async (req, res) => {
// 		const result = await userSrv.getUserInfo(req);
// 		response.json(res, result);
// 	})
// );
// // 获取购物车
// router.get(
// 	'/cart',
// 	authH5,
// 	catchError(async (req, res) => {
// 		const result = await userSrv.getCart(req);
// 		response.json(res, result);
// 	})
// );
// // 修改购物车信息
// router.post(
// 	'/cart',
// 	authH5,
// 	catchError(async (req, res) => {
// 		const { goodsId } = req.query;
// 		const { number } = req.body;
// 		const result = await userSrv.addOrUpdateCart(
// 			req,
// 			goodsId,
// 			number === undefined ? undefined : Number(number)
// 		);
// 		response.json(res, result);
// 	})
// );
// // 删除购物车
// router.delete(
// 	'/cart',
// 	authH5,
// 	catchError(async (req, res) => {
// 		const { goodsId } = req.query;
// 		if (goodsId) {
// 			// 删除指定购物车
// 			const result = await userSrv.delCart(req, goodsId);
// 			response.json(res, result);
// 		} else {
// 			// 清空购物车
// 			const result = await userSrv.clearCart(req);
// 			response.json(res, result);
// 		}
// 	})
// );
// // 获取送货地址
// router.get(
// 	'/address',
// 	authH5,
// 	catchError(async (req, res) => {
// 		const result = await userSrv.getAddr(req);
// 		response.json(res, result);
// 	})
// );
// // 修改送货地址
// router.post(
// 	'/address',
// 	authH5,
// 	catchError(async (req, res) => {
// 		const { id } = req.query;
// 		const { name, phone, addr } = req.body;
// 		const result = await userSrv.addOrUpdateAddr(
// 			req,
// 			{
// 				orderAddr: addr,
// 				orderPhone: phone,
// 				orderName: name
// 			},
// 			id
// 		);
// 		response.json(res, result);
// 	})
// );
// // 删除送货地址
// router.delete(
// 	'/address',
// 	authH5,
// 	catchError(async (req, res) => {
// 		const { addrId } = req.query;
// 		const result = await userSrv.delAddr(req, addrId);
// 		response.json(res, result);
// 	})
// );

export default router;
