<template>
    <view>
        <view class="navTab">
            <navTab :schoolNameType="getMineSchoolName" :tabTitle="title" @changeTab="tabChange" ref="navTab"></navTab>
        </view>

        <swiper :current="currentTabIndex"  :style="{height:swiperHeight + 'px'}" @change="changeSwiper" class="swiper">
            <swiper-item :key="index" v-for="(item,index) in title" v-show="currentTabIndex == index">
                <load-refresh :backgroundCover="'#FFFFFF'"
                              :heightReduce="110"
                              :isRefresh="true"
                              :pageNo="currentPage"
                              :refreshTime="800"
                              :totalPageNo="totalPage"
                              @loadMore="loadMore"
                              @refresh="refresh"
                              ref="loadRefresh" v-if="viewType == '私聊'">

                    <view slot="content-list"  style="margin:0 20rpx">
                        <view :key="index1" @click="gotoChat(item1.friend__sign,item1.friend__name,currentTabIndex)" class="dynamicItem" v-for="(item1,index1) in privateChatList">

                            <view class="dynamInfo">
                                <view class="dynamInfoItem PublisherAvatar">
                                    <view class="avatar">
                                        <image :src="item1.friend__pic" class="auto-img"></image>
                                    </view>
                                </view>
                                <view class="dynamInfoItem Publishertime">
                                    <view class="Publisher">
                                        <view class="item">{{item1.friend__name}}</view>
                                        <view class="item privateTime">{{item1.time}}</view>
                                    </view>
                                    <view class="lastChatMsg">{{item1.lastChatMsg}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </load-refresh>

                <load-refresh :backgroundCover="'#FFFFFF'"
                              :heightReduce="110"
                              :isRefresh="true"
                              :pageNo="currentPage"
                              :refreshTime="800"
                              :totalPageNo="totalPage"
                              @loadMore="loadMore"
                              @refresh="refresh"
                              ref="loadRefresh" v-if="viewType == '群聊'">
                    <view slot="content-list"  style="margin:0 20rpx">
                        <view :key="index2" @click="gotoChat(item2.room__roomSign,item2.room__roomName,currentTabIndex)" class="dynamicItem" v-for="(item2,index2) in groupChatList">
                            <view class="dynamInfo">
                                <view class="dynamInfoItem PublisherAvatar">
                                    <view class="avatar">
                                        <image :src="item2.room__pic" class="auto-img"></image>
                                    </view>
                                </view>
                                <view class="dynamInfoItem Publishertime">
                                    <view class="Publisher">
                                        <view class="item">{{item2.room__roomName}}</view>
                                        <view class="item" v-if="item2.hasNewMsg">
                                            <view class="redPoint"></view>
                                        </view>
                                    </view>
                                    <view class="describe">描述：{{item2.room__describe}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </load-refresh>
            </swiper-item>
        </swiper>
<!--        <button @click="gotoChat">聊天</button>-->
    </view>
</template>

<script>
    /*
    * title  后台传回来的数据
    * swiperHeight  轮播切换视图的高度
    * currentTabIndex  当前tab的下标
    * currentPage  轮播图切换的当前页面
    * */
    import navTab from './navTab';
    import loadRefresh from './load-refresh';
    import constant from "../utils/constant";

    let that;
    export default {
        props: {
            title: {
                type: Array,
                default: []
            },
            // swiperHeight: {
            //     type: Number,
            //     default: 0
            // },
            currentTabIndex: {
                type: Number,
                default: 0
            },
            currentPage: {
                type: Number,
                default: 0
            },
            totalPage: {
                type: Number,
                default: 0
            },
            viewType:{
                type:String,
                default:''
            },
            privateChatList:{
                type:Array,
                default:[]
            },
            groupChatList:{
                type:Array,
                default:[]
            }
        },
        components: {
            navTab,
            loadRefresh
        },
        data() {
            return {
                heightReduce:0,
                swiperHeight:0,
                getMineSchoolName:''
            }
        },
        onLoad() {

        },
        onShow() {

        },
        onReady() {
            this.getMineSchoolName = constant.getUserInfo().schoolName
            that = this;
            uni.getSystemInfo({
                success: (res) => {
                    const  query = uni.createSelectorQuery().in(this);

                    query.select('.navTab').boundingClientRect(data=>{
                        console.log('getSystemInfo',data)

                        that.heightReduce = data.height;
                        that.swiperHeight =  res.windowHeight - data.height;
                    }).exec();
                }
            });

            // uni.$on('getPrivateLastChat',(res)=>{
            //     console.log('最新的消息--------------------------',res)
            // })
        },
        methods: {
            tabChange(index) {
                this.$emit('changeFatherTab', index)
            },
            changeSwiper(e) {
                let index = e.detail.current;
                this.$refs.navTab.longClick(index);
            },
            loadMore() {
                console.log('loadMore')
                // 请求新数据完成后调用 组件内loadOver()方法
                // 注意更新当前页码 currPage
                // this.$refs.loadRefresh.loadOver()
                // setTimeout(res => {
                //     this.dynamicList += 8;
                //     this.currPage += 1;
                // }, 2000)

                this.$emit('loadMoreData')
            },
            refresh() {
                this.$emit('refreshFatherData')
                console.log('refresh')
            },
            gotoChat(roomSign,roomName,type){
                this.groupChatList.forEach(res=>{
                    if(res.room__roomSign == roomSign){
                        res.hasNewMsg = false;
                    }
                })
                uni.setStorageSync('CHAT_GROUP_LIST',this.groupChatList);
                console.log('跳转-=-=-=-=-=-======',this.groupChatList)
                // uni.navigateTo({
                //     url:"/pages/chatPage/chatPage?roomSign=" + roomSign + '&roomName=' + roomName
                // })

                uni.navigateTo({
                    url:"/pages/chatRoom/chatRoom?roomSign=" + roomSign + '&roomName=' + roomName + '&chatType=' + type + '&userName=' + constant.getUserInfo().name
                })

                if (type == 0){
                    uni.setStorage({
                        key: 'privateChatSign',
                        data: roomSign,
                        success: function () {
                            console.log('success');
                        }
                    });
                    uni.setStorage({
                        key: 'privateChatName',
                        data: roomName,
                        success: function () {
                            console.log('success');
                        }
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .navTab {
        border-bottom: 1px solid #eee;
    }
    .dynamicItem {
        width: 100%;
        border: 1px solid #eee;
        border-radius: 20rpx;
        margin: 15rpx 0;
        .dynamInfo {
            display: flex;


            .dynamInfoItem {
                flex: 1;
                margin: 15rpx 0;

                .avatar {
                    width: 100rpx;
                    height: 100rpx;
                    border: 1px solid #ddd;
                    border-radius: 20rpx;
                    margin: 0 auto;
                    overflow: hidden;
                }

                .Publisher {
                    display: flex;
                    margin-bottom: 15rpx;
                    align-items: center;
                    .item{
                        flex: 1;
                        &:first-child{
                            flex-grow: 4;
                        }
                        &:last-child{
                            padding-right: 20rpx;
                        }
                    }

                }
                .redPoint{
                    width: 15rpx;
                    height: 15rpx;
                    background-color: red;
                    border: 1px solid #ff0000;
                    border-radius: 100%;
                    float: right;
                }
                .privateTime{
                    text-align: center;
                    color:#AAAAAA;
                    font-size: 20rpx;
                    font-family:"Microsoft YaHei";

                }
                .lastChatMsg{
                    color: #9d9d9d;
                    font-size: 24rpx;
                    padding: 9rpx 0;
                    font-family: "Microsoft YaHei";
                }
                .describe{
                    margin-top: 15rpx;
                    font-size: 26rpx;
                    color: #b2b2b2;
                }

            }

            .Publishertime {
                flex-grow: 4;

                .lastMsg {
                    margin-top: 15rpx;
                    font-size: 26rpx;
                    color: #b2b2b2;
                }

                .groupChat {
                    display: flex;
                    align-items: center;
                    padding-right: 20rpx;

                    .sender {
                        flex: 1;
                    }

                    .sendTime {
                        flex: 1;
                        text-align: right;
                    }
                }
            }
        }

        .PublishContent {
            text-align: justify;
            font-family: "Microsoft YaHei";
            font-size: 26rpx;
            padding: 0 20rpx;
        }
    }
</style>
