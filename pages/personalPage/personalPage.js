import api from "../../utils/request/api";
import constant from "../../utils/constant";
import universityChoose from "../../utils/universityChoose";
import msDropdownMenu from '../../components/ms-dropdown/dropdown-menu';
import msDropdownItem from '../../components/ms-dropdown/dropdown-item';
import uniSearchBar from '../../components/uni-search-bar/uni-search-bar'

export default {
    components: {
        msDropdownMenu,
        msDropdownItem,
        uniSearchBar
    },
    data() {
        return {
            //个人信息
            schoolName:'',
            userAvater:'',
            userNickName:'',
            userSign:'',
            // personalSignature:'清华人清华魂，来世还做清华人',
            personalName:null,
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
            chooseSex:null,
            personalAge:null,
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
            schoolTotal:[],
            showRegion:false,
            // regionList:
            chooseRegion:'',
            chooseSexNum:null,
            province:'',
            city:'',
            country: '',
        };
    },
    onLoad(option){
        //修改顶部导航
        uni.setNavigationBarTitle({
            title: '个人信息'
        });
        uni.getStorage({
            key: 'USER_LOGIN',
            success:  (res) =>{
                // console.log('USER_LOGIN>>>>>>>>',res.data);
                let data=res.data
                this.schoolName=data.schoolName
                this.userAvater=data.pic
                this.personalName=data.name
                this.userSign=data.sign
                this.personalAge=data.age
                let sex=data.gender
                if(sex ==1){
                    this.chooseSex='男'
                    this.chooseSexNum=1
                }else if(sex ==2) {
                    this.chooseSex='女'
                    this.chooseSexNum=2
                }else if (sex ==null || sex == 0){
                    uni.getStorage({
                        key: 'USER_INFO',
                        success:  (res) =>{
                            // console.log('USER_INFO',res.data);
                            let sexInfo=res.data.gender
                            if(sexInfo ==1){
                                this.chooseSex='男'
                                this.chooseSexNum=1
                            }else if(sexInfo ==2) {
                                this.chooseSex = '女'
                                this.chooseSexNum = 2
                            }else if (sexInfo ==null || sexInfo == 0){
                                this.chooseSex='请选择性别'
                            }else {
                                console.log('他是胡一菲')
                            }
                        }
                    });
                }else {
                    console.log('他是胡一菲')
                }
            }
        });
        // uni.getStorage({
        //     key: 'SCHOOL_INFO',
        //     success:  (res) =>{
        //         // console.log('SCHOOL_INFO>>>>>>>>',res.data);
        //         let data=res.data
        //         this.schoolName=data.schoolName
        //     }
        // });

        
        uni.getStorage({
            key: 'USER_INFO',
            success:  (res) =>{
                // console.log('USER_INFO',res.data);
                this.chooseRegion=res.data.province+'  '+res.data.city
                this.province=res.data.province
                this.city=res.data.city
                this.country=res.data.country
                this.userNickName=res.data.nickName
            }
        });
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
            // console.log(val[0])
            if (val[0] ==0){
                this.chooseSex='男'
                this.chooseSexNum=1
            }else {
                this.chooseSex='女'
                this.chooseSexNum=2
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
            if(this.keyword.value == ''){
                this.showCell = false;
                this.showSelect = false;
            }

            this.showCell = true;
            this.showSelect = true;

            if (this.keyword == '') {
                this.showSelect = false;
            }else{
                // let keyword=this.keyword
                this.keyword.value = this.keyword.value.replace(/[^\u4E00-\u9FA5]/g, ''); // 清除除了中文以外的输入的字符
                if (this.keyword.value==''||this.keyword.value ==null || this.keyword.value ==undefined){
                    return
                }else {
                    // console.log(this.keyword)
                    let json = await api.searchSchool({
                        query: {
                            keyword: this.keyword.value,
                            sign: this.userSign
                        }
                    })
                    console.log(json)
                    if (json.data.errcode == 200) {
                        this.searchSchoolList = json.data.campusList
                    }
                }
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
            if(this.keyword.value != ''){
                return
            }
            this.showCell = false
            this.showSelect = false;
        },
        getSchool(val){
            console.log(val)
            this.schoolName=val[0]
            this.showPopup=false
            constant.setIsUpdateData(true)
            // this.searchSchoolList
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
            // console.log('>>>>>>>>>>>',schoolTotal)
            this.schoolName=schoolTotal[0]
            //确定按钮
            // this.updateSchool(schoolTotal);
            this.schoolValue = val;
            this.showPopup=false
        },
        async updateSchool(schoolItem) {
            let oldSchoolName=constant.getUserLogin().schoolName
            if (oldSchoolName==this.schoolName) {
                console.log('>>>>>>>>>>>',schoolItem)
                // console.log('>>>>>>>>>',this.schoolName)
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
                        schoolName: this.schoolName
                    }
                })
                console.log('15616545',json)
                if (json.data.errcode == 200) {
                    console.log('第一个200',schoolItem)
                    this.showPopup = false;
                    let userInfo=constant.getUserLogin()
                    userInfo.schoolName=this.schoolName
                    constant.setUserLogin(userInfo)
                    this.toLogin();
                    // uni.reLaunch({
                    //     url: '/pages/tabbel/home/home'
                    // })
                }
            } else {
                if (this.schoolName == null) {
                    this.hideTop = false;
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
                    // this.schoolName = schoolItem[0];
                    console.log('第二个200',schoolItem)
                    this.avatarImgUrl = 'https://cdn4game.xunyi.online/static/SchoolLian/Badges/' + this.schoolName + '.png';
                    constant.setSchoolInfo(schoolInfo);

                    let updateJson = await api.updateUserSchool({
                        query: {
                            sign: this.userSign,
                            schoolName: this.schoolName
                        }
                    })
                        console.log('>>>>>>>>>>>',updateJson)
                    if (updateJson.data.errcode == 200) {
                        console.log('第三个200',schoolItem)
                        let userInfo=constant.getUserLogin()
                        userInfo.schoolName=this.schoolName
                        constant.setUserLogin(userInfo)
                        uni.showToast({
                            title: "已切换至：" + this.schoolName,
                            mask: true,
                            icon: 'none'
                        })

                        this.dynamicList = []
                        this.currPage = 1;
                        this.toLogin();
                        constant.setIsUpdateData(true)
                        // this.getDynamicList(this.currPage)
                        // this.getChatRoom();
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
                // console.log('市辖区？》》》》',val)
                this.chooseRegion=val.province.label+'  '+val.area.label
            }else{
                // console.log('不是市辖区？》》》》',val)
                this.chooseRegion=val.province.label+'  '+val.city.label
            }

        },
        //取消
        cancelPop(){
            this.showPopup=false
        },
        //保存信息
      async  save(){
            let that = this;
            const res=await api.updateUserInfo({
                query:{
                    sign:this.userSign,
                    name:this.personalName,
                    pic:this.userAvater,
                    gender:this.chooseSexNum,
                    country: this.country,
                    province: this.province,
                    city:this.city,
                    age:this.personalAge
                }
            })

            if(res.data.errcode == 200){
                uni.showToast({
                    title:'保存成功',
                    icon:'none',
                    mask: true
                })

                let times = 0;
                let timers = setInterval( () =>{
                    times++;

                    uni.showToast({
                        title:'更新中...',
                        icon:'loading',
                        mask:true
                    })

                    if(times==3){
                        console.log(times)
                        uni.showToast({
                            title:'更新完成',
                            mask:true,
                            duration:4000,
                            success:()=>{

                                this.updateSchool(this.schoolTotal)
                                this.toLogin();

                                clearInterval(timers);
                                timers = null;
                                uni.navigateBack();
                            }
                        })




                    }
                    // console.log(times)
                },1000)



            }


        }
    }
}
