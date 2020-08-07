import dynamicCard from "../../components/dynamicCard";
import constant from "../../utils/constant";
import api from '../../utils/request/api'

export default {
    components: {
        dynamicCard
    },
    data() {
        return {
            dynamicObj: {},
            userSign:'',
            commentList:[],
            customStyle: {
                backgroundColor: '#07CF65',
                color: '#fff',
                marginRight: '20rpx',
                border: 'none'
            },
            showAddCommentPnael:false,
            isMySupport:false
        }
    },
    onLoad(option) {
        console.log('11111===>',option)
        this.userSign = constant.getUserSign();
        //获取动态详情
        this.dynamicObj = JSON.parse(option.dynamicObj);

        this.getCommentList()
    },
    onShow(){
        if(constant.getUserSign().length !=0){
            this.getCommentList();
            this.getCommentNum();
            this.getSupportList();
        }
    },
    onReady(){
        uni.setStorageSync('IS_PREVIEW',false);

        this.getSupportList();
    },
    onShareAppMessage(){
        return {
            title: "传播校园文化,助力高考报考",
            path: '/pages/tabbel/home/home',
            imageUrl: "/static/images/poster.png"
        }
    },
    methods: {
        //    获取评论列表
        async getCommentList() {
            let json = await api.getCommentList({
                query: {
                    sign:this.userSign,
                    dynamicSign:this.dynamicObj.dynamicSign,
                    page:1
                }
            })
            if(json.data.errcode == 200){
                this.commentList = json.data.commentList
            }
        },
        //获取动态评论数
        async getCommentNum(){
            let json = await api.getDynamicList({
                query: {
                    sign: this.userSign,
                    page: 1,
                    type: 0
                }
            })
            if (json.data.errcode == 200) {
                json.data.dynamicList.forEach(res=>{
                    if(this.dynamicObj.dynamicSign == res.dynamicSign ){
                        this.dynamicObj.commentTimes =res.commentTimes;
                    }
                })
            }
        },
        previewImg(index,imgList){
            uni.previewImage({
                current:index,
                urls:imgList
            })
        },

        dynamicDetail(obj){
            uni.navigateTo({
                url:'/pages/dynamicDetail/dynamicDetail?dynamicObj=' + JSON.stringify(obj)
            })
        },
        toComment(){
            // this.showAddCommentPnael = true
            uni.navigateTo({
                url:"/pages/publish/publish?publishType=commentDynamic&dynamicSign=" + this.dynamicObj.dynamicSign
            })

        },
        async addSupport(){
            let json = await api.addSupport({
                query:{
                    dynamicSign:this.dynamicObj.dynamicSign,
                    sign:this.userSign
                }
            })

            uni.showToast({
                title:json.data.info,
                mask:true,
                icon:'none'
            })

            if(json.data.errcode == 200){
                this.isMySupport = true;
                this.dynamicObj.likeTimes++;
            }
        },
        // 获取我点赞的动态列表
        async getSupportList(){
            let json  = await api.getSupportList({
                query:{
                    sign:this.userSign,
                    page: 1
                }
            })

            if(json.data.errcode == 200 ){
                 let dynamicList = json.data.dynamicList;

                 dynamicList.forEach((res)=>{
                     if(res.dynamicSign == this.dynamicObj.dynamicSign){
                         this.isMySupport = true;
                         console.log('11111111111',res);
                         this.dynamicObj= {...this.dynamicObj,...res}
                     }
                 })
            }
        }
    }
}
