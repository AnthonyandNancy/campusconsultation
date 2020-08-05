<template>
    <view class="main">
       <view class="header" >
            <view class="header-Info">
                <view @click="toReadNotive" class="notice" v-if="false">
                    <view class="notice_box">
                        <view class="noticeIcon"><image class="auto-img" src="/static/images/notice.png"></image></view>
                        <text class="pointIcon" v-if="false">&#xe608;</text>
                    </view>

                </view>
                <view class="avatar_nickName">
                    <view class="item avatarItem">
                    <!--<button class="getUserInfo" open-type="getUserInfo"  v-if="!isAuthor && !userInfo.pic" @getuserinfo="toAuthor"></button>-->
                        <view class="avatar">
                            <image :src="userInfo.avatar?userInfo.avatar:'../../static/images/avatar.png'" mode="aspectFit" style="width: 100%;height: 100%;"></image>
                        </view>
                    </view>
                    <view class="item nickNameItem">
                        <view class="item userInfo" >
                            {{userInfo.roomName?userInfo.roomName:'请先授权'}}
                        </view>

                        <view @click="follow" class="item followBox">
                            <view class="follow">
                            <!--<image :src="isFollow?'/static/images/follow_active.png':'/static/images/follow.png'" class="auto-img"></image>-->
                                <u-icon :name="isFollow?'star-fill':'star'" :color="isFollow?'#2979ff':'#b2b2b2'" size="28"></u-icon>
                            </view>
                               <view class="followIcon">关注</view>
                        </view>

                        <view class="nickitem userInfo" v-if="false">{{userInfo.roomName?userInfo.roomName:'请先授权'}}</view>
                        <view class="nickite" v-if="false">
                            <u-button  @click="toPrivateChat" class="sendMessageBtn" size="mini">发消息</u-button>
                        </view>
                        <view class="editMeans" v-if="false">编辑资料
                            <text class="arrow-right">&#xe658;</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="header-bg" >
                <image :src="userInfo.avatar" class="auto-img" mode="aspectFill"></image>
            </view>
        </view>

        <view class="sendBtn">
            <view class="sendBtnBox">
<!--                <button style="position: absolute;top: 0;right: 0;bottom:0;width: 100%;height: 100%;z-index: 1000;opacity: 0"-->
<!--                        v-if="!isAuthor" class="getUserInfo" open-type="getUserInfo" @getuserinfo="toAuthor"></button>-->
                <view @click="toPrivateChat" class='btn'>
                    发消息
                </view>
            </view>
        </view>
        <view class="operationBox" v-if="false">
            <view class="moreTip">
                更多功能
            </view>
            <view class="OperationFun">
                <view @click="toReadNotive" class="funItem">
                    <view class="notice">
                        <text class="noticeIcon">
                            &#xe651;
                        </text>
                        <text class="pointIcon">&#xe608;</text>

                    </view>
                    <view>通知</view>
                </view>
                <view class="funItem">
                    <view>
                        <text class="setIcon">&#xe6b6;</text>
                    </view>
                    <view>设置</view>
                </view>
                <view class="funItem">
                    <view>
                        <text class="historyIcon">&#xe7aa;</text>
                    </view>
                    <view>浏览历史</view>
                </view>
            </view>
        </view>
        <refresh :drop="true" :pull="true" @dropOpen="dropOpen" @pullOpen="pullOpen" ref="refresh">
            <view :style="{height: myDynamicViewH + 'px'}" class="myDynamic">
                <view class="tip">
                    我的动态
                </view>
                <view class="dynamicList">
                    <dynamicCard :currentPageType="'mine'" :dynamicObj="item" :key="index" v-for="(item,index) in dynamicList"></dynamicCard>
                </view>
            </view>
        </refresh>
    </view>
</template>

<script src="./otherMinePage.js"></script>

<style lang="scss" scoped>
    @import "./otherMinePage";
</style>
