export default {
    data() {
        return {
            list: [
                {
                    name: '热门动态'
            },
                {
                    name: '所有动态'
            },
                {
                    name: '所有动态'
                },
                {
                    name: '所有动态'
                },
                {
                    name: '所有动态'
                },
                {
                    name: '所有动态'
                },
                {
                    name: '所有动态'
                },
                {
                    name: '所有动态'
                },
                {
                    name: '所有动态'
                },
                {
                    name: '所有动态'
                },


            ],
            tabs:[
                {
                    title:'4545454'
                },
                {
                    title:'4545454'
                },
                {
                    title:'4545454'
                },
                {
                    title:'4545454'
                }, {
                    title:'4545454'
                },


            ],
            // 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
            current: 0, // tabs组件的current值，表示当前活动的tab选项
            swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
        };
    },
    methods:{
        /*滑动栏swiper*/
        // tabs通知swiper切换
        tabsChange(index) {
            console.log('tabs通知swiper切换',index)
            this.current=index
            this.swiperCurrent = index;
        },
        // swiper-item左右移动，通知tabs的滑块跟随移动
        transition(e) {
            console.log('swiper-item左右移动，通知tabs的滑块跟随移动',e)
            let dx = e.detail.dx;
            this.$refs.uTabs.setDx(dx);
        },
        // 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
        // swiper滑动结束，分别设置tabs和swiper的状态
        animationfinish(e) {
            console.log(' swiper滑动结束，分别设置tabs和swiper的状态',e)
            // let current = e.detail.current;
            let current=this.list.length
            this.$refs.uTabs.setFinishCurrent(current);
            // this.swiperCurrent = current;
            // this.current = current;
        },
        // scroll-view到底部加载更多
        onreachBottom() {

        }
    }
}
