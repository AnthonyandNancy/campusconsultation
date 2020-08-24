<template>
    <view class="main">
        <view class="header">
            <view class="header-Info">
                <view class="notice" @click="toReadNotive">
                    <view class="notice_box">
                        <view class="noticeIcon">
                            <image src="/static/images/notice.png" class="auto-img"></image>
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
                                   style="width: 100%;height: 100%;border-radius: 100% !important;"
                                   mode="aspectFit"></image>
                        </view>
                    </view>

                    <view class="item nickNameItem">
                        <view class="item userInfo">{{userInfo.name?userInfo.name:'请先授权'}}</view>
                    </view>

                    <view class="item support_or_folloew">
                        <view class="supportOrFollowItem">
                            <view  class="supportBox" @click="toMySupport">
                                <view class="supportOrFollowNum">15</view>
                                <view class="supportOrFollowText">我赞过的</view>
                            </view>
                        </view>
                        <view class="supportOrFollowItem">
                            <view class="followBox" @click="toMyFollow">
                                <view class="supportOrFollowNum">{{followNum}}</view>
                                <view class="supportOrFollowText">我的关注</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="header-bg">
                <!--userInfo.pic-->
                <image src="/static/images/mineBG@2x.png" class="auto-img" mode="aspectFill"></image>
            </view>
        </view>

        <view class="myDynamic"  :style="{height: myDynamicViewH + 'px'}">

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
                    <view class="tip">
                        我的动态
                    </view>
                    <view class="dynamicList">

                        <dynamicCard v-for="(item1,index1) in dynamicList" :key="index1"
                                     :dynamic-obj="item1"
                                     :currentIndex="index1" :currentPageType="'mine'"
                                     @shareEvent="toShare" @commentEvent="toComment"
                                     @supportEvent="toSupport" @showAllEvent="showAll(index1)"
                                     @toDetailEvent="dynamicDetail"></dynamicCard>
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
