import Vue from 'vue';
import axios from 'axios';
// import config from '@config';
import { Toast } from 'vant';

if (process.env.NODE_ENV === 'development') {
	axios.defaults.withCredentials = true;
}

let $axios = axios.create({
	// baseURL: config.baseUrl(),
	timeout: 10000
});

let loadingCount = 0;

// 请求拦截
$axios.interceptors.request.use(
	function(config) {
		if (loadingCount++ === 0) {
			Toast.loading();
		}
		// Do something before request is sent
		return config;
	},
	function(error) {
		loadingCount = loadingCount > 0 ? loadingCount - 1 : 0;

		if (loadingCount === 0) {
			Toast.clear();
		}
		// Do something with request error
		return Promise.reject(error);
	}
);

// 返回拦截
$axios.interceptors.response.use(
	function(response) {
		console.log('统一接口拦截', response);
		if (response.status !== 200 && response.status !== 304) {
			return Promise.reject(response);
		}
		loadingCount = loadingCount > 0 ? loadingCount - 1 : 0;

		if (loadingCount === 0) {
			Toast.clear();
		}
		return response.data.data;
	},
	function(err) {
		loadingCount = loadingCount > 0 ? loadingCount - 1 : 0;

		if (loadingCount === 0) {
			Toast.clear();
		}
		console.log(err.response);
		Vue.prototype.$toast.fail(err.response.data);
		// Do something with response error
		return Promise.reject(err);
	}
);

Vue.prototype.$axios = $axios;
Vue.prototype.$get = $axios.get;
Vue.prototype.$post = $axios.post;
Vue.prototype.$delete = $axios.delete;
Vue.prototype.$put = $axios.put;

export const $get = (url, opts) => $axios({ ...opts, url, method: 'get' });
export const $post = (url, opts) => $axios({ ...opts, url, method: 'post' });
export const $delete = (url, opts) =>
	$axios({ ...opts, url, method: 'delete' });
export const $put = (url, opts) => $axios({ ...opts, url, method: 'put' });

export default $axios;
