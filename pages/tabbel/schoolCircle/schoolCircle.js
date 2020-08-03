import api from '../../../utils/request/api'
import constant from "../../../utils/constant";
export default {
    data() {
        return {
            list: [
                '所有动态',
                '热门动态',
                '以书会友',
                '校园爱情',
                '百团大战',
                '约起开黑',
                '操场相见',
                '个人杂物'
            ],
            chooseTab:0,
            dynamicList:[]
        };
    },
    onLoad(){
        /*获取缓存中的个人信息*/
        this.userInfo = constant.getUserLogin();
    },
    onReady(){
        this.feachData(3)

    },
    methods:{
        /*选项卡*/
        //选项卡改变时 val`s type Nunmer
        activeTab(val){
        //     console.log('选项卡',val)
        //     switch(val) {
        //         case 0:
        //             this.forEachData(3)
        //             break;
        //         case 1:
        //             this.forEachData(3)
        //             break;
        //         case 2:
        //             this.forEachData(3)
        //             break;
        //         case 3:
        //             this.forEachData(3)
        //             break;
        //         case 4:
        //             this.forEachData(3)
        //             break;
        //         case 5:
        //             this.forEachData(3)
        //             break;
        //         case 6:
        //             this.forEachData(3)
        //             break;
        //         case 7:
        //             this.forEachData(3)
        //             break;
        //         case 8:
        //             this.forEachData(3)
        //             break;
        //         default:
        //             // 默认代码块
        //             console.log('tabs栏炸了')
        //     }
        },
        //获得所有动态
      async  feachData(e){
            // console.log(this.userInfo)
              let res = await api.getDynamicList({
                  query: {
                      sign: this.userInfo.sign,
                      page: 1,
                      type: e
                  }
              })

          this.dynamicList=res.data.dynamicList
          console.log(this.dynamicList)
        },
        //动态进行分类
        forEachData(e){
            this.dynamicList.map(val=>{
                if (val.type==e){
                    this.dynamicList=[]
                    this.dynamicList.push(val)
                }
            })
        },
    }
}
