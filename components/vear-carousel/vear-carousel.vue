<template>
	<swiper class="image-container" previous-margin="45rpx" next-margin="45rpx" circular autoplay @change="swiperChange" :indicator-dots="true"  :indicator-active-color="'#fff'"  :indicator-color="'rgba(255,255,255,0.3)'">
		<swiper-item :class="currentIndex == index ? 'swiper-item' : 'swiper-item-side'" v-for="(item, index) in imgList" :key="item[urlKey]">
			<button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor" @getuserinfo="toAuthor"></button>
			<image @click="clickImg(item)"  :class="currentIndex == index ? 'item-img' : 'item-img-side'" :src="item[urlKey]" lazy-load :style="dontFirstAnimation ? 'animation: none;' : ''" mode="aspectFill"></image>
		</swiper-item>
	</swiper>
</template>
<script>
	import constant from "../../utils/constant";
	import api from "../../utils/request/api";
		let that;
	export default {
		props: {
			imgList: {
				type: Array,
				default() {
					return []
				}
			},
			urlKey: {
				type: String,
				default() {
					return ''
				}
			}
		},
		data() {
			return {
				userSign:'',
				currentIndex: 0,
				dontFirstAnimation: true,
				isAuthor:false
			}
		},
		onReady(){
			that = this;
			this.userSign = constant.getUserSign();
		  this.isAuthor = constant.getIsAuthor();
		},
		methods: {
			swiperChange(e) {
				this.dontFirstAnimation = false
				this.currentIndex = e.detail.current
			},
			clickImg(item) {
				this.$emit('selected', item, this.currentIndex)
			},
			toAuthor() {
				uni.getUserInfo({
					provider: 'weixin',
					lang: 'zh_CN',
					success: async function (infoRes) {

						if (infoRes.errMsg == "getUserInfo:ok") {
							constant.setIsAuthor(true);
							that.isAuthor = true;

							constant.setUserInfo(infoRes.userInfo)

							let {nickName, avatarUrl, gender, country, province, city} = infoRes.userInfo;
							let json = await api.updateUserInfo({
								query: {
									sign: that.userSign,
									name: nickName,
									pic: avatarUrl,
									gender: gender,
									country: country,
									province: province,
									city: city
								}
							})
							if (json.data.errcode == 200) {

								uni.showToast({
									title: '授权成功',
									mask: true,
									icon: 'none'
								});
								that.toLogin();
							}
						}
					},
					fail(res) {
						constant.setIsAuthor(false)
						that.isAuthor = false;
					}
				});
			}
		}
	}
</script>
<style scoped>
	.image-container {
		width: 750rpx;
		height: 320rpx;
	}

	.item-img {
		width: 630rpx;
		height: 300rpx;
		border-radius: 14rpx;
		animation: to-big .3s;
		border: 1rpx solid rgba(0,0,0,0.1);
	}

	.swiper-item {
		position: relative;
		width: 630rpx;
		height: 300rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.item-img-side {
		width: 630rpx;
		height: 260rpx;
		border-radius: 14rpx;
		animation: to-mini .3s;
	}

	.swiper-item-side {
		position: relative;
		width: 630rpx;
		height: 260rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.getUserInfo{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width:100%;
		height:100%;
		z-index: 1000;
		opacity: 0;
	}

	@keyframes to-mini
	{
		from {
			height: 300rpx;
		}
		to {
			height: 260rpx;
		}
	}
	@keyframes to-big
	{
		from {
			height: 260rpx;
		}
		to {
			height: 300rpx;
		}
	}
</style>
