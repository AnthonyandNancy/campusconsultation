<template>
	<view>
		<view :class="{
        'uni-fab--leftBottom': leftBottom,
        'uni-fab--rightBottom': rightBottom,
        'uni-fab--leftTop': leftTop,
        'uni-fab--rightTop': rightTop
      }" class="uni-fab"
		 v-if="popMenu && (leftBottom||rightBottom||leftTop||rightTop)">
			<view :class="{
          'uni-fab__content--left': horizontal === 'left',
          'uni-fab__content--right': horizontal === 'right',
          'uni-fab__content--flexDirection': direction === 'vertical',
          'uni-fab__content--flexDirectionStart': flexDirectionStart,
          'uni-fab__content--flexDirectionEnd': flexDirectionEnd,
		  'uni-fab__content--other-platform': !isAndroidNvue
        }"
			 :style="{ width: customBoxWidth, height: boxHeight  }" class="uni-fab__content"
			 elevation="5">
				<view class="uni-fab__item uni-fab__item--first" v-if="flexDirectionStart || horizontalLeft" />

				<view :class="{ 'uni-fab__item--active': isShow }" :key="index" @click="_onItemClick(index, item)" class="uni-fab__item"
				 v-for="(item, index) in content">
					<view class="fab_Img">
						<view class="img_item">
							<image :src="item.active ? item.selectedIconPath : item.iconPath" class="uni-fab__item-image" mode="widthFix" />
						</view>

					</view>
					<view class="fab_title">
						<text :style="{ color: item.active ? styles.selectedColor : styles.color }" class="uni-fab__item-text">{{ item.text }}</text>
					</view>

				</view>
				<view class="uni-fab__item uni-fab__item--first" v-if="flexDirectionEnd || horizontalRight" />
			</view>
		</view>
		<view :class="{
		  'uni-fab__circle--leftBottom': leftBottom,
		  'uni-fab__circle--rightBottom': rightBottom,
		  'uni-fab__circle--leftTop': leftTop,
		  'uni-fab__circle--rightTop': rightTop,
		  'uni-fab__content--other-platform': !isAndroidNvue
		}"
		 :style="{ 'background': isShow ? styles.clickBtnColor:styles.buttonColor}" @click="_onClick" class="uni-fab__circle uni-fab__plus">

			<view :class="{'uni-fab__plus--active': isShow}" class="fab-circle-v"></view>
			<view :class="{'uni-fab__plus--active': isShow}" class="fab-circle-h"></view>
		</view>
	</view>
</template>

<script>
	let platform = 'other'
	// #ifdef APP-NVUE
	platform = uni.getSystemInfoSync().platform
	// #endif
	export default {
		name: 'UniFab',
		props: {
			pattern: {
				type: Object,
				default () {
					return {}
				}
			},
			horizontal: {
				type: String,
				default: 'left'
			},
			vertical: {
				type: String,
				default: 'bottom'
			},
			direction: {
				type: String,
				default: 'horizontal'
			},
			content: {
				type: Array,
				default () {
					return []
				}
			},
			show: {
				type: Boolean,
				default: false
			},
			popMenu: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				fabShow: false,
				isShow: false,
				isAndroidNvue: platform === 'android',
				styles: {
					color: '#3c3e49',
					selectedColor: '#007AFF',
					backgroundColor: '#fff',
					buttonColor: 'linear-gradient(90deg,rgba(254,97,96,1) 0%,rgba(255,176,97,1) 100%)'
				}
			}
		},
		computed: {
			contentWidth(e) {
				return (this.content.length + 1) * 50 + 10 + 'px'
			},
			curstomContentWidth(){
				return 140 + 'px';
			},
			contentWidthMin() {
				return 45 + 'px'
			},
			// 动态计算宽度
			boxWidth() {
				return this.getPosition(3, 'horizontal')
			},
			customBoxWidth() {
				return this.getPosition(4, 'vertical')
			},
			// 动态计算高度
			boxHeight() {
				return this.getPosition(3, 'vertical')
			},
			// 计算左下位置
			leftBottom() {
				return this.getPosition(0, 'left', 'bottom')
			},
			// 计算右下位置
			rightBottom() {
				return this.getPosition(0, 'right', 'bottom')
			},
			// 计算左上位置
			leftTop() {
				return this.getPosition(0, 'left', 'top')
			},
			rightTop() {
				return this.getPosition(0, 'right', 'top')
			},
			flexDirectionStart() {
				return this.getPosition(1, 'vertical', 'top')
			},
			flexDirectionEnd() {
				return this.getPosition(1, 'vertical', 'bottom')
			},
			horizontalLeft() {
				return this.getPosition(2, 'horizontal', 'left')
			},
			horizontalRight() {
				return this.getPosition(2, 'horizontal', 'right')
			}
		},
		watch: {
			pattern(newValue, oldValue) {
				//console.log(JSON.stringify(newValue))
				this.styles = Object.assign({}, this.styles, newValue)
			}
		},
		created() {
			this.isShow = this.show
			if (this.top === 0) {
				this.fabShow = true
			}
			// 初始化样式
			this.styles = Object.assign({}, this.styles, this.pattern);

			console.log(this.styles);
		},
		methods: {
			_onClick() {
				this.$emit('fabClick')
				if (!this.popMenu) {
					return
				}
				this.isShow = !this.isShow
			},
			open() {
				this.isShow = true
			},
			close() {
				this.isShow = false
			},
			/**
			 * 按钮点击事件
			 */
			_onItemClick(index, item) {
				this.$emit('trigger', {
					index,
					item
				})
			},
			/**
			 * 获取 位置信息
			 */
			getPosition(types, paramA, paramB) {
				if (types === 0) {
					return this.horizontal === paramA && this.vertical === paramB
				} else if (types === 1) {
					return this.direction === paramA && this.vertical === paramB
				} else if (types === 2) {
					return this.direction === paramA && this.horizontal === paramB
				} else if(types === 3) {
					return this.isShow && this.direction === paramA ? this.contentWidth : this.contentWidthMin
				}else{
					return  this.isShow && this.direction === paramA ? this.curstomContentWidth : this.contentWidthMin;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-fab {
		position: fixed;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.uni-fab--active {
		opacity: 1;
	}

	.uni-fab--leftBottom {
		left: 5px;
		bottom: 20px;
		/* #ifdef H5 */
		bottom: calc(20px + var(--window-bottom));
		/* #endif */
		padding: 10px;
	}

	.uni-fab--leftTop {
		left: 5px;
		top: 30px;
		/* #ifdef H5 */
		top: calc(30px + var(--window-top));
		/* #endif */
		padding: 10px;
	}

	.uni-fab--rightBottom {
		right: 5px;
		bottom: 80px;
		/* #ifdef H5 */
		bottom: calc(20px + var(--window-bottom));
		/* #endif */
		padding: 10px;
	}

	.uni-fab--rightTop {
		right: 5px;
		top: 30px;
		/* #ifdef H5 */
		top: calc(30px + var(--window-top));
		/* #endif */
		padding: 10px;
	}

	.uni-fab__circle {
		position: fixed;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		width: 45px;
		height:  45px;
		background-color: #3c3e49;
		border-radius:  45px;
		z-index: 11;
	}

	.uni-fab__circle--leftBottom {
		left: 15px;
		bottom: 30px;
		/* #ifdef H5 */
		bottom: calc(30px + var(--window-bottom));
		/* #endif */
	}

	.uni-fab__circle--leftTop {
		left: 15px;
		top: 40px;
		/* #ifdef H5 */
		top: calc(40px + var(--window-top));
		/* #endif */
	}

	.uni-fab__circle--rightBottom {
		right: 15px;
		bottom: 90px;
		/* #ifdef H5 */
		bottom: calc(30px + var(--window-bottom));
		/* #endif */
	}

	.uni-fab__circle--rightTop {
		right: 15px;
		top: 40px;
		/* #ifdef H5 */
		top: calc(40px + var(--window-top));
		/* #endif */
	}

	.uni-fab__circle--left {
		left: 0;
	}

	.uni-fab__circle--right {
		right: 0;
	}

	.uni-fab__circle--top {
		top: 0;
	}

	.uni-fab__circle--bottom {
		bottom: 0;
	}

	.uni-fab__plus {
		font-weight: bold;
	}

	.fab-circle-v {
		position: absolute;
		/*width: 3px;*/
		/*height: 31px;*/
		width:6px;
		height:26px;
		left: 20px;
		top: 10px;
		background:rgba(255,255,255,1);
		transform: rotate(0deg);
		transition: transform 0.3s;
		border-radius:3px;
	}

	.fab-circle-h {
		position: absolute;
		/*width: 31px;*/
		/*height: 3px;*/
		width:26px;
		height:6px;
		left: 10px;
		top: 20px;
		background:rgba(255,255,255,1);
		transform: rotate(0deg);
		transition: transform 0.3s;
		border-radius:3px;
	}

	.uni-fab__plus--active {
		transform: rotate(135deg);
	}

	.uni-fab__content {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		/* #endif */
		flex-direction: row;
		/*border-radius: 55px;*/
		overflow: hidden;
		transition-property: width, height;
		transition-duration: 0.2s;
		width: 45px;
		border-color: #DDDDDD;
		border-width: 1rpx;
		border-style: solid;
	}

	.uni-fab__content--other-platform {
		border-width: 0px;
		/*box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);*/
	}

	.uni-fab__content--left {
		justify-content: flex-start;
	}

	.uni-fab__content--right {
		justify-content: flex-end;
	}

	.uni-fab__content--flexDirection {
		flex-direction: column;
		justify-content: flex-end;
	}

	.uni-fab__content--flexDirectionStart {
		flex-direction: column;
		justify-content: flex-start;
	}

	.uni-fab__content--flexDirectionEnd {
		flex-direction: column;
		justify-content: flex-end;
	}

	.uni-fab__item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */

		/*flex-direction: column;*/
		justify-content: center;
		align-items: center;
		width:140px;
		height:50px;
		opacity: 0;
		/*margin-right: 5rpx;*/
		transition: opacity 0.2s;
		margin: 10rpx 0;
		background:linear-gradient(90deg,rgba(254,97,96,1) 0%,rgba(255,176,97,1) 100%);
		box-shadow:0px 0px 4px rgba(80,18,17,0.3);
		border-radius: 25px;

		.fab_Img{
			flex: 1;
			image{
				position: relative;
				left: 50%;
				transform: translateX(-50%);
				opacity:1;
			}
		}
		.fab_title{
			flex: 1;
			font-family:Source Han Sans SC;
			font-weight:400;
			line-height:40px;
			color:rgba(255,255,255,1) !important;
			opacity:1;
		}
	}


	.uni-fab__item--active {
		opacity: 1;
	}

	.uni-fab__item-image {
		width: 25px;
		height: 25px;
	}

	.uni-fab__item-text {
		color: #FFFFFF;
		font-size: 14px;
		font-family: "Microsoft YaHei UI";
		font-weight: 500;
	}

	.uni-fab__item--first {
		width: 45px;
	}
</style>
