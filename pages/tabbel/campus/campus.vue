<template>
	<view class="hotDynamic_content">
		<v-tabs padding="10px 20px" v-model="tab" auto :tabs="tabsList" @change="changeTab"></v-tabs>
		<view>
			<swiper class="navTab" :current="currentSwiper" @change="changeSwiper" :style="{height:swiperViewHeight + 'px'}">
				<swiper-item class="swiper-item" v-for="(item, index) in tabsList.length" :key="index">
					<load-refresh ref="hideLoading"
								  :isRefresh="true"
								  :refreshTime="800"
								  :heightReduce="loadRefreshHeight"
								  :backgroundCover="'#fff'"
								  :pageNo="currPage"
								  :totalPageNo="totalPage"
								  @loadMore="loadMore"
								  @refresh="refresh">
						<scroll-view scroll-y style="height: 800rpx;width: 100%;" @scrolltolower="onreachBottom">
							{{index}}
						</scroll-view>
					</load-refresh>
				</swiper-item>
			</swiper>
		</view>

		<view class="addDynamic">
			<uni-fab
					:pattern="pattern"
					:content="content"
					:horizontal="horizontal"
					:vertical="vertical"
					:direction="direction"
					@trigger="trigger"
			></uni-fab>
		</view>
	</view>
</template>

<script src="./campus.js"></script>
<style lang="scss" scoped>
	@import "./campus";
</style>
