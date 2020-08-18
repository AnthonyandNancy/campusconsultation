//插件 start
import WucTab from '../../../components/wuc-tab/wuc-tab';
import loadRefresh from '../../../components/load-refresh';
import uniFab from '../../../components/uni-fab/uni-fab'
import luchAudio from '../../../components/luch-audio/luch-audio';
//插件 end

import api from "../../../utils/request/api";
import constant from "../../../utils/constant";

//组件 start
import dynamicCard from "../../../components/dynamicCard";
//组件 end

let that;
export default {
    components: {
        WucTab,
        loadRefresh,
        uniFab,
        dynamicCard,
        luchAudio
    },
    data() {
        return {
            userSign: '',
            tab: 0,
            Tabs: ['所有动态', '热门动态', '以书会友', '校园爱情', '百团大战', '约起开黑', '操场相见', '个人杂物', '热门校园'],
            tabsList: [],
            currentSwiper: 0,
            systemInfo: {},
            //悬浮按钮 start
            pattern: {
                color: '#7A7E83',
                backgroundColor: '#fff',
                selectedColor: '#007AFF',
                buttonColor: '#007AFF'
            },
            content: [],
            createContent: [
                {
                    iconPath: '/static/images/pinglun.png',
                    selectedIconPath: '/static/images/pinglun.png',
                    text: '发布动态',
                    active: false
                },
                {
                    iconPath: '/static/images/love.png',
                    selectedIconPath: '/static/images/love.png',
                    text: '怦然心动',
                    active: false
                }
            ],
            loveContent: [
                {
                    iconPath: '/static/images/love.png',
                    selectedIconPath: '/static/images/love.png',
                    text: '怦然心动',
                    active: false
                }
            ],
            horizontal: 'right',
            vertical: 'bottom',
            direction: 'horizontal',
            //悬浮按钮 end

            //刷新refresh start
            swiperViewHeight: 0,
            loadRefreshHeight: 0,
            currPage: 1,
            totalPage: 0,
            //刷新refresh end

            hotDynamicList: [], //热门动态列表,
            audioPlay: false,
            animationData: {},
            videoContext: {},

            videoUrl:'',
            commentDySign:''
        }
    },
    onShareAppMessage() {
        return {
            title: "传播校园文化,助力高考报考",
            path: '/pages/selectSchool/selectSchool',
            imageUrl: "/static/images/poster.png"
        }
    },
    onLoad() {
        that = this;
        constant.setIsPublish(false);
        uni.getSystemInfo({
            success: (data) => {
                this.systemInfo = data;
            }
        })
        this.userSign = constant.getUserSign();
        this.tabsList = constant.getUserLogin().header[1].title;
        this.content = this.createContent;
    },
    onShow() {

        if(constant.getIsComment()){
            this.tabsList[this.currentSwiper].dynamicList.forEach((res)=>{
                if(res.dynamicSign == this.commentDySign){
                    res.commentTimes++;
                }
            })

            constant.setIsComment(false)
        }


        if (constant.getSelectType().length != 0) {

            if(constant.getSelectType() == 3){
                this.content = this.loveContent;
            }

            this.tab = constant.getSelectType();
            this.currentSwiper = constant.getSelectType();
            uni.removeStorageSync('SELECT_TYPE');
        }
    },
    onReady() {
        this.userSign = constant.getUserSign();

        new Promise((resolve, reject) => {

            resolve(this.tabsList)

        }).then(res => {

            let query = uni.createSelectorQuery().in(this);

            query.select('.navTab').boundingClientRect(res => {
                this.loadRefreshHeight = res.top;
                this.swiperViewHeight = this.systemInfo.windowHeight - res.top;
            }).exec();

            this.tabsList.forEach((res, index) => {
                this.getAllDynamicList(index)
            })

        })
    },
    methods: {
        showVideo(url) {
            this.videoUrl = url;

            this.videoContext = uni.createVideoContext('videoId', this);

            this.videoContext.requestFullScreen({direction:0});
        },
        screenChange(e) {

            if(e.detail.fullScreen){
                setTimeout(res=>{
                    this.videoContext.play();
                },200)

            }else{
                this.videoUrl = '';
                this.videoContext.stop()
            }
        },
        //点击头像进入个人页面
        toOtherMineInfoPage(item) {
            let data = item

            if (this.userSign == data.sign) {
                return;
            }

            uni.navigateTo({
                url: '/pages/otherMinePage/otherMinePage?roomSign=' + data.sign + '&roomName=' + data.name + '&from=home' + '&avatar=' + data.pic
            })
        },
        changeTab(index) {
            this.currentSwiper = index;
            this.tab = index;
        },
        changeSwiper(e) {
            let index = e.detail.current;
            this.tab = index;
            this.currentSwiper = index;

            if (index == 3) {
                this.content = this.loveContent;
            } else {
                this.content = this.createContent;
            }
        },
        trigger(val) {
            constant.setIsPublish(true);
            let index = val.index
            if (index == 0) {
                uni.navigateTo({
                    url: "/pages/publish/publish?publishType=publishDynamic"
                })
            } else if (index == 1) {
                // this.showApplyPanel = true;
                uni.navigateTo({
                    url: "/pages/beckoningPage/beckoningPage"
                })
            }
        },
        tofindLove(){
            uni.navigateTo({
                url: "/pages/beckoningPage/beckoningPage"
            })
        },
        refresh() {
            this.tabsList[this.currentSwiper].dynamicList = [];
            this.tabsList[this.currentSwiper].currentPage = 1;
            this.getAllDynamicList(this.currentSwiper)
        },
        loadMore() {
            this.tabsList[this.currentSwiper].currentPage++
            this.getAllDynamicList(this.currentSwiper)
        },

        //展示全文
        showAll(index) {
            if (!this.tabsList[this.currentSwiper].dynamicList[index].isShowAllContent) {
                this.tabsList[this.currentSwiper].dynamicList[index].isShowAllContent = true
            } else {
                this.tabsList[this.currentSwiper].dynamicList[index].isShowAllContent = false
            }
        },

        //图片预览
        preViewImg(index, imgList) {
            constant.setIsPublish(false);
            uni.previewImage({
                current: index,
                urls: imgList
            });
        },
        controlAudioPlay() {
            if (!this.audioPlay) {
                this.audioPlay = true;
            } else {
                this.audioPlay = false;
            }
        },

        toAddChatRoom(dynamicObj) {
            let chatObj = dynamicObj
            uni.navigateTo({
                url: '/pages/chatRoom/chatRoom?roomSign=' + chatObj.roomId + '&roomName=' + chatObj.roomInfo.roomName + '&chatType=' + 1 + '&userName=' + constant.getUserLogin().name
            })
        },
        async toPersionalChat(personalObj) {

            const res = await api.addNewFriend({
                query: {

                    sign: this.userSign,
                    friendSign: personalObj.sign

                }
            })
            const resFri = await api.addNewFriend({
                query: {
                    sign: personalObj.sign,
                    friendSign: this.userSign

                }
            })

            uni.navigateTo({
                url: '/pages/chatRoom/chatRoom?roomSign=' + personalObj.sign + '&roomName=' + personalObj.name + '&chatType=' + 0 + '&avatar=' + personalObj.pic
            })
        },
        //所有动态
        async getAllDynamicList(index) {
            let schoolName = constant.getUserLogin().schoolName;
            uni.showLoading({
                title:'加载中...'
            });

            // if (this.tabsList[index].type == 37) {
            //     const chatGroupJson = await api.getGroupChatList({
            //         query: {
            //             sign: this.userSign,
            //             schoolName: constant.getUserLogin().schoolName
            //         }
            //     })
            //     if (chatGroupJson.data.errcode == 200) {
            //         // uni.hideLoading();
            //         this.tabsList[index].dynamicList = chatGroupJson.data.roomList
            //     }
            //     return;
            // }

            let json = await api.getDynamicList({
                query: {
                    sign: this.userSign,
                    page: this.tabsList[index].currentPage,
                    type: this.tabsList[index].type
                }
            })


            if (json.data.errcode == 200) {
                this.tabsList[index].totalPage = json.data.totalPage
                json.data.dynamicList.forEach((res) => {
                    res['isShowAllContent'] = false
                })



                that.tabsList[index].dynamicList = [...that.tabsList[index].dynamicList, ...json.data.dynamicList];

               if(index == this.tabsList.length - 1){
                   uni.hideLoading();
               }
            }
        },

        //进入动态详情页面
        dynamicDetail(obj) {
            uni.navigateTo({
                url: '/pages/dynamicDetail/dynamicDetail?dynamicObj=' + JSON.stringify(obj)
            })
        },

        //发布动态
        toPublishDynamic() {
            uni.navigateTo({
                url: "/pages/publish/publish?publishType=publishDynamic"
            })
        },

        //分享
        async toShare(dynSign) {
            let json = await api.shareDynamic({
                query: {
                    dynamicSign: dynSign,
                    sign: this.userSign
                }
            })

            if (json.data.errcode == 200) {
                this.tabsList[this.currentSwiper].dynamicList.forEach((res)=>{
                    if(res.dynamicSign == dynSign){
                        res.shareTimes++;
                    }
                })

                uni.showToast({
                    title: json.data.info,
                    mask: true,
                    icon: 'none'
                })
            }
        },
        // 评论
        toComment(dynSign) {
            this.commentDySign = dynSign;
            uni.navigateTo({
                url: "/pages/publish/publish?publishType=commentDynamic&dynamicSign=" + dynSign
            })
        },
        //点赞
        async toSupport(dynSign) {
            let json = await api.addSupport({
                query: {
                    dynamicSign: dynSign,
                    sign: this.userSign
                }
            })

            uni.showToast({
                title: json.data.info,
                mask: true,
                icon: 'none'
            })

            if (json.data.errcode == 200) {
                this.tabsList[this.currentSwiper].dynamicList.forEach(res => {
                    if (res.dynamicSign == dynSign) {
                        res.likeTimes++;
                        this.$set(res, 'like', true)
                    }
                })
            }
        }

    }
}
