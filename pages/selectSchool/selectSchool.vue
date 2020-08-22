<template>
    <view class="selectSchoolcontain">
        <view class="contain">
            <view class="selectSchool">
                <view class="selectSchool_header">
                    <view class="selectTip">关注的校园</view>
                    <view class="selectTarget">我们将为您提供更多校园资讯</view>
                </view>


                <view class="schoolBox" id="schoolBox">
                    <view class="schoolItem" v-for="(item,index) in getSchoolList" :key="index" v-if="index != 9" >
                        <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor" @getuserinfo="toAuthor"></button>
                            <view class="select_item" @click="selectSchool(item.schoolName)">
                                <view class="avatarBox">
                                    <view class="avatar_img" >
                                        <image :src="item.schoolPic" class="auto-img"  mode="aspectFit"></image>
                                    </view>
                                </view>

                            </view>

                            <view class="select_item " @click="selectSchool(item.schoolName)">
                                <view class="moreText">
                                    {{item.schoolName}}
                                </view>

                            </view>
                    </view>

                        <view class="schoolItem" v-for="(item,index) in getSchoolList" :key="index" v-if="index == 9"  >
                            <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor" @getuserinfo="toAuthor"></button>

                            <view class="select_item" @click="showPopup = true">
                                <view class="avatarBox">
                                    <view class="avatar_img">
                                        <image src="/static/images/moreIcon.png" class="auto-img"  mode="aspectFit"></image>
                                    </view>
                                </view>
                            </view>

                            <view class="select_item " @click="showPopup = true">
                                <view class="moreText">
                                    更多校园
                                </view>

                            </view>
                        </view>
                </view>
            </view>
        </view>

        <!--更多学校弹窗-->
        <u-popup v-model="showPopup" mode="center" width="100%" height="100%">

            <view class="popupClose">
                <view class="item" @click="showPopup = false">
                    <u-icon name="arrow-left" color="#000" size="48"></u-icon>
                </view>
                <view class="item">
                    <uni-search-bar placeholder="请输入你喜欢的院校" @focus="getFocus" @blur="toBlus" @input="handelSearch" v-model="keyword" :radius="100" ></uni-search-bar>
            </view>
            </view>

            <u-cell-group v-if="showCell">
                <u-cell-item v-for="(item,index) in searchSchoolList" :key="index" icon="none" :title="item[0]"
                             :arrow="false" @click="selectSchool(item[0])"></u-cell-item>
            </u-cell-group>

            <view v-if="!showSelect">
                <ms-dropdown-menu>
                    <ms-dropdown-item v-model="provinceValue" :list="provinceList"
                                      @input="getprovinceVal" :placeholderTip="'请输入您期望的省份'"></ms-dropdown-item>
                    <ms-dropdown-item v-if="cityList.length != 0" v-model="cityValue" :list="cityList"
                                      @input="getcityVal" :placeholderTip="'请输入您期望的城市'"></ms-dropdown-item>
                    <ms-dropdown-item v-if="schoolList.length != 0" v-model="schoolValue" :list="schoolList"
                                      @input="getschoolVal" :placeholderTip="'请输入您期望的学校'"></ms-dropdown-item>
                </ms-dropdown-menu>
            </view>
        </u-popup>

    </view>
</template>

<script src="./selectSchool.js"></script>

<style lang="scss" scoped>
    @import './selectSchool.scss';
</style>
