import tenxunMap from '../../utils/mapSDK/qqmap-wx-jssdk';
import api from "../../utils/request/api";
import constant from "../../utils/constant";

import msDropdownMenu from '../../components/ms-dropdown/dropdown-menu';
import msDropdownItem from '../../components/ms-dropdown/dropdown-item';
import uniSearchBar from '../../components/uni-search-bar/uni-search-bar.vue'

import universityChoose from '../../utils/universityChoose';

let qqMapWX, that;
export default {
    components:{
        msDropdownMenu,
        msDropdownItem,
        uniSearchBar
    },
    data() {
        return {
            userSign: '',
            getSchoolList: [],
            isAuthor:Boolean,
            showPopup: false,//显示弹窗
            keyword:'',
            searchSchoolList:[],//搜索出来的学校列表
            showCell:false,
            provinceList: [{text: "请选择省", value: 0}],
            cityList: [{text: "请选择市", value: 0}],
            schoolList: [{text: "请选学校", value: 0}],
            showSelect: false,
            provinceValue: 0,
            cityValue: 0,
            schoolValue: 0,
        }
    },
    onLoad() {

        if(constant.getUserLogin().schoolName != null){
            uni.switchTab({
                url:'/pages/tabbel/home/home'
            })
        }

        that = this;
        qqMapWX = new tenxunMap({
            key: 'GA7BZ-CJ4WJ-O65F3-KYEJZ-ROAU5-2FBTY'
        })
    },
    onReady() {
        this.getCurLocation()
        this.isAuthor = constant.getIsAuthor();
        this.provinceList = universityChoose
    },
    methods: {
        //授权
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
        //获取学校列表
        getCurLocation() {
            // 选择位置信息 uni.chooseLocation({})
            //自动获取当前的位置信息 只获取经纬度
            uni.getLocation({
                type: 'wgs84',
                geocode: true,
                success: function (res) {
                    let long = res.longitude;//经度
                    let lat = res.latitude;//维度
                    //获取详细定位，中文地址
                    qqMapWX.reverseGeocoder({
                        location: {
                            longitude: long,
                            latitude: lat
                        },
                        success: async (res) => {
                            that.userSign = constant.getUserSign();
                            let province = res.result.ad_info.province;
                            let city = res.result.ad_info.city;
                            //获取该地址的学校信息
                            let schoolJson = await api.getSchoolList({
                                query: {
                                    sign: that.userSign,
                                    province: province,
                                    city: city
                                }
                            })

                            if (schoolJson.data.errcode == 200) {
                                let obj = {};
                                schoolJson.data.campusList.forEach((res, index) => {
                                    if (index > 10){
                                        return;
                                    }
                                    obj = {
                                        schoolName: res[0],
                                        schoolPic: 'https://game.xunyi.online/static/SchoolLian/Badges/' + res[0] + '.png'
                                    }
                                    if(res[0] != '广东技术师范大学天河学院'){
                                        that.getSchoolList.push(obj)
                                    }

                                })
                            }
                        },
                        fail: (err) => {
                            console.log('获取详细的地址 fail', err)
                        }
                    })
                }
            });
        },
        //查看更多学校
        showMoreSchool(){
            this.showPopup = true;
        },
        //选择学校后直接跳回首页
        selectSchool(schoolName){
            this.updateSchool(schoolName);

            uni.switchTab({
                url:'/pages/tabbel/home/home'
            })
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
            this.updateSchool(schoolTotal[0]);
            this.schoolValue = val;
        },
        async updateSchool(nameVal){
            let json = await api.updateUserSchool({
                query:{
                    sign: this.userSign,
                    schoolName: nameVal
                }
            })
            if(json.data.errcode == 200){
                this.toLogin();
                uni.switchTab({
                    url:'/pages/tabbel/home/home'
                })
            }
        },
        getFocus(){
            this.showSelect = true;
        },
        toBlus(){
            if(this.keyword != ''){
                return
            }
            this.showSelect = false;
        },
        async handelSearch(obj) {
            this.keyword = obj.value;
            setTimeout((res)=>{},1000)

            if(this.keyword == ''){
                this.showCell = false;
                return
            }

            let json = await api.searchSchool({
                query: {
                    keyword: this.keyword,
                    sign: this.userSign
                }
            })
            if (json.data.errcode == 200) {
                this.showCell = true;
                this.toLogin();
                this.searchSchoolList = json.data.campusList;
            }
        },
    }
}
