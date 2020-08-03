<template>
	<view class="campus">
<!--		校园页面-->
		<view class="campusSearch">
			<view class="search">
				搜索您心仪的学校
			</view>
		</view>
		<view class="campusHistory">
			<swiper :duration="duration" :indicator-dots="indicatorDots"  :interval="interval" class="swiper">
				<swiper-item>
					<scroll-view @scroll="scroll" class="scroll-view_H" scroll-left="120" scroll-x="true">
						<view class="scroll-view-item_H " id="demo1">A</view>
						<view class="scroll-view-item_H " id="demo2">B</view>
						<view class="scroll-view-item_H" id="demo3">C</view>
					</scroll-view>
				</swiper-item>

			</swiper>
		</view>
	</view>
</template>

<script src="./campus.js"></script>

<style lang="scss" scoped>
	@import "./campus";
</style>
