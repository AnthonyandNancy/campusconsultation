import api from "../../utils/request/api";
import constant from "../../utils/constant";
import supportCart from "../../components/supportCart";
export default {
    data(){
        return{
            userSign:'',
            supportList:[]
        }
    },
    components:{
        supportCart
    },
    onReady(){
        this.userSign = constant.getUserSign();
        this.getMySupport();
    },
    methods:{
        async getMySupport(){
            let json =  await api.getSupportList({
                query:{
                    sign:this.userSign,
                    page:1
                }
            })

            if(json.data.errcode == 200){
                console.log('我赞过的动态列表',json);
                this.supportList = json.data.dynamicList;
            }
        }
    }
}
