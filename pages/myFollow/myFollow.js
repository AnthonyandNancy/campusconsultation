import api from "../../utils/request/api";
import constant from "../../utils/constant";
let that;
export default {
    data(){
        return{
            mineSign:'',
            userSign:'',
            followList:[]
        }
    },
    onReady(){
        that = this;
        this.mineSign = constant.getUserSign();
        this.getFollowList();
    },
    methods:{
       async getFollowList(){
            let json  = await api.getFollowList({
                query:{
                    sign:this.mineSign,
                    page:1
                }
            })


           if(json.data.errcode == 200){
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
                }else{
                    // let json  = await api.setFollow({
                    //     query:{
                    //         sign:this.mineSign,
                    //         followSign:this.userSign
                    //     }
                    // })
                    // if(json.data.errcode == 200 ){
                    //     uni.showToast({
                    //         title: '已关注',
                    //         icon:'none',
                    //         mask:true
                    //     })
                    //     this.isFollow = true;
                    // }
                    // console.log('点击关注',json);
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
                that.followList.forEach(res=>{
                    if(res.sign == followerSign){
                        res.isMineFollow = false;
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
    }
}
