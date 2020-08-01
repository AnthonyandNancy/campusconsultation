import api from "../../utils/request/api";
import constant from "../../utils/constant";

export default {
    data(){
        return{
            userSign:''
        }
    },
    onReady(){
        this.userSign = constant.getUserSign();
        this.getFollowList();
    },
    methods:{
       async getFollowList(){
            let json  = await api.getFollowList({
                query:{
                    sign:this.userSign,
                    page:1
                }
            })

           console.log('我关注的用户列表',json)
        }
    }
}
