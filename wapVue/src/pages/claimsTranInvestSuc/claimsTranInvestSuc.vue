<template>
  <div id="claimsTranInvestSuc" class="claimsTranInvestSuc"  v-cloak>
    <div class="success_box">
      <img src="//static.facebank.cn/static/wapFront/depository/img/duigouSuc.png" />
      <p class="p1">出借完成</p>
      <p class="p2">¥{{resuleData.remainAmount|currency}}</p>
      <p class="p3">预期总回报{{resuleData.allInterest|currency}}元</p>
    </div>
    <div class="matchInfoList">
      <dl>
        <dt>获得债权价值</dt>
        <dd>{{resuleData.amount|currency}}元</dd>
      </dl>
      <dl>
        <dt>还款方式</dt>
        <dd>{{resuleData.repaymentText}}</dd>
      </dl>
      <dl>
        <dt>剩余期限</dt>
        <dd>{{resuleData.remainDays}}天
         </dd>
      </dl>

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
      <a class="btn_tpls btn_tpls2 short" v-on:click="utils.toLoanlist()">继续出借</a>
      <a class="btn_tpls short" v-on:click="utils.toAccount()">返回我的账户</a>
    </footer>
  </div>
</template>
<style scoped src="./claimsTranInvestSuc.less"></style>
<script>

  export default {
    name: 'claimsTranInvestSuc',
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
      this.resuleData =this.$route.query;
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
        window.event.returnValue=false;
      },

      closeTk : function(){
        this.isShowTkAward = false;
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
