<template>
    <view class="home_content">
        <view class="home_swiper">
            <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="5000" :duration="500" :loop="true">
                <swiper-item v-for="(item,index) in bannerImg" :key="index">
                        <image :src="item" class="auto-img"></image>
                </swiper-item>
            </swiper>
        </view>

        <view class="home_cart">
            <view class="cart">

                <view class="cartItem"   v-for="(cartItem,index) in cartTypeList" :key="index" :style="{backgroundColor:cartItem.bgColor}">
                    <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor" @getuserinfo="toAuthor"></button>
                    <view class="cartBox" @click="toHotDynamicPage(index)">
                        <view></view>
                        <view class="cart_text">{{cartItem.name}}</view>
                    </view>

                </view>
            </view>
        </view>

        <!--新用户进入时，首次看到的是动态列表 v-show="getMineSchoolName && !hideTop"  -->
        <!--        <view class="top" :style="getMineSchoolName && !hideTop?'':'display:none;'">-->
        <!--            <view class="selectBox" :style="getMineSchoolName && !hideTop?'':'display:none;'" v-if="showSelect">-->
        <!--                <ms-dropdown-menu>-->
        <!--                    <ms-dropdown-item v-model="provinceValue" :list="provinceList"-->
        <!--                                      @input="getprovinceVal"></ms-dropdown-item>-->
        <!--                    <ms-dropdown-item v-if="cityList.length != 0" v-model="cityValue" :list="cityList"-->
        <!--                                      @input="getcityVal"></ms-dropdown-item>-->
        <!--                    <ms-dropdown-item v-if="schoolList.length != 0" v-model="schoolValue" :list="schoolList"-->
        <!--                                      @input="getschoolVal"></ms-dropdown-item>-->
        <!--                </ms-dropdown-menu>-->
        <!--            </view>-->
        <!--            &lt;!&ndash;校园详情 &ndash;&gt;-->
        <!--            <view class="contentTop" :style="getMineSchoolName && !hideTop?'':'display:none;'"-->
        <!--                  v-if="schoolInfo.schoolName != undefined">-->
        <!--                <view class="item schoolAvatar" @click="show">-->
        <!--                    <view class="avatar">-->
        <!--                        <image class="auto-img" :src="avatarImgUrl"></image>-->
        <!--                    </view>-->
        <!--                </view>-->
        <!--                <view class="item schoolContent">-->
        <!--                    <view class="schoolName">-->
        <!--                        <view class="childItem name" @click="show">{{schoolInfo.schoolName}}</view>-->
        <!--                        &lt;!&ndash;                            <view class="childItem">&ndash;&gt;-->
        <!--                        &lt;!&ndash;                                <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor"&ndash;&gt;-->
        <!--                        &lt;!&ndash;                                        @getuserinfo="toAuthor"></button>&ndash;&gt;-->
        <!--                        &lt;!&ndash;                                <u-button type="primary" size="mini" class="push" @click="toApply">创建群聊</u-button>&ndash;&gt;-->
        <!--                        &lt;!&ndash;                            </view>&ndash;&gt;-->
        <!--                    </view>-->
        <!--                    <view class="describe" @click="show">{{schoolInfo.province}}{{schoolInfo.city && schoolInfo.city-->
        <!--                        !=-->
        <!--                        '请选择市'?schoolInfo.city:''}}{{schoolInfo.education}}院校-->
        <!--                    </view>-->
        <!--                    <view class="describe" @click="show">统一编码:{{schoolInfo.schoolCode}}</view>-->
        <!--                </view>-->
        <!--            </view>-->
        <!--        </view>-->


      <!--  <view class="top" :style="getMineSchoolName && !hideTop?'':'display:none;'">
            <view class="schoolContent">
                <view class="schoolItem avatar">
                    <image class="auto-img" :src="avatarImgUrl"></image>
                </view>
                <view class="schoolItem schoolName1" @click="show">{{schoolInfo.schoolName}}</view>
                <view class="schoolItem ">
                    <view class="describe" @click="show">{{schoolInfo.province}}{{schoolInfo.city && schoolInfo.city!='请选择市'?schoolInfo.city:''}}|{{schoolInfo.education}}院校
                    </view>
                    <view class="describe" @click="show">统一编码:{{schoolInfo.schoolCode}}</view>
                </view>
            </view>
            <view class="schoolContentBg">

            </view>
        </view>-->

        <!--        <view class="addBtn">-->
        <!--            <view class="addFather">-->
        <!--                <button class="getUserInfo" open-type="getUserInfo" v-if="!isAuthor"-->
        <!--                        @getuserinfo="toAuthor"></button>-->
        <!--                <view class="add" @click="toPublish()">-->
        <!--                    <text class="addBtnIcon">&#xe632;</text>-->
        <!--                </view>-->
        <!--            </view>-->
        <!--        </view>-->

      <!--  <view class="navTab" v-if="getMineSchoolName == null">
            <button style="position: absolute;top: 0;right: 0;bottom:0;width: 50%;height: 100%;z-index: 1000;opacity: 0"
                    v-if="!isAuthor" class="getUserInfo" open-type="getUserInfo" @getuserinfo="toAuthor"></button>
            <navTab ref="navTab" :tabTitle="tabTitle" @changeTab="changeTab"></navTab>
        </view>

        <view class="navTab" v-if="getMineSchoolName != null">
            <button style="position: absolute;top: 0;right: 0;bottom:0;width: 35%;height: 100%;z-index: 1000;opacity: 0"
                    v-if="!isAuthor" class="getUserInfo" open-type="getUserInfo" @getuserinfo="toAuthor"></button>
            <navTab ref="navTab" :schoolNameType="getMineSchoolName" :tabTitle="cahangeTabTile"
                    @changeTab="changeTab"></navTab>
        </view>-->
        <!--如果当前还未选择学校 swiper高度为110  已选择学校：!getMineSchoolName && hideTop?110:otherViewHight   -->

<!--        <swiper class="swiper" :style="{height:swiperHeight + 'px'}" :current="currentTab" @touchmove="touchmove"-->
<!--                @touchstart="touchstart" @touchend="touchend" @change="changeSwiper">-->
<!--            <swiper-item v-for="(item,index) in getMineSchoolName == null?tabTitle:cahangeTabTile" :key="index">-->
<!--                &lt;!&ndash;全部动态&ndash;&gt;-->
<!--                <load-refresh ref="hideLoading"-->
<!--                              :isRefresh="true"-->
<!--                              :refreshTime="800"-->
<!--                              :heightReduce="otherViewHight"-->
<!--                              :backgroundCover="'#fff'"-->
<!--                              :pageNo="allDynamicCurrPage"-->
<!--                              :totalPageNo="allDynamicTotalPage"-->
<!--                              @loadMore="loadMore"-->
<!--                              @refresh="refresh"-->
<!--                              @scrollEvent="dynimicScroll"-->
<!--                              v-if="item == '全部动态'">-->

<!--                    <view slot="content-list">-->
<!--                        <view class="dynamicItem" v-for="(item1,index1) in totalDynamicList" :key="index1">-->
<!--                            <view class="dynamInfo">-->
<!--                                <view class="dynamInfoItem PublisherAvatar">-->
<!--                                    <view class="avatar" @click="toPublisher(item1)">-->
<!--                                        <image :src="item1.pic" class="auto-img" mode="aspectFill"></image>-->
<!--                                    </view>-->
<!--                                    <button style="position: absolute;top: 0;left:0;right: 0;bottom:0;width: 65%;height:40%;z-index: 1000;opacity: 0"-->
<!--                                            v-if="!isAuthor" class="getUserInfo" open-type="getUserInfo"-->
<!--                                            @getuserinfo="toAuthor">-->
<!--                                    </button>-->
<!--                                </view>-->
<!--                                <view class="dynamInfoItem Publishertime">-->
<!--                                    <view class="Publisher">{{item1.name}}-->
<!--                                        <text v-if="false" class="point" @click="dynamicDetail(item1)">&#xe608;</text>-->
<!--                                        <u-tag :text="item1.schoolName" size="default"-->
<!--                                               type="info" @click="getSchool(item1.schoolName)" v-if="false"/>-->
<!--                                    </view>-->
<!--                                    <u-tag :text="item1.schoolName" size="mini"-->
<!--                                           type="info" @click="getSchool(item1.schoolName)"/>-->
<!--                                    <view class="time" v-if="false" @click="dynamicDetail(item1)">{{item1.addTime}}-->
<!--                                    </view>-->
<!--                                </view>-->

<!--                            </view>-->
<!--                            <view class="showSourse">-->
<!--                                <view class="PublishContent" @click="dynamicDetail(item1)">-->
<!--                                    {{item1.content}}-->
<!--                                </view>-->

<!--                                <view class="resources">-->
<!--                                    &lt;!&ndash;https://game.xunyi.online/static/SchoolLian/uploadFiles/7ed1cdf466d7ab9930bce2d07c88075e.png&ndash;&gt;-->
<!--                                    <view class="item image" v-for="(imgItem,index) in item1.imgList"-->
<!--                                          @click='preViewImg(index,item1.imgList)' :key="index">-->
<!--                                        <image :src="imgItem" class="auto-img" lazy-load mode="aspectFill"></image>-->
<!--                                    </view>-->
<!--                                    <view class="video"-->
<!--                                          v-if="item1.video != 'https://cdn4game.xunyi.online' && item1.video != null">-->
<!--                                        <video v-if="item1.video != 'https://cdn4game.xunyi.online'&& item1.video != null"-->
<!--                                               object-fit="cover" controls class="auto-img"-->
<!--                                               :src="item1.video"></video>-->
<!--                                    </view>-->
<!--                                </view>-->

<!--                                <view v-if="item1.audio != null">-->
<!--                                    <luchAudio :src="item1.audio" :play.sync="audioPlay" :name='item1.schoolName'-->
<!--                                               :author="item1.name" @click="controlAudioPlay"></luchAudio>-->
<!--                                </view>-->
<!--                            </view>-->
<!--                            <view class="support">-->
<!--                                <view class="Item publishTime">{{item1.addTime}}</view>-->
<!--                                <view class="Item support_comment">-->
<!--                                    <view class="supportIcon" @click="support(item1.dynamicSign)">-->
<!--                                        <view>{{item1.likeTimes}}</view>-->
<!--                                        <view class="icon">-->
<!--                                            <image :src="item1.isMySupport?'/static/images/support_active1.png':'/static/images/support1.png'" class="auto-img"></image>-->
<!--                                        </view>-->
<!--                                    </view>-->
<!--                                    <view class="commentIcon" @click="comment(item1.dynamicSign)">-->
<!--                                        <view>{{item1.commentTimes}}</view>-->
<!--                                        <view class="icon">-->
<!--                                            <image src="/static/images/comment_active.png" class="auto-img"></image>-->
<!--                                        </view>-->
<!--                                    </view>-->
<!--                                </view>-->
<!--                            </view>-->
<!--                        </view>-->
<!--                    </view>-->
<!--                </load-refresh>-->
<!--                &lt;!&ndash;动态列表&ndash;&gt;-->
<!--                <load-refresh ref="hideLoading"-->
<!--                              :isRefresh="true"-->
<!--                              :refreshTime="800"-->
<!--                              :heightReduce="otherViewHight"-->
<!--                              :backgroundCover="'#fff'"-->
<!--                              :pageNo="currPage"-->
<!--                              :totalPageNo="totalPage"-->
<!--                              @loadMore="loadMore"-->
<!--                              @refresh="refresh"-->
<!--                              v-if="item == '该校动态'">-->
<!--                    &lt;!&ndash;                    @scrollEvent="dynimicScroll"&ndash;&gt;-->
<!--                    <view slot="content-list">-->
<!--                        <view class="dynamicItem" v-for="(item1,index1) in dynamicList" :key="index1">-->
<!--                            <view class="dynamInfo">-->
<!--                                <view class="dynamInfoItem PublisherAvatar" @click="toPublisher(item1)">-->
<!--                                    <view class="avatar">-->
<!--                                        <image :src="item1.pic" class="auto-img" mode="aspectFill"></image>-->
<!--                                    </view>-->
<!--                                </view>-->
<!--                                <view class="dynamInfoItem Publishertime">-->
<!--                                    <view class="Publisher">{{item1.name}}-->
<!--                                        <text class="point" v-if="!getMineSchoolName && hideTop"-->
<!--                                              @click="dynamicDetail(item1)">&#xe608;-->
<!--                                        </text>-->
<!--                                        <u-tag v-if="!getMineSchoolName && hideTop" :text="item1.schoolName"-->
<!--                                               size="default"-->
<!--                                               type="success" @click="getSchool(item1.schoolName)"/>-->
<!--                                    </view>-->
<!--                                    <view class="time" @click="dynamicDetail(item1)">{{item1.addTime}}</view>-->

<!--                                    <view class="PublishContent" @click="dynamicDetail(item1)">-->
<!--                                        {{item1.content}}-->
<!--                                    </view>-->
<!--                                    <view class="resources">-->
<!--                                        &lt;!&ndash;https://game.xunyi.online/static/SchoolLian/uploadFiles/7ed1cdf466d7ab9930bce2d07c88075e.png&ndash;&gt;-->
<!--                                        <view class="item image" v-for="(imgItem,index) in item1.imgList"-->
<!--                                              @click='preViewImg(index,item1.imgList)' :key="index">-->
<!--                                            <image :src="imgItem" class="auto-img" lazy-load mode="aspectFill"></image>-->
<!--                                        </view>-->
<!--                                        <view class="video"-->
<!--                                              v-if="item1.video != 'https://cdn4game.xunyi.online' && item1.video != null">-->
<!--                                            <video v-if="item1.video != 'https://cdn4game.xunyi.online'&& item1.video != null"-->
<!--                                                   object-fit="cover" controls class="auto-img"-->
<!--                                                   :src="item1.video"></video>-->
<!--                                        </view>-->
<!--                                    </view>-->
<!--                                    <view v-if="item1.audio != null">-->
<!--                                        <luchAudio :src="item1.audio" :play.sync="audioPlay" :name='item1.schoolName'-->
<!--                                                   :author="item1.name" @click="controlAudioPlay"></luchAudio>-->
<!--                                    </view>-->
<!--                                </view>-->
<!--                            </view>-->
<!--                        </view>-->
<!--                    </view>-->
<!--                </load-refresh>-->
<!--                &lt;!&ndash;群聊列表&ndash;&gt;-->
<!--                <load-refresh ref="loadRefresh"-->
<!--                              :isRefresh="true"-->
<!--                              :refreshTime="800"-->
<!--                              :heightReduce="otherViewHight"-->
<!--                              :backgroundCover="'#FFFFFF'"-->
<!--                              :pageNo="currPage"-->
<!--                              :totalPageNo="totalPage"-->
<!--                              @loadMore="loadMore"-->
<!--                              @refresh="refresh"-->
<!--                              v-if="item == '该校群聊' || item == '群聊'">-->

<!--                    &lt;!&ndash;@scrollEvent="chatScroll"&ndash;&gt;-->

<!--                    <view slot="content-list">-->
<!--                        <view class="groupChatItem" v-for="(item1,index1) in charRoomList" :key="index1"-->
<!--                              @click="toChatPage(item1.roomSign,item1.roomName,currentTab)">-->
<!--                            <view class="dynamInfo">-->
<!--                                <view class="dynamInfoItem PublisherAvatar">-->
<!--                                    <view class="avatar">-->
<!--                                        <image :src="item1.pic" class="auto-img" mode="aspectFill"></image>-->
<!--                                    </view>-->
<!--                                </view>-->
<!--                                <view class="dynamInfoItem Publishertime">-->
<!--                                    <view class="groupChat">-->
<!--                                        <view class="sender">{{item1.roomName}}</view>-->
<!--                                        <view class="sendTime" v-if="false">2019-10</view>-->
<!--                                    </view>-->
<!--                                    <view class="lastMsg">描述：{{item1.describe}}</view>-->
<!--                                </view>-->
<!--                            </view>-->
<!--                        </view>-->
<!--                    </view>-->
<!--                </load-refresh>-->
<!--            </swiper-item>-->
<!--        </swiper>-->

        <!--选择学校弹出层-->
<!--        <u-popup v-model="showPopup" mode="center" width="100%" height="100%">-->

<!--            <view class="popupClose">-->
<!--                <view class="item" @click="hidePopup">-->
<!--                    <u-icon name="arrow-left" color="#000" size="48"></u-icon>-->
<!--                </view>-->
<!--                <view class="item">-->
<!--                    <u-search placeholder="请输入你喜欢的院校" v-model="keyword" @change="handelSearch" @focus="getFocus"-->
<!--                              @search="search" @custom="search" @clear="clearText" :show-action="false" @blur="toBlus"-->
<!--                              input-align="left" :animation="true"></u-search>-->
<!--                </view>-->
<!--            </view>-->

<!--            <u-cell-group v-if="showCell">-->
<!--                <u-cell-item v-for="(item,index) in searchSchoolList" :key="index" icon="none" :title="item[0]"-->
<!--                             :arrow="false" @click="getSchool(item)"></u-cell-item>-->
<!--            </u-cell-group>-->


<!--            <view v-if="!showSelect">-->
<!--                <ms-dropdown-menu>-->
<!--                    <ms-dropdown-item v-model="provinceValue" :list="provinceList"-->
<!--                                      @input="getprovinceVal" :placeholderTip="'请输入您期望的省份'"></ms-dropdown-item>-->
<!--                    <ms-dropdown-item v-if="cityList.length != 0" v-model="cityValue" :list="cityList"-->
<!--                                      @input="getcityVal" :placeholderTip="'请输入您期望的城市'"></ms-dropdown-item>-->
<!--                    <ms-dropdown-item v-if="schoolList.length != 0" v-model="schoolValue" :list="schoolList"-->
<!--                                      @input="getschoolVal" :placeholderTip="'请输入您期望的学校'"></ms-dropdown-item>-->
<!--                </ms-dropdown-menu>-->
<!--            </view>-->

<!--        </u-popup>-->

        <!--创建新房间弹出层-->
<!--        <u-popup v-model="showApplyPanel" border-radius="14" mode="center" width="80%" height="70%"-->
<!--                 :mask-close-able="true"-->
<!--                 closeable="true" close-icon-pos="top-left">-->
<!--            <view>-->
<!--                <view class="applyPanelTip">-->
<!--                    创建群聊-->
<!--                </view>-->
<!--                <view>-->
<!--                    <u-form :model="applyObj" ref="uForm">-->
<!--                        <view class="applyContent">-->
<!--                            <u-form-item label="名称">-->
<!--                                <u-input v-model="applyObj.roomName" placeholder="请输入名称"/>-->
<!--                            </u-form-item>-->
<!--                        </view>-->
<!--                        <view class="applyContent">-->
<!--                            <u-form-item label="描述">-->
<!--                                <u-input v-model="applyObj.describe" placeholder="请输入描述"/>-->
<!--                            </u-form-item>-->
<!--                        </view>-->
<!--                        <view class="applyContent">-->
<!--                            <u-form-item label="图片">-->
<!--                                <view style="width: 150rpx; height: 150rpx;position: relative;"-->
<!--                                      v-if="applyObj.pic != ''">-->
<!--                                    <image class="auto-img" :src="applyObj.pic"></image>-->
<!--                                    <view class="deleteBox" @click="del">-->
<!--                                        <text class="delete">&#xe625;</text>-->
<!--                                    </view>-->
<!--                                </view>-->
<!--                                <u-button v-if="applyObj.pic == ''" :custom-style="customStyle" size="mini"-->
<!--                                          @click="onUploaded">-->
<!--                                    <text class="addIcon">&#xe641;</text>-->
<!--                                    选择图片-->
<!--                                </u-button>-->
<!--                            </u-form-item>-->
<!--                        </view>-->
<!--                    </u-form>-->
<!--                </view>-->
<!--                <view style="width: 300rpx;margin: 40rpx auto 0; ">-->
<!--                    <u-button @click="submitApply" style="margin:0 auto !important; ">提交</u-button>-->
<!--                </view>-->
<!--            </view>-->
<!--        </u-popup>-->

<!--        <view>-->
<!--            <button class="uniFabgetInFo" open-type="getUserInfo" v-if="!isAuthor"-->
<!--                    @getuserinfo="toAuthor"></button>-->
<!--            <uni-fab-->
<!--                    :pattern="pattern"-->
<!--                    :content="content"-->
<!--                    :horizontal="horizontal"-->
<!--                    :vertical="vertical"-->
<!--                    :direction="direction"-->
<!--                    @trigger="trigger"-->
<!--            ></uni-fab>-->
<!--        </view>-->
    </view>
</template>

<script src="./home.js"></script>

<style lang="scss" scoped>
    @import "./home";
</style>
