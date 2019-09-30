<template>
  <div v-show="dicountShow" v-cloak >
    <div class="layer_style layer_discount" style="top:10%;" v-cloak>
      <div class="layer_content">
        <div class="layer_title">
          <div class="d1">什么是折让率</div>
        </div>
        <div class="other">
          折让率是"转让债权的本金折让率"的简称。折让率是指：发布债权转让的出借人（出让人），为了尽快转出所持有的债权收回本金，愿意给出一的的折扣把债权转让给新的出借人（受让人）。这相当于“把本金打折出售”。

        </div>
        <div class="gs">
          <span class="span1">出让价格=债权价值*（1-折让率）</span>
          <span class="span2">债权价值，即剩余未还本金</span>
        </div>
        <div class="other"><strong>举例:</strong>小明（出让人）把价值10000元的本金，按1%的折让率把债权转让给笑笑（受让人），在这个交易的过程中，小明实际获得9900元，笑笑实际支出9900元。这相当于笑笑花9900元购买到了小明的这个价值10000元的债权。而且，日后笑笑可以按照债权的还款计划收回10000元的本金和其对应利息。</div>

      </div>

      <div class="layer_btn one">
        <a href="javascript:;" @click="toHide()">知道了</a>
      </div>

    </div>
    <div class="layerMask" v-cloak></div>
  </div>

</template>
<style>
  .layer_discount .other{ display:block;height:auto;overflow:hidden;font-size:.75rem;color:#848999;margin-top: 1rem;
    line-height: 1.25rem;}
  .layer_discount {padding-top:0;top:25%;-webkit-transform:none;-moz-transform: none;-o-transform: none;transform:none;}
  .layer_discount .layer_content{text-align:left;padding:0;margin:1.25rem 1.15rem 1.1875rem;line-height:1.25rem;font-size:.75rem;max-height:21rem;}

  .layer_discount .gs{font-size: 0.75rem;background: #F2F4F8;border-radius: 0.2rem;padding: 0.625rem;margin: 1rem 0;}
  .layer_discount .gs .span1{color:#2b313d;font-weight: bold; }
  .layer_discount .gs .span2{color: #848999;display: block;}

</style>
<script>
    export default {
      props: ['dicountShow'],
      methods:{
        toHide:function(){
            this.$emit('closeDiscount');
        }
      }
    }
</script>

