<template>
    <view class="home_content">
        <view class="home_swiper">
            <mosowe-swiper
                    :lists="bannerImg"
                    :touchable="false"
                    indicator="dots"
                    :imageKey="image"
                    previewImage
                    pyramid
                    pyramidMargin="90rpx"/>
        </view>

        <view class="home_cart">
            <view class="cart">
                <view class="cartItem"   v-for="(cartItem,index) in cartTypeList" :key="index" :style="{backgroundColor:cartItem.bgColor}">
                    <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor" @getuserinfo="toAuthor"></button>
                    <view class="cartBox" @click="toHotDynamicPage(index)">
                        <view class="picture">
                            <view class="imgBox">
                                <image :src="'/static/images/h'+ (index+1) +'.png'" class="auto-img"></image>
                            </view>
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
