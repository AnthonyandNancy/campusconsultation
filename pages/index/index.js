import universityChoose from "../../utils/universityChoose";
import api from '../../utils/request/api';
import msDropdownItem from '../../components/ms-dropdown/dropdown-item';
import msDropdownMenu from '../../components/ms-dropdown/dropdown-menu';
import constant from '../../utils/constant';

export default {
    data() {
        return {
            bgImg: "",
            keyword: '',
            universityChoose: universityChoose,
            showSelect: false,
            // searchStatus:true
            provinceList: [{text: "请选择市", value: 0}],
            cityList: [{text: "请选择市", value: 0}],
            schoolList: [{text: "请选学校", value: 0}],
            provinceValue: 0,
            cityValue: 0,
            schoolValue: 0,
            userSign:''
        }
    },
    components: {
        msDropdownItem,
        msDropdownMenu
    },
    async onLoad() {
        // if (Object.keys(constant.getSchoolInfo()).length != 0) {
        //     console.log(Object.keys(constant.getSchoolInfo()).length != 0)
        //
        // }
        //获取用户sign

        this.getUserSign = constant.getUserSign();
        this.bgImg = wx.getFileSystemManager().readFileSync('/static/images/bg1.jpg', "base64");
        this.provinceList = universityChoose;
    },
    methods: {
        //测试调到tabbal
        toTabbel() {
            console.log('挑战了')
        },
        //搜索框搜索
        //文件改变时搜索
        handelSearch() {
            console.log('改变了')
        },
        //按搜索时搜索
        search() {
            uni.switchTab({
                url: '../tabbel/home/home'
            })
            console.log('搜索了')
        },
        //选择省份后
        getprovinceVal(val) {
            //获取该省份的相关城市
            this.cityList = this.provinceList[val].children;
            this.provinceValue = val;

            //将选择的下标置空，不会导致刚打开就是选中状态
            this.cityValue = null;
        },
        //选择城市后
        async getcityVal(val) {
            this.schoolValue = null;
            this.cityValue = val;
             let json = await api.getSchoolList({
                 query:{
                     sign:this.getUserSign,
                     province:this.provinceList[this.provinceValue].text,
                     city:this.cityList[val].text
                 }
             })
            if(json.data.errcode == 200){
                let schoolListArr = [];
                json.data.campusList.forEach((res,index)=>{
                    let obj = {
                        text:res[0],
                        value:index,
                        total:res
                    }
                    schoolListArr.push(obj)
                })
                this.schoolList = schoolListArr;
            }
        },
        //选择学校之后跳转到该学校的详情
        getschoolVal(index) {

            // //缓存学校信息
            // let schoolInfo = {
            //     schoolName:this.schoolList[index].total[0],
            //     schoolCode:this.schoolList[index].total[1],
            //     province:this.schoolList[index].total[2],
            //     education:this.schoolList[index].total[3],
            //     city:this.cityList[this.cityValue].text
            // }
            // constant.setSchoolInfo(schoolInfo);

            uni.switchTab({
                url: '../tabbel/home/home'
            })
        },
        //选择学校
        showSelectClick() {
            this.showSelect = true
        },
    }
}
