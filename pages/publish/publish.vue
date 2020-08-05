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
            <u-cell-item icon="file-text" title="@话题" @click="chooseHuaTi"  :value="tabsText"></u-cell-item>
            <!--群聊的选择-->
            <u-cell-item icon="chat" title="@群聊" @click="creatQun"  :value="creatSchoolGrounpName"></u-cell-item>
        </u-cell-group>





        <view class="tab" v-if="chooseActiveTab==true">
            <view style="width:200%;">
                <view   @click="activeTab(index)" class="tabss" v-for="(item,index) in list ">{{item.value}}</view>
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


        <u-popup  height="26%" mode="center" v-model="showBtn" width="70%">
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


        <u-picker :default-selector="[0]" :range="roomList"  @confirm="radioChange" mode="selector" range-key="room__roomName" v-model="showSchoolList"></u-picker>

<!--        <u-popup height="36%" mode="center" v-model="showCreatSchool" width="80%">-->
<!--            <view class="">-->
<!--                <span style="font-size: 40rpx;margin-bottom: 40rpx;color: black; width: 100%;">创建群聊</span>-->
<!--                <u-row class="creatSchoolBox" gutter="16" justify="space-between">-->
<!--                    <u-col span="4">-->
<!--                        <view class="creatSchoolLeft">头像：</view>-->
<!--                    </u-col>-->
<!--                    <u-col span="8">-->
<!--                        <image :src="groupChatAvatar" @click="chooseAvater" style="width: 6vh;height:6vh;border-radius: 20rpx;margin-left: -5vh;"></image>-->
<!--                    </u-col>-->
<!--                </u-row>-->
<!--                <view style="width: 100%;">-->
<!--                    <u-line border-style="dashed" color="#eeeeef" length="100%"/>-->
<!--                </view>-->
<!--                <u-row class="creatSchoolBox" gutter="16" justify="space-between">-->
<!--                    <u-col span="4">-->
<!--                        <view class="creatSchoolLeft">名称：</view>-->
<!--                    </u-col>-->
<!--                    <u-col span="8">-->
<!--                        <view  style="margin-top: 26rpx;margin-left: -5vh;">-->
<!--                            <u-input border="false" height="6vh" input-align="left" placeholder="请输入群聊名称" type="text" v-model="groupChatName"/>-->
<!--                        </view>-->

<!--                    </u-col>-->
<!--                </u-row>-->
<!--                <view style="width: 100%;">-->
<!--                    <u-line border-style="dashed" color="#eeeeef" length="100%"/>-->
<!--                </view>-->
<!--                <u-row class="creatSchoolBox" gutter="16" justify="space-between">-->
<!--                    <u-col span="4">-->
<!--                        <view class="creatSchoolLeft">描述：</view>-->
<!--                    </u-col>-->
<!--                    <u-col span="8">-->
<!--                        <view  style="margin-top: 26rpx;margin-left: -5vh;">-->
<!--                            <u-input border="false" height="6vh" input-align="left" placeholder="请输入群聊描述" type="text"  v-model="groupChatDescribe"/>-->
<!--                        </view>-->
<!--                    </u-col>-->
<!--                </u-row>-->
<!--                <view style="width: 100%;">-->
<!--                    <u-line border-style="dashed" color="#eeeeef" length="100%"/>-->
<!--                </view>-->
<!--                <view style="width: 100%;">-->
<!--                    <u-button @click="canelCreatSchoolGrounp" size="medium" style="margin-left: 18%;" type="warning">返回</u-button>-->
<!--                    <u-button @click="creatSchoolGrounp" size="medium" style="margin-left: 20rpx;" type="primary">创建</u-button>-->
<!--                </view>-->
<!--            </view>-->
<!--        </u-popup>-->
    </view>
</template>

<script src="./publish.js"></script>

<style lang="scss">
    @import "./publish";
</style>
