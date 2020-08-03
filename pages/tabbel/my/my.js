import api from '../../../utils/request/api';
import constant from '../../../utils/constant';
import dynamicCard from "../../../components/dynamicCard";
import refresh from '../../../components/refresh';

let that;
export default {
    components:{
        dynamicCard,
        refresh
    },
    data() {
        return {
            userInfo:{},
            avatarBgImgUrl:'',
            userSign:'',
            dynamicList:[],
            pageHeight:0,
            myDynamicViewH:0,
            isAuthor: Boolean,

            currPage:1,//当前的页数
            totalPage:3, //数据的总页数
            currentType:'my',

            getPrivateChatObj:{},


        };
    },
    onLoad(){
        that = this;
        this.userInfo = constant.getUserInfo();
        uni.getSystemInfo({
            success: (res) => {
                this.pageHeight = res.windowHeight;
            }
        });
    },
    onShow(){
        if(constant.getUserSign().length != 0){
            this.currPage = 1;
            this.dynamicList = [];
            this.getDynamicList(this.currPage);
        }

        this.userInfo = constant.getUserInfo();
    },
    onReady(){
        // this.avatarBgImgUrl ='data:image/jpg;base64,'+ wx.getFileSystemManager().readFileSync(this.userInfo.pic, "base64");
        // console.log(this.avatarBgImgUrl)

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
          this.myDynamicViewH = this.pageHeight - res.top;
      }).exec();

      this.getDynamicList(this.currPage);
    },
    methods:{
        //去修改个人信息修改页面、
        toEditDetail(val){
            // console.log('去修改个人信息修改页面',val)
            // url:"/pages/chatRoom/chatRoom?roomSign=" + roomSign + '&roomName=' + roomName + '&chatType=' + type + '&userName=' + constant.getUserInfo().name
            uni.navigateTo({
                url: '/pages/personalPage/personalPage'
            });
        },


        toAuthor(res) {
            console.log('>>>>>',res)
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
        dropOpen(next) { // 下拉刷新触发方法
            this.currPage = 1;
            this.dynamicList = [];
            this.getDynamicList(this.currPage)

            setTimeout(() => { // 模拟请求
                next(); // 请求到数据，执行next() 表示加载完毕，关闭效果
            }, 1000);
        },
        //加载更多
        pullOpen(next) { // 上拉加载触发方法
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
            if(json.data.errcode == 200){
                console.log('------',json);
                this.dynamicList =  json.data.dynamicList
                //     .forEach(res=>{
                //     if(res.sign == that.userSign){
                //         this.dynamicList.push(res);
                //     }
                // })
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
        toMyFollow(){
            uni.navigateTo({
                url:"/pages/myFollow/myFollow"
            })
        }
    }
}
