/*
 * @Author: jianghong.wei
 * @Date: 2019-12-13 11:06:16
 * @Last Modified by:   jianghong.wei
 * @Last Modified time: 2019-12-13 11:06:16
 * 获取系统配置
 */
import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";

const config = (function() {
  if (process.env.NODE_ENV === "development") {
    return loadJSON(path.resolve(__dirname, "../../../var/server.config.json"));
  }
  return loadJSON(path.resolve(__dirname, "../../../server.config.json"));
})();

function loadJSON(filename: string) {
  try {
    const content = fs.readFileSync(filename, "utf8");
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

function getInternally(conf: any, key: any) {
  const keys = key.split(".");
  let result = conf;
  for (const k of keys) {
    result = result[k];
    if (result == null) return null;
  }
  return result;
}

export function get(key: string) {
  return getInternally(config, key);
}
