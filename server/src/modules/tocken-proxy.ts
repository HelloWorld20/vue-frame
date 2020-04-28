// access_tocken中控服务器
import * as Api from "./api";
import * as config from "./config";
const { AppId, AppSecret } = config.get("wechat");

class TockenProxy {
  constructor() {
    this.fetchAndSaveTocken();
  }
  private tocken = "";
  private expiresTime = 0;

  fetchTocken() {
    return Api.get("https://api.weixin.qq.com/cgi-bin/token", {
      params: {
        grant_type: "client_credential",
        appid: AppId,
        secret: AppSecret
      }
    });
  }
  async fetchAndSaveTocken() {
    const { access_token, expires_in }: any = await this.fetchTocken();
    this.tocken = access_token;
    const current = new Date().getTime();
    this.expiresTime = (current + expires_in - 100) * 1000; // 减掉100秒时间
    return { access_token, expires_in };
  }
  isOutDate() {
    return new Date().getTime() > this.expiresTime;
  }
  clearTocken() {
    this.tocken = "";
  }
  async getTocken() {
    if (!this.tocken) {
      const access_token = await this.fetchAndSaveTocken();
      return access_token;
    }
    return this.tocken;
  }
}

export default new TockenProxy();
