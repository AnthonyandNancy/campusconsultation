<template>
	<div class="dropdown-item">
		<!-- selected -->
		<view @click="changePopup"
			  class="dropdown-item__selected">
			<slot name="title" v-if="$slots.title"></slot>
			<block v-else>
				<view class="selected__name">{{title ? title : selectItem.text}}</view>
				
				<image src="https://i.loli.net/2020/07/15/QsHxlr1gbSImvWt.png" mode="" class="icon-triangle" v-if="showClass === 'show'"></image>
								<image src="https://i.loli.net/2020/07/15/xjVSvzWcH9NO7al.png" mode="" class="icon-triangle" v-else></image>
				<!-- <view :class="showClass === 'show'? 'up' : 'down'"
					  class="selected__icon"
				>
					<span class="iconfont">&#xe851;</span>
				</view> -->
			</block>
		</view>

		<view :style="{top: contentTop + 'px'}" class="dropdown-item__content" v-if="showList">
				<!-- dropdown -->
				<view :class="['list', showClass]">
					<slot v-if="$slots.default"></slot>
					<block v-else>
						<scroll-view scroll-y="true" style="height:700rpx">
						<view style="width: 90%;margin: 20rpx auto 0;  ">
							<u-search :placeholder="placeholderTip" :show-action="false" @change="handelSearch" @custom="search" @search="search" v-model="keyword" ></u-search>
						</view>

						<view :key="index"
							  @click="choose(item)"
							  class="list__option"
							   v-for="(item, index) in filterList">
							<view>{{item.text}}</view>
							<icon size="26" type="success_no_circle" v-if="item.value === value"/>
						</view>
						</scroll-view>
					</block>
				</view>


			<!-- dropdown-mask -->
			<view :class="['dropdown-mask', showClass]" @click="closePopup" v-if="showList"></view>
		</view>

	</div>
</template>

<script>
	export default {
		components: {
		},
		props: {
			value: [Number, String, Object],
			list: {
				type: Array,
				default: ()=> {
					return []
				}
			},
			title: [Number, String],
			placeholderTip:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				showList: "",
				showClass: '',
				selectItem: {},
				contentTop: 0,
				keyword:''
			}
		},
		computed: {
			filterList () {
				var arr = []
				this.list.forEach((item) => arr.push(item))
				if (this.keyword) {
					arr = this.list.filter(item => item.text.includes(this.keyword))
				}
				return arr
			}
		},
		mounted() {
			this.showList = this.active;
			this.selectItem = this.list[this.value];
			// document.addEventListener('click', e => {
			// 	//this.$el 可以获取当前组件的容器节点
			// 	if (!this.$el.contains(e.target)) {
			// 		console.log('change');
			// 		this.close()
			// 	}
			// });
		},
		methods: {
			handelSearch() {
				console.log('改变了')
			},
			//按搜索时搜索
			search() {
				console.log('搜索了',this.keyword);
			},
			choose(item) {
				this.selectItem = item
				this.$emit('input', item.value)
				this.closePopup()
			},
			changePopup() {
				if(this.showList) {
					this.closePopup()
				} else {
					this.openPopup()
				}
			},
			openPopup() {
				// this.$parent  -> dropdown-menu
				this.$parent.$emit('close')
				this.showList = true
				this.$nextTick(() => {
					this.getElementData('.dropdown-item__selected', (data)=>{
						this.contentTop = data[0].bottom
						this.showClass = 'show'
					})
				})
			},
			closePopup() {
				this.showClass = ''
				setTimeout(() => {
					this.showList = false
				}, 300)
			},
			close() {
				this.showClass = ''
				this.showList = false
			},
			getElementData(el, callback){
				uni.createSelectorQuery().in(this).selectAll(el).boundingClientRect().exec((data) => {
					callback(data[0]);
				});
			}
		}
	}
</script>

<style lang="scss">
	@font-face {
	  font-family: 'iconfont';  /* project id 1564327 */
	  src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot');
	  src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot?#iefix') format('embedded-opentype'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff2') format('woff2'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff') format('woff'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.ttf') format('truetype'),
	  url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.svg#iconfont') format('svg');
	}
	.iconfont{
		font-family:"iconfont" !important;
		font-size:28rpx;
		font-style:normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}
	.dropdown-item {
		width: 100%;
		flex:1;
		position: relative;
		&__selected {
			position: relative;
			display: flex;
			align-items: center;
			/*background: #fff;*/
			/*padding: 30rpx;*/
			padding: 15rpx 30rpx;
			box-sizing: border-box;
			justify-content: center;
			.selected__name {
				width: 130rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-size: 32rpx;
				text-align: center;
			}
			.icon-triangle {
							width: 16rpx;
							height: 16rpx;
							margin-left: 10rpx;
						}
			.selected__icon {
				margin-left: 20rpx;
				&.down {
					transition: transform .3s;
					transform: rotateZ(0);
				}
				&.up {
					transition: transform .3s;
					transform: rotateZ(-180deg);
				}
			}
		}
		&__content {
			position: fixed;
			left: 0;
			right: 0;
			overflow: hidden;
			top: 0;
			bottom: 0;
			z-index: 1000;
			.list {
				max-height: 400px;
				/*overflow-y: auto;*/
				position: absolute;
				left: 0;
				right: 0;
				z-index: 3;
				background: #fff;
				transform: translateY(-100%);
				transition: all .3s;
				&.show {
					transform: translateY(0);
				}
				&__option {
					font-size:32rpx;
					padding: 26rpx 28rpx;
					display: flex;
					justify-content: space-between;
					&:not(:last-child) {
						border-bottom: 1rpx solid #DDDDDD;
					}
				}
			}
			.dropdown-mask {
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				transition: all .3s;
				z-index: 2;
				&.show {
					background:rgba(0,0,0,0.5);
				}
			}
		}
		&:not(:last-child):after {
			content: ' ';
			position: absolute;
			width: 2rpx;
			top: 36rpx;
			bottom: 36rpx;
			right: 0;
			background: $uni-border-color;
		}
	}
</style>
