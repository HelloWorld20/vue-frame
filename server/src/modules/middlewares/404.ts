/**
 * 404 Not Found 中间件
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
import * as error_1 from "../error";

export default (req: any, res: any, next: any) => {
  const err = new error_1.ServiceError(
    "404",
    "Not Found"
  );
  next(err);
};
