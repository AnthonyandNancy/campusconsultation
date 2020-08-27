import carousel from '@/components/vear-carousel/vear-carousel';
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
            imageUrl: ""
        }
    },
    onLoad() {
        this.toLogin();

    },

    onReady() {
        uni.$on('schoolName', (res) => {
            if (res == null) {
                uni.reLaunch({
                    url: '/pages/selectSchool/selectSchool'
                })
            }
        })

        that = this;
        uni.showLoading({
            title: '加载中...',
            mask: true
        })


        this.isAuthor = constant.getIsAuthor();
        let banner = constant.getUserLogin().banner;
        this.userSign = constant.getUserSign();
        this.bannerImg = banner;

        if (this.bannerImg.length != 0) {
            uni.hideLoading();
        }
    },

    methods: {
        jumpToOtherPath(res) {
            if (res.jumpPage == null) {
                return;
            }

            let jumpUrl = res.jumpPage.split('?')[0]

            let jumpObj = {};
            res.jumpPage.replace(/([^?&]+)=([^?&]+)/g, function (s, key, value) {
                jumpObj[key] = value
            });

            switch (jumpObj.jumpType) {
                case 'navigate':
                    uni.navigateTo({
                        url: jumpUrl
                    })
                    break;
                case 'switchTab':
                    constant.setSelectType(!jumpObj.jumpIndex ? '0' : jumpObj.jumpIndex);
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
        }
    }
}
