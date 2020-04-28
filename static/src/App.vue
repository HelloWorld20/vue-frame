<template>
	<div id="wrapper">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	data() {
		return {
			selected: 'Home'
		};
	}
};
</script>
<style lang="less" scoped>
#wrapper {
	padding-bottom: 50px;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	overflow: auto;
}
</style>
