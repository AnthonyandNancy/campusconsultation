import api from '../../utils/request/api';
import constant from '../../utils/constant';
import dynamicCard from "../../components/dynamicCard";
import loadRefresh from '../../components/load-refresh';
let that;
export default {
    components:{
        dynamicCard,
        loadRefresh
    },
    data() {
        return {
            userInfo:{},
            userSign:'', //被关注的用户sign
            mineSign:'', //我的sign
            dynamicList:[],
            pageHeight:0,
            myDynamicViewH:0,
            loadRefreshH:0,

            currPage:1,//当前的页数
            totalPage:0,//数据的总页数
            currentType:'my',
            isAuthor: Boolean,
            isFollow:Boolean


        };
    },
    onLoad(option){
        // roomSign=' + sign + '&roomName=' + name + '&chatType=' + chatType + '&avatar=' + avatar
        let privateChatData = option;
        that = this;
        this.userInfo = privateChatData;
        this.userSign = privateChatData.roomSign;
        this.mineSign = constant.getUserSign();

        uni.getSystemInfo({
            success: (res) => {
                this.pageHeight = res.windowHeight;
            }
        });
    },
    onShow(){

    },
    onReady(){
        // this.userSign = this.userInfo.roomSign;
        uni.setStorageSync('IS_PREVIEW',false);

        const query = uni.createSelectorQuery().in(this);

        query.select('.myDynamic').boundingClientRect(res=>{
            this.myDynamicViewH = this.pageHeight - res.top;
            this.loadRefreshH = res.top;

        }).exec();

        this.getDynamicList(this.currPage);
        this.checkIsFollow();
    },
    methods:{
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
                            if(that.getMineSchoolName == null){
                                that.showPopup = true;
                            }
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

            setTimeout(() => { // 模拟请求
                next(); // 请求到数据，执行next() 表示加载完毕，关闭效果
            }, 1000);
        },
        //加载更多
        loadMore(next) { // 上拉加载触发方法
            this.currPage++;
            this.getDynamicList(this.currPage)
            setTimeout(() => { // 模拟请求
                next();
            }, 1000);
        },
        //h获取动态列表
        async getDynamicList(currentPage){
            let json = await api.getDynamicList({
                query:{
                    sign:this.userSign,
                    page: currentPage,
                    type: 2
                }
            })
            this.totalPage = json.data.totalPage;
            if(json.data.errcode == 200){
                this.dynamicList =json.data.dynamicList
            }
        },
        async toPrivateChat(){
            if(this.userInfo.from == 'home'){
                let userSign = constant.getUserSign();

                const res = await api.addNewFriend({
                    query: {
                        sign: userSign,
                        friendSign: this.userInfo.roomSign

                    }
                })
                const resFri = await api.addNewFriend({
                    query: {
                        sign: this.userInfo.roomSign,
                        friendSign: userSign

                    }
                })

            }

            uni.redirectTo({
                url: '/pages/chatRoom/chatRoom?roomSign=' + this.userInfo.roomSign + '&roomName=' + this.userInfo.roomName + '&chatType=' + 0 + '&avatar=' + this.userInfo.avatar
            });
        },

        // 检测是否已关注
        async checkIsFollow(){
            let checkIsFollowJson = await api.checkFollow({
                query:{
                    sign:this.mineSign,
                    followSign:this.userSign
                }
            })

            if(checkIsFollowJson.data.errcode == 200){
                let checkStatus = checkIsFollowJson.data.relation;
                console.log('检测关注',checkIsFollowJson)
                    this.isFollow = checkStatus;
            }
        },

        //关注
        async follow(){
            let checkIsFollowJson = await api.checkFollow({
                query:{
                    sign:this.mineSign,
                    followSign:this.userSign
                }
            })

            if(checkIsFollowJson.data.errcode == 200){
                let checkStatus = checkIsFollowJson.data.relation;
                //检测是否已关注
                if(checkStatus){
                    this.cancelFollow();
                }else{
                    let json  = await api.setFollow({
                        query:{
                            sign:this.mineSign,
                            followSign:this.userSign
                        }
                    })
                    if(json.data.errcode == 200 ){
                        uni.showToast({
                            title: '已关注',
                            icon:'none',
                            mask:true
                        })
                       this.isFollow = true;
                    }
                    console.log('点击关注',json);
                }
            }
        },

        async cancelFollow(){
            let cancelJson = await api.cancelFollow({
                query:{
                    sign:this.mineSign,
                    followSign:this.userSign
                }
            })

            if(cancelJson.data.errcode == 200){
                uni.showToast({
                    title: '关注已取消',
                    icon:'none',
                    mask:true
                })
                this.isFollow = false;
            }
            console.log('取消关注',cancelJson);
        },

    }
}
