<template>
    <li class="timeDepositLi" :class="{'saleOver':listItem.remainAmount*1<=0}" @click="toDetail(listItem)">
        <div class="li_content">
            <div class="product_name">
                <p>{{substrings(listItem.productName, 10)}}</p>
                <span v-if="listItem.isEnableFirstAddCash=='1'">首购返现</span>
                <span v-if="listItem.activityRate*1 > 0 && listItem.activityRemainTime*1 > 0">限时加息</span>
                <span v-if="listItem.saleTags != null && listItem.saleTags.length > 0 && index < tagShowCount" v-for="(it, index) in listItem.saleTags">{{substrings(it, 4)}}</span>
            </div>

            <div class="infos">
              <p class="lv">
                  <span>
                    <span><strong>{{listItem.rate}}</strong></span><i>%</i>
                    <span class="ar" v-if="listItem.activityRate*1 > 0">+<strong>{{listItem.activityRate}}</strong></span><i v-if="listItem.activityRate*1 > 0">%</i>
                  </span>
                  <i>期待年化回报率<!--<em class="iconfont icon-inf_huaban" @click="showInterestDescLayer"></em>--></i>
              </p>
              <p class="p2">
                  <span>
                    <strong>{{listItem.termCount}}</strong>
                    <font>{{listItem.termUnit == 1 ? '天' : listItem.termUnit == 3 ? '个月' : ''}}后委托转让</font>
                  </span>
                  <i v-if="listItem.remainAmount*1<=0">剩余 0元</i>
                  <i v-else>剩余
                    {{listItem.remainAmount | formatNumber2}}{{listItem.remainAmount*1 < 10000 ? '' : '万元'}}
                  </i>
              </p>

            </div>
            <a href="javascript:;" v-if="listItem.remainAmount*1<=0" class="btn_invest">已售罄</a>
            <a href="javascript:;" v-else :id="'btnInvest_'+listItem.rate" class="btn_invest"><span class="newMobile" style="display:none;"></span>出借</a>

        </div>
    </li>
</template>
<script>
    export default {
      name: 'timeDepositItem',
      props: ['listItem', 'showNavSwitch', 'limitId'],
      data(){
          return {
              canToDetailPage : true,
              tagShowCount : 3,
          }
      },
      filters : {
          formatNumber2(num){
              if(num*1<10000){
                  return '不足1万元';
              }else{
                  var nums = new Number(num)
                  //num = nums.toLocaleString()
                  return parseInt((num/10000)*100)/100;
              }
          }

      },
      created:function(){
          if(this.listItem.isEnableFirstAddCash=='1'){
              this.tagShowCount--;
          }
          if(this.listItem.activityRate*1 > 0 && this.listItem.activityRemainTime*1 > 0){
              this.tagShowCount--;
          }
      },
      methods:{
          substrings(val, len){
              if(!val) return;
              var lastVal = this.len(val) > len ? (val.substring(0,len) + '...') : val.substring(0,len)
              return lastVal;
          },
            //获取字符长度
            len : function(s){
                if(!s) return '';
                var l = 0;
                var a = s.split("");
                for (var i=0;i<a.length;i++) {
                    if (a[i].charCodeAt(0)<299){
                        l++;
                    }else{
                        l+=2;
                    }
                };
                return Math.ceil(l/2);
            },
          toDetail(listItem){
              this.utils.setCookie('currentId', '', -1);
              var _this = this;
              if(!this.canToDetailPage) return false;
              this.canToDetailPage = false;



              _this.utils.newWebView('/timeDepositDetail?id='+listItem.productId, 'noRefresh')

              /*var userInfo = _this.utils.getUserInfo();
              this.isLogin = userInfo.isLogin;
              this.isBindCard = userInfo.isBindCard;
              this.isIdValify = userInfo.isIdValify;
              if(userInfo.info.accountState=='350'){
                  this.$parent.showLayer("您的笑脸账号异常，请联系客服4008-900-766！");
                  _this.canToDetailPage = true;
                  return;
              }
              if(userInfo.info.accountState=='300'){
                  this.$parent.showLayer("您的账户状态异常，请联系客服4008-900-766！");
                  _this.canToDetailPage = true;
                  return;
              }
              if (!this.isLogin) {
                  var cburl = !this.showNavSwitch ? '?showNavSwitch=0' : '';
                  _this.utils.toLogin('/loanList'+cburl);
                  _this.canToDetailPage = true;
                  return false;
              }else if (!this.isIdValify) {
                  this.$parent.$refs.tosat.tosatShow({
                      msg : '请先完成实名 ',
                      time : 2
                  }, function(){
                      _this.utils.newWebView('/authentication?cburl=%2floanList')
                  })
                  _this.canToDetailPage = true;
                  return false;
              }else{
                  if(!_this.$parent.$refs.needActive.checkDepositoryStatus()){
                      _this.canToDetailPage = true;
                      return false;
                  }
                  // setTimeout(function(){
                  //     _this.canToDetailPage = true;
                  // },500)
                  _this.$parent.checkRiskStatus(function(riskEnable){
                      _this.canToDetailPage = true;
                      if(riskEnable){
                          _this.utils.newWebView('/timeDepositDetail?id='+listItem.productId, 'noRefresh')
                      }
                  }, true)

              }*/
          }
      }
    }
</script>
<style scoped>
li.timeDepositLi{ display:block;margin-bottom:.625rem;height:auto;overflow:hidden; background:#FFFFFF; position: relative;padding-left:1rem;}
li.timeDepositLi .li_content{border:0;padding:0 0 1.065rem 0; position: relative;}
li.timeDepositLi .product_name{line-height:3.25rem;font-size:1rem;color:#2b313d;margin-bottom:.625rem;height:auto;overflow:hidden;}
li.timeDepositLi .product_name p{float:left; white-space: nowrap;font-weight:bold;}
li.timeDepositLi .product_name span{float:left;margin-left:.4375rem;margin-top:1.125rem;border-radius:.5rem;padding:0 .375rem;line-height:1rem;font-size:.625rem;color:#B88A2D;background:#FDF2E5;}
li.timeDepositLi .box{display: block;padding:0;margin:0;}
li.timeDepositLi .btn_invest{width:3.375rem;display:block;line-height:1.625rem;font-size:.75rem; text-align:center;border:1px solid #F0484E;color:#F0484E; position: absolute;right:1rem;bottom:1.5rem;border-radius:1.08rem;}
li.timeDepositLi .btn_invest:active{background:#F0484E;color:#FFFFFF;}
li.timeDepositLi .infos{ display: block;;height:auto;overflow:hidden;}
li.timeDepositLi p{float:left;min-width:4.8125rem;}
li.timeDepositLi p span{ display: block;line-height:2rem;color:#848899;font-size:.6875rem;height: 2rem;margin-bottom:.1875rem;}
li.timeDepositLi p span span{display:inline-block;padding-top:.5rem;font-size:.875rem;}

li.timeDepositLi p strong{font-family:Arial, Microsoft YaHei;}
li.timeDepositLi p i{font-style: normal; display: block;font-size:.6875rem;line-height:1.5;color:#848999;}
li.timeDepositLi p span i{font-size:1rem;font-style:normal;line-height:1;color:#F0484E;display:inline-block;}
li.timeDepositLi .lv{width:9.125rem;float:left;}
li.timeDepositLi .lv span{color:#F0484E;}
li.timeDepositLi .lv span span{padding-top:0rem;height:2rem;line-height:2rem;font-size:1.875rem;}
li.timeDepositLi .lv span span.ar{padding-top:0rem;height:2rem;line-height:2rem;font-size:1.375rem;}
li.timeDepositLi .p2{padding-top:.5rem;}
li.timeDepositLi .p2 span{line-height:1.5rem;height:1.5rem;}
li.timeDepositLi .p2 strong{color: #2b313d;}
li.timeDepositLi .p2 span strong{font-size: 1.375rem;}
li.timeDepositLi .p2 font{}
li.timeDepositLi span.newMobile{width:2.3125rem;height:1rem; position: absolute;right:-.6875rem;top:-.6875rem;background:url("~assets/wapFront/invest/img/firstIcon.png") no-repeat center center/100% 100%;}



li.timeDepositLi.saleOver .lv span{color:#848999;}
li.timeDepositLi.saleOver .p2 strong{color:#848999;}
li.timeDepositLi.saleOver .btn_invest{border-color:#BCC2CC;color:#BCC2CC;}
li.timeDepositLi.saleOver .btn_invest:active{background:#FFFFFF;color:#BCC2CC;}
li.timeDepositLi.saleOver p span i{color:#848999}
</style>
