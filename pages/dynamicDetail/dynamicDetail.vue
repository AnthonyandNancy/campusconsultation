<template>
    <view>
<!--        <scroll-view :scroll-y="true" @scroll="scroll" :scroll-top="500" :upper-threshold="upperDistance" :lower-threshold="upperDistance"  @scrolltolower="tolower"  :style="{height:(scrollH )+ 'px'}"  :scroll-with-animation="true" @scrolltoupper = 'toupper'>-->

        <!--评论列表-->
        <view class="commentList" v-if="Object.keys(dynamicObj).length != 0">
            <load-refresh ref="hideLoading"
                          :isRefresh="true"
                          :refreshTime="800"
                          :heightReduce="0"
                          :backgroundCover="'#fff'"
                          :pageNo="currPage"
                          :totalPageNo="totalPage"
                          @loadMore="loadMore"
                          @refresh="refresh">
                <view slot="content-list">
                    <view style="padding-bottom: 10rpx">
                        <!--动态-->
                        <dynamicCard :currentPageType="'detail'" :dynamicObj="dynamicObj" @showAllEvent="showAll"  :isAuthor="isAuthor" @failAuth="toCheckAuthor" @successAuth="toCheckAuthor"></dynamicCard>
                    </view>

                    <view class="commentTip">评论 {{dynamicObj.commentTimes}}</view>
                    <view :key="index" class="commentFlex" v-for="(item,index) in commentList">
                        <view class="item commentUser">
                            <view class="avatar">
                                <image :src="item.pic" class="auto-img"  style="overflow: hidden; border-radius: 100%;"></image>
                            </view>
                        </view>
                        <view class="item commentInfo">
                            <view class="userName">{{item.name}}</view>
                            <view class="userContent">{{item.content}}</view>

                            <view class="userSources">
                                <view :key="index" @click="previewImg(index,item.imgList)" class="sourcesItem" v-for="(imgItem,index) in item.imgList" v-if="item.imgList.length != 0">
                                    <image :src="imgItem" class="auto-img" mode="aspectFill"></image>
                                </view>
                                <view class="video" v-if="item.video != '' && item.video != 'https://cdn4game.xunyi.online'">
                                    <video :src="item.video" class="auto-img" controls object-fit="cover"></video>
                                </view>
                            </view>

                            <view class="otherInfo">
                                <view class="otherItem commentTime">{{item.addTime}}</view>
                                <view class="otherItem suppertText" v-if="false"><text class="supportIcon">&#xe601;</text>点赞</view>
                            </view>
                        </view>
                    </view>
                </view>
            </load-refresh>

        </view>

<!--        </scroll-view>-->
        <view class="content">

            <view class="comment">

                <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor" @getuserinfo="toAuthor"></button>


                <view class="item">
                    <view @click="addSupport" class="supportBox">
                        <view class="supportIcon"><image :src="dynamicObj.ILike?'/static/images/support_active.png':'/static/images/support.png'" class="auto-img"></image></view>
                        <view class="tip">{{dynamicObj.likeTimes}}</view>
                    </view>

                    <view @click="toComment" class="commentBox">
                        <view class="commentIcon"><image class="auto-img" src="/static/images/comment.png"></image></view>
                        <view class="tip">{{dynamicObj.commentTimes}}</view>
                    </view>
                </view>
                <view class="item">
                    <button class="hideShareBtn" open-type="share" :data-detaildy="dynamicObj">分享</button>
                    <u-button :custom-style="customStyle" class="shareBtn" shape="circle" size="mini">
                        <u-icon color="#fff" name="weixin-circle-fill" size="28"></u-icon>
                        分享
                    </u-button>
                </view>
            </view>
        </view>
    </view>
</template>

<script src="./dynamicDetail.js">

</script>

<style lang="scss" scoped>
    @import "./dynamicDetail.scss";
</style>
