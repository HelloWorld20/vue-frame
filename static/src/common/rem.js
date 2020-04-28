export default (function() {
	// 设置font-size大小。根据屏幕宽度来设置rem。3.75rem = 屏幕宽度
	const innerWidth = window.innerWidth < window.innerHeight
		? window.innerWidth : window.innerHeight;
	const size = innerWidth / 3.75;
	document.documentElement.style.fontSize = `${size}px`;
}());
