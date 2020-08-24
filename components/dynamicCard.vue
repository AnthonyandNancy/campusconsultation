<template>
    <view class="dyCartContent">

        <view class="dynamicItem" v-if="currentPageType != 'chat'">
            <!--头部样式-->
            <view class="dynamInfo">
                <view class="dynamInfoItem PublisherAvatar">
                    <view class="avatar u-skeleton-circle">
                        <image :src="dynamicObj.pic" style="width: 100%;height: 100%;border-radius: 100% !important;" mode="aspectFill"></image>
                    </view>
                </view>
                <view class="dynamInfoItem Publishertime" @click="toDetail(dynamicObj)">
                    <view class="Publisher">{{dynamicObj.name}}
                    </view>
                    <view class="time" @click="toDetail(dynamicObj)" v-if="Object.keys(dynamicObj).length != 0">
                        {{dynamicObj.addTime.split(' ')[0].substring(dynamicObj.addTime.split(' ')[0].indexOf('-')+1)}}&nbsp;&nbsp;{{dynamicObj.addTime.split(' ')[1].substring(0,dynamicObj.addTime.split(' ')[1].lastIndexOf(':'))}}&nbsp;&nbsp;|&nbsp;&nbsp;{{currentPageType=='detail'?dynamicObj.campus:dynamicObj.schoolName}}
                    </view>
                </view>

                <view class="dynamInfoItem chatRoom_Entrance">
                    <view @click="toAddChatRoom(dynamicObj)"  class="chat_btn" v-if=" dynamicObj.roomId != null && dynamicObj.type != 6 && dynamicObj.type != 5">加入聊天</view>

                    <view   class="chat_btn" @click="toPersionalChat(dynamicObj)" v-if=" dynamicObj.type == 6 && userSign != dynamicObj.sign">进入表白</view>

                    <view   class="chat_btn" @click="toPersionalChat(dynamicObj)" v-if="dynamicObj.type == 5 && userSign != dynamicObj.sign">咨询物主</view>

                </view>
            </view>

            <!--动态内容-->
            <view class="showSourse">
                <view >
                    <view :class="!dynamicObj.isShowAllContent?'showAllContent':'hideSectionContent'"
                          @click="toDetail(dynamicObj)">
                        {{dynamicObj.content}}
                    </view>
                    <view class="fullText" v-if="dynamicObj.content.length >= 39"
                          @click="showAllContent()">{{!dynamicObj.isShowAllContent?'全文':'收起'}}
                    </view>
                </view>

                <view class="resources">
                    <view class="item image" v-for="(imgItem,index) in dynamicObj.imgList"
                          @click='preViewImg(index,dynamicObj.imgList)' :key="index">
                        <image :src="imgItem" class="auto-img" lazy-load
                               mode="aspectFill"></image>
                    </view>

                    <view class="item image" v-if="currentPageType != 'detail'&&dynamicObj.video != null && dynamicObj.videoPreview != 'https://cdn4game.xunyi.onlineNone' " @click="showVideo(dynamicObj.video)" >
                        <image :src="dynamicObj.videoPreview" class="auto-img"></image>
                        <view class="videoBtnIcon" @click="showVideo(dynamicObj.video)">
                            <image src="/static/images/video_play.png" class="auto-img" mode="aspectFit"></image>
                        </view>
                        <view class="videoMark"></view>
                    </view>

                    <view class="video" v-show="currentPageType == 'detail'&&dynamicObj.video!=null">
                        <video id="dynamicVideo" object-fit="cover" controls class="auto-img"
                               :src="dynamicObj.video"></video>
                    </view>
                </view>

                <view v-if="dynamicObj.audio != null">
                    <luchAudio :src="dynamicObj.audio" :play.sync="audioPlay"
                               :name='dynamicObj.schoolName'
                               :author="dynamicObj.name" @click="controlAudioPlay"></luchAudio>
                </view>
            </view>

            <view class="support" v-if="currentPageType != 'detail'">

                <view class="Item support_comment">

                    <view class="shareIcon" @click="share(dynamicObj.dynamicSign)">
                        <button class="shareIconBtn" open-type="share"></button>
                        <view class="icon">
                            <image src="/static/images/share.png"
                                   class="auto-img"></image>
                        </view>
                        <view class="tip">{{dynamicObj.shareTimes}}</view>
                    </view>

                    <view class="commentIcon" @click="comment(dynamicObj.dynamicSign)">
                        <view class="icon">
                            <image src="/static/images/comment.png"
                                   class="auto-img"></image>
                        </view>
                        <view class="tip">{{dynamicObj.commentTimes}}</view>
                    </view>

                    <view class="supportIcon" @click="support(dynamicObj.dynamicSign)">
                        <view class="icon">
                            <image :src="dynamicObj.like?'/static/images/support_active.png':'/static/images/support.png'"
                                   class="auto-img"></image>
                        </view>
                        <view class="tip">{{dynamicObj.likeTimes}}</view>
                    </view>
                </view>
            </view>

        </view>

        <video id="videoId"  style="display: block !important; width: 0 !important; height: 0 !important;" :src="videoUrl" class="video" controls @fullscreenchange="screenChange"></video>

        <!-- 群聊列表-->
        <view v-if="currentPageType == 'chat'">
            <view class="chatItemBox" @click="toChatRoom">
                <view class="chatItem">
                    <view class="chatAvatar">
                        <image :src="dynamicObj.pic" class="auto-img" style="border-radius: 20rpx"></image>
                    </view>
                </view>
                <view class="chatItem">
                    <view class="chatRoomName">{{dynamicObj.roomName}}</view>
                    <view class="chatRoomDec">{{dynamicObj.describe}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import luchAudio from '../components/luch-audio/luch-audio';
    import constant from "../utils/constant";
    let that;
    export default {
        props:{
            dynamicObj:{
                type:Object,
                defaule:{}
            },
            currentIndex:{
              type:Number,
              defaule:0
            },
            currentPageType:{
                type:String,
                defaule: ''
            }
        },
        components:{
            luchAudio
        },
        data(){
            return{
                audioPlay:false,
                videoContext:{},
                userSign:'',
                videoUrl:''
            }
        },
        onReady(){
            that = this;
            this.userSign = constant.getUserSign();
        },
        onShareAppMessage:(res)=>{
            return{
                title: dynamicObj.content,
                path: '/pages/dynamicDetail/dynamicDetail',
                imageUrl:dynamicObj.imgList.length==0?'':dynamicObj.imgList[0]
            }
        },
        methods:{
            //图片预览
            preViewImg(index,imgList){
                uni.previewImage({
                    current: index,
                    urls: imgList
                });
            },
            dynamicDetail(){
                if(this.currentPageType == 'mine' ){
                    uni.navigateTo({
                        url:'/pages/dynamicDetail/dynamicDetail?dynamicObj=' + JSON.stringify(this.dynamicObj)
                    })
                }
            },
            controlAudioPlay(){
                if(!this.audioPlay){
                    this.audioPlay = true
                }else{
                    this.audioPlay = false
                }
            },
            share(dySign){
                this.$emit('shareEvent',dySign)
            },
            comment(dySign){
                this.$emit('commentEvent',dySign)
            },
            support(dySign){
                this.$emit('supportEvent',dySign)
            },
            showAllContent(){
                this.$emit('showAllEvent')
            },
            showVideo(url) {
                this.videoUrl = url
                this.videoContext = wx.createVideoContext('videoId', this);
                this.videoContext.requestFullScreen({direction: 0});
            },
            screenChange(e) {
                if (e.detail.fullScreen) {
                    setTimeout(res => {
                        this.videoContext.play();
                    }, 200)

                } else {
                    this.videoUrl = '';
                    this.videoContext.stop()
                }
            },
            toDetail(){
                this.$emit('toDetailEvent',this.dynamicObj)
            },
            toChatRoom(){
                this.$emit('toChatRoomEvent',this.dynamicObj)
            },
            toAddChatRoom(){
                let chatObj = this.dynamicObj
                uni.navigateTo({
                    url: '/pages/chatRoom/chatRoom?roomSign=' + chatObj.roomId + '&roomName=' + chatObj.roomInfo.roomName + '&chatType=' + 1 + '&userName=' + constant.getUserLogin().name
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.dyCartContent{
    .dynamicItem {
        background-color: #FFFFFF;
        padding: 20rpx 20rpx;
        border-bottom: 5px solid #F2F2F2;

        .dynamInfo {
            display: flex;
            //border-bottom: 1rpx solid rgba(0,0,0,0.1);
            .dynamInfoItem {
                flex: 1;
                margin: 15rpx 0;
                position: relative;

                .avatar {
                    width: 80rpx;
                    height: 80rpx;
                    border-radius: 100%;
                    margin: 0 auto;
                    overflow: hidden;
                    box-shadow:0px 0px 2px 1px rgba(0, 0, 0, 0.2);
                }
            }

            .chatRoom_Entrance{
                flex-grow: 3;
                font-size: 24rpx;
                color: #b2b2b2;
            }
            .chat_btn{
                width:136rpx;
                height:60rpx;
                text-align: center;
                background:linear-gradient(90deg,rgba(254,97,96,1) 0%,rgba(255,176,97,1) 100%);
                opacity:1;
                border-radius:15px;
                line-height: 60rpx;
                font-size:24rpx;
                font-family:Source Han Sans SC;
                font-weight:400;
                color:rgba(255,255,255,1);
                letter-spacing:0.5px;
                margin: 0  auto;
            }
            .videoIcon{
                position: absolute;
                width: 48rpx;
                height: 40rpx;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
            }

            .Publishertime {
                flex-grow: 7.5;
                .Publisher {
                    font-weight: 600;
                    font-size: 28rpx;
                    margin-bottom: 5rpx;
                    font-family:Source Han Sans SC;
                    color:rgba(0,0,0,1);
                    padding-left: 20rpx;
                }

                .time {
                    font-size:24upx;
                    font-family:Source Han Sans SC;
                    font-weight:300;
                    color:rgba(159,159,159,1);
                    padding-left: 20rpx;
                }
            }
        }

        .showSourse{
            .showAllContent {
                text-align: justify;
                font-family: "Microsoft YaHei";
                font-size:34rpx;
                padding: 0rpx 10rpx;
                word-break: break-all;
                overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                margin: 15rpx 0;
            }
            .hideSectionContent{
                text-align: justify;
                font-family: "Microsoft YaHei";
                font-size:34rpx;
                padding: 0rpx 10rpx;
                word-break: break-all;
                transition: all .5s linear;
                margin: 15rpx 0;
            }
            .fullText{
                text-align: right;
                font-size: 20rpx;
                color:#b2b2b2;
                padding: 10rpx 0;
            }
            .fullText{
                font-size: 20rpx;
            }
            .resources {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 20rpx;

                .item {
                    margin: 10rpx;
                    width: calc(100% / 3);
                    height: 230rpx;
                }

                .image{
                    position: relative;
                    .videoMark{
                         position: absolute;
                         left: 0;
                         top: 0;
                         width: 100%;
                         height: 100%;
                         background: rgba(0,0,0,0.2);
                          z-index: 800;
                    }
                    .videoBtnIcon{
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%,-50%);
                        width: 96rpx;
                        height: 96rpx;
                        z-index: 1000;
                    }
                }

                .video {
                    width: 98%;
                    height: 300rpx;
                    margin-top: 20rpx;
                    margin-bottom: 20rpx;
                    padding-left: 5px;
                }
            }
        }

        .support{
            display: flex;
            padding: 25rpx 0;
            .Item{
                flex: 1;
            }
            .publishTime{
                flex-grow: 2;
                font-size: 24rpx;
                color: #b2b2b2;
            }
            .support_comment{
                display: flex;
                justify-content:flex-end;
            }
            .supportIcon{
                display: flex;
                align-items: center;
                font-size: 20rpx;
                color: #b2b2b2;
                margin-right: 20rpx;
            }
            .commentIcon{
                display: flex;
                align-items: center;
                font-size: 20rpx;
                color: #b2b2b2;
                margin-right: 20rpx;
            }
            .shareIcon{
                display: flex;
                align-items: center;
                font-size: 20rpx;
                color: #b2b2b2;
                margin-right: 20rpx;
                position: relative;
            }
            .shareIconBtn{
                position: absolute;
                right: 0;
                left: 0;
                top: 0;
                bottom: 0;
                z-index: 1000;
                opacity: 0;
            }
            .tip{
                margin-left: 20rpx;
            }
            .icon{
                width: 40rpx;
                height: 40rpx;
                margin-left: 5px;

            }
        }

    }
    .chatItemBox{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10rpx 15rpx;
        .chatItem{
            flex: 1;
            &:last-child{
                flex-grow: 7.5;
            }
            .chatAvatar{
                width: 80rpx;
                height: 80rpx;
                border-radius: 20rpx;
                margin: 10rpx 20rpx;
            }
            .chatRoomName{
                font-family: "Microsoft YaHei UI";
                margin-bottom: 10rpx;
                font-size: 30rpx;
            }
            .chatRoomDec{
                font-family: "Microsoft YaHei UI";
                font-size: 25rpx;
                color: #b2b2b2;
            }
        }
    }
}
</style>
