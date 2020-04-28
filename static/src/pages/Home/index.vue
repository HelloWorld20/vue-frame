<template>
	<div class="home" ref="wrapper">
		<div ref="inner">
			<van-search
				placeholder="请输入搜索关键词"
				v-model="searchVal"
				show-action
				shape="round"
				@search="onSearch"
				@cancel="onCancel"
			/>
			<div class="home-carousel">
				<van-swipe :autoplay="4000" style="height: 100%">
					<van-swipe-item
						class="carousel-item"
						v-for="(item, index) in carousel"
						:key="index"
						:style="`background-image: url(${item})`"
					>
					</van-swipe-item>
				</van-swipe>
			</div>
			<van-grid :column-num="5" class="home-category">
				<van-grid-item
					class="home-category-item"
					:key="item.id"
					v-for="item in cateData"
					@click="handleClickCate(item)"
				>
					<div
						class="home-category-item-img"
						:style="
							`background-image: url(${getImages(item.images)})`
						"
					></div>
					<div class="home-category-item-name">{{ item.name }}</div>
				</van-grid-item>
			</van-grid>

			<van-divider>推荐商品</van-divider>

			<van-grid :column-num="2" class="home-rec">
				<van-grid-item
					v-for="(item, index) in recommendData"
					:key="index"
				>
					<div class="home-rec-item">
						<div
							class="home-rec-item-img"
							:style="
								`background-image: url(${getImages(
									item.images
								)})`
							"
						></div>
						<div class="home-rec-item-name">{{ item.name }}</div>
						<div class="home-rec-item-desc">{{ item.desc }}</div>
						<div class="home-rec-item-control">
							<div class="home-rec-item-control-pirce">
								￥{{ item.prise }}
							</div>
							<van-button
								type="primary"
								icon="cart-o"
								@click="add2cart(item.id)"
							></van-button>
						</div>
					</div>
				</van-grid-item>
			</van-grid>
		</div>
	</div>
</template>

<script>
import { Swipe, SwipeItem, Grid, GridItem, Search } from 'vant';
import { mapActions } from 'vuex';
import { getRecommend, addOrUpdateCart } from '../../http/apis';
import { createHandleScroll } from '../../common/utils';

export default {
	data() {
		return {
			searchVal: '',
			carousel: [],
			cateData: [],
			recommendData: []
		};
	},
	components: {
		[Swipe.name]: Swipe,
		[SwipeItem.name]: SwipeItem,
		[Grid.name]: Grid,
		[GridItem.name]: GridItem,
		[Search.name]: Search
	},
	async created() {
		this.getUserInfo();
		const [carousel, category, recommendData] = await Promise.all([
			this.getHomeInfo(),
			this.getCategory(),
			getRecommend()
		]);
		this.carousel = carousel.carousel;
		this.cateData = category;
		this.recommendData = recommendData;
	},
	mounted() {
		const elWrapper = this.$refs['wrapper'];
		const elInner = this.$refs['inner'];
		createHandleScroll(elWrapper, elInner, () => {
			getRecommend().then(
				recommendData =>
					(this.recommendData = this.recommendData.concat(
						recommendData
					))
			);
		});
	},
	methods: {
		...mapActions(['getCategory', 'getUserInfo', 'getHomeInfo']),
		async add2cart(goodsId) {
			await addOrUpdateCart(goodsId);
			this.$toast('添加购物车成功');
		},
		handleClickCate(item) {
			this.$router.push({
				path: '/Category',
				query: {
					id: item.id
				}
			});
		},
		onSearch(str) {
			this.$router.replace({
				path: '/Search',
				query: {
					name: str
				}
			});
		},
		onCancel() {
			this.searchVal = '';
		},
		getImages(imageArr) {
			return `${window.location.protocol}//${imageArr[0]}`;
		}
	}
};
</script>

<style lang="less" scoped src="./index.less"></style>
