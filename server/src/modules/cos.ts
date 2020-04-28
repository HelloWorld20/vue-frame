/*
 * @Author: jianghong.wei
 * @Date: 2019-12-13 11:06:36
 * @Last Modified by:   jianghong.wei
 * @Last Modified time: 2019-12-13 11:06:36
 * 腾讯云cos文件上传服务
 */
import * as config from './config'
import * as COS from 'cos-nodejs-sdk-v5';

const cos_conf = config.get('cos');

var cos = new COS({
  SecretId: cos_conf.SecretId,
  SecretKey: cos_conf.SecretKey,
});
// 分片上传
export const upload = function (filePath: string, fileName: string) {
  if (!filePath || !fileName) return;
  return new Promise((resolve, reject) => {
    cos.sliceUploadFile({
      Bucket: cos_conf.Bucket.market, // Bucket 格式：test-1250000000
      Region: cos_conf.Region,
      Key: `/cos/${fileName}`,
      FilePath: filePath
    }, function (err: any, data: any) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  })
}

