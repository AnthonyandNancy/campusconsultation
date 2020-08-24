import api from "../../utils/request/api";
import constant from "../../utils/constant";
import loadRefresh from '../../components/load-refresh';

let that;
export default {
    data(){
        return{
            mineSign:'',
            userSign:'',
            followList:[],

            loadRefreshHeight:0,
            currPage:1,
            totalPage:0,
        }
    },
    components:{
        loadRefresh
    },

    onReady(){
        that = this;

        let query = uni.createSelectorQuery().in(this);
        query.select('.myFollow_content').boundingClientRect(res => {
            this.loadRefreshHeight = res.top;
        }).exec();

        this.mineSign = constant.getUserSign();
        this.getFollowList();
    },

    methods:{
       async getFollowList(){
            let json  = await api.getFollowList({
                query:{
                    sign:this.mineSign,
                    page:this.currPage
                }
            })


           if(json.data.errcode == 200){
               this.totalPage = json.data.totalPage;
               json.data.userList.forEach(res=>{
                   new Promise((resolve, reject) => {
                       resolve(that.checkIsFollow(res.sign))
                   }).then(data=>{
                       res['isMineFollow'] = data;
                       this.followList.push(res)
                       console.log('-------------------',data)
                   })
               })
           }
           console.log('我关注的用户列表',json)
        },
        async checkIsFollow(followedSign){
            let checkIsFollowJson = await api.checkFollow({
                query:{
                    sign:this.mineSign,
                    followSign:followedSign
                }
            })

            if(checkIsFollowJson.data.errcode == 200){
                let checkStatus = checkIsFollowJson.data.relation;
                return checkStatus;
            }
        },
        async follow(sign){
            let checkIsFollowJson = await api.checkFollow({
                query:{
                    sign:this.mineSign,
                    followSign:sign
                }
            })

            if(checkIsFollowJson.data.errcode == 200){
                let checkStatus = checkIsFollowJson.data.relation;
                //检测是否已关注
                if(checkStatus){
                    this.cancelFollow(sign);
                }
            }
        },
        async cancelFollow(followerSign){
            let cancelJson = await api.cancelFollow({
                query:{
                    sign:this.mineSign,
                    followSign:followerSign
                }
            })

            if(cancelJson.data.errcode == 200){
                this.toLogin();

                that.followList.forEach((res,index)=>{
                    if(res.sign == followerSign){
                        res.isMineFollow = false;
                        that.followList.splice(index,1)
                    }
                })
                uni.showToast({
                    title: '已取消关注',
                    icon:'none',
                    mask:true
                })
            }
            console.log('取消关注',cancelJson);
        },
        loadMore(){
            this.currPage++;
            this.getFollowList();
        },
        refresh(){
            this.currPage = 1;
            this.followList = [];
            this.getFollowList();
        }
    }
}
