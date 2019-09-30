import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state:{
      count:0,
      paybackList:'',//还款日历
      isCctShow:'',//还款日历
  },
  getters:{
       // 参数列表state指的是state数据
       getPaybackList(state){
           return state.paybackList;
       },
       getIsCctShow(state){
           return state.isCctShow;
       },
   },
  mutations:{
      setPaybackList(state, value){
              state.paybackList = value;//将传参设置给state的city
      },
      setIsCctShow(state, value){
              state.isCctShow = value;//将传参设置给state的city
      }
  }
})
