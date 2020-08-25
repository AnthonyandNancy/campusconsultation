// 插件 start
import loadRefresh from '../../../components/load-refresh';
import uniFab from '../../../components/uni-fab/uni-fab'
import dynamicCard from "../../../components/dynamicCard";
import WucTab from '../../../components/wuc-tab/wuc-tab';
import luchAudio from '../../../components/luch-audio/luch-audio';
// 插件 end

import api from "../../../utils/request/api";
import constant from "../../../utils/constant";

let that;
export default {
    components: {
        loadRefresh,
        uniFab,
        dynamicCard,
        WucTab,
        luchAudio
    },
    data() {
        return {
            userSign: '',
            tab: 0,
            Tabs: ['所有动态', '热门动态', '以书会友', '校园爱情', '百团大战', '约起开黑', '操场相见', '个人杂物', '该校群聊',],
            tabsList: [],
            currentSwiper: 0,
            systemInfo: {},
            //悬浮按钮 start
            pattern: {
                color: 'rgba(255,255,255,1)',
                backgroundColor: '#fff',
                selectedColor: 'rgba(255,255,255,1)',
                buttonColor: 'linear-gradient(360deg,rgba(254,97,96,1) 0%,rgba(255,176,97,1) 100%)',
                clickBtnColor:'linear-gradient(90deg,rgba(254,97,96,1) 0%,rgba(255,176,97,1) 100%)'
            },
            content: [],
            createContent: [
                {
                    iconPath: '/static/images/fab_publish.png',
                    selectedIconPath: '/static/images/fab_publish.png',
                    text: '发布动态',
                    active: false
                },
                {
                    iconPath: '/static/images/fab_create.png',
                    selectedIconPath: '/static/images/fab_create.png',
                    text: '创建群聊',
                    active: false
                },
                {
                    iconPath: '/static/images/fab_love.png',
                    selectedIconPath: '/static/images/fab_love.png',
                    text: '怦然心动',
                    active: false
                }
            ],
            loveContent: [{
                iconPath: '/static/images/fab_love.png',
                selectedIconPath: '/static/images/fab_love.png',
                text: '怦然心动',
                active: false
            }],
            horizontal: 'right',
            vertical: 'bottom',
            direction: 'vertical',
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

            //创建聊天房间 start
            applyObj: {
                roomName: '',
                describe: '',
                pic: ''
            },
            showApplyPanel: false,
            customStyle: {
                backgroundColor: "#fff",
                border: '1px solid #ddd'
            },
            realImgUrlList: '',
            form: {
                name: '',
                intro: '',
                sex: ''
            },
            //创建聊天房间 end

            videoContext: {},
            videoUrl: '',
            commentDySign: '',

            isShowMark:false,
            isRefresh:false,

            shareDynamicObj:{}
        }
    },
    onShareAppMessage(res) {

        console.log('分享的方式===》',res)

        if(res.from == 'button'){
            return {
                title: shareDynamicObj.content,
                path: '/pages/dynamicDetail/dynamicDetail?dynamicObj=' + JSON.stringify(shareDynamicObj),
                imageUrl: shareDynamicObj.imgList.length != 0 ?shareDynamicObj.imgList[0]:shareDynamicObj.videoPreview == null?'':shareDynamicObj.videoPreview
            }

        }else if(res.from == 'menu'){

            return {
                title: this.Tabs[this.tab],
                path: '/pages/campus/campus?intoType=share&currentTabIndex=' + this.tab ,
                imageUrl: ""
            }
        }


    },

    onLoad(option) {
        that = this;

        if(option.intoType == 'share'){
            if(option.currentTabIndex == 3){
                this.content = this.loveContent;
            }

            this.tab = option.currentTabIndex;
            this.currentSwiper = option.currentTabIndex;
        }

        constant.setIsPublish(false);
        uni.getSystemInfo({
            success: (data) => {
                this.systemInfo = data;
            }
        })

        //获取导标签 对应的动态
        this.tabsList = constant.getUserLogin().header[0].title
        this.content = this.createContent;
    },
    onShow() {
        this.userSign = constant.getUserSign();

        if (constant.getIsComment()) {
            this.tabsList[this.currentSwiper].dynamicList.forEach((res) => {
                if (res.dynamicSign == this.commentDySign) {
                    res.commentTimes++;
                }
            })

            constant.setIsComment(false)
        }

        if (constant.getIsUpdateData()) {
            //遍历获取所有动态

            this.tabsList.forEach((res, index) => {
                this.tabsList[index].dynamicList = [];
                this.getAllDynamicList(index)
            })
            constant.setIsUpdateData(false)
        }


    },
    onReady() {
        this.userSign = constant.getUserSign();

        new Promise((resolve, reject) => {
            resolve(this.tabsList);
        }).then(res => {
            let query = uni.createSelectorQuery().in(this);
            query.select('.navTab').boundingClientRect(res => {
                this.loadRefreshHeight = res.top;
                this.swiperViewHeight = this.systemInfo.windowHeight - res.top;
            }).exec();
        })


        //遍历获取所有动态
        this.tabsList.forEach((res, index) => {
            this.getAllDynamicList(index)
        })

    },

    methods: {
        showVideo(url) {
            this.videoUrl = url;

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
        changeTab(index, e) {
            this.currentSwiper = index;
            this.tab = index;
        },
        changeSwiper(e) {
            let index = e.detail.current;
            this.tab = index;
            this.currentSwiper = index;

            if (index == 4) {
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
                this.showApplyPanel = true;
            } else if (index == 2) {
                // this.showApplyPanel = true;
                uni.navigateTo({
                    url: "/pages/beckoningPage/beckoningPage"
                })
            }
        },
        fabclick(val){
            this.isShowMark = val
        },
        hideFabMark(){
            this.$refs.unifab._onClick();
        },
        tofindLove() {
            uni.navigateTo({
                url: "/pages/beckoningPage/beckoningPage"
            })
        },
        refresh() {

            this.isRefresh = true;
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
            this.tabsList[this.currentSwiper]
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

        onUploaded() {

            uni.authorize({
                scope: "scope.camera",
                success: () => {

                    uni.chooseImage({
                        count: 1,
                        sizeType: ['compressed'],
                        sourceType: ['album', 'camera'],
                        success: async (chooseImageRes) => {
                            uni.showLoading({
                                title: '图片上传中',
                                mask: true
                            })
                            if (chooseImageRes.errMsg == 'chooseImage:ok') {

                                this.applyObj.pic = chooseImageRes.tempFilePaths[0];

                                //线上路径
                                let json = await api.uploadImages({
                                    query: {
                                        filePath: this.applyObj.pic,
                                        data: {sign: that.userSign},
                                        key: 'img'
                                    }
                                })
                                let jsonData = JSON.parse(json.data);
                                if (jsonData.errcode == 200) {
                                    uni.hideLoading();
                                    that.realImgUrlList = jsonData.img;
                                }
                            }
                        }
                    });
                }
            })

        },
        del() {
            this.applyObj.pic = '';
            this.applyRealImageUrl = '';
        },
        async submitApply() {
            if(this.realImgUrlList == ''){
                uni.showToast({
                    title:'请上传图片',
                    icon:'none',
                    mask:true
                })
                return ;
            }else if(this.applyObj.roomName == ''){
                uni.showToast({
                    title:'请输入群聊名称',
                    icon:'none',
                    mask:true
                })
                return ;

            }else if(this.applyObj.describe == ''){
                uni.showToast({
                    title:'请输入群聊描述',
                    icon:'none',
                    mask:true
                })
                return ;
            }


            let json = await api.applyNewChatRoom({
                query: {
                    sign: this.userSign,
                    roomName: this.applyObj.roomName,
                    describe: this.applyObj.describe,
                    pic: this.realImgUrlList
                }
            })
            if (json.data.errcode == 200) {
                this.applyObj = {
                    roomName: '',
                    describe: '',
                    pic: ''
                }
                uni.showToast({
                    title: json.data.info,
                    mask: true,
                    icon: 'none'
                })
                this.showApplyPanel = false;
            }
        },
        //所有动态
        async getAllDynamicList(index) {
            let schoolName = constant.getUserLogin().schoolName;
            uni.showLoading({
                title:'加载中...'
            });
            //获取群聊
            if (this.tabsList[index].type == 37) {
                const chatGroupJson = await api.getSchoolChatRoom({
                    query: {
                        sign: this.userSign,
                        schoolName: constant.getUserLogin().schoolName
                    }
                })
                if (chatGroupJson.data.errcode == 200) {
                    this.tabsList[index].dynamicList = chatGroupJson.data.roomList;
                    if(this.isRefresh){
                        uni.hideLoading();
                    }
                }
                return;
            }

            let json = await api.getDynamicList({
                query: {
                    sign: this.userSign,
                    page: this.tabsList[index].currentPage,
                    school: schoolName,
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
                    setTimeout( ()=> {
                        uni.hideLoading();

                    },1500)
                }else if(this.isRefresh){
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
        async toShare(dynamicItem) {
            this.shareDynamicObj = dynamicItem

            let json = await api.shareDynamic({
                query: {
                    dynamicSign: dynamicItem.dynamicSign,
                    sign: this.userSign
                }
            })

            if (json.data.errcode == 200) {
                this.tabsList[this.currentSwiper].dynamicList.forEach((res) => {
                    if (res.dynamicSign == dynamicItem.dynamicSign) {
                        res.shareTimes++;
                    }
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
                this.toLogin();
                this.tabsList[this.currentSwiper].dynamicList.forEach(res => {
                    if (res.dynamicSign == dynSign) {
                        res.likeTimes++;
                        this.$set(res, 'like', true)
                    }
                })
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

        //进入聊天房间
        async toChat(obj) {
            let json = await api.joinGroupChat({
                query: {
                    sign: this.userSign,
                    roomSign: obj.roomSign
                }
            })

            if (json.data.errcode == 200) {
                uni.navigateTo({
                    url: '/pages/chatRoom/chatRoom?roomSign=' + obj.roomSign + '&roomName=' + obj.roomName + '&chatType=' + 1 + '&userName=' + constant.getUserLogin().name
                })

            }
        },

    }
}
