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
            cartTypeList: [{name: '热门动态', bgColor: '#ABB3FE'}, {name: '以书会友', bgColor: '#ABB3FE'}, {
                name: '校园爱情',
                bgColor: '#89D2B7'
            }, {name: '百团大战', bgColor: '#89D2B7'}, {name: '约起开黑', bgColor: '#ABB3FE'}, {
                name: '操场相见',
                bgColor: '#ABB3FE'
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
    onLoad(){
        this.toLogin();
    },
    onReady() {
        uni.showLoading({
            title:'加载中...'
        })
        that = this;
        this.isAuthor = constant.getIsAuthor();
        let banner = constant.getUserLogin().banner;
        this.userSign= constant.getUserSign();
        // banner.forEach(res=>{
        //     this.bannerImg.push(res.pic);
        // })
        this.bannerImg = banner;


        uni.hideLoading();
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
