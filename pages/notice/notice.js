import api from "../../utils/request/api";
import constant from "../../utils/constant";

export default {
    data() {
        return {
            userSing:'',
            noticeList:[],


            title: '素胚勾勒出青花，笔锋浓转淡',
            subTitle: '',
            thumb: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
        };
    },
    onLoad(){
        this.userSign = constant.getUserSign();
    },
    onReady(){
        this.userSign = constant.getUserSign();

        this.getApplyRoom()
    },
    computed:{
        getNotice(){

        }
    },
    methods:{
        // 提交审核的房间列表
        async getApplyRoom(){
            let json = await  api.getApplyChatRoom({
                query:{
                    sign:this.userSign
                }
            })


            if(json.data.errcode == 200){
                let roomList = json.data.roomList;
                roomList.forEach(res=>{
                    if(res.state== 0 ){
                        res['examineType'] = '审核中'
                    }else if(res.state== 1){
                        res['examineType'] = '审核通过'
                    }else if(res.state== 2){
                        res['examineType'] = '审核失败'
                    }
                })
                this.noticeList =roomList;
            }

        },
    }
}
