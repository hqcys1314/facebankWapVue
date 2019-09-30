<template>
<div class="page" :style="'top:'+pageTop">
  <div class="box success">
    <img src="//static.facebank.cn/static/wapFront/myAccount/img/changeMobile/success.png" width="100%" alt="更换成功">
    <p class="green">更换成功</p>
    <p class="text">当前登录手机号</p>
    <p class="mobile">{{newMobile}}</p>
    <p class="desc">该手机号将用于您登录笑脸平台和接收笑脸消息提醒</p>
    <a href="javascript:;" @click="utils.resLoginHome()">
      <span class="btn_tpl">重新登录</span>
    </a>
  </div>
</div>
</template>
<style scoped src="./changeMobileSuc.css"></style>
<style scoped>
.headIos{z-index:2;}
</style>
<script>
import * as constants from './changeMobileSucConstants';
// import {bankTrans} from 'tools';
import {utils} from 'tools';
export default {
    name: constants.NAME,
    data() {
        return {
          newMobile:'',
          pageTop : '0',
        }
    },
    created () {
         this.newMobile = this.$route.query.newMobile;
         if(utils.getCookie('curDevice')=='ios'&& utils.getCookie('curVersion')=='2.7.5'){
            this.pageTop = '2.6875rem'
        }else{
            this.pageTop = '0'
        }

    },



}
</script>
