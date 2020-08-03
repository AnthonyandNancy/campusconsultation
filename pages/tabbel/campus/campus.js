import vTabs from '../../../components/v-tabs/v-tabs';
import loadRefresh from '../../../components/load-refresh';
import uniFab from '../../../components/uni-fab/uni-fab'
import api from "../../../utils/request/api";
import constant from "../../../utils/constant";


import dynamicCard from "../../../components/dynamicCard";

export default {
    components:{
        vTabs,
        loadRefresh,
        uniFab,
        dynamicCard
    },
    data() {
        return {
            userSign:'',
            tab: 0,
            tabsList: ['所有动态','热门动态', '以书会友', '校园爱情', '百团大战', '约起开黑', '操场相见', '个人杂物', '热门校园'],
            currentSwiper:0,
            systemInfo:{},
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
            swiperViewHeight:0,
            loadRefreshHeight:0,
            currPage:0,
            totalPage:0,
            //刷新refresh end

            hotDynamicList: [], //热门动态列表,
            audioPlay:false,
            animationData:{},
        }
    },
    onLoad(){
        uni.getSystemInfo({
            success:(data)=>{
                this.systemInfo = data;
            }
        })
    },
    onShow(){

    },
    onReady(){
        this.userSign = constant.getUserSign();
        let query = uni.createSelectorQuery().in(this);
        query.select('.navTab').boundingClientRect(res=>{
            this.loadRefreshHeight = res.top;
            this.swiperViewHeight =this.systemInfo.windowHeight - res.top;
        }).exec();

        this.getAllDynamicList();
        this.getSupportList();
    },
    methods: {
        changeTab(index){
            this.currentSwiper = index;
        },
        changeSwiper(e){
            let index = e.detail.current;
            this.tab = index;
        },
        trigger(val) {
            console.log('点击悬浮按钮事件', val.index)
            let index = val.index
            if (index == 0) {
                uni.navigateTo({
                    url: "/pages/publish/publish?publishType=publishDynamic"
                })
            }
        },
        refresh(){

        },
        loadMore(){

        },
        //展示全文
        showAll(index){
            if(!this.hotDynamicList[index].isShowAllContent){
                this.hotDynamicList[index].isShowAllContent = true
            }else{
                this.hotDynamicList[index].isShowAllContent = false
            }
        },
        //图片预览
        preViewImg(index, imgList) {
            uni.setStorageSync('IS_PREVIEW', false);
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
        async getAllDynamicList(currPage) {
            uni.showLoading();

            let json = await api.getDynamicList({
                query: {
                    sign: this.userSign,
                    page: currPage,
                    type: 0
                }
            })

            if (json.data.errcode == 200) {
                uni.hideLoading();
                console.log('所有动态',json);
                this.totalPage = json.data.totalPage;
                json.data.dynamicList.forEach((res)=>{
                    res['isShowAllContent'] = false
                })
                this.hotDynamicList = [...this.hotDynamicList, ...json.data.dynamicList]
            }
        },

        //发布动态
        toPublishDynamic(){
            uni.navigateTo({
                url: "/pages/publish/publish?publishType=publishDynamic"
            })
        },
        //分享
        async toShare(dynSign){
            let json = await api.shareDynamic({
                query:{
                    dynamicSign:dynSign,
                    sign:this.userSign
                }
            })

            if(json.data.errcode == 200){
                uni.showToast({
                    title: json.data.info,
                    mask: true,
                    icon: 'none'
                })
                console.log('----->分享成功',json)
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
                console.log('----->点赞成功',json)
                this.hotDynamicList.forEach(res => {
                    if (res.dynamicSign == dynSign) {
                        this.$set(res,'isMySupport',true)
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

                for (let i = 0; i < this.hotDynamicList.length; i++) {
                    for(let j = 0;j<supportList.length;j++){
                        if (this.hotDynamicList[i].dynamicSign == supportList[j].dynamicSign) {
                            this.$set(this.hotDynamicList[i],'isMySupport',true)
                        }
                    }
                }
                console.log('22222', this.hotDynamicList)
            }
        },

    }
}
