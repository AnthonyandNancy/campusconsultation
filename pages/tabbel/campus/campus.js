import vTabs from '../../../components/v-tabs/v-tabs';
import loadRefresh from '../../../components/load-refresh';
import uniFab from '../../../components/uni-fab/uni-fab'
import api from "../../../utils/request/api";
import constant from "../../../utils/constant";

export default {
    components:{
        vTabs,
        loadRefresh,
        uniFab
    },
    data() {
        return {
            userSign:'',
            tab: 0,
            tabsList: ['热门动态', '所有动态', '以书会友', '校园爱情', '百团大战', '约起开黑', '操场相见', '个人杂物', '热门校园'],
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

            hotDynamicList: [], //热门动态列表
        }
    },
    onLoad(){
        uni.getSystemInfo({
            success:(data)=>{
                this.systemInfo = data;
            }
        })
    },
    onReady(){
        this.userSign = constant.getUserSign();
        let query = uni.createSelectorQuery().in(this);
        query.select('.navTab').boundingClientRect(res=>{
            this.loadRefreshHeight = res.top;
            this.swiperViewHeight =this.systemInfo.windowHeight - res.top;
        }).exec();

        this.getHotDynamicList();
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
        //热门动态
        async getHotDynamicList(currPage) {
            uni.showLoading();

            let json = await api.getDynamicList({
                query: {
                    sign: this.userSign,
                    page: currPage,
                    type: 1
                }
            })

            if (json.data.errcode == 200) {
                uni.hideLoading();
                console.log('热门动态',json);
                this.totalPage = json.data.totalPage;
                this.hotDynamicList = [...this.hotDynamicList, ...json.data.dynamicList]
            }
        },
        //发布动态
        toPublishDynamic(){

        }
    }
}
