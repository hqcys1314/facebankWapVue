<template>
  <div id="app">
    <div class="headIos" v-if="showHeader">
        <a href="javascript:history.go(-1)">
            <img src="~assets/wapFront/common/img/jiantou.png">
        </a>
        笑脸金融
    </div>
      <!-- 路由匹配到的组件将渲染在这里 -->
      <router-view></router-view>
   </div>
</template>

<script>
import {utils,Modal,globalVariable} from 'tools';
import 'assets/wapFront/common/css/common.css';
import 'assets/css/common.less';
import 'assets/fonts/iconfont.css';
export default {
  name: 'app',
  data(){
    return{
      showHeader:true,
     }
  },
  beforeCreate:function(){
      if(utils.IsPC){
          window.location.href="https://www.facebank.cn/"
      }


    //将设备号及版本号写进cookies
    var curDevice = this.$route.query.curDevice;
    var curVersion = this.$route.query.curVersion;
    //是否开启了全wap 1开启  0未开启
    var isShowAllWap = this.$route.query.isShowAllWap;

    if(typeof isShowAllWap !== "undefined" && isShowAllWap && isShowAllWap != '' && isShowAllWap != null){
        utils.setCookie('isShowAllWap', isShowAllWap);
    }
    if(typeof curDevice !== "undefined" && curDevice && curDevice != '' && curDevice != null){
           utils.setCookie('curDevice', curDevice);
    }
    if(typeof curVersion !== "undefined" && curVersion && curVersion != '' && curVersion != null){
           utils.setCookie('curVersion', curVersion);
    }
  },
  created:function () {
      if(utils.IsPC){
          window.location.href="https://www.facebank.cn/"
      }
    //将设备号及版本号写进cookies
    var curDevice = this.$route.query.curDevice;
    var curVersion = this.$route.query.curVersion;
    //是否开启了全wap 1开启  0未开启
    var isShowAllWap = this.$route.query.isShowAllWap;
    if(typeof isShowAllWap !== "undefined" && isShowAllWap && isShowAllWap != '' && isShowAllWap != null){
        utils.setCookie('isShowAllWap', isShowAllWap);
    }
    if(typeof curDevice !== "undefined" && curDevice && curDevice != '' && curDevice != null){
           utils.setCookie('curDevice', curDevice);
    }
    if(typeof curVersion !== "undefined" && curVersion && curVersion != '' && curVersion != null){
           utils.setCookie('curVersion', curVersion);
    }

    var pathname=window.location.pathname;
    if(utils.getCookie('curDevice')=='ios'&& utils.getCookie('curVersion')=='2.7.5'&&
        pathname.indexOf('/home')=='-1'&&pathname.indexOf('/loanList')=='-1'
        &&pathname.indexOf('/account')=='-1'&&pathname.indexOf('/transactionRecord')=='-1'&&pathname.indexOf('/repaymentCalendarMicroMessager')=='-1'&&pathname.indexOf('/repaymentCalendar')=='-1'){
      this.showHeader=true;
    }else{
      this.showHeader=false;
    }
    if(document.getElementById('zhichiBtnBox'))
    document.getElementById('zhichiBtnBox').style.display="none";

  },
  mounted:function(){
    var pathname=window.location.pathname;
    if(utils.getCookie('curDevice')=='ios'&& utils.getCookie('curVersion')=='2.7.5'&&
        pathname.indexOf('/home')=='-1'&&pathname.indexOf('/loanList')=='-1'
        &&pathname.indexOf('/account')=='-1'&&pathname.indexOf('/transactionRecord')=='-1'&&pathname.indexOf('/repaymentCalendarMicroMessager')=='-1'&&pathname.indexOf('/repaymentCalendar')=='-1'){
      this.showHeader=true;
    }else{
      this.showHeader=false;
    }

  },
  beforeUpdate:function(){
    //将设备号及版本号写进cookies
    var curDevice = this.$route.query.curDevice;
    var curVersion = this.$route.query.curVersion;
    //是否开启了全wap 1开启  0未开启
    var isShowAllWap = this.$route.query.isShowAllWap;
    if(typeof isShowAllWap !== "undefined" && isShowAllWap && isShowAllWap != '' && isShowAllWap != null){
        utils.setCookie('isShowAllWap', isShowAllWap);
    }
    if(typeof curDevice !== "undefined" && curDevice && curDevice != '' && curDevice != null){
           utils.setCookie('curDevice', curDevice);
    }
    if(typeof curVersion !== "undefined" && curVersion && curVersion != '' && curVersion != null){
           utils.setCookie('curVersion', curVersion);
    }
    var pathname=window.location.pathname;
    if(utils.getCookie('curDevice')=='ios'&& utils.getCookie('curVersion')=='2.7.5'&&
        pathname.indexOf('/home')=='-1'&&pathname.indexOf('/loanList')=='-1'
        &&pathname.indexOf('/account')=='-1'&&pathname.indexOf('/transactionRecord')=='-1'&&pathname.indexOf('/repaymentCalendarMicroMessager')=='-1'&&pathname.indexOf('/repaymentCalendar')=='-1'){
      this.showHeader=true;
    }else{
      this.showHeader=false;
    }
  },
  update:function(){
    //将设备号及版本号写进cookies
    var curDevice = this.$route.query.curDevice;
    var curVersion = this.$route.query.curVersion;
    //是否开启了全wap 1开启  0未开启
    var isShowAllWap = this.$route.query.isShowAllWap;
    if(typeof isShowAllWap !== "undefined" && isShowAllWap && isShowAllWap != '' && isShowAllWap != null){
        utils.setCookie('isShowAllWap', isShowAllWap);
    }
    if(typeof curDevice !== "undefined" && curDevice && curDevice != '' && curDevice != null){
           utils.setCookie('curDevice', curDevice);
    }
    if(typeof curVersion !== "undefined" && curVersion && curVersion != '' && curVersion != null){
           utils.setCookie('curVersion', curVersion);
    }

    var pathname=window.location.pathname;
    if(utils.getCookie('curDevice')=='ios'&& utils.getCookie('curVersion')=='2.7.5'&&
        pathname.indexOf('/home')=='-1'&&pathname.indexOf('/loanList')=='-1'
        &&pathname.indexOf('/account')=='-1'&&pathname.indexOf('/transactionRecord')=='-1'&&pathname.indexOf('/repaymentCalendarMicroMessager')=='-1'&&pathname.indexOf('/repaymentCalendar')=='-1'){
      this.showHeader=true;
    }else{
      this.showHeader=false;
    }
    document.getElementById('zhichiBtnBox').style.display="none";

  },

}
</script>
