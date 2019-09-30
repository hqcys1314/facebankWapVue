<template>
  <div class="rechargeSuc">
    <div class="part1">
        <p class="p_img"><img src="~assets/wapFront/invest/img/sc_ok.png"></p>
        <p class="p_text">充值完成</p>
        <ul>
            <li>
                <p class="p1">{{chargeAmount | currency}}</p>
                <p class="p2">本次充值(元)</p>
            </li>
            <li>
                <p class="p1">{{accountCashResult.accountBalance| currency}}</p>
                <p class="p2">账户余额(元)</p>
            </li>
        </ul>
    	   <!-- <div class="result" v-if="bindCardNum == 1">
    	        <p>
    	            获得笑脸币：<span class="span1">{{firstRecharge | toFixed}}</span>
    	        </p>
    	        <p>首次出借再送<span class="span1">{{firstInvestor | toFixed}}</span>笑脸币</p>
    	   </div> -->
    </div>
    <div class="suc-page-btn">
        <a v-on:click="utils.toAccount()">确定</a>
    </div>
  </div>
</template>

<style scoped src="./rechargeSuc.css">
</style>
<script>
 import * as constants from './rechargeSucConstants';
 import {utils} from 'tools';

  export default {
    name: constants.NAME,
    data() {
      return {
        bindCardNum:'1',
        accountCashResult:'',
        chargeAmount:'',
      }
    },
    created:function () {
       this.chargeAmount = this.$route.query.chargeAmount;
        //获取用户资金
        var _this = this;
        $.ajax({
            url : utils.AJAXDOMAINNAME+"/wap/getUserAccountCashInfo",
            success : function(res){
                if(res.code==1){
                   _this.accountCashResult=res.data;
                }
            }
        })
    },
    mounted(){

    },
    methods: {

    },
  }
</script>
