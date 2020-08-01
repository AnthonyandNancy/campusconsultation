<template>
	<view  class="bg" :style="{background: 'url(data:image/jpg;base64,'+ bgImg +') no-repeat'}">

		<view class="box2">
			<!-- <view>{{keyword}}</view> -->
			<view class="searchEle">
				<u-search placeholder="请输入你喜欢的院校" v-model="keyword" @change="handelSearch" @search="search" @custom="search" :show-action="false" ></u-search>
			</view>

			<view>
				<view class="chooseUnivercity" v-if="!showSelect" @click="showSelectClick">选择您喜欢的学校</view>
			</view>

			<view style="margin-top: 50%;" v-if="showSelect">
				<ms-dropdown-menu>
					<ms-dropdown-item v-model="provinceValue" :list="provinceList" @input="getprovinceVal" :placeholderTip="'请输入你想找的省份'"></ms-dropdown-item>
					<ms-dropdown-item v-if="cityList.length != 0" v-model="cityValue" :list="cityList" @input="getcityVal" :placeholderTip="'请输入你想找的市'"></ms-dropdown-item>
					<ms-dropdown-item v-if="schoolList.length != 0" v-model="schoolValue" :list="schoolList" @input="getschoolVal" :placeholderTip="'请输入你想找的学校'"></ms-dropdown-item>
				</ms-dropdown-menu>
			</view>
			<!--<u-select v-model="showSelect" mode="mutil-column-auto" :list="universityChoose" @confirm="chooseUnivercity" ></u-select>-->
		</view>

	</view>

</template>

<script src="./index.js"></script>

<style scoped lang="scss">
	@import "./index.scss";
</style>
