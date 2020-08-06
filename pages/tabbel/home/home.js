//插件 start
import mosoweSwiper from '../../../components/mosowe-swiper/mosowe-swiper';
//插件 end
import constant from "../../../utils/constant";
import api from '../../../utils/request/api';

let that;

export default {
    components: {
        mosoweSwiper
    },
    data() {
        return {
            bannerImg: [],
            cartTypeList: [{name: '热门动态', bgColor: '#ACB2FD'}, {name: '以书会友', bgColor: '#ACB2FD'}, {
                name: '校园爱情',
                bgColor: '#89D4B5'
            }, {name: '百团大战', bgColor: '#89D4B5'}, {name: '约起开黑', bgColor: '#D5A5FD'}, {
                name: '操场相见',
                bgColor: '#D5A5FD'
            }],
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
    onReady() {
        that = this;
        this.isAuthor = constant.getIsAuthor();
        let banner = constant.getUserLogin().banner;
        banner.forEach(res=>{
            this.bannerImg.push(res.pic);
        })
    },

    methods: {
        toHotDynamicPage(index) {
            constant.setSelectType(index + 1)
            uni.switchTab({
                url: '/pages/tabbel/schoolCircle/schoolCircle'
            })
        },
        toAuthor(){
            uni.getUserInfo({
                provider: 'weixin',
                lang:'zh_CN',
                success: async function (infoRes) {
                    constant.setIsAuthor(true);
                    that.isAuthor = true;

                    if (infoRes.errMsg == "getUserInfo:ok") {
                        console.log('获取到的用户信息',infoRes)
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
                        console.log('更新用户信息=====>',json)
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
