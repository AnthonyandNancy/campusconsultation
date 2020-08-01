<template>
    <view class="main">
        <view :key="index" v-for="(item,index) in noticeList">
            <u-card :sub-title="item.examineType" :thumb="'https://cdn4game.xunyi.online/static/SchoolLian/Badges/' + item.campus + '.png'" :title="item.campus">
                <view class="" slot="body">
                    <view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0">
                        <view class="u-body-item-title u-line-2">
                            <view>您的群聊:'{{item.roomName}}'{{item.examineType}}</view>
                        </view>
                        <image :src="item.pic" mode="aspectFill" style="margin-left: 76rpx;"></image>
                    </view>
                </view>
                <view class="" slot="foot"><u-icon :label="item.addTime" color="" name="clock" size="34"></u-icon></view>
            </u-card>
        </view>

    </view>
</template>

<script src="./notice.js"></script>

<style lang="scss" scoped>
    @import "./notice";
</style>
