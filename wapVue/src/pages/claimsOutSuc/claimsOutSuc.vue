<template>
  <div class="claimsOutSuc" id="claimsOutSuc">
    <div class="success_box">
      <img src="//static.facebank.cn/static/wapFront/depository/img/duigouSuc.png" />
      <p class="p1">已发起债转</p>
      <p class="p3">请及时关注本订单的债权状态</p>
      <p class="p4">
        <span class="span1">*</span><span class="span2">在债权转让成功之前，待还本金、待还利息和待还奖励将被按照还款计划还款至您的账户余额</span>
      </p>
    </div>
    <a class="btn_tpls" v-on:click="utils.toAccount()">返回我的账户</a>
  </div>
</template>

<style lang="less" src="./claimsOutSuc.less"></style>

<script>
  import * as constants from './claimsOutSucConstants';

  export default {
    name: constants.NAME,
    data() {
      return {
      }
    },
    created:function () {

    },
    methods: {

    },
    components: {}
  }
</script>
