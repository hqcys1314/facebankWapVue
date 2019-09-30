<template>
  <div class="white_background regandwith">
      <ul class="box">
          <li class="item item_1">
              <p>充值已提交，等待银行处理</p>
              <i>充值金额{{resule.amount | formatThousandth}}元</i>
              <em>{{resule.date}}</em>
          </li>
          <li class="item item_2">
              <p>预计5分钟内到账</p>
              <i>请及时关注笑脸账户余额变动</i>
          </li>
      </ul>
      <a href="javascript:;" class="btn_tpls" @click="toAccount">返回我的账户</a>
      <!--统一提示层-->
      <services :rid="resule.requestNo" showItem="online, feedback" sourceType="recharge-success" pos="bottom"></services>
  </div>
</template>

<style src="../withdrawSuc/withdrawSuc.css"></style>
<script>
export default {
    name: 'rechargeHandler',
    data() {
        return {
            requestNo : 0,
            resule : '',

            informationLayerContent : '',
            showLayerStatus : false,
        }
    },
    created:function () {
        this.resule = this.$route.query;
    },
    mounted : function(){
        document.title='充值';

    },
    methods: {
        toAccount(){
            this.utils.toAccount();
        }
    }
}
</script>
