import { $get } from './request';

let urls = {
	home: '/api/h5/market/home' // 首页相关接口
};

export const getHome = () => $get(urls.home);

export default urls;
