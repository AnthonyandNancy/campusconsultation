<template>
    <view class="main">
        <view>
            <textarea class="inputText" cols="30" id="" name="" placeholder="来吧，尽情发挥吧..." rows="10" v-model="inputText"></textarea>
            <view v-if="false">
                <view v-if="showTag ==true">
                    <span style="color: #2B83FF">您选择的标签:</span>
                    {{tabsText}}
                    <span  @click="closeTag" style="color:red;margin-left: 5%;">取消</span>
                </view>

                <view v-if="showgroupChatText==true">
                    <span style="color: #2B83FF">邀请他人加入:</span>
                    {{creatSchoolGrounpName}}  <span  @click="closeGroupTag" style="color:red;margin-left: 5%;">    取消</span>
                </view>
            </view>
        </view>
        <view class="otherSourse">
            <view :key="index"   class="item" v-for="(item,index) in imagesList">
                <image :src="item" class="auto-img" @click="preViewImg(index,imagesList)"></image>

                <u-icon @click.prevent="del('img',index)" class="delete" name="minus-circle"></u-icon>
            </view>
            <view :key="index" class="item" v-for="(item,index) in videoList" v-if="false">
                <video :src="item" class="auto-img"></video>
                <u-icon @click.prevent="del" class="delete" name="minus-circle"></u-icon>
            </view>
            <view class="item audio" v-if="audioList != ''">
                <image :src="audioPlay?'../../static/images/playAudio.jpg':'../../static/images/audio.jpg'" @click="controlAudioPlay"  class="auto-img"></image>
                <view v-show="false">
                    <luchAudio :play.sync="audioPlay" :src="audioList"></luchAudio>
                </view>
                <u-icon @click.prevent="del('video',videoList)" class="delete" name="minus-circle"></u-icon>
            </view>
            <view class="item" v-if="videoList != ''">
                <video :src="videoList" class="auto-img"></video>
                <u-icon @click.prevent="del('video',videoList)" class="delete" name="minus-circle"></u-icon>
            </view>
        </view>


        <u-cell-group v-if="publishType=='publishDynamic'">
            <!--话题的选择-->
            <u-cell-item icon="file-text" title="#话题" @click="chooseHuaTi"  :value="tabsText"></u-cell-item>
            <!--群聊的选择-->
            <u-cell-item icon="chat" title="@群聊" @click="creatQun"  :value="creatSchoolGrounpName" v-if="dynamicType ==0"></u-cell-item>

        </u-cell-group>

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


        <!--话题-->
        <u-picker :default-selector="[0]" :range="list"  @confirm="activeTab" mode="selector" range-key="value" v-model="chooseActiveTab"></u-picker>

        <!--群聊的选择-->
        <u-picker :default-selector="[0]" :range="roomList"  @confirm="radioChange" mode="selector" range-key="room__roomName" v-model="showBtn"></u-picker>


        <u-popup  height="26%" mode="center" v-model="showBtn" width="70%" v-if="false">
            <view   style="width: 100%;height: 11vh; border-bottom: #AAAAAA dashed 2rpx; margin-top: 2vh;" v-if="false">
                <image src="../../static/images/creatGroup.png" style="margin-left: 40rpx;width: 8vh;height: 8vh;"></image>
                <u-button @click="btnCreatGroupChat" size="medium" style="margin-left: 4%;margin-top: -1rpx;" type="primary">创建群聊</u-button>
            </view>

            <view  class="selectChatRoom">
                <view class="selectItem">
                    <image src="../../static/images/chooseGroup.png" style="width: 8vh;height: 8vh;"></image>
                </view>
                <view class="selectItem">
                    <u-button :disabled="btnDis" @click="btnChooseGroupChat" size="medium" style="  margin-top: -1rpx;" type="primary">选择群聊</u-button>

                </view>
            </view>
        </u-popup>
    </view>
</template>

<script src="./publish.js"></script>

<style lang="scss">
    @import "./publish";
</style>
