import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/pages/Home';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Root',
			component: Home
		},
		{
			path: '/Home',
			name: 'Home',
			component: Home
		},
		{
			path: '/*',
			name: 'WildMatch',
			component: Home
		}
	]
});
