<template>
  <div class="riskWarnings" v-cloak>
    <h2>风险提示</h2>
    <div class="content">
   您正在进行的是由深圳光华普惠科技有限公司（下称“笑脸金融”）提供网络借贷信息中介服务的网络借贷活动。笑脸金融在此就网络借贷活动的风险及禁止性行为向您提示如下：
        <br><br>1、网络借贷是个体和个体之间通过互联网平台实现的直接借贷，您与借款人约定的且通过笑脸金融平台展示的借款利率或年化利率不代表您最终实际取得的利息或回报，您出借的本金以及相应的利息存在不能够按期收回的风险；笑脸金融不对您本金的收回、可获利息或回报金额作出任何承诺、保证。
        <br><br>2、您作为出借人，不得从事以下行为或存在以下情形：
		 <br>（1）向网络借贷信息中介机构提供不真实、不准确、不完整的信息；
		 <br>（2）使用非法资金或非自有资金进行出借；
		 <br>（3）不具备与进行网络借贷活动相适应的风险认知和承受能力，出借于与自身风险承受能力不匹配的融资项目；
		 <br>（4）其他借贷合同及有关协议约定的禁止性行为。

        <br><br>3、您确认已经知悉网络借贷活动的风险，保证不存在从事网络借贷活动的禁止性行为，承诺具备与参与网络借贷活动相适应的出借风险意识、风险识别能力、拥有非保本类金融产品出借的经历并熟悉互联网，承诺自行承担借贷产生的本息损失。
    </div>

  </div>
</template>

<style scoped src="./riskWarnings2.css">
</style>

<script>
import * as constants from './riskWarnings2Constants';
export default {
  name: constants.NAME,
  data () {
    return {
    }
  },
  components:{},//这里注册
  created:function () {
  },
  computed: {

  },
  methods: {
  }
}

</script>
