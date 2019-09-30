<template>
    <div id="directInvestSuccess"  v-cloak>
      <div class="part1">
          <p class="p_img"><img src="~assets/wapFront/invest/img/sc_ok.png"></p>
          <p class="p_text">出借成功!</p>
          <p class="p-center" v-if="resuleData.assetType==60&&resuleData.productType==3&&resuleData.fpRainbowPrjId>0">出借成功即起息<br>还款方式:等额本息</p>
          <p class="p-center" v-if="resuleData.assetType!=60&&resuleData.productType==3&&resuleData.fpRainbowPrjId>0">开始起息:满标后一个自然日内<br>还款方式:等额本息</p>
          <p class="p-center" v-if="resuleData.assetType==60&&resuleData.productType==4&&resuleData.fpRainbowPrjId>0">开始起息:满标当日<br>还款方式:等本等息 </p>
          <ul>
              <li>
                  <p class="p1">{{resuleData.investAmount}}</p>
                  <p class="p2">出借金额(元)</p>
              </li>
              <li>
                  <p class="p1">
                      {{toFixed(resuleData.allInterest)}}
                  </p>

                  <p class="p2">预期总回报(元)
                      <span class="sensors-btn" sensors-name="预期利息" v-on:click="shouyi()">
                      <img src="~assets/wapFront/invest/img/suc_wenhao.png" width="15px" height="15px">
                  </span>
                </p>
              </li>
          </ul>

      </div>
      <a class="part2" v-if="userInfo.userAutoBiddingState" :href="'//partner'+urlTest+'.facebank.cn/partner_plan'">
          <img src="//static.facebank.cn/static/wapFront/invest/img/success-share.png">
      </a>
      <a class="part2" v-else  href="javascript:;" @click="utils.newWebView('/automaticBidding')"><img src="//static.facebank.cn/static/wapFront/common/images/automaticBidding/banner_autoBidding.png?v=2"></a>
      <feedbackEntrance :rids="resuleData.orderId" sourceType="bulk-standard-success" type="1"></feedbackEntrance>
      <div style="height: 4rem;"></div>
      <div class="part3">
          <a class="btn_tpls" @click="toLoanlist()">继续出借
          </a>
          <a class="btn_tpls" @click="toAccount()">我的账户
          </a>
      </div>
      <div class="wapMc" v-show="wapMcStatus" style="display:block">
      </div>
      <div class="wapPos" v-show="shouyiStatus" style="display:block">
          <div class="wapTip">
              <div class="div-value">
                  <p>应收利息<span class="span-right"><font>{{resuleData.basicInterest}}</font>元</span></p>
                  <p v-if="resuleData.redBagInterest>0">卡券奖励<span class="span-right"><font>{{resuleData.redBagInterest}}</font>元</span></p>
                  <p v-if="resuleData.redAmountInterest>0">卡券奖励<span class="span-right"><font>{{resuleData.redAmountInterest}}</font>元</span></p>
                  <p v-if="resuleData.cardInterest>0">卡券奖励<span class="span-right"><font>{{resuleData.cardInterest}}</font>元</span></p>
                  <p v-if="resuleData.firstInterestValue> 0">首购返现奖励<span class="span-right"><font>{{resuleData.firstInterestValue}}</font>元</span></p>
                  <p v-if="resuleData.vipInterest> 0">会员加息奖励<span class="span-right"><font>{{resuleData.vipInterest}}</font>元</span></p>
                  <p v-if="resuleData.prjInterestVal> 0">项目加息奖励<span class="span-right"><font>{{resuleData.prjInterestVal}}</font>元</span></p>

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
<style scoped src="./directInvestSuccess.css">
</style>
<script>
  import {utils,Modal} from 'tools';

  export default {
    name: 'directInvestSuccess',
    data(){
       return{
         investAmount:5,
         investInterest:'1',
         isloadingShow:false,
         loadingTime:5,
         wapMcStatus:false,
         productType:'',
         assetType:0,
         allInterest:0,
         fpRainbowPrjId:'',
         shouyiStatus:false,
         basicInterest:'',
         firstInterestValue:'',
         prjInterestVal:'',
         redBagInterest:'',
         redAmountInterest:'',
         vipInterest:'',
         urlTest:utils.URLSET,
		 userInfo : '',		 sShowTkAward:false,       }
    },
    created:function(){
        this.$options.methods.loading.bind(this)();
        /*this.investId = this.$route.params.investId;
        this.allInterest=this.$route.params.allInterest;
        this.fpRainbowPrjId=this.$route.params.fpRainbowPrjId;
        this.productType=this.$route.params.productType;
        this.redAmountInterest=this.$route.params.redAmountInterest;
        this.redBagInterest=this.$route.params.redBagInterest;
        this.firstInterestValue=this.$route.params.firstInterestValue;
        this.basicInterest=this.$route.params.basicInterest;
        this.vipInterest=this.$route.params.vipInterest;
        this.investAmount=this.$route.params.investAmount;
        this.assetType=this.$route.params.assetType;*/
        this.resuleData = this.$route.params.allInterest ? this.$route.params : JSON.parse(utils.getCookie('directConSuc'));
        console.log(this.resuleData)
		this.userInfo = utils.getUserInfo().info;

		//保单页面返回时不展示保单弹框backShowTk==1
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
    methods:{
        toPromoPage(){
            this.wapMcStatus=false;
            this.isShowTkAward=false;
            this.utils.newWebViewAll('https://promo'+this.urlTest+'.facebank.cn/policy?token='+this.resuleData.cacheKey)
            //window.location.href=
            window.event.returnValue=false;
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
          toAccount : function(){
              utils.setCookie('orderId_success', '')
              utils.toAccount()
          },
          toLoanlist : function(){
              utils.setCookie('orderId_success', '')
              this.utils.toLoanlist()
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
