<template>
    <view class="hotDynamic_content">
        <wuc-tab :tab-list="tabsList" :tabCur.sync="tab" @change="changeTab"></wuc-tab>
        <view>
            <swiper class="navTab" :current="currentSwiper" @change="changeSwiper"
                    :style="{height:swiperViewHeight + 'px'}">
                <swiper-item class="swiper-item" v-for="(item, index) in tabsList" :data-typeId="item.type" :key="index">

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
                            <dynamicCard v-if="item.type == 37" v-for="(item1,index1) in item.dynamicList" :key="index1"
                                         :dynamic-obj="item1"
                                         :currentIndex="index1" :currentPageType="item.type== 37?'chat':''"
                                         @shareEvent="toShare" @commentEvent="toComment"
                                         @supportEvent="toSupport" @showAllEvent="showAll" @toDetailEvent="dynamicDetail" @toChatRoomEvent="toChat"></dynamicCard>

                            <view class="dynamicItem" v-if="item.type != 37" v-for="(item1,index1) in item.dynamicList" :key="index1">
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

                                    <view class="dynamInfoItem" @click="showVideo('dynamicVideo'+index)" >
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
                                              @click='preViewImg(imgIndex,item1.imgList)' :key="imgIndex">
                                            <image :src="imgItem" class="auto-img" lazy-load
                                                   mode="aspectFill"></image>
                                        </view>
                                    <view  v-if="item1.video != null">
                                        <view class="video" style="display: none">
                                            <video  :id="'dynamicVideo'+index"  object-fit="cover" autoplay controls class="auto-img"
                                                   :src="item1.video" @fullscreenchange="screenChange"></video>
                                            <!--dynamicObj.video   v-if="dynamicObj.video != 'https://cdn4game.xunyi.online' && dynamicObj.video != null"-->
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
                                    <view class="Item publishTime" v-if="item.type != 36 && item1.roomId != null && item1.type != 6">
                                        <u-button size="mini" @click="toAddChatRoom(item1)">加入聊天</u-button>
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

        <view class="addDynamic" v-if="content.length>1">
            <uni-fab
                    :pattern="pattern"
                    :content="content"
                    :horizontal="horizontal"
                    :vertical="vertical"
                    :direction="direction"
                    @trigger="trigger"
            ></uni-fab>
        </view>

        <!--创建群聊房间-->
        <u-popup v-model="showApplyPanel" border-radius="14" mode="center" width="80%" height="70%"
                 :mask-close-able="true"
                 closeable="true" close-icon-pos="top-left">
            <view>
                <view class="applyPanelTip">
                    创建群聊
                </view>
                <view>
                    <u-form :model="applyObj" ref="uForm">
                        <view class="applyContent">
                            <u-form-item label="名称">
                                <u-input v-model="applyObj.roomName" placeholder="请输入名称"/>
                            </u-form-item>
                        </view>
                        <view class="applyContent">
                            <u-form-item label="描述">
                                <u-input v-model="applyObj.describe" placeholder="请输入描述"/>
                            </u-form-item>
                        </view>
                        <view class="applyContent">
                            <u-form-item label="图片">
                                <view style="width: 150rpx; height: 150rpx;position: relative;"
                                      v-if="applyObj.pic != ''">
                                    <image class="auto-img" :src="applyObj.pic"></image>
                                    <view class="deleteBox" @click="del">
                                        <text class="delete">&#xe625;</text>
                                    </view>
                                </view>
                                <u-button v-if="applyObj.pic == ''" :custom-style="customStyle" size="mini"
                                          @click="onUploaded">
                                    <text class="addIcon">&#xe641;</text>
                                    选择图片
                                </u-button>
                            </u-form-item>
                        </view>
                    </u-form>
                </view>
                <view style="width: 300rpx;margin: 40rpx auto 0; ">
                    <u-button @click="submitApply" style="margin:0 auto !important; ">提交</u-button>
                </view>
            </view>
        </u-popup>

    </view>
</template>

<script src="./campus.js"></script>
<style lang="scss" scoped>
    @import "./campus";
</style>
