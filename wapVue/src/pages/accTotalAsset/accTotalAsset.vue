<template>
    <div id="accTotalAsset" class="white_background" v-cloak>
        <div class="xw_card" @click="toDepository()">
            <p class="money">￥{{accountCashResult.totalAssert| currency}}</p>
            <div class="tips">
                <span>去看看</span>
                资金已经完全存管于新网银行
            </div>
        </div>
        <div class="as_3" id="mon_value">
           <ul>
               <li>
                   <span class="span_num">¥<font>{{accountCashResult.planCapital | currency}}</font></span>
                   <span class="span_name">待收本金</span>
               </li>
               <li>
                   <span class="span_num">¥<font>{{accountCashResult.planProfit | currency}}</font></span>
                   <span class="span_name">待收收益</span>
               </li>
               <li>
                   <span class="span_num">¥<font>{{accountCashResult.accountBalance| currency}}</font></span>
                   <span class="span_name">可用余额</span>
               </li>
               <li>
                   <span class="span_num">¥<font>{{accountCashResult.investFrozenCash | currency}}</font></span>
                   <span class="span_name">出借中资金</span>
               </li>
               <li>
                   <span class="span_num">¥<font>{{accountCashResult.drawCashFrozenCash | currency}}</font></span>
                   <span class="span_name">提现中资金</span>
               </li>

           </ul>
        </div>
        <needActive :userInfo.sync="userInfo" ref="needActive"></needActive>
    </div>
</template>
<style scoped src="./accTotalAsset.css">
</style>
<script>
    export default {
      name: 'accTotalAsset',
      data () {
            return {
              accountCashResult:'',
              userInfo : '',
            }
        },
        components:{},//这里注册
        created:function () {
            var userInfo = this.utils.getUserInfo();
            this.userInfo = userInfo.info;
          var _this = this;
          //获取用户资金
          $.ajax({
              url : this.utils.AJAXDOMAINNAME+"/wap/getUserAccountCashInfo",
              success : function(res){
                  if(res.code==1){
                     _this.accountCashResult=res.data;
                  }
              }
          })
        },
        mounted:function(){

            this.$refs.needActive.checkDepositoryStatus();
        },
        methods: {
            toDepository(){
                if (!this.$refs.needActive.checkDepositoryStatus()) return false;
                this.$router.push({
                    name: 'depository',
                })
            }
        }
  }

</script>
