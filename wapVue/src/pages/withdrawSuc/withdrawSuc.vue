<template>
  <div class="white_background regandwith">
      <ul class="box">
          <li class="item item_1">
              <p>已提交提现申请，等待银行处理</p>
              <i>提现金额{{resule.amount | formatThousandth}}元</i>
              <em>{{resule.date}}</em>
          </li>
          <li class="item item_2">
              <p>预计{{resule.planArrivalDate}}前到账</p>
              <i>请及时关注笑脸账户余额变动</i>
          </li>
      </ul>
      <a href="javascript:;" class="btn_tpls" @click="toAccount">返回我的账户</a>
      <!--统一提示层-->
      <services :rid="resule.requestNo" showItem="online, feedback" sourceType="withdraw-success" pos="bottom"></services>
  </div>
</template>

<style scoped src="./withdrawSuc.css"></style>
<script>
export default {
    name: 'withdraw',
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
        document.title='提现';

    },
    methods: {
        toAccount(){
            this.utils.toAccount();
        }
    }
}
</script>
