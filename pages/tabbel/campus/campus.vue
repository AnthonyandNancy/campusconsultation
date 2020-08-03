<template>
    <view class="hotDynamic_content">
        <dynamicCard :dynamic-obj="hotDynamicList[0]" :currentIndex="0" @shareEvent="toShare" @commentEvent="toComment" @supportEvent="toSupport" @showAllEvent="showAll"></dynamicCard>

        <v-tabs padding="10px 20px" v-model="tab" auto :tabs="tabsList" @change="changeTab"></v-tabs>
        <view>
            <swiper class="navTab" :current="currentSwiper" @change="changeSwiper"
                    :style="{height:swiperViewHeight + 'px'}">
                <swiper-item class="swiper-item" v-for="(item, index) in tabsList.length" :key="index">

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
                            <view class="dynamicItem" v-for="(item1,index1) in hotDynamicList" :key="index1">

                                <!--头部样式-->
                                <view class="dynamInfo">
                                    <view class="dynamInfoItem PublisherAvatar">
                                        <view class="avatar">
                                            <image :src="item1.pic" class="auto-img" mode="aspectFill"></image>
                                        </view>
                                    </view>

                                    <view class="dynamInfoItem Publishertime">
                                        <view class="Publisher">{{item1.name}}
                                            <text v-if="false" class="point" @click="dynamicDetail(item1)">
                                                &#xe608;
                                            </text>
                                        </view>
                                        <view class="time" @click="dynamicDetail(item1)">
                                            {{item1.addTime}}&nbsp;&nbsp;{{item1.schoolName}}
                                        </view>
                                    </view>

                                    <view class="dynamInfoItem">
                                        <view class="videoIcon" v-if="item1.video != null">
                                            <image src="/static/images/videoIcon.png" class="auto-img"></image>
                                        </view>
                                    </view>
                                </view>

                                <!--动态内容-->
                                <view class="showSourse">
                                    <view>
                                        <view :class="!item1.isShowAllContent?'showAllContent':'hideSectionContent'"
                                              @click="dynamicDetail(item1)">
                                            {{item1.content}}
                                        </view>
                                        <view class="fullText" v-if="item1.content.length >= 39"
                                              @click="showAll(index1)">{{!item1.isShowAllContent?'全文':'收起'}}
                                        </view>
                                    </view>


                                    <view class="resources">
                                        <!--https://game.xunyi.online/static/SchoolLian/uploadFiles/7ed1cdf466d7ab9930bce2d07c88075e.png-->
                                        <view class="item image" v-for="(imgItem,index) in item1.imgList"
                                              @click='preViewImg(index,item1.imgList)' :key="index">
                                            <image :src="imgItem" class="auto-img" lazy-load
                                                   mode="aspectFill"></image>
                                        </view>
                                        <view v-if="false">
                                            <view class="video"
                                                  v-if="item1.video != 'https://cdn4game.xunyi.online' && item1.video != null">
                                                <video v-if="item1.video != 'https://cdn4game.xunyi.online'&& item1.video != null"
                                                       object-fit="cover" controls class="auto-img"
                                                       :src="item1.video"></video>
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

                                    <view class="Item support_comment">

                                        <view class="shareIcon" @click="toShare(item1.dynamicSign)">
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
                                                <image :src="item1.isMySupport?'/static/images/support_active.png':'/static/images/support.png'"
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

        <view class="addDynamic">
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

<script src="./campus.js"></script>
<style lang="scss" scoped>
    @import "./campus";
</style>
