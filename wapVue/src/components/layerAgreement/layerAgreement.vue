<template>
    <div class="layerAgreementMask" :class="{'opacity' : !isOpacity}" v-show="layerAgreementMask" v-cloak>
        <div class="closeArea" @click="closeLayer()"></div>
        <div class="layerAgreementCont">
            <div class="content" v-html="agreementIframe">
                <!-- <iframe ref="contractIframe" frameborder="0" width="100%" height="100%" :src="contractUrl"></iframe> -->
            </div>
            <div class="agreementBtn">
                <a href="javascript:;" @click="closeLayer()">确定</a>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    export default {
      name: 'layerAgreement',
      props: ['show', 'name'],
      data () {
          return {
              layerAgreementMask : false,
              contractUrl : '',
              isOpacity : true,
              agreementIframe : '',
              agreementUrl : {
                  register :         '/contract/registerContract', //笑脸金融平台用户注册协议
                  informationCatch : '/contract/informationCatchContract', //用户信息采集授权声明书
                  rechargeAndWith :  '/contract/rechargeAndWithHoldContract', //充值代扣服务协议
                  userAuthorize :    '/contract/userAuthorizeContract', //用户授权委托书（电子签名、短信验证）
                  investorAuthorize :'/contract/investorAuthorizeContract', //出借人授权委托书（决策及充值/扣划/提现之授）
                  investorService :  '/contract/investorServiceContract', //出借人服务协议
                  riskInfo :         '/contract/riskInfoContract', //风险揭示书
                  investorMoney :    '/contract/investorMoneySafeContract', //出借人资金来源合法承诺函
                  autoBiddingContract :'/contract/autoBiddingContract', //出借人资金来源合法承诺函
                  loanBorrow :       '/contract/preLoanBorrowContract?loanId=', //借款协议
                  sdqAuthorizeContract : '/contract/sdqAuthorizeContract',//月月笑产品出借人授权委托书
                  sdqProductServContract : '/contract/sdqProductServContract',//月月笑产品服务协议
                  sdqRiskPlainContract : '/contract/sdqRiskPlainContract',//月月笑产品风险揭示及禁止性要求
                  cliamsTranServiceLoanId : '/contract/orderTransfer?loanId=',//债权转让协议loanID
                  cliamsTranServiceCreditId : '/contract/orderTransfer?creditId=',//债权转让协议creditId
              }
          }
      },
      created:function(){
      },
      methods:{
          closeLayer(){
              this.layerAgreementMask = false;
              this.contractUrl = '';
              this.agreementIframe = '';
          },
          showAgreement(name, loanId, isOpacity){
              if(name.indexOf('https://cic.facebank.cn') > -1){
                  this.contractUrl = name + (typeof loanId == 'string' && loanId != '' ? loanId : '');
              }else{
                  this.contractUrl = 'https://cic.facebank.cn/wap'+this.agreementUrl[name]+(typeof loanId == 'string' && loanId != '' ? loanId : '');
              }
              if(this.utils.getCookie('curDevice') == 'ios'){
                  //this.utils.newWebView(this.contractUrl)
                  window.location.href = this.contractUrl
                  return;
              }

              this.agreementIframe = '<iframe ref="contractIframe" frameborder="0" width="100%" height="100%" src="'+ this.contractUrl +'"></iframe>';
              this.layerAgreementMask = true;
              this.isOpacity = isOpacity;
          }
      }
    }
</script>
