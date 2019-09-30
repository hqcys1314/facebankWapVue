<template>
    <li class="subjecLi">
        <div class="box" v-on:click="toDirectInvestDetail(listItem.productId)">
            <h2>{{listItem.productName | unescapeHtml}}
                <span class="repayment_type">{{repaymentTypeFont[listItem.repaymentType]}}</span>
            </h2>
            <div class="infos">
              <p class="lv">
                  <span>
                    <span><strong>{{listItem.rate}}</strong></span><i>%</i>
                  </span>
                  <i>借款合同约定年化利率</i>
              </p>
              <p class="p2">
                  <span>
                    <strong>{{listItem.termCount}}</strong>
                    <font>{{listItem.termUnit==1 ? '天' : listItem.termUnit==3 ? '个月' : ''}}期限</font>
                  </span>
                  <i>可出借
                    {{listItem.remainAmount | formatNumber}}{{listItem.remainAmount*1 < 10000 ? '元' : '万元'}}
                  </i>
              </p>
            </div>
        </div>
        <a v-on:click="toInvestConfirmPage(listItem.productId)" class="btn"><span class="newMobile" v-if="listItem.isEnableFirstAddCash=='1'"></span>出借</a>
    </li>

</template>
<script>
import {utils} from 'tools';
    export default {
      name: 'subjectLiItem',
      data (){
          return {
              repaymentTypeFont : ['','先息后本','一次性还本付息','等额本息','等本等息','等额本息'],
              productId : '',
              isBindCard : false,
              isIdValify : false
          }
      },
      props: ['listItem', 'isLogin'],
      filters : {
          formatNumber(num){
              if(num*1<10000){
                  return num;
              }else{
                  return parseInt((num/10000)*100)/100;
              }
          },
          unescapeHtml : function(html){
              var div = document.createElement('div');
              div.innerHTML = html;
              var str = div.innerHTML;
              return str;
          }
      },
      created(){
          this.curDevice = utils.getCookie('curDevice');
          this.curVersion = utils.getCookie('curVersion');
      },
      methods:{
          //标的跳转详情页
          toDirectInvestDetail: function (productId) {
              var _this = this;

              setTimeout(function(){
                  utils.newWebView("/directInvestDetail?productId="+ productId);
              },300)
          },
          getProductInfo(callBack){
              var _this = this;
              $.ajax({
                  url : utils.AJAXDOMAINNAME+ '/wap/product/productDetail',
                  data: '{"productId":"' + _this.productId + '"}',
                  success: function(res) {
                      if (res.code == 1) {
                          if(typeof callBack == 'function') callBack(res.data)
                      }else{
                          _this.$parent.showLayer(res.message)
                      }
                  }
              })
          },
          toInvestConfirmPage : function(productId){
              var _this = this;


              var userInfo = utils.getUserInfo();
              this.isLogin = userInfo.isLogin;
              this.isBindCard = userInfo.isBindCard;
              this.isIdValify = userInfo.isIdValify;
              this.productId = productId;
              if(userInfo.info.accountState=='350'){
                  this.$parent.showLayer("您的笑脸账号异常，请联系客服4008-900-766！");
                  return;
              }
              if(userInfo.info.accountState=='300'){
                  this.$parent.showLayer("您的账户状态异常，请联系客服4008-900-766！");
                  return;
              }
              if (!this.isLogin) {
                  utils.toLogin('/loanList');
                  return false;
              }else if (!this.isIdValify) {
                  _this.$parent.tosatFn({
                      msg : '请先完成实名',
                      path: '/authentication',
                      cburl : '/loanList'
                  })
              }else{
                  if(!_this.$parent.$refs.needActive.checkDepositoryStatus()) return false;
                  _this.getProductInfo(function(detail){
                      if(detail.remainAmount * 1 == 0){
                          _this.$parent.showLayer('当前标的已出借')
                      }else{
                          //风险等级验证
                          if(detail.isSupportInvest*1 == 0){
                              _this.$parent.showRiskLayer(detail.riskWarningMsg, 'subject')
                          }else{
                              utils.newWebView("/directInvestConfirm?productId="+productId)
                          }
                      }
                  })

              }
          },
      }
    }
</script>
<style scoped>
li.subjecLi{ display:block;margin-bottom:.625rem;height:auto;overflow:hidden; background:#FFFFFF;padding:0 1rem 1.0625rem 1rem; position: relative;}
li.subjecLi .box{ display: block;padding:0;margin:0;}
li.subjecLi .btn{width:3.375rem;line-height:1.625rem;font-size:.75rem; text-align:center;border:1px solid #F0484E;color:#F0484E; position: absolute;right:1rem;bottom:2rem;border-radius:1.08rem;height:1.625rem;}
li.subjecLi .btn:active{background:#F0484E;color:#FFFFFF;}
li.subjecLi h2{ display:block;line-height:3.25;font-size:1rem;color:#2F323D;font-weight:bold;margin-bottom:.625rem;}
li.subjecLi h2 .repayment_type{line-height:1rem;font-size:.75rem; text-align:center;padding:0.1rem 0.3rem;border:1px solid #DFE3EB; display:inline-block;margin-left:.5rem;;border-radius:1rem;color:#848999;font-weight: 200;}
li.subjecLi .infos{ display: block;;height:auto;overflow:hidden;}
li.subjecLi p{float:left;min-width:4.8125rem;}
li.subjecLi p span{ display: block;line-height:2rem;color:#848899;font-size:.6875rem;height: 2rem;margin-bottom:.1875rem;}
li.subjecLi p span span{display:inline-block;padding-top:.5rem;font-size:.875rem;}
li.subjecLi p strong{font-family:Arial, Microsoft YaHei;}
li.subjecLi p i{font-style: normal; display: block;font-size:.6875rem;line-height:1.5;color:#848999;}
li.subjecLi p span i{font-size:1rem;font-style:normal;line-height:1;color:#F0484E;display:inline-block;}
li.subjecLi .lv{width:10.375rem;float:left;}
li.subjecLi .lv span{color:#F0484E;}
li.subjecLi .lv span span{padding-top:0rem;height:2rem;line-height:2rem;font-size:1.875rem;}
li.subjecLi .p2{padding-top:.5rem;}
li.subjecLi .p2 span{line-height:1.5rem;height:1.5rem;}
li.subjecLi .p2 strong{color: #2b313d;}
li.subjecLi .p2 span strong{font-size: 1.375rem;}
li.subjecLi .p2 font{color: #2b313d;}
li.subjecLi .btn .newMobile{width:2.3125rem;height:1rem; position: absolute;right:-.6875rem;top:-.6875rem;background:url("~assets/wapFront/invest/img/firstIcon.png") no-repeat center center/100% 100%;}

</style>
