<template>
    <view class="home_content">
        <!-- banner -->
        <view class="home_swiper">
            <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor" @getuserinfo="toAuthor"></button>
            <carousel :img-list="bannerImg" url-key="pic"  @selected="jumpToOtherPath"/>
        </view>

        <!-- cart -->
        <view class="home_cart">
            <view class="cart">
                <view class="cartItem"   v-for="(cartItem,index) in cartTypeList" :key="index">
                    <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor" @getuserinfo="toAuthor"></button>
                    <view class="cartBox" @click="toHotDynamicPage(index)">
                        <view class="imgBox">
                            <image :src="'/static/images/h'+ (index+1) +'.png'" class="auto-img" mode="aspectFit"></image>
                        </view>
                        <view class="cart_text">{{cartItem.name}}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script src="./home.js"></script>

<style lang="scss" scoped>
    @import "./home";
</style>
