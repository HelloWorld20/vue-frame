import { Request, Response, NextFunction, RequestHandler } from 'express';
export class ServiceError extends Error {
  code = "";
  status = "";
  nativeCode = "";
  /**
   * 返回包装后的错误对象
   * @param  {string} [service='UNKONWN']    服务代码
   * @param  {ERROR_CODE} [status='500' ]   状态码
   * @param  {string} [msg='未知错误']        状态消息
   * @return {ServiceError}
   */
  constructor(
    // service = "service_code_1.default.UNKONWN",
    status = "500",
    msg = "未知错误",
    nativeCode?: any
  ) {
    super(msg);
    const service = status;

    const svrcode = service || "service_code_1.default.UNKONWN";
    const code = svrcode + status;
    this.code = code;
    this.status = status;
    this.nativeCode = nativeCode;
  }
}

/**
 * 错误捕捉代理函数
 * @param {RequestHandler} handler 真实的request处理函数
 */
export const catchError = (handler: RequestHandler) => {
  return async (req: any, res: any, next: any) => {
    try {
      return await handler(req, res, next);
    } catch (err) {
      console.error(err.message);
      // 数据库查询抛出的错误，隐藏数据库敏感错误信息
      if (err.sql) {
        const msg = err.sqlMessage;
        const sqlError = new ServiceError(
          "service_code_1.default.DB",
          "error_code_1.default.INTERNAL_SERVER_ERROR",
          msg
        );
        sqlError.stack = err.stack;
        next(sqlError);
        return;
      }
      next(err);
    }
  };
};
exports.catchError = catchError;
