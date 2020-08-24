import api from '../../../utils/request/api';
import constant from '../../../utils/constant';

//插件 start
import dynamicCard from "../../../components/dynamicCard";
import loadRefresh from '../../../components/load-refresh';
//插件 end
let that;
export default {
    components:{
        dynamicCard,
        loadRefresh
    },
    data() {
        return {
            userInfo:{},
            avatarBgImgUrl:'',
            userSign:'',
            dynamicList:[],
            pageHeight:0,

            //refresh start
            myDynamicViewH:0,//视图的高度
            loadRefreshHeight:0,//刷新的高度
            currPage:1,//当前的页数
            totalPage:0, //数据的总页数
            //refresh end

            isAuthor: Boolean,
            currentType:'my',
            getPrivateChatObj:{},

            followNum:0,
            supportNum:0
        };
    },
    onShareAppMessage() {
        return {
            title: "传播校园文化,助力高考报考",
            path: '/pages/selectSchool/selectSchool',
            imageUrl: "/static/images/poster.png"
        }
    },
    onLoad(){

        that = this;
        this.userInfo = constant.getUserLogin();
        uni.getSystemInfo({
            success: (res) => {
                this.pageHeight = res.windowHeight;
            }
        });
    },
    onShow(){

        this.followNum = constant.getUserLogin().followNum;
        this.supportNum = constant.getUserLogin().ILikeTimes;

        if(constant.getUserSign().length != 0){
            this.currPage = 1;
            this.dynamicList = [];
            this.getDynamicList(this.currPage);
        }

        this.userInfo = constant.getUserLogin();
    },
    onReady(){

        uni.setStorageSync('IS_PREVIEW',false);
        setTimeout(function () {
        },1500);



        that.userInfo = constant.getUserLogin();

        if (constant.getIsAuthor().length == 0) {
            this.isAuthor = false;
        } else {
            this.isAuthor = constant.getIsAuthor();
        }

      this.userSign = constant.getUserSign();

      const query = uni.createSelectorQuery().in(this);

      query.select('.myDynamic').boundingClientRect(res=>{
          console.log('我的动态列表===》',res)

          this.myDynamicViewH = this.pageHeight - res.top;
          this.loadRefreshHeight = res.top;
      }).exec();

      this.getDynamicList(this.currPage);
    },
    methods:{
        //去修改个人信息修改页面、
        toEditDetail(val){
            uni.navigateTo({
                url: '/pages/personalPage/personalPage'
            });
        },
        //用户授权
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
                                title:'授权成功',
                                mask:true,
                                icon:'none'
                            });
                            that.showPopup = true;
                            that.toLogin();
                            that.userInfo.pic = avatarUrl;
                            that.userInfo.name = nickName;

                        }
                    }
                },
                fail(res) {
                    constant.setIsAuthor(false)
                    that.isAuthor = false;
                }
            });
        },

        toother(){
            uni.navigateTo({
                url:"/pages/otherMinePage/otherMinePage"
            })
        },

        toReadNotive(){
            uni.navigateTo({
                url:'/pages/notice/notice'
            })
        },

        // 刷新数据
        refresh(next) { // 下拉刷新触发方法
            this.currPage = 1;
            this.dynamicList = [];
            this.getDynamicList(this.currPage)
        },

        //加载更多
        loadMore(next) { // 上拉加载触发方法
            this.currPage++;
            this.getDynamicList(this.currPage)
            that.$refs.hideLoading[1].loadOver()
        },

        //获取动态列表
        async getDynamicList(currentPage){
            let json = await api.getDynamicList({
                query:{
                    sign:this.userSign,
                    page: currentPage,
                    type: 2
                }
            })
            if(json.data.errcode == 200){
                this.totalPage = json.data.totalPage;
                json.data.dynamicList.forEach((res) => {
                    res['isShowAllContent'] = false
                })
                this.dynamicList = [...this.dynamicList,...json.data.dynamicList];
            }
        },

        toPrivateChat(){
            uni.redirectTo({
                url: '/pages/chatRoom/chatRoom'
            });
        },
        toMySupport(){
            uni.navigateTo({
                url:"/pages/mySupport/mySupport"
            })
        },

        //进入动态详情页面
        dynamicDetail(obj) {
            uni.navigateTo({
                url: '/pages/dynamicDetail/dynamicDetail?dynamicObj=' + JSON.stringify(obj)
            })
        },

        //展示全文
        showAll(index) {

            if (!this.dynamicList[index].isShowAllContent) {
                this.dynamicList[index].isShowAllContent = true
            } else {
                this.dynamicList[index].isShowAllContent = false
            }
        },

        toMyFollow(){
            uni.navigateTo({
                url:"/pages/myFollow/myFollow"
            })
        },
        //分享
        async toShare(dynSign) {
            let json = await api.shareDynamic({
                query: {
                    dynamicSign: dynSign,
                    sign: this.userSign
                }
            })

            if (json.data.errcode == 200) {
                uni.showToast({
                    title: json.data.info,
                    mask: true,
                    icon: 'none'
                })
            }
        },

        // 评论
        toComment(dynSign) {
            uni.navigateTo({
                url: "/pages/publish/publish?publishType=commentDynamic&dynamicSign=" + dynSign
            })
        },
        //点赞
        async toSupport(dynSign) {
            let json = await api.addSupport({
                query: {
                    dynamicSign: dynSign,
                    sign: this.userSign
                }
            })

            uni.showToast({
                title: json.data.info,
                mask: true,
                icon: 'none'
            })
            if (json.data.errcode == 200) {
                this.toLogin();
                this.dynamicList.forEach(res => {
                    if (res.dynamicSign == dynSign) {
                        res.likeTimes++;
                        this.$set(res, 'like', true)
                    }
                })

            }
        },

    }
}
