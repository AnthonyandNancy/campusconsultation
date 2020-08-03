<template>
	<view class="box">
		<view class="tabs">
			<v-tabs :tabs="list" @change="activeTab" v-model="chooseTab"></v-tabs>
		</view>
		<view class="dynamicList">
			<view class="tbsBottom"></view>
			<view :key="index" class="dynamic" v-for="(item,index) in dynamicList">
				<view class="dynamicNav">
					<u-avatar :src="item.pic" class="dynamicAvater"></u-avatar>
					<view class="dynamicName">{{item.name}}</view>
					<view class="dynamicAddTime">{{item.addTime}}</view>
				</view>
				<view class="dynamicSubject">
					<view class="dynamicContent">{{item.content}}</view>
					<view class="dynamicMedia">
<!--						{{src}}-->
						<view :key="indexImg" class="dynamicImage" v-for="(srcI,indexImg) in  item.imgList" v-if="item.imgList">
							<image :src="srcI" class="image" v-if="indexImg <=4"></image>
							<view class="image" v-if="indexImg >4">
								<image class="more" src="../../../static/images/more.png"></image>
								查看更多
							</view>

						</view>
						<view :key="indexvideo" class="dynamicVideo" v-for="(srcV,indexvideo) in  item.video" v-if="item.video">
							<video :src="srcV" class="video"></video>
						</view>

					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script src="./schoolCircle.js"></script>

<style lang="scss" scoped>
 @import "./schoolCircle";
</style>
