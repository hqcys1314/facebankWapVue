<template>
  <div id="preInvestSuccess" v-cloak>
    <div class="part1">
        <p class="p_img"><img src="~assets/wapFront/invest/img/sc_ok.png"></p>
        <p class="p_text">转投预约成功</p>
        <p class="p_time">预计生效时间{{expectedEffectiveDate }}</p>
        <p class="p_time">预计起息时间{{startInterestDate }}</p>
        <ul>
            <li>
                <p class="p1">{{newOrder.preInvestAmount}}</p>
                <p class="p2">出借金额(元)</p>
            </li>
            <li>
                <p class="p1">{{interestAmount}}</p>
                <p class="p2">预计收益(元)<span><img src="~assets/wapFront/common/img/tip_i.png" v-on:click="shouyiTip()"></span></p>
            </li>
        </ul>

    </div>
    <div class="part3">
        <router-link class="btn_tpls" :to="{ path: '/regularPlanRecord'}">确认</a>
        </router-link>
    </div>
    <div class="wapMc" v-show="wapMcTk">
    </div>

    <div class="loading"  v-show="loadingStatus">
        <img src="~assets/wapFront/common/img/loading.gif">
    </div>
    <div class="wapPos" v-show="expectedReturnShowStatus">
        <div class="wapTip">
            <div class="div-title">
                预期收益：<font>{{interestAmount}}</font>元
            </div>
            <div class="div-value">
                <p>基本收益({{product.rate}}%)<span class="span-right"><font>{{newOrder.expectedBaseInterest}}</font>元</span></p>
                <p v-if="redPkgType==2">加息红包收益({{redPkgRate}}%)<span class="span-right"><font>{{redPkgAmount}}</font>元</span></p>
                <p v-if="redPkgType==1">返现红包收益<span class="span-right"><font>{{redPkgAmount}}</font>元</span></p>
                <p v-if="newOrder.expectedVipInterest > 0">会员加息收益({{vipRate}}%)
                  <span class="span-right">
                    <font>{{newOrder.expectedVipInterest}}</font>元</span>
                  </p>
            </div>
            <div class="div-rule">
                <ul>
                    <li>1. “会员加息”可能会因转投生效时会员等级的上升而向上浮动；</li>
                    <li>2. 当转投生效时符合“首购加息”条件，则享受“首购加息”；</li>
                    <li>3. 本次转投的实际年化收益率以转投生效为准。</li>
                </ul>
            </div>
            <p class="p3" v-on:click="closeTk()">
                知道了
            </p>
        </div>
    </div>
  </div>
</template>
<style scoped src="./preInvestSuccess.css">
</style>
<script>
    export default {
      name: 'preInvestSuccess',
      data () {
            return {
              wapMcTk:false,
              loadingStatus : false,
              expectedEffectiveDate:'',
              startInterestDate:'',
              newOrder:'',
              interestAmount:'',
              product:'',
              redPkgType:'',
              redPkgRate:'',
              redPkgAmount:'',
              vipRate:'',
              goodsList:'',
              loadingJsonUrl:'/wap/preInvestSuccess',
              expectedReturnShowStatus:false,
            }
        },
        components:{},//这里注册
        created:function () {
              this.$http.get(this.loadingJsonUrl).then(function(res){
                      if ((res.data != null) && (res.data != "")){
                          this.goodsList=eval(res.data);
                      }

              },function(res){
                          console.warn(res);
              });

        },
        methods: {
            shouyiTip:function(){
              this.expectedReturnShowStatus=true;
              this.wapMcTk=true;
            },
            closeTk:function(){
              this.expectedReturnShowStatus=false;
              this.wapMcTk=false;
            }
        }
  }

</script>
