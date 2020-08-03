<template>
    <view class="main">
        <view>
            <textarea class="inputText" cols="30" id="" name="" placeholder="来吧，尽情发挥吧..." rows="10" v-model="inputText"></textarea>
            <u-tag :closeable="true" :show="showTag" :text="tabsText" @close="closeTag" class="uTag" mode="plain"/>

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

        <view class="tabs">
            <v-tabs :tabs="list" @change="activeTab" activeColor="#fff" backgroundColor="#007AFF" borderRadius="10rpx" lineHeight="0" v-model="chooseTab"></v-tabs>
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
                <view @click="creatQun" class="img_video_express">
                    <view class="operationIcon"><image class="auto-img" src="/static/images/qunliao.png"></image></view>
                </view>
                <view @click="uploadEmoji" class="img_video_express" v-if="false">
                    <text class="picture">&#xe62f;</text>
                </view>
            </view>
            <view class="item pushBtn">
                <u-button @click="publish" class="push" size="medium" type="warning">发布</u-button>
            </view>
        </view>


        <u-popup mode="center" v-model="showSchoolList">
            <view class="">
                <span>选择群聊</span>
                <u-radio-group @change="radioGroupChange" v-model="chooseSchool">
                    <u-radio
                            :key="index"
                            :name="item.roomSign" @change="radioChange"
                            shape="square"
                            v-for="(item, index) in roomList"
                    >
                        {{item.roomName}}
                    </u-radio>
                </u-radio-group>
            </view>
        </u-popup>
    </view>
</template>

<script src="./publish.js"></script>

<style lang="scss">
    @import "./publish";
</style>
