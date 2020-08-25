import dynamicCard from "../../components/dynamicCard";
import constant from "../../utils/constant";
import api from '../../utils/request/api';
import loadRefresh from '../../components/load-refresh';

export default {
    components: {
        dynamicCard,
        loadRefresh
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
            isMySupport:false,

            currPage:1,
            totalPage:0,

            scrollH:0,
            upperDistance:0
        }
    },
    async onLoad(option) {
        this.userSign = constant.getUserSign();
        //获取动态详情
        let dynamicObj = JSON.parse(option.dynamicObj);

        let json = await api.getOnlyDynamic({
            query:{
                dynamicSign:dynamicObj.dynamicSign,
                sign:this.userSign
            }
        })

        console.log('单条动态的内容------>>>>',json.data);

        if(json.data.errcode == 200){
            this.dynamicObj = json.data.content
        }

    },
    onShow(){
        if(constant.getIsComment()){
            this.dynamicObj.commentTimes++;
            this.currPage = 1;
            this.commentList=[];
            this.getCommentList();
        }
    },
    onReady(){
        uni.setStorageSync('IS_PREVIEW',false);
        this.getCommentList();

        uni.getSystemInfo({
            success: (res)=> {
                console.log(res,'===============');
                this.scrollH = res.windowHeight;
            }
        })


        let query = uni.createSelectorQuery().in(this);
        query.select('.commentTip').boundingClientRect(res => {
            console.log('========>>>>>>>>>>>>>>>>>>>>',res.top);
            this.upperDistance = res.top;
        }).exec();
    },
    onShareAppMessage(){
        return {
            title: "传播校园文化,助力高考报考",
            path: '/pages/tabbel/home/home',
            imageUrl: "/static/images/poster.png"
        }
    },
    methods: {
        scroll(res){

            console.log('.========>>>',res);
        },
        toupper(res){
            console.log('----toupper=====>',res)
        },
        tolower(res){
            console.log('-----tolower=====>',res)
        },
        //获取评论列表
        async getCommentList() {
            let json = await api.getCommentList({
                query: {
                    sign:this.userSign,
                    dynamicSign:this.dynamicObj.dynamicSign,
                    page:this.currPage
                }
            })
            if(json.data.errcode == 200){
                console.log('========------->>>',json.data)
                this.totalPage = json.data.totalPage;
                this.commentList =[...this.commentList,...json.data.commentList];
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
        showAll(index) {
            if (!this.dynamicObj.isShowAllContent) {
                this.dynamicObj.isShowAllContent = true
            } else {
                this.dynamicObj.isShowAllContent = false
            }
        },
        toComment(){
            uni.navigateTo({
                url:"/pages/publish/publish?publishType=commentDynamic&dynamicSign=" + this.dynamicObj.dynamicSign
            })

        },
        //添加点赞
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
                this.dynamicObj.ILike = true;
                this.dynamicObj.likeTimes++;
            }
        },

        loadMore(){
            this.currPage++;
            this.getCommentList();
        },
        refresh(){
            this.commentList = [];
            this.currPage = 1;
            this.getCommentList();
        }
    }
}
