<template>
    <view class="main">
        <view class="header">
            <view class="header-Info">
                <view class="notice" @click="toReadNotive">
                    <view class="notice_box">
                        <view class="noticeIcon">
                            <image src="/static/images/notice.png" class="auto-img" style="border-radius: 100%"></image>
                        </view>
                        <text class="pointIcon" v-if="false">&#xe608;</text>
                    </view>
                </view>
                <view class="avatar_nickName">
                    <view class="item avatarItem" @click="toEditDetail(userInfo)">
                        <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor && !userInfo.pic"
                                @getuserinfo="toAuthor"></button>
                        <view class="avatar">
                            <image :src="userInfo.pic?userInfo.pic:'../../../static/images/avatar.png'"
                                   style="width: 100%;height: 100%;" mode="aspectFit"></image>
                        </view>
                    </view>
                    <view class="item nickNameItem">
                        <view class="item userInfo">{{userInfo.name?userInfo.name:'请先授权'}}</view>

                        <view class="nickitem userInfo" v-if="false">{{userInfo.name?userInfo.name:'请先授权'}}</view>
                        <view class="nickite" v-if="false">
                            <u-button class="sendMessageBtn" size="mini" @click="toPrivateChat">发消息</u-button>
                        </view>
                        <view class="editMeans" v-if="false">编辑资料
                            <text class="arrow-right">&#xe658;</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="header-bg">
                <image :src="userInfo.pic" class="auto-img" mode="aspectFill"></image>
            </view>
        </view>
        <view>
            <u-cell-group>
                <u-cell-item @click="toMySupport" icon="heart" title="我赞过的" :arrow="true"
                             arrow-direction="right"></u-cell-item>
                <u-cell-item @click="toMyFollow" icon="star" title="我的关注" :arrow="true"
                             arrow-direction="right"></u-cell-item>
            </u-cell-group>
        </view>
        <view class="operationBox" v-if="false">
            <view class="moreTip">
                更多功能
            </view>

            <view class="OperationFun">
                <view class="funItem" @click="toReadNotive">
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

        <!--        <refresh ref="refresh" @dropOpen="dropOpen" @pullOpen="pullOpen" :drop="true" :pull="true">-->

        <view class="myDynamic" :style="{height: myDynamicViewH + 'px'}">

            <load-refresh ref="hideLoading"
                          :isRefresh="true"
                          :refreshTime="800"
                          :heightReduce="loadRefreshHeight"
                          :backgroundCover="'#fff'"
                          :pageNo="currPage"
                          :totalPageNo="totalPage"
                          @loadMore="loadMore"
                          @refresh="refresh">
                <view slot="content-list">
                    <view class="tip" @click="toother">
                        我的动态
                    </view>
                    <view class="dynamicList">

                        <dynamicCard  v-for="(item1,index1) in dynamicList" :key="index1"
                                     :dynamic-obj="item1"
                                     :currentIndex="index1" :currentPageType="'mine'"
                                     @shareEvent="toShare" @commentEvent="toComment"
                                     @supportEvent="toSupport" @showAllEvent="showAll(index1)" @toDetailEvent="dynamicDetail"></dynamicCard>
                    </view>
                </view>
            </load-refresh>
        </view>
    </view>
</template>

<script src="./my.js"></script>

<style lang="scss" scoped>
    @import "./my";
</style>
