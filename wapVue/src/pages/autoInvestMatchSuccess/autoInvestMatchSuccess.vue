<template>
  <div  v-cloak id="autoInvestSuccess" >
       <div class="part1">
           <p class="p_img"><img src="~assets/wapFront/invest/img/sc_ok.png"></p>
           <p class="p_text">出借成功!</p>
           <p class="p-center"  v-if=" bidType==3">开始起息:满标后一个工作日内<br>还款方式:等额本息，每月还本付息</p>
           <ul>
               <li>
                   <p class="p1">{{resuleData.realAmount}}</p>
                   <p class="p2">出借金额(元)</p>
               </li>
               <li>
                   <p class="p1">{{currency(resuleData.allInterest)}}</p>
                   <p class="p2">预期总回报(元)
                       <span  class="sensors-btn" sensors-name="预期利息" v-on:click="shouyi()">
                       <img src="~assets/wapFront/register/img/tipi.png" width="15px" height="15px">
                       </span>
                 </p>
               </li>
           </ul>

       </div>
       <a class="part2" v-if="userInfo.userAutoBiddingState" :href="'//partner'+urlTest+'.facebank.cn/partner_plan'">
           <img src="//static.facebank.cn/static/wapFront/invest/img/success-share.png">
       </a>
       <a class="part2" v-else  href="javascript:;" @click="utils.newWebView('/automaticBidding')"><img src="//static.facebank.cn/static/wapFront/common/images/automaticBidding/banner_autoBidding.png?v=2"></a>
       <feedbackEntrance :rids="resuleData.orderId" sourceType="intelligent-recommendationj-success" type="1"></feedbackEntrance>
       <div style="height: 4rem;">

       </div>
       <div class="part3">
           <a class="btn_tpls" @click="toLoanlist()">继续出借</a>
           <a class="btn_tpls" @click="toAccount()">我的账户</a>
       </div>
       <div class="wapMc" v-show="wapMcStatus" style="display:block">
       </div>
       <div class="wapPos" v-show="shouyiStatus" style="display:block">
           <div class="wapTip">
               <div class="div-value">
                   <p>应收利息<span class="span-right"><font>{{currency(resuleData.baseInterest)}}</font>元</span></p>
                   <p v-if="resuleData.activityInterest>0">限时加息奖励<span class="span-right"><font>{{currency(resuleData.activityInterest)}}</font>元</span></p>
                   <p v-if="resuleData.redPackageAmount>0">卡券奖励<span class="span-right"><font>{{currency(resuleData.redPackageAmount)}}</font>元</span></p>
                   <p v-if="resuleData.cardInterest>0">卡券奖励<span class="span-right"><font>{{currency(resuleData.cardInterest)}}</font>元</span></p>
                   <p v-if="resuleData.vipInterest>0">会员加息奖励<span class="span-right"><font>{{currency(resuleData.vipInterest)}}</font>元</span></p>
                   <p v-if="resuleData.firstAddCash>0">首购返现奖励<span class="span-right"><font>{{currency(resuleData.firstAddCash)}}</font>元</span></p>

               </div>
               <p class="p3" v-on:click="closeTk()">
                   知道了
               </p>
           </div>
       </div>

       <div class="loading" v-show="isloadingShow">
          <img src="~assets/wapFront/common/img/loading.gif">
          <p>正在为您加载奖励内容&nbsp;&nbsp;(<span>{{loadingTime}}s</span>)</p>
       </div>
       <!-- 三重礼奖励  -->
       <div class="tkAward" v-show="isShowTkAward">
           <a class="close" @click="closeTk()"><img src="https://static.facebank.cn/static/wapFront/activity2018/robRedbag/img/close.png" alt=""/></a>
           <img class="headImg" src="https://static.facebank.cn/static/wapFront/newUser/img/tkAward.png" alt="">
           <h3>30元手机话费</h3>
           <p>话费已充值到您的注册手机{{resuleData.mobile}}中</p>
           <h3>“笑脸护航”阳光交通工具意外伤害险</h3>
           <p>保险责任：航空意外险100万、火车意外险50万<br>
             公共汽车意外险50万、轮船意外险20万<br>
             保险期限：3个月<br>
             保险责任于领取次日零时生效</p>
             <p style="margin-top:0.5rem;border:0;">阳光保单可进入「我的」-「我的任务」，在特 殊任务中，找到保险任务，即可查看保单。</p>
             <a class="btn" @click="toPromoPage()" href="javascript:;">
               <img src="https://static.facebank.cn/static/wapFront/newUser/img/btn.png" alt="">
             </a>

       </div>
 </div>
</template>

<style src="./autoInvestMatchSuccess.css" scoped></style>

<script>
  import * as constants from './autoInvestMatchSuccessConstants';
  import {utils,Modal} from 'tools';

  export default {
    name: constants.NAME,
    data() {
      return {
           isloadingShow:false,
           loadingTime:3,
           wapMcStatus:false,
           bidType:'',
           shouyiStatus:false,
           allInterest : '',
           realAmount : '',
           resuleData : {},
           redPackageAmount : '',
   	    	 investAmount : '',
           vipInterest : '',
           baseInterest:'',
           urlTest:utils.URLSET,
			isShowTkAward:false,
            userInfo : ''
        }
    },
    created:function () {
         this.$options.methods.loading.bind(this)();
         this.resuleData = this.$route.params.allInterest ? this.$route.params : JSON.parse(utils.getCookie('autoConSuc'));
		 this.userInfo = utils.getUserInfo().info;//保单页面返回时不展示保单弹框backShowTk==1
         this.isQualifiedForRewards = eval(this.resuleData.isQualifiedForRewards)
         if(this.utils.getCookie('isShowTkAward') != 'true'){
             if(this.$route.query.backShowTk&&this.$route.query.backShowTk==1){
               this.wapMcStatus=false;
               this.isShowTkAward=false;
               utils.setCookie('isShowTkAward', 'false')
             }else if(this.resuleData.isQualifiedForRewards){
                this.wapMcStatus=true;
                this.isShowTkAward=true;
                utils.setCookie('isShowTkAward', 'true')
             }else{
               this.wapMcStatus=false;
               this.isShowTkAward=false;
               utils.setCookie('isShowTkAward', 'false')
             }
         }
     },
    methods: {
      currency:function(number){
              return Number(number).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
          },
          toPromoPage(){
              this.wapMcStatus=false;
              this.isShowTkAward=false;
              this.utils.newWebViewAll('https://promo'+this.urlTest+'.facebank.cn/policy?token='+this.resuleData.cacheKey)
              //window.location.href=
              window.event.returnValue=false;
          },
        toAccount : function(){
            utils.setCookie('orderId_success', '')
            utils.toAccount()
        },
        toLoanlist : function(){

            utils.setCookie('orderId_success', '')
            this.utils.toLoanlist()
        },
        loading:function(){
              var _self=this;
              setInterval(
                      function(){
                          if( _self.loadingTime>0){
                              _self.loadingTime--;
                          }else{
                              _self.isloadingShow=false;
                          }
                      }
                      ,1000)
            },
            shouyi:function(){
              this.shouyiStatus=true;
              this.wapMcStatus=true;

            },
            closeTk:function(){
                  this.shouyiStatus=false;
                  this.wapMcStatus=false;
                  this.isShowTkAward=false;
            },
            toFixed:function(number, digit){
                var numbers = number || 0,
                    digits = digit || 2;
              return Number(numbers).toFixed(digits);
            }

    }
  }
</script>
