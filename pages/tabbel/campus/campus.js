import vTabs from '../../../components/v-tabs/v-tabs';
import loadRefresh from '../../../components/load-refresh';
import uniFab from '../../../components/uni-fab/uni-fab'
import api from "../../../utils/request/api";
import constant from "../../../utils/constant";


import dynamicCard from "../../../components/dynamicCard";

let that;
export default {
    components: {
        vTabs,
        loadRefresh,
        uniFab,
        dynamicCard
    },
    data() {
        return {
            userSign: '',
            tab: 0,
            Tabs:['所有动态','热门动态', '以书会友', '校园爱情', '百团大战', '约起开黑', '操场相见', '个人杂物', '该校群聊',],
            tabsList: [
                {
                    id: 0,
                    name: '所有动态',
                    dynamicList: [],
                    currentPage: 1,
                    totalPage: 0
                },
                {
                    id: 1,
                    name: '热门动态',
                    dynamicList: [],
                    currentPage: 1,
                    totalPage: 0
                },
                {
                    id: 31,
                    name: '以书会友',
                    dynamicList: [],
                    currentPage: 1,
                    totalPage: 0
                },
                {
                    id: 36,
                    name: '校园爱情',
                    dynamicList: [],
                    currentPage: 1,
                    totalPage: 0
                },
                {
                    id: 32,
                    name: '百团大战',
                    dynamicList: [],
                    currentPage: 1,
                    totalPage: 0
                },
                {
                    id: 33,
                    name: '约起开黑',
                    dynamicList: [],
                    currentPage: 1,
                    totalPage: 0
                },
                {
                    id: 34,
                    name: '操场相见',
                    dynamicList: [],
                    currentPage: 1,
                    totalPage: 0
                },
                {
                    id:35,
                    name: '个人杂物',
                    dynamicList: [],
                    currentPage: 1,
                    totalPage: 0
                },
                {
                    id: 37,
                    name: '该校群聊',
                    dynamicList: [],
                    currentPage: 1,
                    totalPage: 0
                },
            ],
            currentSwiper: 0,
            systemInfo: {},
            //悬浮按钮 start
            pattern: {
                color: '#7A7E83',
                backgroundColor: '#fff',
                selectedColor: '#007AFF',
                buttonColor: '#007AFF'
            },
            content: [
                {
                    iconPath: '/static/images/pinglun.png',
                    selectedIconPath: '/static/images/pinglun.png',
                    text: '发布动态',
                    active: false
                },
                {
                    iconPath: '/static/images/qunliao.png',
                    selectedIconPath: '/static/images/peoples.png',
                    text: '创建群聊',
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

            //创建聊天房间 start
            applyObj: {
                roomName: '',
                describe: '',
                pic: ''
            },
            showApplyPanel:false,
            customStyle: {
                backgroundColor: "#fff",
                border: '1px solid #ddd'
            },
            realImgUrlList:'',
            form: {
                name: '',
                intro: '',
                sex: ''
            },
            //创建聊天房间 end
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


    },
    onShow() {
        if (constant.getIsPublish()) {
            this.getSupportList();
        }
    },
    onReady() {
        this.userSign = constant.getUserSign();
        let query = uni.createSelectorQuery().in(this);
        query.select('.navTab').boundingClientRect(res => {
            this.loadRefreshHeight = res.top;
            this.swiperViewHeight = this.systemInfo.windowHeight - res.top;
        }).exec();


        this.tabsList.forEach((res,index)=>{
            this.getAllDynamicList(index)
        })

    },
    methods: {

        changeTab(index) {
            this.currentSwiper = index;
        },
        changeSwiper(e) {
            let index = e.detail.current;
            this.tab = index;
        },
        trigger(val) {
            constant.setIsPublish(true);
            console.log('点击悬浮按钮事件', val.index)
            let index = val.index
            if (index == 0) {
                uni.navigateTo({
                    url: "/pages/publish/publish?publishType=publishDynamic"
                })
            }else if (index == 1) {
                this.showApplyPanel = true;
            }
        },
        refresh() {
            this.tabsList[this.currentSwiper].dynamicList=[];
            this.tabsList[this.currentSwiper].currentPage=1;

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
                                title:'图片上传中',
                                mask:true
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
            console.log(schoolName)
            uni.showLoading();

            if(this.tabsList[index].id == 37){
                const chatGroupJson = await api.getSchoolChatRoom({
                    query:{
                        sign:this.userSign,
                        schoolName:constant.getUserLogin().schoolName
                    }
                })
                if(chatGroupJson.data.errcode == 200){
                    uni.hideLoading();
                    this.tabsList[index].dynamicList = chatGroupJson.data.roomList
                }
                console.log('111222聊天房间',chatGroupJson);
                return;
            }

            let json = await api.getDynamicList({
                query: {
                    sign: this.userSign,
                    page: this.tabsList[index].currentPage,
                    school:schoolName,
                    type: this.tabsList[index].id
                }
            })

            if (json.data.errcode == 200) {
                uni.hideLoading();
                this.tabsList[index].totalPage = json.data.totalPage
                json.data.dynamicList.forEach((res) => {
                    res['isShowAllContent'] = false
                })

                that.tabsList[index].dynamicList = [...that.tabsList[index].dynamicList, ...json.data.dynamicList];

            }
            console.log('tabsList======>',this.tabsList);
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
                uni.showToast({
                    title: json.data.info,
                    mask: true,
                    icon: 'none'
                })
                console.log('----->分享成功', json)
            }
        },
        // 评论
        toComment(dynSign) {
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
                        this.$set(res, 'isMySupport', true)
                    }
                })
            }
        },

        //获取我点赞的动态列表
        async getSupportList() {
            let json = await api.getSupportList({
                query: {
                    sign: this.userSign,
                    page: 1
                }
            })

            if (json.data.errcode == 200) {
                let supportList = json.data.dynamicList;
                console.log(' 我点赞的列表', supportList)
                for (let i = 0; i < this.tabsList[this.currentSwiper].dynamicList.length; i++) {
                    for (let j = 0; j < supportList.length; j++) {
                        if (this.tabsList[this.currentSwiper].dynamicList[i].dynamicSign == supportList[j].dynamicSign) {
                            this.$set(this.tabsList[this.currentSwiper].dynamicList[i], 'isMySupport', true)
                        }
                    }
                }
            }
        },

        //进入聊天房间
       async toChat(obj){
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


            // if (obj.chatType == 1) {
            //     uni.setStorage({
            //         key: 'privateChatSign',
            //         data: obj.roomSign
            //     });
            //     uni.setStorage({
            //         key: 'privateChatName',
            //         data: obj.roomName
            //     });
            // }
        }
    }
}
