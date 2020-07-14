<template>
	<view  class="bg">
		<view class="box1">
			<view style="font-size: 65rpx;">欢迎来到校园资讯</view>
			<view style="margin-left: 60%;">这里有最新的校园咨询</view>

		</view>
		<view class="box2">
			<view>{{keyword}}</view>
			<u-search placeholder="请输入你喜欢的院校" v-model="keyword" @change="handelSearch" @search="search" @custom="search" :show-action="false" ></u-search>
			<view class="chooseUnivercity" @click="showSelectClick">或者选择您喜欢的学校</view>
			<u-select v-model="showSelect" mode="mutil-column-auto" :list="universityChoose" @confirm="chooseUnivercity" ></u-select>
		</view>

	</view>

</template>

<script src="./index.js"></script>

<style scoped lang="scss">
	@import "./index.scss";
</style>
