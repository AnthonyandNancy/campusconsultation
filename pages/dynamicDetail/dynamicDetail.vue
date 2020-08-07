<template>
    <view>
        <!--动态-->
        <dynamicCard :currentPageType="'detail'" :dynamicObj="dynamicObj" @showAllEvent="showAll"></dynamicCard>

        <!--评论列表-->
        <view class="commentList">
            <view class="commentTip">评论 {{dynamicObj.commentTimes}}</view>
            <view :key="index" class="commentFlex" v-for="(item,index) in commentList">
                <view class="item commentUser">
                    <view class="avatar">
                        <image :src="item.pic" class="auto-img" ></image>
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

        <view class="content">
            <view class="comment">
                <view class="item">
                    <view @click="addSupport" class="supportBox">
                        <!--                        <text  :style="{color: isMySupport?'#2B83FF':''}">&#xe620;</text>-->
                        <view class="supportIcon"><image :src="isMySupport?'/static/images/support_active.png':'/static/images/support.png'" class="auto-img"></image></view>
                        <view class="tip">{{dynamicObj.likeTimes}}</view>
                    </view>

                    <view @click="toComment" class="commentBox">
<!--                        <text >&#xe7f5;</text>-->
                        <view class="commentIcon"><image class="auto-img" src="/static/images/comment.png"></image></view>
                        <view class="tip">{{dynamicObj.commentTimes}}</view>
                    </view>
                </view>
                <view class="item">
                    <button class="hideShareBtn" open-type="share">分享</button>
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
