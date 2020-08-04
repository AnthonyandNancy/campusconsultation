import msDropdownMenu from '../../../components/ms-dropdown/dropdown-menu';
import msDropdownItem from '../../../components/ms-dropdown/dropdown-item';
import universityChoose from '../../../utils/universityChoose';
import navTab from '../../../components/navTab';
import loadRefresh from '../../../components/load-refresh';
import constant from "../../../utils/constant";
import api from '../../../utils/request/api';
import uniFab from '../../../components/uni-fab/uni-fab'

import luchAudio from '../../../components/luch-audio/luch-audio';

import navTab_loadRefresh from "../../../components/navTab_loadRefresh";

let that;

export default {
    components: {
        msDropdownMenu,
        msDropdownItem,
        navTab,
        loadRefresh,
        navTab_loadRefresh,
        luchAudio,
        uniFab
    },
    data() {
        return {
            bannerImg: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596525483569&di=0af236d21540744bb56589db045f18ac&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fitbbs%2F1607%2F17%2Fc38%2F24304611_1468760700828_mthumb.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596525483567&di=b551eabe87c4bdb34e34b410544ce54d&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fitbbs%2F1607%2F17%2Fc39%2F24304707_1468760741305.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596525483566&di=34b799251aaeae974982d631889d088f&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fitbbs%2F1607%2F17%2Fc38%2F24304608_1468760682148_mthumb.jpg'],
            cartTypeList: [{name: '热门动态', bgColor: '#ACB2FD'}, {name: '以书会友', bgColor: '#ACB2FD'}, {
                name: '校园爱情',
                bgColor: '#89D4B5'
            }, {name: '百团大战', bgColor: '#89D4B5'}, {name: '约起开黑', bgColor: '#D5A5FD'}, {
                name: '操场相见',
                bgColor: '#D5A5FD'
            }],

            getMineSchoolName: "",
            hideTop: false,
            showPopup: false,
            showCell: false,
            showApplyPanel: false,
            keyword: '',
            isAuthor: Boolean,

            // 下拉选择列表变量 start
            provinceList: [{text: "请选择省", value: 0}],
            cityList: [{text: "请选择市", value: 0}],
            schoolList: [{text: "请选学校", value: 0}],
            showSelect: false,
            provinceValue: 0,
            cityValue: 0,
            schoolValue: 0,
            // 下拉选择列表变量 end

            tabTitle: ['全部动态', '群聊'],
            cahangeTabTile: ['全部动态', '该校动态', '该校群聊'],
            currentTab: 0,  //swiper所在的页面
            viewHeight: 0,
            swiperHeight: 0,
            otherViewHight: 0,//除load-Refresh组件外的高度
            scrollTop: 0,

            userSign: '',
            totalDynamicList: [],
            dynamicList: [], //动态列表
            charRoomList: [],//群聊列表

            //下拉加载刷新变量 start
            currPage: 1, // 下拉加载的当前页码
            totalPage: 0, // 下拉加载的总页数
            allDynamicCurrPage: 1,
            allDynamicTotalPage: 0,
            //下拉加载刷新变量 end

            schoolInfo: {},
            avatarImgUrl: '',
            searchSchoolList: [],
            applyObj: {
                roomName: '',
                describe: '',
                pic: ''
            },
            applyRealImageUrl: '',
            customStyle: {
                backgroundColor: "#fff",
                border: '1px solid #ddd'
            },
            form: {
                name: '',
                intro: '',
                sex: ''
            },
            audioPlay: false,
            chatMakeTopShow: false,
            isPreView: false, //判断是否是预览图片,
            //右下角悬浮按钮
            directionStr: '垂直',
            horizontal: 'right',
            vertical: 'bottom',
            direction: 'horizontal',
            pattern: {
                color: '#7A7E83',
                backgroundColor: '#fff',
                selectedColor: '#007AFF',
                buttonColor: '#007AFF'
            },
            content: [
                {
                    iconPath: '/static/images/pinglun.png',
                    selectedIconPath: '/static/images/pinglun.png',
                    text: '发布评论',
                    active: false
                },
                {
                    iconPath: '/static/images/peoples.png',
                    selectedIconPath: '/static/images/peoples.png',
                    text: '创建群聊',
                    active: false
                }
            ],
            isMySupport: false

        }
    },
    onShareAppMessage() {
        return {
            title: "传播校园文化,助力高考报考",
            path: '/pages/tabbel/home/home',
            imageUrl: "/static/images/poster.png"
        }
    },
    onReady() {
        that = this;
        this.isAuthor = constant.getIsAuthor();
    },
    // onLoad() {
    //     //获取系统高度
    //     uni.getSystemInfo({
    //         success: (res) => {
    //             this.viewHeight = res.windowHeight;
    //         }
    //     });
    // },
    // onShow() {
    //     //判断是否是添加动态后返回的
    //     this.isPreView = uni.getStorageSync('IS_PREVIEW');
    //     //获取城市数据
    //     this.provinceList = universityChoose;
    //     if (constant.getUserSign().length != 0) {
    //         if (this.isPreView) {
    //             this.dynamicList = []
    //             this.totalDynamicList = []
    //             this.currPage = 1;
    //             this.allDynamicCurrPage = 1;
    //             this.getTotalDynaicList(this.allDynamicCurrPage);
    //             this.getDynamicList(this.currPage);
    //             this.getChatRoom();
    //         }
    //         this.getSupportList();
    //     }
    // },
    // onReady() {
    //     that = this;
    //
    //     //授权判断
    //     if (constant.getIsAuthor().length == 0) {
    //         this.isAuthor = false;
    //     } else {
    //         this.isAuthor = constant.getIsAuthor();
    //     }
    //
    //     //sign为空时
    //     if (constant.getUserSign().length == 0) {
    //         new Promise((resolve, reject) => {
    //             uni.login({
    //                 success: async res => {
    //                     let {errMsg, code} = res;
    //                     if (errMsg == "login:ok") {
    //                         let json = await api.getLogin({
    //                             query: {
    //                                 code: code,
    //                                 version: '1.0'
    //                             }
    //                         })
    //                         let {errcode} = json.data;
    //                         if (errcode == 200) {
    //                             that.userSign = json.data.sign;
    //                             that.getMineSchoolName = json.data.schoolName;
    //                             resolve();
    //                         }
    //                     }
    //                 }
    //             })
    //         }).then(res => {
    //             if (that.getMineSchoolName == null) {
    //                 that.hideTop = true;
    //             }
    //
    //             this.avatarImgUrl = 'https://cdn4game.xunyi.online/static/SchoolLian/Badges/' + this.getMineSchoolName + '.png';
    //             if (constant.getSchoolInfo().length == 0 && this.getMineSchoolName != null) {
    //                 this.getSchoolInfo();//获取学校信息
    //             }
    //
    //             // 判断用户本身有没有绑定学校，来获取高度
    //             if (this.getMineSchoolName != null) {
    //
    //                 const query = uni.createSelectorQuery().in(this);
    //                 new Promise((resolve, reject) => {
    //                     query.select('.top').boundingClientRect(data => {
    //                         resolve(data.height)
    //                     }).exec();
    //                 }).then(res => {
    //                     query.select('.swiper').boundingClientRect(data => {
    //                         this.swiperHeight = this.viewHeight - data.top;
    //                         this.otherViewHight = data.top;
    //                     }).exec();
    //                 })
    //             } else {
    //                 const query = uni.createSelectorQuery().in(this);
    //                 query.select('.swiper').boundingClientRect(data => {
    //                     this.swiperHeight = this.viewHeight - data.top;
    //                     this.otherViewHight = data.top;
    //                 }).exec();
    //             }
    //             that.getTotalDynaicList(this.allDynamicCurrPage);
    //             that.getDynamicList(this.currPage);
    //             that.getChatRoom();
    //             that.getSupportList();
    //         })
    //     } else {
    //         this.userSign = constant.getUserSign();
    //         //获取旧用户已绑定的学校
    //         new Promise((resolve, reject) => {
    //             if (constant.getSchoolInfo().length == 0) {
    //                 that.getMineSchoolName = constant.getUserInfo().schoolName;
    //             } else {
    //                 that.getMineSchoolName = constant.getSchoolInfo().schoolName;
    //             }
    //             resolve(that.getMineSchoolName)
    //         }).then((res) => {
    //             if (that.getMineSchoolName == null) {
    //                 that.hideTop = true;
    //             }
    //             this.avatarImgUrl = 'https://game.xunyi.online/static/SchoolLian/Badges/' + res + '.png';
    //
    //             if (constant.getSchoolInfo().length == 0 && that.getMineSchoolName != null) {
    //                 that.getSchoolInfo();
    //             } else {
    //                 that.schoolInfo = constant.getSchoolInfo();
    //             }
    //
    //             if (res != null) {
    //                 const query = uni.createSelectorQuery().in(this);
    //
    //                 new Promise((resolve, reject) => {
    //                     query.select('.top').boundingClientRect(data => {
    //                         resolve(data.height)
    //                     }).exec();
    //                 }).then(res => {
    //                     query.select('.swiper').boundingClientRect(data => {
    //
    //                         that.swiperHeight = that.viewHeight - data.top;
    //                         that.otherViewHight = data.top;
    //                     }).exec();
    //                 })
    //             } else {
    //                 const query = uni.createSelectorQuery().in(this);
    //                 query.select('.swiper').boundingClientRect(data => {
    //                     that.swiperHeight = that.viewHeight - data.top;
    //                     that.otherViewHight = data.top;
    //
    //                 }).exec();
    //             }
    //             //调用动态列表
    //             that.getTotalDynaicList(this.allDynamicCurrPage);
    //             that.getDynamicList(this.currPage);
    //             that.getChatRoom();
    //             that.getSupportList();
    //         })
    //     }
    // },
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
        },


        //悬浮按钮事件
        //点击悬浮按钮事件
        trigger(val) {
            console.log('点击悬浮按钮事件', val.index)
            let index = val.index
            if (index == 0) {
                uni.setStorageSync('IS_PREVIEW', true);
                if (!this.getMineSchoolName) {
                    this.showPopup = true;
                    return;
                }
                uni.navigateTo({
                    url: "/pages/publish/publish?publishType=publishDynamic"
                })
            } else if (index == 1) {
                uni.setStorageSync('IS_PREVIEW', false);
                this.showApplyPanel = true;
            } else {
                console.log('没有该选项')
            }
        },
        controlAudioPlay() {
            if (!this.audioPlay) {
                this.audioPlay = true;
            } else {
                this.audioPlay = false;
            }
        },


        toApply() {
            uni.setStorageSync('IS_PREVIEW', false);
            this.showApplyPanel = true;
        },
        onUploaded() {
            uni.authorize({
                scope: "scope.camera",
                success: () => {
                    uni.chooseImage({
                        count: 1,
                        sizeType: ['compressed'],
                        sourceType: ['album', 'camera'],
                        success: async (chooseImageRes) => {
                            if (chooseImageRes.errMsg == 'chooseImage:ok') {

                                this.applyObj.pic = chooseImageRes.tempFilePaths[0];

                                //线上路径
                                let json = await api.uploadImages({
                                    query: {
                                        filePath: this.applyObj.pic,
                                        data: {sign: that.userSign},
                                        key: 'img'
                                    }
                                })
                                let jsonData = JSON.parse(json.data);
                                if (jsonData.errcode == 200) {
                                    that.realImgUrlList = jsonData.img;
                                }
                            }
                        }
                    });
                }
            })

        },
        del() {
            this.applyObj.pic = '';
            this.applyRealImageUrl = '';
        },
        async toChatPage(roomSign, roomName, chatType) {
            let json = await api.joinGroupChat({
                query: {
                    sign: this.userSign,
                    roomSign: roomSign
                }
            })

            if (json.data.errcode == 200) {
                uni.navigateTo({
                    url: '/pages/chatRoom/chatRoom?roomSign=' + roomSign + '&roomName=' + roomName + '&chatType=' + 1 + '&userName=' + constant.getUserLogin().name
                })
            }

            if (chatType == 1) {
                uni.setStorage({
                    key: 'privateChatSign',
                    data: roomSign
                });
                uni.setStorage({
                    key: 'privateChatName',
                    data: roomName
                });
            }

        },
        async submitApply() {
            let json = await api.applyNewChatRoom({
                query: {
                    sign: this.userSign,
                    roomName: this.applyObj.roomName,
                    describe: this.applyObj.describe,
                    pic: this.realImgUrlList
                }
            })
            if (json.data.errcode == 200) {
                this.applyObj = {
                    roomName: '',
                    describe: '',
                    pic: ''
                }
                uni.showToast({
                    title: json.data.info,
                    mask: true,
                    icon: 'none'
                })
                this.showApplyPanel = false;
            }
        },

        //进入动态详情页面
        dynamicDetail(obj) {
            uni.navigateTo({
                url: '/pages/dynamicDetail/dynamicDetail?dynamicObj=' + JSON.stringify(obj)
            })
        },
        toPublisher(data) {
            console.log('>>>>>>>>>>>', data)
            if (this.userSign == data.sign) {
                return;
            }
            uni.navigateTo({
                url: '/pages/otherMinePage/otherMinePage?roomSign=' + data.sign + '&roomName=' + data.name + '&from=home' + '&avatar=' + data.pic
            })


        },

        // 用户不是新用户，但缓存中没有学校的信息数据
        async getSchoolInfo() {
            let json = await api.searchSchool({
                query: {
                    keyword: this.getMineSchoolName,
                    sign: this.userSign
                }
            })
            let campusList = json.data.campusList[0];
            if (json.data.errcode == 200) {
                let schoolInfo = {
                    schoolName: campusList[0],
                    schoolCode: campusList[1],
                    province: campusList[2],
                    education: campusList[3],
                    city: this.cityList[this.cityValue].text
                }
                this.schoolInfo = schoolInfo
                constant.setSchoolInfo(schoolInfo);
            }
        },
        //搜索框搜索
        //文件改变时搜索
        async handelSearch() {
            this.showCell = true;
            this.showSelect = true;
            if (this.keyword == '') {
                this.showSelect = false;
            }
            let json = await api.searchSchool({
                query: {
                    keyword: this.keyword,
                    sign: this.userSign
                }
            })
            if (json.data.errcode == 200) {
                this.searchSchoolList = json.data.campusList
            }
        },
        //按搜索时搜索
        search() {
            uni.switchTab({
                url: '../tabbel/home/home'
            })
        },
        //输入框聚焦
        getFocus() {
            this.showSelect = true;
        },
        toBlus() {
            this.showSelect = false;
        },
        show() {
            this.showPopup = true;
        },
        //选择省份后
        getprovinceVal(val) {
            //获取该省份的相关城市
            this.cityList = this.provinceList[val].children;
            this.provinceValue = val;
            this.cityValue = null
        },
        //选择城市后
        async getcityVal(val) {
            this.schoolValue = null
            let json = await api.getSchoolList({
                query: {
                    sign: this.userSign,
                    province: this.provinceList[this.provinceValue].text,
                    city: this.cityList[val].text
                }
            })

            if (json.data.errcode == 200) {
                let schoolListArr = [];
                json.data.campusList.forEach((res, index) => {
                    let obj = {
                        text: res[0],
                        value: index,
                        total: res
                    }
                    schoolListArr.push(obj)
                })
                this.schoolList = schoolListArr;
            }
        },
        //选择学校之后跳转到该学校的详情
        getschoolVal(val) {
            let schoolTotal = this.schoolList[val].total;
            this.updateSchool(schoolTotal);
            this.schoolValue = val;
        },
        //搜索学校后选择返回的学校
        getSchool(schoolItem) {
            this.updateSchool(schoolItem)
        },
        async updateSchool(schoolItem) {
            if (schoolItem == this.getMineSchoolName) {
                return;
            }
            //缓存学校信息
            if (Object.prototype.toString.call(schoolItem) == '[object Array]') {
                let schoolInfo = {
                    schoolName: schoolItem[0],
                    schoolCode: schoolItem[1],
                    province: schoolItem[2],
                    education: schoolItem[3],
                    city: this.cityList[this.cityValue].text
                }

                constant.setSchoolInfo(schoolInfo);

                let json = await api.updateUserSchool({
                    query: {
                        sign: this.userSign,
                        schoolName: schoolInfo.schoolName
                    }
                })

                if (json.data.errcode == 200) {
                    this.showPopup = false;
                    this.toLogin();
                    uni.reLaunch({
                        url: '/pages/tabbel/home/home'
                    })
                }
            } else {
                if (this.getMineSchoolName == null) {
                    that.hideTop = false;
                }

                let json = await api.searchSchool({
                    query: {
                        keyword: schoolItem,
                        sign: this.userSign
                    }
                })
                if (json.data.errcode == 200) {

                    let schoolInfo = {
                        schoolName: json.data.campusList[0][0],
                        schoolCode: json.data.campusList[0][1],
                        province: json.data.campusList[0][2],
                        education: json.data.campusList[0][3],
                        city: this.cityList[this.cityValue].text
                    }

                    this.schoolInfo = schoolInfo;
                    this.getMineSchoolName = schoolItem;
                    this.avatarImgUrl = 'https://cdn4game.xunyi.online/static/SchoolLian/Badges/' + this.getMineSchoolName + '.png';
                    constant.setSchoolInfo(schoolInfo);


                    let updateJson = await api.updateUserSchool({
                        query: {
                            sign: this.userSign,
                            schoolName: schoolItem
                        }
                    })

                    if (updateJson.data.errcode == 200) {
                        uni.showToast({
                            title: "已切换至：" + this.getMineSchoolName,
                            mask: true,
                            icon: 'none'
                        })

                        this.dynamicList = []
                        this.currPage = 1;
                        this.toLogin();
                        that.getDynamicList(this.currPage)
                        that.getChatRoom();
                    }
                }
            }
        },
        touchstart() {
        },
        touchmove(e) {
            if (this.currentTab == 0) {
                return;
            }
            new Promise((resolve, reject) => {
                this.getMineSchoolName = constant.getSchoolInfo().schoolName;
                if (this.getMineSchoolName != '') {
                    this.hideTop = false;
                    this.chatMakeTopShow = true;
                }
                resolve();
            }).then(schoolName => {
                const query = uni.createSelectorQuery().in(this);
                query.select('.swiper').boundingClientRect(data => {
                    that.swiperHeight = that.viewHeight - data.top;
                    that.otherViewHight = data.top;
                }).exec();
            })
        },
        touchend() {
        },
        //切换导航和左右滑动
        changeSwiper(e) {
            let index = e.detail.current;
            if (this.getMineSchoolName != null) {
                if (index == 2 && constant.getSchoolInfo().schoolName == null) {
                    this.showPopup = true;
                    return;
                }
            } else {
                if (index == 1 && constant.getSchoolInfo().schoolName == null) {
                    this.showPopup = true;
                    return;
                }
            }

            // if (index == 1) {
            //     that.getDynamicList(that.currPage);
            // }

            this.$refs.navTab.longClick(index);
        },
        changeTab(index) {
            if (this.getMineSchoolName != null) {
                if (index == 2 && constant.getSchoolInfo().schoolName == null) {
                    this.showPopup = true;
                    return;
                }
            } else {
                if (index == 1 && constant.getSchoolInfo().schoolName == null) {
                    that.getDynamicList(that.currPage);
                    this.showPopup = true;
                    return;
                }
            }
            this.currentTab = index;
        },
        // 上划加载更多
        loadMore() {
            if (this.currentTab == 0) {
                this.allDynamicCurrPage++;
                this.getTotalDynaicList(this.allDynamicCurrPage);
                that.$refs.hideLoading[0].loadOver()
            } else if (this.currentTab == 1) {
                this.currPage++;
                this.getDynamicList(this.currPage);
                that.$refs.hideLoading[1].loadOver()
            } else if (this.currentTab == 2) {
                this.getChatRoom();
            }
            // 请求新数据完成后 组件内loadOver()方法
            // this.$refs.loadRefresh.loadOver()
        },
        // 下拉刷新数据列表
        refresh(b) {
            if (this.currentTab == 0) {
                this.totalDynamicList = []
                this.allDynamicCurrPage = 1;
                this.getTotalDynaicList(this.allDynamicCurrPage);
            } else if (this.currentTab == 1) {
                this.dynamicList = []
                this.currPage = 1;
                this.getDynamicList(this.currPage);
            } else if (this.currentTab == 2) {
                this.getChatRoom();
            }
        },
        dynimicScroll(e) {
            if (e.detail.scrollTop < 300) {
                this.chatMakeTopShow = false;
            }
            if (this.getMineSchoolName != null) {
                if (!this.chatMakeTopShow) {
                    if (e.detail.scrollTop > 300) {
                        if (this.getMineSchoolName != '') {
                            this.hideTop = true
                        }

                        const query = uni.createSelectorQuery().in(this);
                        query.select('.swiper').boundingClientRect(data => {
                            that.swiperHeight = that.viewHeight - data.top;
                            that.otherViewHight = data.top;
                        }).exec();

                    } else if (e.detail.scrollTop < 300) {
                        new Promise((resolve, reject) => {
                            this.getMineSchoolName = constant.getSchoolInfo().schoolName;
                            if (this.getMineSchoolName != '') {
                                this.hideTop = false
                            }
                            resolve();
                        }).then(schoolName => {
                            const query = uni.createSelectorQuery().in(this);
                            query.select('.swiper').boundingClientRect(data => {
                                that.swiperHeight = that.viewHeight - data.top;
                                that.otherViewHight = data.top;
                            }).exec();
                        })
                    }
                }
            }
        },

        chatScroll(e) {

            if (this.getMineSchoolName != null) {
                if (e.detail.scrollTop >= 300) {
                    if (this.getMineSchoolName != '') {
                        this.hideTop = true
                    }

                    const query = uni.createSelectorQuery().in(this);
                    query.select('.swiper').boundingClientRect(data => {
                        that.swiperHeight = that.viewHeight - data.top;
                        that.otherViewHight = data.top;
                    }).exec();

                } else if (e.detail.scrollTop < 300) {
                    new Promise((resolve, reject) => {
                        this.getMineSchoolName = constant.getSchoolInfo().schoolName;
                        if (this.getMineSchoolName != '') {
                            this.hideTop = false
                        }
                        resolve();
                    }).then(schoolName => {
                        const query = uni.createSelectorQuery().in(this);
                        query.select('.swiper').boundingClientRect(data => {
                            that.swiperHeight = that.viewHeight - data.top;
                            that.otherViewHight = data.top;
                        }).exec();
                    })
                }
            }

        },
        toPublish() {
            uni.setStorageSync('IS_PREVIEW', true);
            if (!this.getMineSchoolName) {
                this.showPopup = true;
                return;
            }
            uni.navigateTo({
                url: "/pages/publish/publish?publishType=publishDynamic"
            })
        },
        hidePopup() {
            this.showPopup = false;
        },
        //图片预览
        preViewImg(index, imgList) {
            uni.setStorageSync('IS_PREVIEW', false);
            uni.previewImage({
                current: index,
                urls: imgList
            });
        },

        async getChatRoom() {
            let json = await api.getSchoolChatRoom({
                query: {
                    sign: this.userSign,
                    schoolName: this.getMineSchoolName
                }
            })

            if (json.data.errcode == 200) {
                this.charRoomList = json.data.roomList;

                // let arr = [];
                // for (let i = 0; i < 20; i++) {
                //     arr.push(json.data.roomList[0])
                // }
                // this.charRoomList = arr;
            }
        },

        //获取所有的动态列表
        async getTotalDynaicList(totalCurrPage) {
            let totalJson = await api.getDynamicList({
                query: {
                    sign: this.userSign,
                    page: totalCurrPage,
                    type: 3
                }
            })

            if (totalJson.data.errcode == 200) {
                // uni.hideLoading();
                this.allDynamicTotalPage = totalJson.data.totalPage;
                this.totalDynamicList = [...this.totalDynamicList, ...totalJson.data.dynamicList];
                console.log('所有的动态列表', this.totalDynamicList)
            }
        },

        // 获取动态列表
        async getDynamicList(currPage) {

            // uni.showLoading();

            let json = await api.getDynamicList({
                query: {
                    sign: this.userSign,
                    page: currPage,
                    type: 0
                }
            })

            if (json.data.errcode == 200) {
                // uni.hideLoading();
                this.totalPage = json.data.totalPage;
                this.dynamicList = [...this.dynamicList, ...json.data.dynamicList]
            }
        },

        //点赞
        async support(dynamicSign) {
            console.log('dynamicSign', dynamicSign)
            let json = await api.addSupport({
                query: {
                    dynamicSign: dynamicSign,
                    sign: this.userSign
                }
            })

            uni.showToast({
                title: json.data.info,
                mask: true,
                icon: 'none'
            })

            if (json.data.errcode == 200) {
                this.totalDynamicList.forEach(res => {

                    if (res.dynamicSign == dynamicSign) {
                        this.$set(res, 'isMySupport', true)

                    }
                })
                console.log('11111111111111111111111', this.totalDynamicList)
            }
        },

        //获取我点赞的动态列表
        async getSupportList() {
            let json = await api.getSupportList({
                query: {
                    sign: this.userSign,
                    page: 1
                }
            })

            if (json.data.errcode == 200) {
                let supportList = json.data.dynamicList;
                console.log(' 我点赞的列表', supportList)

                for (let i = 0; i < this.totalDynamicList.length; i++) {
                    for (let j = 0; j < supportList.length; j++) {
                        if (this.totalDynamicList[i].dynamicSign == supportList[j].dynamicSign) {
                            this.$set(this.totalDynamicList[i], 'isMySupport', true)
                        }
                    }
                }
                console.log('22222', this.totalDynamicList)
            }
        },
        // 评论
        comment(dynamicSign) {
            uni.navigateTo({
                url: "/pages/publish/publish?publishType=commentDynamic&dynamicSign=" + dynamicSign
            })
        }
    }
}
