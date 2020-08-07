<template>
    <view @click="toDynamicDetail" class="container">
        <view class="containerItem">
            <view class="dynContent">{{dynamicObj.content}}</view>
            <view class="publisher_info">
                <view class="publisher_avatar"><image :src="dynamicObj.pic" class="auto-img" style="border-radius: 100%"></image></view>
                <view class="publisher_name">{{dynamicObj.name}}</view>
            </view>
            <view class="dynamic_Info">
                <view class="infoItem"><u-icon color="#000" name="share" size="28" style="margin-right: 10rpx"></u-icon><view class="shareTimesTip">{{dynamicObj.shareTimes}}</view></view>
                <view class="infoItem">{{dynamicObj.addTime}}</view>
            </view>
        </view>
        <view class="containerItem">
            <view class="picture" v-if="dynamicObj.imgList.length != 0">
                <image :src="dynamicObj.imgList[0]" class="auto-img" style="border-radius: 10rpx" mode="aspectFit"></image>
            </view>
        </view>
    </view>
</template>


<script>
    export default {
        props:{
            dynamicObj:{
                type:Object,
                default:{}
            }
        },
        data(){
            return{

            }
        },
        methods:{
            toDynamicDetail(){
                uni.navigateTo({
                    url:'/pages/dynamicDetail/dynamicDetail?dynamicObj=' + JSON.stringify(this.dynamicObj)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        display: flex;
        padding: 20rpx 0;
        border-bottom: 1rpx solid rgba(0,0,0,.1);
        .containerItem{
            flex: 1;
            &:first-child{
                flex-grow: 3.5;
            }

        }
        .dynContent{
            font-size: 30rpx;
            font-family: "Microsoft YaHei";
            font-weight: 600;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .publisher_info{
            display: flex;
            align-items: center;
            margin: 15rpx 0;
            .publisher_avatar{
                flex:  0 0 1;
                display: inline-block;
                width: 40rpx;
                height: 40rpx;
                border-radius: 100%;
                margin-right: 20rpx;
                overflow: hidden;
            }
            .publisher_name{
                flex-grow: 2;
                display: inline-block;
                font-size: 24rpx;
                font-weight: 500;
                font-family: "Microsoft YaHei";
                line-height: 40rpx;
            }
        }


        .dynamic_Info{
            display: flex;
            align-items: center;
            .infoItem{
                flex: 1;
                &:first-child{
                    font-size: 24rpx;
                    font-family: "Microsoft YaHei UI";

                }
                &:last-child{
                    flex-grow: 2;
                    font-size: 24rpx;
                    text-align: right;
                    padding-right: 15rpx;
                }
            }
        }

        .picture{
            width: 100%;
            height: 160rpx;
            border-radius: 10rpx;
            margin: 10rpx;
            border:1px solid #ddd;

        }
    }
</style>
