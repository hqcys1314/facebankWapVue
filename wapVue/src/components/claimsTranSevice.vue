
<template>
  <div v-show="fwfShow" v-cloak>
      <div class="layer_style layer_sevice" v-cloak>
        <div class="layer_content">
          <p>债权转让服务费标准，详情请查看
            <a style="color:#F0484E;" href="javascript:;" @click="showContract('cliamsTranServiceLoanId')">《债权转让协议》</a>
            。最终需要支付的服务费，由转让成功时转出的债权价值决定
          </p>
          <div class="gs">
            <span class="span1">转让服务费=债权价值*转让服务费率</span>
            <span class="span2">债权价值，即剩余未还本金</span>
          </div>
        </div>
        <div class="layer_btn one">
          <a href="javascript:;" @click="closeLayer()">知道了</a>
        </div>

      </div>
      <div class="layerMask" v-cloak></div>
    <layerAgreement ref="layerAgreement"></layerAgreement>

  </div>

</template>
<style>
  .layer_sevice .other{ display:block;height:auto;overflow:hidden;font-size:.75rem;color:#848999;margin-top: 1rem;
    line-height: 1.25rem;}
  .layer_sevice {padding-top:0;top:25%;-webkit-transform:none;-moz-transform: none;-o-transform: none;transform:none;}
  .layer_sevice .layer_content{text-align:left;padding:0;margin:1.25rem 1.15rem 1.1875rem;line-height:1.25rem;font-size:.75rem;max-height:21rem;}

  .layer_sevice .gs{font-size: 0.75rem;background: #F2F4F8;border-radius: 0.2rem;padding: 0.625rem;margin: 1rem 0;}
  .layer_sevice .gs .span1{color:#2b313d;font-weight: bold; }
  .layer_sevice .gs .span2{color: #848999;display: block;}
</style>
<script>

  export default {
    props: ['fwfShow'],
    methods:{
      closeLayer:function(){
        this.$emit('closeLayer');
      },
      showContract(type, loanId){
        this.$refs.layerAgreement.showAgreement(type, loanId);
      },
    }
  }
</script>
