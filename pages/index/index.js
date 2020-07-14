import universityChoose from "../../utils/universityChoose";
import api from '../../utils/request/api'

export default {
    data() {
        return {
            keyword:'',
            universityChoose:universityChoose,
            showSelect:false,
            // searchStatus:true

        }
    },
    async onLoad() {
        const res =await api.requresyUrl({
            query: {
                                 sign: 'b3f79d05f6e372c67e375dfb05805f24572650fc' //string 必须 用户身份唯一标识
                     }
        })
        console.log(res)
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
        //院校选择器
        //打开选择器
        showSelectClick() {
            this.showSelect = true
        },
        //选择器的确定按钮
        chooseUnivercity(e) {
            uni.switchTab({
                url: '../tabbel/home/home'
            })
            console.log(e)
        }
    }
}
