/*
 * @Author: jianghong.wei
 * @Date: 2019-11-13 18:50:28
 * @Last Modified by: jianghong.wei
 * @Last Modified time: 2019-11-23 16:39:25
 * 是否登陆判断中间件
 */

import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '../modules/error';
// admin端授权
export const authAdmin = function(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.session && req.session.username) {
        next();
        return;
    }
    throw new ServiceError('403', '用户未登陆');
};
// H5端授权
export const authH5 = function(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.session && req.session.openid) {
        next();
        return;
    }
    // 以后改为，执行微信授权登录，而不是仅仅报个错。
    throw new ServiceError('403', '用户未登录');
};
