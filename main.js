import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import api from "./utils/request/api";
import constant from "./utils/constant";

Vue.use(uView);


Vue.prototype.$recorderManager = uni.getRecorderManager();
Vue.prototype.$innerAudioContext = uni.createInnerAudioContext();
Vue.prototype.$innerAudioContext.autoplay = true;
Vue.prototype.$voicePath = ''

Vue.config.productionTip = false

Vue.prototype.toLogin = () => {
    uni.login({
        success: async res => {
            let {errMsg, code} = res;
            if (errMsg == "login:ok") {
                let json = await api.getLogin({
                    query: {
                        code: code,
                        version: '1.0'
                    }
                })
                let {errcode} = json.data;
                if (errcode == 200) {
                    constant.setUserSign(json.data.sign);
                    constant.setUserLogin(json.data);
                    console.log('11111111111111111111111111111111111111111111111',json.data)
                }
            }
        }
    })
}


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
