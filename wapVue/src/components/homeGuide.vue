<template>
  <div class="guide" v-bind:class="{'guide1':!isLogin,'guide2':isLogin}">
      <ul>
          <li  v-show="!isInvested" v-on:click="utils.newWebView('/newWelfare')">
                <i class="iconfont icon-ic_redbag"></i>
                <p class="sensors-btn" sensors-name="wap首页-新手福利">新手福利</p>
          </li>

          <li  v-show="isInvested"  v-on:click="utils.newWebViewAll('https://partner'+utils.URLSET+'.facebank.cn/partner_plan')">
              <a>
                <i class="iconfont icon-ic_invite"></i>
                <p class="sensors-btn" sensors-name="wap首页-邀请有奖">邀请有奖</p>
              </a>
          </li>

          <li v-on:click="utils.newWebViewAll('https://cms'+utils.CMSSET+'.facebank.cn/safe.html')">
             <a>
                  <i class="iconfont icon-ic_guarantee"></i>
                  <p  class="sensors-btn" sensors-name="wap首页-安全保障">安全保障</p>
            </a>
          </li>
          <li v-on:click="sign()" v-show="isLogin">
              <i class="iconfont icon-ic_sign"></i>
              <p class="sensors-btn" sensors-name="wap首页-签到">每日签到</p>
          </li>
          <li v-on:click="utils.newWebViewAll('https://cms'+utils.CMSSET+'.facebank.cn/plwapIndex.html')">
             <i class="iconfont icon-ic_disclosure"></i>
             <p  class="sensors-btn" sensors-name="wap首页-信息披露">信息披露</p>
          </li>
          <!-- <li v-show="!isLogin">
              <a :href="'https://cms'+utils.CMSSET+'.facebank.cn/wapHelpNew.html'">
                  <i class="iconfont icon-ic_help"></i>
                  <p>帮助中心</p>
             </a>
          </li> -->

      </ul>
      <div class="wapPos" v-show="showTipsLayer">
         <div class="wapTip">
             <!-- <div class="p-title"></div> -->
             <div class="cash" v-html="tipsLayerContent"></div>
             <div class="btn_area">
                 <p class="p3" @click="closeTipsLayer()">知道了</p>
             </div>
         </div>
      </div>
      <div class="wapMc" v-show="showTipsMask" @click="closeTipsLayer()"></div>
      <toastMessage :istoastMessageShow="isTmShow" :toastTime="tTime" :message="tMsg"></toastMessage>

  </div>
</template>

<script>
import {utils} from'tools'
import toastMessage from 'components/toastMessage';

export default {
  name: 'homeGuide',
  data (){
      return {
          showTipsLayer : false,
          showTipsMask : false,
          tipsLayerContent : '',
          isTmShow:false,//是否展示吐司
          tTime:2000,//吐司时间
          tMsg:'',
      }
  },
  components:{toastMessage},
  props: ['isLogin','isInvested'],
  methods : {
    sign(){
      //签到
      var _this=this;
      if(utils.getUserInfo().isLogin){
        $.ajax({
            url : utils.AJAXDOMAINNAME+"/wap/user/signIn",
            success : function(res){
              if(res.code==1){
                if(res.data.status == '200'){
                    _this.tMsg = '本次签到获得<span>'+ res.data.points +'</span>个笑脸币<br/>已连续签到<span>'+ res.data.count +'</span>天(7天/周期)'
                }else if(res.data.status == '2001'){
                    _this.tMsg = '已签到'
                }else{
                    _this.tMsg = '签到失败'
                }
                _this.isTmShow=true;
                var self=_this;
                setTimeout(
                        function () {
                            _this.isTmShow=false;
                            //utils.newWebViewAll('https://promo'+utils.URLSET+'.facebank.cn/SnatchRedEnvelope/index');
                }, 2000);
              }

            }
        })
      }else{
         _this.$router.push({path: '/regOrlogin'});
      }
    },
    closeTipsLayer(){
      this.showTipsLayer = false;
      this.showTipsMask = false;
      this.layerDatas = {};
    }
  }
}

</script>
<style scoped>
/*引导*/
.guide {
  background-color: #ffffff;
}
.guide ul {
  margin-left: 5%;
  margin-right: 5%;
  overflow: hidden;
  padding-top: 0.8rem;
}
.guide ul li {
  float: left;
  text-align: center;
}
.guide1 ul li {
  float: left;
  width: 33%;
  text-align: center;
}
.guide2 ul li {
  float: left;
  width: 25%;
  text-align: center;
}
.guide ul li i {
  font-size: 1.688rem;
}
.guide ul li i.icon-ic_redbag{
	color:#fb8c29;
}
.guide ul li i.icon-ic_invite{
	color:#ff6420;
}
.guide ul li i.icon-ic_help {
  color: #ef6a6a;
}
.guide ul li i.icon-ic_disclosure {
  color: #ff9d2a;
}
.guide ul li i.icon-ic_guarantee {
  color: #4ab2f8;
}
.guide ul li i.icon-ic_sign {
  color: #ff621e ;
}
.guide ul li p {
  margin-top: 0.2rem;
  margin-bottom: 0.6rem;
  font-size: 0.75rem;
}

    .guide .wapPos{position:fixed;left: 0;top:50%;z-index: 22;  width: 100%; -webkit-transform:translateY(-50%); transform:translateY(-50%)}
    .guide .wapPos .p-title{margin: 0rem auto;color: #2b313d;font-size: 1.1rem;text-align: center;}
    .guide .wapPos .cash{margin: 0;text-align: center;padding:2rem;}
    .guide .wapPos .cash span{color:#f0484e}
    .guide .wapPos .btn_area{ display:flex;display:-webkit-flex; text-align:center;flex-wrap: nowrap;}
    .guide .wapPos .btn_area p{ display:block;border-right:1px solid #ddd}
    .guide .wapPos .btn_area p:last-child{border-right:0;color:#848999;}
</style>
