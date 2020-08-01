import api from "../../utils/request/api";
import constant from "../../utils/constant";
import universityChoose from "../../utils/universityChoose";
import msDropdownMenu from '../../components/ms-dropdown/dropdown-menu';
import msDropdownItem from '../../components/ms-dropdown/dropdown-item';

export default {
    components: {
        msDropdownMenu,
        msDropdownItem,
    },
    data() {
        return {
            //个人信息
            schoolName:'',
            userAvater:'',
            userNickName:'Anthony哈哈哈',
            userSign:'',
            personalSignature:'清华人清华魂，来世还做清华人',
            personalName:'彭于晏',
            sex:[
                {
                    value:'男',
                    id:0
                },
                {
                    value:'女',
                    id:1
                }
            ],
            showSex:false,
            chooseSex:'男',
            personalAge:'26',
            showPopup:false,
            showCell: false,
            showSelect: false,
            keyword: '',
            searchSchoolList:[],
            provinceValue: 0,
            cityValue: 0,
            schoolValue: 0,
            // 下拉选择列表变量 start
            provinceList: [{text: "请选择省", value: 0}],
            cityList: [{text: "请选择市", value: 0}],
            schoolList: [{text: "请选学校", value: 0}],
            schoolTotal:'',
            showRegion:false,
            // regionList:
            chooseRegion:'广东省  广州市'
        };
    },
    onLoad(option){
        //修改顶部导航
        uni.setNavigationBarTitle({
            title: '个人信息'
        });
        //个人信息
        console.log('个人信息页面',option)
        this.schoolName=option.schoolName
        this.userAvater=option.userAvater
        // this.userNickName=option.userNickName
        this.userSign=option.userSign
    },
    onShow(){
        //获取城市数据
        this.provinceList = universityChoose;
    },
    methods:{
        //选择性别
        clickSex(){
            this.showSex=true
        },
        confirmSex(val){
            console.log(val[0])
            if (val[0] ==0){
                this.chooseSex='男'
            }else {
                this.chooseSex='女'
            }
        },
        cancelSex(){
            this.showSex=false
        },
        //选择学校
        clickSchoolName(){
            this.showPopup = true;
        },
        hidePopup() {
            this.showPopup = false;
        },
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
        search() {
          console.log('按了搜搜')
        },
        //输入框聚焦
        getFocus() {
            this.showSelect = true;
        },
        toBlus() {
            this.showSelect = false;
        },
        // 用户不是新用户，但缓存中没有学校的信息数据
        async getSchoolInfo() {
            let json = await api.searchSchool({
                query: {
                    keyword: this.schoolName,
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
            this.schoolTotal=this.schoolList[val].total;
            //确定按钮
            // this.updateSchool(schoolTotal);
            this.schoolValue = val;
        },
        async updateSchool(schoolItem) {
            if (schoolItem == this.schoolName) {
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
                if (this.schoolName == null) {
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
                    this.schoolName = schoolItem;
                    this.avatarImgUrl = 'https://cdn4game.xunyi.online/static/SchoolLian/Badges/' + this.schoolName + '.png';
                    constant.setSchoolInfo(schoolInfo);


                    let updateJson = await api.updateUserSchool({
                        query: {
                            sign: this.userSign,
                            schoolName: schoolItem
                        }
                    })

                    if (updateJson.data.errcode == 200) {
                        uni.showToast({
                            title: "已切换至：" + this.schoolName,
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
        //地区
        clickRegion(){
            this.showRegion=true
        },
        confirmRegion(val){
            // console.log('地区？》》》》',val)
            if (val.city.label == "市辖区"){
                console.log('市辖区？》》》》',val)
                this.chooseRegion=val.province.label+'  '+val.area.label
            }else{
                console.log('不是市辖区？》》》》',val)
                this.chooseRegion=val.province.label+'  '+val.city.label
            }

        },
    }
}
