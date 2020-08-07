<template>
    <view class="myFollow_content">
        <view class="followerBox" v-for="(item,index) in followList" :key="index">
            <view class="item follower_avatar">
                <view class="avatar">
                    <image :src="item.pic" class="auto-img"></image>
                </view>
            </view>
            <view class="item follower_Info">
                <view class="follower_Info_item">
                    <view class="followerName">{{item.name}}</view>
                    <view class="followerFans">
                        <view class="fansItem">动态 &nbsp;&nbsp;0</view>
                        <view class="fansItem">粉丝 &nbsp;&nbsp;0</view>
                    </view>
                </view>
                <view class="follower_Info_item">
                    <u-button :custom-style="{borderColor:'#fff'}" class="btn" size="mini" shape="circle" @click="follow(item.sign)">{{item.isMineFollow?'已关注':'关注'}}</u-button>
                </view>
            </view>
        </view>
    </view>
</template>

<script src="./myFollow.js"></script>

<style lang="scss" scoped>
    @import "./myFollow";
</style>
