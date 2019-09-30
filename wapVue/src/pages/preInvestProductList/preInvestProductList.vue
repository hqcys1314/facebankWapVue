<template>
  <div id="preInvestProductList" v-cloak>
      <div class="ofList" v-for="product in productList">
          <div class="investListLeft">
              <ul>
                  <li>
                      <p class="p1 p-cl-grey">{{product.termCount}}<span class="span-samll">天</span></p>
                      <p class="p2">期限</p>
                  </li>
                  <li>
                      <p class="p1 p-cl-red">{{product.rate}}<span class="span-samll">%</span></p>
                      <p class="p2">预期年化收益</p>
                  </li>
              </ul>
          </div>
          <div class="investListRight">
            <router-link :to="{ path: '/preInvestConfirm', query: {orderId:orderId,productId:product.productId}}"  class="color-background-red"
                >
                转投
            </router-link>
          </div>
      </div>
      <div class="rule">
          <p class="p-title">转投需知：</p>
          <ul>
              <li>1. 所有定存计划转投项目均为笑脸金融定存计划，还款方式均为一次性还本付息；</li>
              <li>2. 必须将到期本息（包括加息收益等）作为本金进行全额转投；</li>
              <li>
                  3. 转投预约成功后不可撤销；</li>
              <li>
                  4. 原定存计划还款当日即进行自动转投，且当日转投生效；</li>
              <li>
                  5. 会员加息、首购加息、出借经验值奖励、出借笑脸币奖励等以转投生效为准。
              </li>
          </ul>
      </div>
  </div>
</template>
<style scoped src="./preInvestProductList.css">
</style>
<script>
    export default {
      name: 'preInvestProductList',
      data () {
            return {
              orderId:'',
              productList : '',
              holdJsonUrl:'/wap/productList',
            }
        },
        components:{},//这里注册
        created:function () {
              this.$http.get(this.productList).then(function(res){
                      if ((res.data != null) && (res.data != "")){
                          this.productList=eval(res.data);
                      }

              },function(res){
                          console.warn(res);
              });

        },
        methods: {

        }
  }

</script>
