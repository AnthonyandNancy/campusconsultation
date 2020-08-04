<template>
    <view class="main">
        <view>
            <textarea class="inputText" cols="30" id="" name="" placeholder="来吧，尽情发挥吧..." rows="10" v-model="inputText"></textarea>
            <view v-if="showTag ==true">您选择的标签:
                <u-tag :closeable="true" :show="showTag" :text="tabsText" @close="closeTag" class="uTag" mode="plain"/>
            </view>

            <view v-if="showgroupChatText==true">
                <u-tag :closeable="true" :show="showgroupChatText" :text="groupChatText" @close="closeGroupTag" class="uTag" mode="plain"/>
                {{creatSchoolGrounpName}}
            </view>
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


        <u-popup closeable="true" height="26%" mode="center" v-model="showBtn" width="70%">
<!--            <view class="">-->
<!--                <u-button type="primary"  @click="btnCreatGroupChat">创建群聊</u-button>-->
<!--                <u-button type="primary"  @click="btnChooseGroupChat">选择群聊</u-button>-->
<!--            </view>-->
            <view @click="btnCreatGroupChat"  style="width: 100%;height: 11vh; border-bottom: #AAAAAA dashed 2rpx; margin-top: 2vh;">
                <image src="../../static/images/creatGroup.png" style="margin-left: 40rpx;width: 8vh;height: 8vh;"></image>
                <u-button size="medium" style="margin-left: 20rpx;margin-top: -1rpx;" type="primary">创建群聊</u-button>
            </view>
            <view @click="btnChooseGroupChat"  style="width: 100%;height: 11vh; border-bottom: #AAAAAA dashed 2rpx; margin-top: 2vh;">
                <image src="../../static/images/chooseGroup.png" style="margin-left: 40rpx;width: 8vh;height: 8vh;"></image>
                <u-button size="medium" style="margin-left: 20rpx;margin-top: -1rpx;" type="primary">选择群聊</u-button>
            </view>
        </u-popup>
        <u-picker :default-selector="[0]" :range="roomList"  @confirm="radioChange" mode="selector" range-key="roomName" v-model="showSchoolList"></u-picker>
<!--        <u-popup mode="left" v-model="showSchoolList" width="70%">-->
<!--            <view class="">-->
<!--                <span style="font-size: 40rpx;margin-bottom: 20rpx;color: black; ">选择群聊</span>-->
<!--                <u-radio-group @change="radioGroupChange" v-model="chooseSchool">-->
<!--                    <u-radio-->
<!--                            :key="index"-->
<!--                            :name="item.roomSign" @change="radioChange"-->
<!--                            shape="square"-->
<!--                            v-for="(item, index) in roomList"-->
<!--                    >-->
<!--                        {{item.roomName}}-->
<!--                    </u-radio>-->
<!--                </u-radio-group>-->
<!--            </view>-->
<!--        </u-popup>-->

        <u-popup height="50%" mode="center" v-model="showCreatSchool" width="80%">
            <view class="">
                <span style="font-size: 40rpx;margin-bottom: 40rpx;color: black; width: 100%;">创建群聊</span>
                <u-row class="creatSchoolBox" gutter="16" justify="space-between">
                    <u-col span="4">
                        <view class="creatSchoolLeft">头像：</view>
                    </u-col>
                    <u-col span="8">
                        <image :src="groupChatAvatar" @click="chooseAvater" style="width: 6vh;height:6vh;border-radius: 20rpx;margin-left: -5vh;"></image>
                    </u-col>
                </u-row>
                <view style="width: 100%;">
                    <u-line border-style="dashed" color="#eeeeef" length="100%"/>
                </view>
                <u-row class="creatSchoolBox" gutter="16" justify="space-between">
                    <u-col span="4">
                        <view class="creatSchoolLeft">名称：</view>
                    </u-col>
                    <u-col span="8">
                        <view  style="margin-top: 26rpx;margin-left: -5vh;">
                            <u-input border="false" height="6vh" input-align="left" placeholder="请输入群聊名称" type="text" v-model="groupChatName"/>
                        </view>

                    </u-col>
                </u-row>
                <view style="width: 100%;">
                    <u-line border-style="dashed" color="#eeeeef" length="100%"/>
                </view>
                <u-row class="creatSchoolBox" gutter="16" justify="space-between">
                    <u-col span="4">
                        <view class="creatSchoolLeft">描述：</view>
                    </u-col>
                    <u-col span="8">
                        <view  style="margin-top: 26rpx;margin-left: -5vh;">
                            <u-input border="false" height="6vh" input-align="left" placeholder="请输入群聊描述" type="text"  v-model="groupChatDescribe"/>
                        </view>
                    </u-col>
                </u-row>
                <view style="width: 100%;">
                    <u-line border-style="dashed" color="#eeeeef" length="100%"/>
                </view>
                <view style="width: 100%;">
                    <u-button @click="canelCreatSchoolGrounp" size="medium" style="margin-left: 50rpx;" type="warning">返回</u-button>
                    <u-button @click="creatSchoolGrounp" size="medium" style="margin-left: 20rpx;" type="primary">创建</u-button>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script src="./publish.js"></script>

<style lang="scss">
    @import "./publish";
</style>
