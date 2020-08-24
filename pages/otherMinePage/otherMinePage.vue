<template>
    <view class="main">
        <view class="header">
            <view class="header-Info">
                <view class="avatar_nickName">
                    <view class="item avatarItem">
                        <view class="avatar">
                            <image :src="userInfo.avatar?userInfo.avatar:'../../static/images/avatar.png'"
                                   mode="aspectFit"
                                   style="width: 100%;height: 100%;border-radius: 100% !important;"></image>
                        </view>
                    </view>
                    <view class="item nickNameItem">

                        <view class="item userInfo">
                            {{userInfo.roomName?userInfo.roomName:'请先授权'}}
                            <view class="followFatherBox">
                                <view @click="follow" class="item followBox">
                                    <view class="follow">
                                        <u-icon :name="isFollow?'star-fill':'star'" :color="isFollow?'#2979ff':'#5f5f5f'"
                                                size="28"></u-icon>
                                    </view>
                                    <view class="followIcon">关注</view>
                                </view>
                            </view>
                    </view>




                    </view>
                </view>
            </view>
            <view class="header-bg">
                <image :src="userInfo.avatar" class="auto-img" mode="aspectFill"></image>
            </view>
        </view>

        <view class="sendBtn">
            <view class="sendBtnBox">
                <view @click="toPrivateChat" class='btn'>
                    发消息
                </view>
            </view>
        </view>

        <view :style="{height: myDynamicViewH + 'px'}" class="myDynamic">
            <load-refresh ref="hideLoading"
                          :isRefresh="true"
                          :refreshTime="800"
                          :heightReduce="loadRefreshH"
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
<!--                        <dynamicCard :currentPageType="'mine'" :dynamicObj="item" :key="index"-->
<!--                                     v-for="(item,index) in dynamicList"></dynamicCard>-->


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

<script src="./otherMinePage.js"></script>

<style lang="scss" scoped>
    @import "./otherMinePage";
</style>
