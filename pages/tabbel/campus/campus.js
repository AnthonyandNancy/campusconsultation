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
            Tabs:['所有动态','热门动态', '以书会友', '校园爱情', '百团大战', '约起开黑', '操场相见', '个人杂物', '热门校园'],
            tabsList: [
                {
                    id: 0,
                    name: '所有动态',
                    dynamicList: [],
                    currentpPge: 1,
                    totalPage: 0
                },
                {
                    id: 1,
                    name: '热门动态',
                    dynamicList: [],
                    currentpPge: 1,
                    totalPage: 0
                },
                {
                    id: 31,
                    name: '以书会友',
                    dynamicList: [],
                    currentpPge: 1,
                    totalPage: 0
                },
                {
                    id: 36,
                    name: '校园爱情',
                    dynamicList: [],
                    currentpPge: 1,
                    totalPage: 0
                },
                {
                    id: 32,
                    name: '百团大战',
                    dynamicList: [],
                    currentpPge: 1,
                    totalPage: 0
                },
                {
                    id: 33,
                    name: '约起开黑',
                    dynamicList: [],
                    currentpPge: 1,
                    totalPage: 0
                },
                {
                    id: 34,
                    name: '操场相见',
                    dynamicList: [],
                    currentpPge: 1,
                    totalPage: 0
                },
                {
                    id:35,
                    name: '个人杂物',
                    dynamicList: [],
                    currentpPge: 1,
                    totalPage: 0
                },
                {
                    id: 37,
                    name: '热门校园',
                    dynamicList: [],
                    currentpPge: 1,
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
            this.currPage = 1
            this.hotDynamicList = [];
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
            }
        },
        refresh() {
            this.hotDynamicList = [];
            this.currPage = 1;
            this.getAllDynamicList(this.currPage)
        },
        loadMore() {
            this.currPage++;
            this.getAllDynamicList(this.currPage)
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

        //所有动态
        async getAllDynamicList(index) {
            let schoolName = constant.getUserLogin().schoolName;
            console.log(schoolName)
            uni.showLoading();

            let json = await api.getDynamicList({
                query: {
                    sign: this.userSign,
                    page: this.tabsList[index].currentpPge,
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

                for(let i = 0;i<json.data.dynamicList.length;i++){
                    if(json.data.dynamicList[i].schoolName == schoolName){
                        that.tabsList[index].dynamicList = [...that.tabsList[index].dynamicList, ...json.data.dynamicList];
                    }
                }
            }
            console.log('tabsList======>',this.tabsList);
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
                console.log('----->点赞成功', json)
                this.tabsList[this.currentSwiper].dynamicList.forEach(res => {
                    if (res.dynamicSign == dynSign) {
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

    }
}
