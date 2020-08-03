<template>
    <view class="dyCartContent">
        <view class="dynamicItem">

            <!--头部样式-->
            <view class="dynamInfo">
                <view class="dynamInfoItem PublisherAvatar">
                    <view class="avatar">
                        <image :src="dynamicObj.pic" class="auto-img" mode="aspectFill"></image>
                    </view>
                </view>

                <view class="dynamInfoItem Publishertime">
                    <view class="Publisher">{{dynamicObj.name}}
                        <text v-if="false" class="point" @click="dynamicDetail(dynamicObj)">
                            &#xe608;
                        </text>
                    </view>
                    <view class="time" @click="dynamicDetail(dynamicObj)">
                        {{dynamicObj.addTime}}&nbsp;&nbsp;{{dynamicObj.schoolName}}
                    </view>
                </view>

                <view class="dynamInfoItem" @click="showVideo">
                    <view class="videoIcon" v-if="dynamicObj.video != null" >
                        <image src="/static/images/videoIcon.png" class="auto-img"></image>
                    </view>
                </view>
            </view>

            <!--动态内容-->
            <view class="showSourse">
                <view>
                    <view :class="!dynamicObj.isShowAllContent?'showAllContent':'hideSectionContent'"
                          @click="dynamicDetail(dynamicObj)">
                        {{dynamicObj.content}}
                    </view>
                    <view class="fullText" v-if="dynamicObj.content.length >= 39"
                          @click="showAllContent(index1)">{{!dynamicObj.isShowAllContent?'全文':'收起'}}
                    </view>
                </view>


                <view class="resources">
                    <!--https://game.xunyi.online/static/SchoolLian/uploadFiles/7ed1cdf466d7ab9930bce2d07c88075e.png-->
                    <view class="item image" v-for="(imgItem,index) in dynamicObj.imgList"
                          @click='preViewImg(index,dynamicObj.imgList)' :key="index">
                        <image :src="imgItem" class="auto-img" lazy-load
                               mode="aspectFill"></image>
                    </view>

                    <view class="video">
                        <video id="dynamicVideo" object-fit="cover" controls class="auto-img"
                               src="https://game.xunyi.online/static/SchoolLian/uploadFiles/16c1becf9ba8f4adc4e6e1d48beea951.mp4"></video>
                    <!--dynamicObj.video   v-if="dynamicObj.video != 'https://cdn4game.xunyi.online' && dynamicObj.video != null"-->
                    </view>
                </view>

                <view v-if="dynamicObj.audio != null">
                    <luchAudio :src="dynamicObj.audio" :play.sync="audioPlay"
                               :name='dynamicObj.schoolName'
                               :author="dynamicObj.name" @click="controlAudioPlay"></luchAudio>
                </view>
            </view>


            <view class="support">
                <view class="Item publishTime" v-if="false">{{dynamicObj.addTime}}</view>

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
                            <image :src="dynamicObj.isMySupport?'/static/images/support_active.png':'/static/images/support.png'"
                                   class="auto-img"></image>
                        </view>
                        <view class="tip">{{dynamicObj.likeTimes}}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import luchAudio from '../components/luch-audio/luch-audio';
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
                audioPlay:false
            }
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
                this.$emit('showAllEvent',this.currentIndex)
            },
            showVideo(){
                let playVideo = uni.createVideoContext('dynamicVideo');
                playVideo.requestFullScreen();
            }
        }
    }
</script>

<style lang="scss" scoped>
.dyCartContent{
    .dynamicItem {
        margin: 0 0 15rpx;
        background-color: #FFFFFF;
        padding: 0 20rpx;
        border-bottom: 5px solid #eee;

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

            .videoIcon{
                position: absolute;
                width: 48rpx;
                height: 40rpx;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
            }

            .Publishertime {
                flex-grow: 4.5;
                .Publisher {
                    color: #A2BDFC;
                    font-weight: 600;
                    font-size: 28rpx;
                    font-family: "Microsoft YaHei";
                    margin-bottom: 5rpx;
                }

                .point {
                    font-family: iconfont;
                    font-size: 20rpx;
                    color: #ddd;
                }

                .time {
                    color: #B0B0B0;
                    font-family: "Microsoft YaHei";
                    font-size: 20rpx;
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
                    padding: 10rpx;
                    width: calc(100% / 3);
                    height: 230rpx;
                }

                .image {
                    //height: 100px;
                }

                .video {
                    width: 50%;
                    height: 200rpx;
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
                margin-left: 5rpx;
            }
            .icon{
                width: 40rpx;
                height: 40rpx;
                margin-left: 5px;

            }
        }

    }

}
</style>
