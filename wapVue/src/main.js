// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource  from 'vue-resource'
import App from './App.vue'
import router from './router'
//import Vuex from 'vuex'
import {utils, currency, Modal,globalVariable} from 'tools';
import mobileFit from 'tools/mobileFit';
import httpErrorTips from './httpErrorTips.html';
//import $ from 'jquery';
import "babel-polyfill";
//import store from './store/store'
import tosat from 'components/tosat'
import needActive from 'components/needActive'
import depositoryEntering from 'components/depositoryEntering'
import contactUs from 'components/contactUs'
import moneyInput from 'components/moneyInput'
import tipLayer from 'components/tipLayer'
import layerAgreement from 'components/layerAgreement'
import fullLoading from 'components/fullLoading'
import smileLoading from 'components/smileLoading'
import feedbackEntrance from 'components/feedbackEntrance'
import services from 'components/services'
import loadingMoreData from 'components/loadingMoreData'
import empty from 'components/empty'
import footerButtonToLoanList from 'components/footerButtonToLoanList'


//Vue.use(Vuex)
Vue.use(mobileFit);
//Vue.use(Router)
Vue.use(VueResource);
Vue.use(utils);
Vue.use(globalVariable);
Vue.use(tosat);
Vue.use(needActive);
Vue.use(depositoryEntering);
Vue.use(contactUs);
Vue.use(moneyInput);
Vue.use(tipLayer);
Vue.use(layerAgreement);
Vue.use(fullLoading);
Vue.use(smileLoading);
Vue.use(feedbackEntrance);
Vue.use(services);
Vue.use(loadingMoreData);
Vue.use(empty);
Vue.use(footerButtonToLoanList);

Vue.filter('toFixed', utils.toFixed);
Vue.filter('currency', utils.currency);
Vue.filter('formatThousandth', utils.formatThousandth);
Vue.component('depositoryEntering', depositoryEntering);
Vue.config.productionTip = false;
Vue.prototype.utils = utils;
Vue.prototype.globalVariable=globalVariable;


// require('./assets/wapFront/common/css/common.css')
/* eslint-disable no-new */

//初始化ajax
$.ajaxSetup({
	dataType : 'JSON',
	type : 'POST',
	processData :true,
	xhrFields:{withCredentials: true },
	crossDomain: true,
	timeout : 15000,
	contentType : 'application/json',
	complete:function(XMLHttpRequest,textStatus){
	 //通过XMLHttpRequest取得响应结果
		var response = XMLHttpRequest.responseJSON;
		//var disableTips=XMLHttpRequest.getAllResponseHeader.disableTips;
		try{
			if(response.code=='-853'){
                utils.setCookieAll('mic_sessionid', '');
			}
		}catch(e){}
 	},
	error: function(XMLHttpRequest, textStatus) {
		if(textStatus == 'error'){
      utils.toastFuc('网络请求错误，请稍候重试');
		}else if(textStatus == 'timeout'){
      utils.toastFuc('网络请求超时，请稍候重试');
		}
    }

})

let vue = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
});
