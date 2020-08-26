<template>
    <view class="main">

        <scroll-view :scroll-y="true" :scroll-top="isScroll?'520':'0'" :style="{height:(pageHeight )+ 'px'}" :scroll-with-animation="true">
            <view class="header">
                <view class="header-Info">
                    <!--通知-->
                    <view class="notice" @click="toReadNotive">
                        <view class="notice_box">
                            <view class="noticeIcon">
                                <image src="/static/images/notice.png" class="auto-img"></image>
                            </view>
                        </view>
                    </view>

                    <view class="avatar_nickName">

                        <view class="item avatarItem">
                            <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor"
                                    @getuserinfo="toAuthor"></button>
                            <view class="avatar" @click="toEditDetail()">
                                <image :src="userInfo.pic?userInfo.pic:'../../../static/images/avatar.png'"
                                       style="width: 100%;height: 100%;border-radius: 100% !important;"
                                       mode="aspectFit"></image>
                            </view>
                        </view>

                        <view class="item">
                            <view class="userInfo">{{userInfo.name != null ?userInfo.name:'请先授权'}}</view>
                        </view>

                        <view class="item support_or_folloew">

                            <view class="supportOrFollowItem">
                                <view class="supportBox" @click="toMySupport">
                                    <view class="supportOrFollowNum">{{supportNum}}</view>
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
            </view>

            <load-refresh ref="hideLoading"
                          :isRefresh="true"
                          :refreshTime="800"
                          :heightReduce="loadRefreshHeight"
                          :backgroundCover="'#fff'"
                          :pageNo="currPage"
                          :totalPageNo="totalPage"
                          @loadMore="loadMore"
                          @refresh="refresh"
                          @scrollEvent="scroll">

                <view slot="content-list">
                    <view class="myDynamic">
                        <view class="tip">
                            我的动态
                        </view>
                        <view class="dynamicList">

                            <dynamicCard v-for="(item1,index1) in dynamicList" :key="index1"
                                         :dynamic-obj="item1"
                                         :currentIndex="index1" :currentPageType="'mine'"
                                         @shareEvent="toShare" @commentEvent="toComment"
                                         @supportEvent="toSupport" @showAllEvent="showAll(index1)"
                                         @toDetailEvent="dynamicDetail"  :isAuthor="isAuthor" @failAuth="toCheckAuthor" @successAuth="toCheckAuthor"></dynamicCard>
                        </view>
<!--                        -->
                    </view>
                </view>
            </load-refresh>
        </scroll-view>


    </view>
</template>

<script src="./my.js"></script>

<style lang="scss" scoped>
    @import "./my";
</style>
