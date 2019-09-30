<template>
    <div id="timeDepositSuccess" class="timeDepositSuccess"  v-cloak>
        <div class="success_box">
            <img src="//static.facebank.cn/static/wapFront/depository/img/duigouSuc.png" />
            <p class="p1">出借完成</p>
            <p class="p2">¥{{utils.currency(resuleData.investAmount)}}</p>
            <p class="p3">预期总回报{{resuleData.allInterest}}元</p>
        </div>
        <div class="matchInfoList">
            <dl>
                <dt>锁定期</dt>
                <dd>{{resuleData.termCount}}{{resuleData.termUnit == 1 ? '天' : resuleData.termUnit == 3 ? '个月' : ''}}</dd>
            </dl>
            <dl>
                <dt>出借日期</dt>
                <dd>{{formatDate(decodeURIComponent(resuleData.publishTime))}}</dd>
            </dl>
            <dl>
                <dt>解锁日期</dt>
                <dd>{{formatDate(decodeURIComponent(resuleData.investEndDate))}}</dd>
            </dl>
            <dl>
                <dt>退出方式</dt>
                <dd>自动委托平台转让退出</dd>
            </dl>
        </div>

        <div class="ad_area">
            <a v-if="userInfo.userAutoBiddingState" @click="utils.newWebViewAll('//partner'+utils.URLSET+'.facebank.cn/partner_plan')">
                <img src="//static.facebank.cn/static/wapFront/invest/img/success-share.png">
            </a>
            <a class="part2" v-else-if="!userInfo.userAutoBiddingState"  href="javascript:;" @click="utils.newWebView('/automaticBidding')"><img src="//static.facebank.cn/static/wapFront/common/images/automaticBidding/banner_autoBidding.png?v=2"></a>
            <feedbackEntrance :rids="resuleData.orderId" sourceType="closed-period-success" type="1"></feedbackEntrance>
        </div>

        <!-- 三重礼奖励  -->
        <div class="tkAward" v-show="isShowTkAward" style="z-index:101">
            <a class="close" @click="closeTk()"><img src="https://static.facebank.cn/static/wapFront/activity2018/robRedbag/img/close.png" alt=""/></a>
            <img class="headImg" src="https://static.facebank.cn/static/wapFront/newUser/img/tkAward.png" alt="">
            <h3>30元手机话费</h3>
            <p>话费已充值到您的注册手机{{decodeURIComponent(resuleData.mobile).replace('|', '****')}}中</p>
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
        <div class="layerMask" v-show="isShowTkAward" v-cloak></div>

        <footer class="button_area" :class="{'static' : hasStatic}">
            <a class="btn_tpls btn_tpls2 short" v-on:click="toLoanlist()">继续出借</a>
            <a class="btn_tpls short" v-on:click="toAccount()">返回我的账户</a>
        </footer>
    </div>
</template>
<style scoped src="./timeDepositSuccess.css"></style>
<script>

  export default {
    name: 'timeDepositSuccess',
    data(){
        return{
            hasStatic : false,
            isShowTkAward : false,
            resuleData : '',
            userInfo : '',
            isQualifiedForRewards : false,
        }
    },
    created:function(){
        //this.$options.methods.loading.bind(this)();
        this.resuleData = this.$route.query.allInterest ? this.$route.query : JSON.parse(this.utils.getCookie('tiemDepositConSuc'));
		this.userInfo = this.utils.getUserInfo().info;
        this.isQualifiedForRewards = eval(this.resuleData.isQualifiedForRewards)
        this.resizeBtnPos();
        if(this.utils.getCookie('isShowTkAward') != 'true'){
            if(this.$route.query.backShowTk&&this.$route.query.backShowTk==1){
                this.isShowTkAward=false;
                this.utils.setCookie('isShowTkAward', 'false')
            }else if(this.isQualifiedForRewards){
                this.isShowTkAward=true;
                this.utils.setCookie('isShowTkAward', 'true')
            }else{
                this.isShowTkAward=false;
                this.utils.setCookie('isShowTkAward', 'false')
            }
        }
    },
    mounted:function(){
        var _this = this;
        window.addEventListener('resize', function(){
            _this.resizeBtnPos()
        }, false)
    },
    methods:{
        toPromoPage(){
            this.isShowTkAward=false;
            this.utils.newWebViewAll('https://promo'+this.utils.URLSET+'.facebank.cn/policy?token='+this.resuleData.cacheKey)
            //window.location.href=
            window.event.returnValue=false;
        },
        formatDate : function(date){
            return date.replace('|', '年').replace('|', '月').replace('|', '日')
        },
          closeTk : function(){
              this.isShowTkAward = false;
          },
          toAccount : function(){
              this.utils.setCookie('orderId_success', '')
              this.utils.toAccount()
          },
          toLoanlist : function(){
              this.utils.setCookie('orderId_success', '')
              this.utils.toLoanlist()
          },
          resizeBtnPos : function(){
              var winHeight = window.innerHeight;
              if(winHeight < 35 * (window.innerWidth / 750 * 32)){
                  this.hasStatic = true;
              }else{
                  this.hasStatic = false;
              }
          }

    }
  }
</script>
