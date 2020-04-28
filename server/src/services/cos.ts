/*
 * @Author: jianghong.wei
 * @Date: 2019-11-21 15:52:23
 * @Last Modified by: jianghong.wei
 * @Last Modified time: 2020-04-28 18:01:18
 * 文件上传相关
 */
import * as cos from "../modules/cos";
import * as formidable from "formidable";
import * as uuid from "uuid/v4";

const form = new formidable.IncomingForm();

// 单个文件上传
export const upload = async (req: any) => {
  const files: any = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
  // 上传成功后，会把该文件临时存储到files.file.path, 上传前文件名为 files.file.name
  return cos.upload(files.file.path, uuid() + files.file.name);
};
