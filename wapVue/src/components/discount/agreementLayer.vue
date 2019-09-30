<template>
    <div>
        <div class="layer_style" v-show="showLayer" v-cloak style="padding-top:0;top:15%;-webkit-transform:none;-moz-transform: none;-o-transform: none;transform:none;">
          <div class="layer_content" style="text-align:left;padding:0;margin:1.25rem 1.15rem;line-height:1.25rem;font-size:.75rem;max-height:21rem;">
              <p v-if="productType != 'deposit'">
                  网络借贷有风险。当您/贵机构在做出接受网络借贷信息中介机构服务和出借决策之前，请仔细阅读在充分了解并清楚知晓网络借贷产品风险收益特征和产品特性，<span style="color:#2b313d">认真考虑网络借贷产品存在的各项风险因素及网贷机构禁止性行为后，</span>，并并充分考虑自身的风险承受能力，理性判断并谨慎做出是否出借的决策。具体内容请详见：<!--《网络借贷风险揭示书》--><a href="javascript:;" @click="showContract('riskInfo')" style="display:inline;">《网络借贷风险揭示书》</a><br><br>
              </p>
              <p v-if="productType == 'deposit'">
                  <span style="color:#2b313d">月月笑产品流动性风险提示：</span>锁定期满后平台根据授权发起债权转让，您所持债权转让完成的具体时间和进度，视债权转让实际交易情况而定。平台不承诺退出时效，期满后可能无法即时完成债权转让，债权持有时间视您出借的借款项目而定。<span>根据历史经验转让时长不超过3个工作日。</span>具体内容请详见：<!--《月月笑产品风险揭示及禁止性要求》--><a href="javascript:;" @click="showContract('sdqRiskPlainContract')" style="display:inline;">《月月笑产品风险揭示及禁止性要求》</a><br><br></p>
            您同意授权笑脸金融平台调用您的电子签名认证证书完成上述协议的电子签署：<br>

            <div v-if="productType == 'deposit'">
                <a href="javascript:;" v-for="item in proInfos.contractList" @click="showContract(item.url)">{{item.name}}</a>
                <!-- <a href="javascript:;" @click="showContract('sdqProductServContract')">《月月笑产品服务协议》</a><br />
                <a href="javascript:;" @click="showContract('sdqAuthorizeContract')">《月月笑产品出借人授权委托书》</a><br />
                <a href="javascript:;" @click="showContract('investorMoney')">《出借人资金来源合法承诺函》</a><br /><br /> -->
            </div>
            <div v-else>
                <a href="javascript:;" @click="showContract('investorService')">《出借人服务协议》</a>
                <a href="javascript:;" @click="showContract('riskInfo')">《网络借贷风险揭示书》</a>
                <a href="javascript:;" @click="showContract('investorMoney')">《出借人资金来源合法承诺函》</a>
            </div>
            <div v-if="proInfos.loanId">
            <a href="javascript:;" @click="showContract('loanBorrow', proInfos.loanId)">《借款协议》</a>{{proInfos.loanId}}
            </div>
            <div v-else-if="proInfos.loanIdArr&&proInfos.loanIdArr.length>0">
              <p v-for="(loan, index) in proInfos.loanIdArr">
                <a href="javascript:;" @click="showContract('loanBorrow',loan)">《借款协议》</a>{{loan}}
              </p>
            </div>
            <div v-else-if="proInfos.creditIdArr&&proInfos.creditIdArr.length>0">
              <p v-for="(loan, index) in proInfos.creditIdArr">
                <a href="javascript:;" @click="showContract('cliamsTranServiceCreditId',loan)">《债权转让协议》-</a>{{loan}}
              </p>
            </div>
            <div v-else>
                <p v-for="(loan, index) in proInfos.contractListArr">
                    <a href="javascript:;" @click="showContract(t.url)" v-for="t in loan">{{t.name}}</a>
                </p>
            </div>
        </div>
          <div class="layer_btn two">
              <a href="javascript:;" @click="closeLayer()">取消</a>
              <a href="javascript:;" @click="investConfirm()">同意并出借</a>
          </div>
        </div>
        <div class="layerMask" v-show="showLayer" v-cloak></div>

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
              this.$parent.$refs.layerAgreement.showAgreement(type, loanId)
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
