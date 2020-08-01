<template>
    <view class="main">
        <view>
            <textarea class="inputText" cols="30" id="" name="" placeholder="来吧，尽情发挥吧..." rows="10" v-model="inputText"></textarea>
        </view>
        <view class="otherSourse">
            <view :key="index"  @click="preViewImg(index,imagesList)" class="item" v-for="(item,index) in imagesList">
                <image :src="item" class="auto-img"></image>
                <text @click="del('img',index)" class="delete">&#xe625;</text>
            </view>
            <view :key="index" class="item" v-for="(item,index) in videoList" v-if="false">
                <video :src="item" class="auto-img"></video>
                <text @click="del" class="delete">&#xe625;</text>
            </view>
            <view class="item audio" v-if="audioList != ''">
                <image :src="audioPlay?'../../static/images/playAudio.jpg':'../../static/images/audio.jpg'" @click="controlAudioPlay"  class="auto-img"></image>
                <view v-show="false">
                    <luchAudio :play.sync="audioPlay" :src="audioList"  ></luchAudio>
                </view>
                <text @click="del('video',videoList)" class="delete">&#xe625;</text>
            </view>
            <view class="item" v-if="videoList != ''">
                <video :src="videoList" class="auto-img"></video>
                <text @click="del('video',videoList)" class="delete">&#xe625;</text>
            </view>
        </view>

        <view class="operation">
            <view class="item">
                <view @click="uploadImage" class="img_video_express">
                    <view class="operationIcon"><image class="auto-img" src="/static/images/picture.png"></image></view>
                </view>
                <view @click="uploadVideo" class="img_video_express">
                    <view class="operationIcon"><image class="auto-img" src="/static/images/video.png"></image></view>
                </view>
                <view @longpress.prevent="longToTouch"  @touchend.prevent="endRecord" @touchstart="startRecord"  class="img_video_express">
                    <view class="operationIcon"><image class="auto-img" src="/static/images/audio.png"></image></view>
                </view>
                <view @click="uploadEmoji" class="img_video_express" v-if="false">
                    <text class="picture">&#xe62f;</text>
                </view>
            </view>
            <view class="item pushBtn">
                <u-button @click="publish" class="push" size="medium" type="warning">发布</u-button>
            </view>
        </view>
    </view>
</template>

<script src="./publish.js"></script>

<style lang="scss">
    @import "./publish";
</style>
