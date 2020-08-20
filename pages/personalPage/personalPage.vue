<template>
    <view class="box">
        <view class="userDetail">
            <view class="top"></view>
            <view class="common">
                <view class="commonLeft">头像</view>

                <view class="commonRight">
                    <u-avatar :src="userAvater" class="u_avater"></u-avatar>
                </view>
            </view>
            <view class="common">
                <view class="commonLeft">昵称</view>
                <view class="commonRight">
                    <u-input :border="false" :type="text" input-align="right" v-model="personalName"
                             :clearable="false"/>
                </view>
            </view>
            <view class="common">
                <view class="commonLeft">性别</view>
                <view class="commonRight">
                    <view @click="clickSex" class="sex">
                        {{chooseSex}}
                        <u-picker :range="sex" @cancel="cancelSex" @confirm="confirmSex" mode="selector"
                                  range-key="value" v-model="showSex"></u-picker>
                    </view>
                </view>
            </view>
            <view class="common">
                <view class="commonLeft">年龄</view>
                <view class="commonRight">
                    <u-input :border="false" :maxlength="2" :type="text" input-align="right" placeholder="请输入你的年龄"
                             v-model="personalAge" type="number" :clearable="false"/>
                </view>
            </view>
            <view class="common">
                <view class="commonLeft">学校</view>
                <view class="commonRight">
                    <view @click="clickSchoolName" class="likeSchool">{{schoolName}}</view>
                </view>
            </view>
            <u-button type="success" @click="save" class="uBTnSave">保存信息</u-button>


        </view>

        <!--选择学校弹出层-->
        <u-popup height="100%" mode="center" v-model="showPopup" width="100%">

            <view class="popupClose">
                <view class="item">

                    <uni-search-bar placeholder="请输入你喜欢的院校" @focus="getFocus" @blur="toBlus" @input="handelSearch"
                                    v-model="keyword" :radius="100" cancelButton="always"
                                    @cancel="cancelPop"></uni-search-bar>
                </view>
            </view>

            <u-cell-group v-if="showCell">
                <u-cell-item :arrow="false" :key="index" :title="item[0]" @click="getSchool(item)"
                             icon="none" v-for="(item,index) in searchSchoolList"></u-cell-item>
            </u-cell-group>


            <view v-if="!showSelect">
                <ms-dropdown-menu>
                    <ms-dropdown-item :list="provinceList" :placeholderTip="'请输入您期望的省份'"
                                      @input="getprovinceVal" v-model="provinceValue"></ms-dropdown-item>
                    <ms-dropdown-item :list="cityList" :placeholderTip="'请输入您期望的城市'" @input="getcityVal"
                                      v-if="cityList.length != 0" v-model="cityValue"></ms-dropdown-item>
                    <ms-dropdown-item :list="schoolList" :placeholderTip="'请输入您期望的学校'" @input="getschoolVal"
                                      v-if="schoolList.length != 0" v-model="schoolValue"></ms-dropdown-item>
                </ms-dropdown-menu>
            </view>

        </u-popup>

    </view>
</template>

<script src="./personalPage.js"></script>

<style lang="scss" scoped>
    @import "./personalPage";
</style>
