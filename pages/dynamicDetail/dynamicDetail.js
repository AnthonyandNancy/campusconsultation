import dynamicCard from "../../components/dynamicCard";
import constant from "../../utils/constant";
import api from '../../utils/request/api';
import loadRefresh from '../../components/load-refresh';
let that;
export default {
    components: {
        dynamicCard,
        loadRefresh
    },
    data() {
        return {
            dynamicObj: {},
            addressDynamicObj:{},
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
            upperDistance:0,
            isAuthor:Boolean
        }
    },
    async onLoad(option) {
        that = this;
        this.userSign = constant.getUserSign();
        //获取动态详情
        let dynamicObj = JSON.parse(option.dynamicObj);


        if(option.intoType == 'share'){
            uni.$on('userLogin',(res)=>{
                this.userSign = res.sign;
            })
        }

        let json = await api.getOnlyDynamic({
            query:{
                dynamicSign:dynamicObj.dynamicSign,
                sign:this.userSign !=''?this.userSign:dynamicObj.userSign
            }
        })

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
        this.isAuthor = constant.getIsAuthor();

        uni.setStorageSync('IS_PREVIEW',false);
        this.getCommentList();

        uni.getSystemInfo({
            success: (res)=> {
                this.scrollH = res.windowHeight;
            }
        })


        // let query = uni.createSelectorQuery().in(this);
        // query.select('.commentTip').boundingClientRect(res => {
        //     this.upperDistance = res.top;
        // }).exec();

    },

    onShareAppMessage(res){
        if(res.from == 'button'){
            let  dyObj = res.target.dataset.detaildy;
            return{
                title: dyObj.content,
                path: '/pages/dynamicDetail/dynamicDetail?dynamicObj=' + JSON.stringify(dyObj),
                imageUrl: dyObj.imgList.length != 0 ? dyObj.imgList[0] : dyObj.videoPreview == null ? '' : dyObj.videoPreview
            }
        }
    },

    methods: {
        toAuthor(res) {
            uni.getUserInfo({
                provider: 'weixin',
                success: async function (infoRes) {
                    constant.setIsAuthor(true)
                    that.isAuthor = true;
                    if (infoRes.errMsg == "getUserInfo:ok") {
                        let {nickName, avatarUrl, gender, country, province, city} = infoRes.userInfo;
                        let json = await api.updateUserInfo({
                            query: {
                                sign: that.userSign,
                                name: nickName,
                                pic: avatarUrl,
                                gender: gender,
                                country: country,
                                province: province,
                                city: city
                            }
                        })
                        if (json.data.errcode == 200) {
                            uni.showToast({
                                title: '授权成功',
                                mask: true,
                                icon: 'none'
                            });
                            that.showPopup = true;
                            that.toLogin();

                        }
                    }
                },
                fail(res) {
                    constant.setIsAuthor(false)
                    that.isAuthor = false;
                }
            });
        },
        toCheckAuthor(authorStatus){
            this.isAuthor = authorStatus
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
