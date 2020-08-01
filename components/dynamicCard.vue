<template>
    <view class="dyCartContent">
        <view class="dynamicItem">
            <view class="dynamInfo">
                <view @click="dynamicDetail" class="dynamInfoItem PublisherAvatar">
                    <view class="avatar">
                        <image :src="dynamicObj.pic" class="auto-img" mode="aspectFit"></image>
                    </view>
                </view>
                <view class="dynamInfoItem Publishertime">
                    <view @click="dynamicDetail" class="Publisher">{{dynamicObj.name}}</view>
                    <view @click="dynamicDetail" class="time">{{dynamicObj.addTime}}</view>

                    <view @click="dynamicDetail" class="PublishContent">
                       {{dynamicObj.content}}
                    </view>
                    <view class="resources">
                        <view :key="index" @click='preViewImg(index,dynamicObj.imgList)' class="item image" v-for="(item,index) in dynamicObj.imgList">
                            <image :src="item" class="auto-img" lazy-load  mode="aspectFill"></image>
                        </view>

                        <view class="video" v-if="dynamicObj.video != null &&dynamicObj.video != 'https://cdn4game.xunyi.online'">
                            <video :src="dynamicObj.video" class="auto-img" controls object-fit="cover"></video>
                        </view>
                    </view>
                    <view v-if="dynamicObj.audio != null">
                        <luchAudio :author="dynamicObj.name" :name = 'dynamicObj.schoolName' :play.sync="audioPlay" :src="dynamicObj.audio" @click="controlAudioPlay"></luchAudio>
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
        methods:{
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
            }
        }
    }
</script>

<style lang="scss" scoped>
.dyCartContent{
    border-bottom: 5px solid #ddd;
    padding: 0 25rpx;
    .dynamicItem {
        width: 100%;
        margin: 0 0 15rpx;
        background-color: #FFFFFF;
        .dynamInfo{
            display: flex;
            .dynamInfoItem{
                flex: 1;
                margin: 15rpx 0;
                .avatar{
                    width:80rpx;
                    height: 80rpx;
                    border: 1px solid #ddd;
                    border-radius: 20rpx;
                    margin:  0 auto ;
                    overflow: hidden;
                }
                .Publisher{
                    color: #576B95;
                    font-weight: 600;
                    font-size: 30rpx;
                    font-family: "Microsoft YaHei";
                    margin-bottom: 5rpx;
                }
                .time{
                    color: #B0B0B0;
                    font-family: "Microsoft YaHei";
                    font-size: 26rpx;
                    margin-bottom: 20rpx;
                }
            }
            .Publishertime{
                flex-grow: 4;
                .lastMsg{
                    margin-top: 15rpx;
                    font-size: 26rpx;
                    color: #b2b2b2;
                }
                .groupChat{
                    display: flex;
                    align-items: center;
                    padding-right: 20rpx;
                    .sender{
                        flex: 1;
                    }
                    .sendTime{
                        flex: 1;
                        text-align: right;
                    }
                }
            }
        }
        .PublishContent{
            text-align: justify;
            font-family: "Microsoft YaHei";
            font-size: 34rpx;
            //padding:0 20rpx;
            word-break: break-all;

        }
        .resources{
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 20rpx;
            .item{
                padding: 10rpx;
                width: calc(100% / 3);
                height: 100px;
            }
            .image{

            }
            .video{
                width: 50%;
                    height: 200rpx;
                margin-bottom: 20rpx;
                padding-left: 10rpx;
            }
        }
    }

}
</style>
