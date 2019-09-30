<template>
    <div>
        <div class="layer_style" v-show="showLayer" v-cloak style="padding-top:0;top:25%;-webkit-transform:none;-moz-transform: none;-o-transform: none;transform:none;">
          <div class="layer_content" style="text-align:left;padding:0;margin:1.25rem 1.15rem;line-height:1.25rem;font-size:.75rem;max-height:21rem;">
             <p>
               您同意授权笑脸金融平台调用您的电子签名认证证书完成上述协议的电子签署：</p>
            <div>
                <a href="javascript:;" @click="showContract('cliamsTranServiceLoanId')">《债权转让协议》</a>

            </div>
        </div>
          <div class="layer_btn two">
              <a href="javascript:;" @click="closeLayer()">关闭</a>
              <a href="javascript:;" @click="investConfirm()">同意并发起</a>
          </div>
        </div>
        <div class="layerMask" v-show="showLayer" v-cloak></div>
      <layerAgreement ref="layerAgreement"></layerAgreement>

    </div>
</template>
<style scoped>
#autoInvestMatchConfirm .layer_style{ position:fixed;}
.layer_style .layer_content a{color:#F0484E;display:block;}
.layer_style .layer_content p{display: block;}
/* .layer_style .layer_content p span{color:#F0484E} */
.layer_style .layer_btn.two a:first-child{color:#848899}
</style>
<script>
  export default {
      name: 'informationLayer',
      props: ['show', 'proInfo', 'abandonSelectChange', 'productType'],
      data () {
          return {
              showLayer : false,
              proInfos : ''
          }
      },
      created:function(){this.proInfos = this.proInfo;},
      methods:{
          showContract(type, loanId){
              this.$refs.layerAgreement.showAgreement(type, loanId)
          },
          closeLayer(){
              this.showLayer = false;
              this.$emit('abandonSelectChange', false)
              this.$emit('update:show', this.showLayer)
          },
          investConfirm(){
              this.showLayer = false;
              this.$emit('update:show', this.showLayer)
              if(typeof this.abandonSelectChange != undefined){
                  this.$emit('update:abandonSelectChange', true);
              }
              this.$emit('investConfirm', '');
          }
      },
      watch : {
          show : function(val){
              this.showLayer = val;
          },
          proInfo : function(val){
              this.proInfos = val;
          },
      }
    }
</script>
