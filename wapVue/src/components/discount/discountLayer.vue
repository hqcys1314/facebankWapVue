<template>
    <div>
        <div class="layer_style" v-show="showLayer" v-cloak>
            <div class="layer_title">提示</div>
            <div class="layer_content">你有卡券优惠可选择使用<br>使用卡券优惠，出借可享额外奖励</div>
            <div class="layer_btn two">
                <a href="javascript:;" v-if="agreementState" @click="investConfirm()">确认直接出借</a>
                <a href="javascript:;" v-else @click="abandonSelect()">直接出借</a>
                <a href="javascript:;" @click="selectCouponFn()">选择卡券</a>
            </div>
        </div>
        <div class="layerMask" v-show="showLayer" v-cloak></div>
    </div>
</template>
<style scoped>
#autoInvestMatchConfirm .layer_style{ position:fixed;}
</style>
<script>
    export default {
      name: 'informationLayer',
      props: ['show', 'agreementState'],
      data () {
          return {
              showLayer : false,
          }
      },
      created:function(){
      },
      methods:{
          abandonSelect(){
              this.showLayer = false;
              this.$emit('update:show', this.showLayer)
              this.$emit('abandonSelect', '')
          },
          selectCouponFn(){
              this.showLayer = false;
              this.$emit('update:show', this.showLayer)
              this.$emit('selectCouponFn', '')
          },
          investConfirm(){

              this.$emit('abandonSelectChange', false);
              this.showLayer = false;
              this.$emit('update:show', this.showLayer)
              this.$emit('investConfirm', '');
          }
      },
      watch : {
          show : function(val){
              this.showLayer = val;
          }
      }
    }
</script>
