//插件 start
import carousel from '@/components/vear-carousel/vear-carousel';
//插件 end
import constant from "../../../utils/constant";
import api from '../../../utils/request/api';

let that;

export default {
    components: {
        carousel
    },
    data() {
        return {
            bannerImg: [],
            cartTypeList: [
                {name: '热门动态'},
                {name: '以书会友'},
                {name: '校园爱情'},
                {name: '百团大战'},
                {name: '约起开黑'},
                {name: '操场相见'}],
            isAuthor: Boolean,
            userSign: ''
        }
    },
    onShareAppMessage() {
        return {
            title: "传播校园文化,助力高考报考",
            path: '/pages/selectSchool/selectSchool',
            imageUrl: "/static/images/poster.png"
        }
    },
    onLoad() {

        this.toLogin();

    },
    onReady() {
        uni.showLoading({
            title: '加载中...'
        })

        that = this;
        this.isAuthor = constant.getIsAuthor();
        let banner = constant.getUserLogin().banner;
        this.userSign = constant.getUserSign();
        this.bannerImg = banner;

        if (this.bannerImg.length != 0) {
            uni.hideLoading();
        }
    },

    methods: {
        jumpToOtherPath(res){
            if(res.jumpPage == null){
                return;
            }

            let jumpUrl = res.jumpPage.split('?')[0]
            console.log('====>',jumpUrl)

            let jumpObj =  {};
            res.jumpPage.replace(/([^?&]+)=([^?&]+)/g, function(s, key, value) {
                jumpObj[key] =  value
            });

            console.log(jumpObj.jumpIndex)
           switch (jumpObj.jumpType) {
               case 'navigate':
                   uni.navigateTo({
                        url:jumpUrl
                   })
                   break;

               case 'switchTab':
                   constant.setSelectType( !jumpObj.jumpIndex?'0':jumpObj.jumpIndex);
                   uni.switchTab({
                       url: jumpUrl
                   })
                   break;

           }
        },

        toHotDynamicPage(index) {
            constant.setSelectType(index + 1)
            uni.switchTab({
                url: '/pages/tabbel/schoolCircle/schoolCircle'
            })
        },

        toAuthor() {
            uni.getUserInfo({
                provider: 'weixin',
                lang: 'zh_CN',
                success: async function (infoRes) {
                    constant.setIsAuthor(true);
                    that.isAuthor = true;

                    if (infoRes.errMsg == "getUserInfo:ok") {
                        constant.setUserInfo(infoRes.userInfo)

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
                            that.toLogin();
                        }
                    }
                },
                fail(res) {
                    constant.setIsAuthor(false)
                    that.isAuthor = false;
                }
            });
        }
    }
}
