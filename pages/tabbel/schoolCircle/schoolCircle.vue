<template>
    <view class="schoolCircle_content">

        <wuc-tab :tab-list="tabsList" :tabCur.sync="tab" @change="changeTab"></wuc-tab>

        <view>
            <swiper class="navTab" :style="{height:swiperViewHeight + 'px'}" :current="currentSwiper" @change="changeSwiper">

                <swiper-item class="swiper-item" v-for="(item, index) in tabsList" :key="index">
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
                                <view class="dynamicItem"  v-for="(item1,index1) in item.dynamicList" :key="index1">
                                    <!--头部样式-->
                                    <view class="dynamInfo">
                                        <view class="dynamInfoItem PublisherAvatar">
                                            <view class="avatar u-skeleton-circle" @click="toOtherMineInfoPage(item1)">
                                                <image :src="item1.pic" class="auto-img" mode="aspectFill"></image>
                                            </view>
                                        </view>
                                        <view class="dynamInfoItem Publishertime" @click="dynamicDetail(item1)">
                                            <view class="Publisher">{{item1.name}}
                                                <text v-if="false" class="point" @click="dynamicDetail(item1)">
                                                    &#xe608;
                                                </text>
                                            </view>
                                            <view class="time" @click="dynamicDetail(item1)">
                                                {{item1.addTime}}&nbsp;&nbsp;{{item1.schoolName}}
                                            </view>
                                        </view>

                                        <view class="dynamInfoItem" @click="showVideo('dynamicVideo' + index)" >
                                            <view class="videoIcon" v-if="item1.video != null" >
                                                <image src="/static/images/videoIcon.png" class="auto-img"></image>
                                            </view>
                                        </view>
                                    </view>

                                    <!--动态内容-->
                                    <view class="showSourse">
                                        <view >
                                            <view :class="!item1.isShowAllContent?'showAllContent':'hideSectionContent'"
                                                  @click="dynamicDetail(item1)">
                                                {{item1.content}}
                                            </view>
                                            <view class="fullText" v-if="item1.content.length >= 39"
                                                  @click="showAll(index1)">{{!item1.isShowAllContent?'全文':'收起'}}
                                            </view>
                                        </view>

                                        <view class="resources">
                                            <view class="item image" v-for="(imgItem,imgIndex) in item1.imgList"
                                                  @click='preViewImg(imgIndex,item1.imgList)' :key="index">
                                                <image :src="imgItem" class="auto-img" lazy-load
                                                       mode="aspectFill"></image>
                                            </view>
                                            <view v-if="item1.video != null">
                                                <view class="video" v-show="false">
                                                    <video :id="'dynamicVideo' + index" object-fit="cover" autoplay controls class="auto-img"
                                                           :src="item1.video" @fullscreenchange="screenChange"></video>
                                                </view>
                                            </view>

                                        </view>

                                        <view v-if="item1.audio != null">
                                            <luchAudio :src="item1.audio" :play.sync="audioPlay"
                                                       :name='item1.schoolName'
                                                       :author="item1.name" @click="controlAudioPlay"></luchAudio>
                                        </view>
                                    </view>

                                    <view class="support">
                                        <view class="Item publishTime" v-if="false">{{item1.addTime}}</view>
                                        <view class="Item publishTime" v-if="item.type != 36 && item1.roomId != null">
                                            <u-button size="mini" @click="toPersionalChat(item1)">加入聊天</u-button>
                                        </view>

                                        <view class="Item publishTime" v-if="item.type == 36 && userSign != item1.sign">
                                            <u-button size="mini" @click="toPersionalChat(item1)">进入表白</u-button>
                                        </view>

                                        <view class="Item support_comment">
                                            <view class="shareIcon" @click="toShare(item1.dynamicSign)">
                                                <button class="shareIconBtn" open-type="share"></button>
                                                <view class="icon">
                                                    <image src="/static/images/share.png"
                                                           class="auto-img"></image>
                                                </view>
                                                <view class="tip">{{item1.shareTimes}}</view>
                                            </view>

                                            <view class="commentIcon" @click="toComment(item1.dynamicSign)">
                                                <view class="icon">
                                                    <image src="/static/images/comment.png"
                                                           class="auto-img"></image>
                                                </view>
                                                <view class="tip">{{item1.commentTimes}}</view>
                                            </view>

                                            <view class="supportIcon" @click="toSupport(item1.dynamicSign)">
                                                <view class="icon">
                                                    <image :src="item1.like?'/static/images/support_active.png':'/static/images/support.png'"
                                                           class="auto-img"></image>
                                                </view>
                                                <view class="tip">{{item1.likeTimes}}</view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                        </view>
                    </load-refresh>
                </swiper-item>
            </swiper>
        </view>

        <view class="loveBtn" v-if="content.length==1" @click="tofindLove">
            <view class="loveImg">
                <image src="/static/images/loveIcon.png" class="auto-img"></image>
            </view>
            <view class="loveText">怦然心动</view>
        </view>

        <view class="addDynamic" v-if="content.length > 1">
            <uni-fab
                    :pattern="pattern"
                    :content="content"
                    :horizontal="horizontal"
                    :vertical="vertical"
                    :direction="direction"
                    @trigger="trigger"
            ></uni-fab>
        </view>
    </view>
</template>

<script src="./schoolCircle.js"></script>

<style lang="scss" scoped>
    @import "./schoolCircle";
</style>
