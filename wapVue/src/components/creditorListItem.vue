<template>
    <li class="creditorLi" v-on:click="toCreditorDetail()">
        <div class="title">转让债权-{{listItem.translateId}}</div>
        <div class="box">
            <div class="state">
                <div class="isOver">{{listItem.status == 1 ? '已转' : '可转'}}</div>
            </div>
            <div class="left">
                <div class="line">
                    <p><span class="lv_num">{{listItem.creditRate}}</span><span class="unit">%</span></p>
                    <p class="col2">剩余期限 <span class="lv_big">{{listItem.lastDays}}</span>天</p>
                </div>
                <div class="line">
                    <p><span class="desc">借款合同约定年化利率</span></p>
                    <p>转让金额 <span class="lv_big">{{listItem.translateAmount}}</span>元</p>
                </div>
            </div>
        </div>
        <div class="bot">
            <span class="right">剩余可投{{listItem.lastAmount || '0.00'}}元</span>
            <span>{{repaymentTypeFont[listItem.repaymentType] || '无'}}</span>
        </div>
    </li>
</template>
<script>
import {utils} from 'tools';
    export default {
      name: 'listItem',
      data (){
          return {
              repaymentTypeFont : ['','一次性还本付息','等额本息','等额本金','先息后本','等本等息'],
          }
      },
      props: ['listItem', 'isLogin', 'bindCard'],
      filters : {
          formatNumber(num){
              if(num*1<10000){
                  return num;
              }else{
                  return parseInt((num/10000)*100)/100;
              }
          }
      },
      methods:{
          //标的跳转详情页
          toCreditorDetail: function () {
            var parame = [],
                _this = this;
            for(var k in this.listItem){
                if(this.listItem.hasOwnProperty(k)){
                    parame.push(k + '=' + encodeURIComponent(this.listItem[k]))
                }
            }
            utils.newWebView("/creditorDetail?"+ parame.join('&'))
          }
      }
    }
</script>
<style scoped>
li.creditorLi{ display:block;color:#848999;margin-bottom:.3125rem;padding:0 .75rem;background:#FFFFFF;}
li.creditorLi .title{line-height:2.5rem;padding-left:.25rem;font-size:.875rem;color:#2b313d;}
li.creditorLi .box{height:auto;overflow:hidden;padding:.5rem 0 .5625rem;}
li.creditorLi .box .left{ display:block;margin-right:3.15rem;height:auto;overflow:hidden;}
li.creditorLi .box .left .line{height:auto;overflow:hidden;}
li.creditorLi .box .left p{width:8.5rem;float:left;font-size:.75rem;line-height:1.375rem;}
li.creditorLi .lv{width:7.5rem;float:left;line-height:1.375rem;}
li.creditorLi .line span.lv_num{font-size:1.5rem;color:#f0484e;line-height:1;}
li.creditorLi .line span.unit{font-size:.75rem;color:#f0484e;line-height:1rem;}
li.creditorLi .line .desc{font-size:.75rem;}
li.creditorLi .line .lv_big{font-size: 1rem;color: #2b313d;font-weight: bold;margin-right: 0.1rem;}
li.creditorLi .line p.col2{padding-top:.5rem;line-height:1.375rem;}
li.creditorLi .infos{line-height:1.375rem;font-size:.75rem;float:left; white-space: nowrap;}
li.creditorLi .infos span{font-size:.875rem;color:#2b313d;}
li.creditorLi .state{width:3.15rem;height:3.125rem;float:right;margin-right:.25rem;margin-top:0rem;}
li.creditorLi .state .isOver{width:3.15rem;height:3.125rem;line-height:3.125rem; text-align:center;font-size:.875rem;border-radius:50%;background:#F1F1F1;}
li.creditorLi .bot{border-top:1px solid #f1f1f1;line-height:2.1875rem;padding:0 .25rem;font-size:.75rem;}
li.creditorLi .bot span.right{float:right; white-space: nowrap;}


</style>
