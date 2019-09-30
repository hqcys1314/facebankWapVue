<template>
    <li class="cliamTransLi"  v-on:click="toClaimsTranInvestDetail(listItem.oriOrderId)">
        <div class="box">
            <h2>
              <span class="repayment_type">{{repaymentTypeFont[listItem.repaymentType]}}</span>
              <span>{{listItem.productName | unescapeHtml}}</span>
                <span class="discountIcon">折让{{listItem.discountFeeRate}}%</span>
            </h2>
            <div class="infos">
              <p class="lv">
                  <span>
                    <span><strong>{{listItem.rate}}</strong></span><i>%</i>
                  </span>
                  <i>原标年化</i>
              </p>
              <p class="p2">
                  <span>
                    <strong>{{listItem.remainDays}}</strong>天剩余期限
                  </span>
                  <i>出让价格
                    {{listItem.remainAmount | formatNumber}}{{listItem.remainAmount*1 < 10000 ? '元' : '万元'}}
                  </i>
              </p>
            </div>
        </div>
        <a  class="btn"><span class="newMobile" v-if="listItem.isEnableFirstAddCash=='1'"></span>出借</a>
    </li>

</template>

<script>
import {utils} from 'tools';
    export default {
      name: 'cliamTransListItem',
      data (){
          return {
              repaymentTypeFont : ['','先息后本','一次性还本付息','等额本息','等本等息','等额本息'],
              oriOrderId : '',
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
        toClaimsTranInvestDetail: function (oriOrderId) {
              var _this = this;

              setTimeout(function(){
                  utils.newWebView("/claimsTranInvestDetail?oriOrderId="+ oriOrderId);
              },300)
          },

      }
    }
</script>
<style scoped>
li.cliamTransLi{ display:block;margin-bottom:.625rem;height:auto;overflow:hidden; background:#FFFFFF;padding:0 1rem 1.0625rem 1rem; position: relative;}
li.cliamTransLi .box{ display: block;padding:0;margin:0;}
li.cliamTransLi .btn{width:3.375rem;line-height:1.625rem;font-size:.75rem; text-align:center;border:1px solid #F0484E;color:#F0484E; position: absolute;right:1rem;bottom:2rem;border-radius:1.08rem;height:1.625rem;}
li.cliamTransLi .btn:active{background:#F0484E;color:#FFFFFF;}
li.cliamTransLi h2{ display:block;padding: 1rem 0;font-size:1rem;color:#2F323D;font-weight:bold;margin-bottom:.625rem;overflow: hidden;}
li.cliamTransLi h2 .repayment_type{line-height:1rem;font-size:.75rem; text-align:center;padding:0.1rem 0.3rem;float: right;
  border:1px solid #DFE3EB; display:inline-block;margin-left:.5rem;;border-radius:1rem;color:#848999;font-weight: 200;}
li.cliamTransLi h2 span{float: left;}
li.cliamTransLi h2 .discountIcon{color: #B88A2D;font-size: 0.625rem;background: #FDF2E5;margin-top: 0.1rem;margin-left: 0.2rem;
  border-radius:2rem;padding: 0 0.4rem 0.2rem;}
li.cliamTransLi .infos{ display: block;;height:auto;overflow:hidden;}
li.cliamTransLi p{float:left;min-width:4.8125rem;}
li.cliamTransLi p span{ display: block;line-height:2rem;color:#848899;font-size:.6875rem;height: 2rem;margin-bottom:.1875rem;}
li.cliamTransLi p span span{display:inline-block;padding-top:.5rem;font-size:.875rem;}
li.cliamTransLi p strong{font-family:Arial, Microsoft YaHei;}
li.cliamTransLi p i{font-style: normal; display: block;font-size:.6875rem;line-height:1.5;color:#848999;}
li.cliamTransLi p span i{font-size:1rem;font-style:normal;line-height:1;color:#F0484E;display:inline-block;}
li.cliamTransLi .lv{width:10.375rem;float:left;}
li.cliamTransLi .lv span{color:#F0484E;}
li.cliamTransLi .lv span span{padding-top:0rem;height:2rem;line-height:2rem;font-size:1.875rem;}
li.cliamTransLi .p2{padding-top:.5rem;}
li.cliamTransLi .p2 span{line-height:1.5rem;height:1.5rem;}
li.cliamTransLi .p2 strong{color: #2b313d;}
li.cliamTransLi .p2 span strong{font-size: 1.375rem;}
li.cliamTransLi .p2 font{color: #2b313d;}
li.cliamTransLi .btn .newMobile{width:2.3125rem;height:1rem; position: absolute;right:-.6875rem;top:-.6875rem;background:url("~assets/wapFront/invest/img/firstIcon.png") no-repeat center center/100% 100%;}

</style>
