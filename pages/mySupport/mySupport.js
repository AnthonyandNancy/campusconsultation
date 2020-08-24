import api from "../../utils/request/api";
import constant from "../../utils/constant";
import supportCart from "../../components/supportCart";
import loadRefresh from '../../components/load-refresh';

export default {
    data(){
        return{
            userSign:'',
            supportList:[],

            currPage:1,
            totalPage:0,
            loadRefreshHeight:0
        }
    },
    components:{
        supportCart,
        loadRefresh
    },
    onReady(){
        let query = uni.createSelectorQuery().in(this);
        query.select('.componentBox').boundingClientRect(res => {
            console.log( 'loadRefreshHeight', res)
            this.loadRefreshHeight = res.top;
        }).exec();

        this.userSign = constant.getUserSign();
        this.getMySupport();
    },
    methods:{
        async getMySupport(){
            let json =  await api.getSupportList({
                query:{
                    sign:this.userSign,
                    page:this.currPage
                }
            })

            if(json.data.errcode == 200){
                this.totalPage = json.data.totalPage;
                console.log('我赞过的动态列表',json);
                this.supportList = [...this.supportList,...json.data.dynamicList];
            }
        },
        loadMore(){
            this.currPage++;
            this.getMySupport();
        },
        refresh(){
            this.supportList=[]
            this.currPage = 1
            this.getSystemInfo();
        }
    }
}
