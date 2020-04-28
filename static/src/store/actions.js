import {
	getHome
} from '../http/apis';

export default {
	getHomeInfo({
		state, commit
	}) {
		if (state.homeInfo) {
			return state.homeInfo;
		} else {
			return getHome().then(res => {
				console.log('getHomeInfo', res);
				commit('updateHomeInfo', res);
				return res;
			});
		}
	}

};
