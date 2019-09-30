<template>
    <div class="product_intro">
        <h2>什么是月月笑？</h2>
        <div class="article">
            <div class="cont">
                <p>月月笑是为解决等额本息还款方式回款时间散乱、回款金额小、资金难以统一管理而推出的固定锁定期的出借工具。锁定期内资金自动循环出借、锁定期满自动转让退出，锁定期满后平台将通过债权转让的形式帮助您实现资金陆续退出，平台不保证退出时效。
                </p>
            </div>

            <div class="cont" style="padding-bottom:1.96875rem;">
                <h3 style="margin-bottom:1.71875rem;">月月笑特点</h3>
                <div class="cont" style="padding:0;border:0;height:auto;overflow:hidden;padding:0;">
                    <dl>
                        <dt><img src="//static.facebank.cn/static/wapFront/timeDeposit/intro_1.png?V=1" height="100%"></dt>
                        <dd><span>多种期限</span>轻松选择</dd>
                    </dl>

                    <dl>
                        <dt><img src="//static.facebank.cn/static/wapFront/timeDeposit/intro_2.png" height="100%"></dt>
                        <dd><span>出借分散</span>降低风险</dd>
                    </dl>
                    <dl>
                        <dt><img src="//static.facebank.cn/static/wapFront/timeDeposit/intro_3.png" height="100%"></dt>
                        <dd><span>固定期限</span>类似银行定存习惯</dd>
                    </dl>
                </div>
            </div>
            <div class="cont">
                <h3>产品工作原理图</h3>
                <p><img src="//static.facebank.cn/static/wapFront/timeDeposit/pic.jpg?v=1" width="100%"></p>
            </div>
            <div class="cont">
                <h3>产品详细说明</h3>
                <p><i>期待年化回报率</i>期待年化回报率不代表您的实际回报率，出借人的实际收益取决于锁定期内是否及时成功匹配借款人以及借款人是否按期足额偿还借款本息等情况。您在加入月月笑产品之前应主动了解该产品信息，理解并接受自身的交易行为可能存在不能够按期收回出借资金本息的风险，笑脸金融平台不对您在“月月笑”产品下本息的收回作出任何承诺、保证。</p>
                <p>&nbsp;</p>

                <p><i>计息方式</i>出借撮合成功后生成债权，每债权根据《借款协议》及《债权转让协议》单独计息。月月笑产品无统一起息日期。</p>
                <p>&nbsp;</p>

                <p><i>锁定期</i>您在加入月月笑产品成功（资金成功撮合标的或受让债权）后进入锁定期，期间您授权平台对回款资金继续循环出借给经平台严格审核的高质量借款人或受让其他出借用户债权，锁定期满停止此授权。锁定期内，出借用户不能申请退出月月笑产品服务或受让逾期债权；不能变更授权出借本金、提前终止出借或就该等授权出借本金进行提现（即从出借用户存管记账账户提现至其银行结算账户）。</p>
                <p>&nbsp;</p>

                <p><i>退出方式</i>月月笑产品锁定期满后，如有回款资金未被出借则直接结算到您的余额账户；如有未结束的债权，您委托平台进行债权转让，转让成功后资金实时结算到您的余额账户，未转让成功的债权持续转让或继续持有直到结清。如因国家法律法规、监管政策、自律规定、市场变化等原因，笑脸金融平台有权调整月月笑产品的相关规则，单方终止本产品且无需承担违约责任。</p>
                <p>&nbsp;</p>

                <p>
                    <i>费用说明</i>服务费在债权成功回款和成功转让时收取：<br>
                    1、回款成功时收费 = 该笔单一债权回款实收利息 - 该笔单一债权回款实收利息 x 期待年化回报率 / 借款协议约定年化利率<br>
                    2、转让成功时收费 = 该笔转让债权当期应收利息 - 该笔转让债权当期应收利息 x 期待年化回报率 / 借款协议约定年化利率 <br>
                    注：期待年化回报率 >= 借款协议约定年化利率 则不收取服务费<br>
                </p>
                <p>&nbsp;</p>

                <p><i>服务协议</i>
                    <a @click="utils.newWebViewAll('https://'+'cic.facebank.cn/wap/contract/sdqAuthorizeContract')" href="javascript:;">《月月笑产品出借人授权委托书》</a>
                    <a @click="utils.newWebViewAll('https://'+'cic.facebank.cn/wap/contract/sdqProductServContract')" href="javascript:;">《月月笑产品服务协议》</a>
                    <a @click="utils.newWebViewAll('https://'+'cic.facebank.cn/wap/contract/sdqRiskPlainContract')" href="javascript:;">《月月笑产品风险揭示及禁止性要求》</a>
                </p>
                <p>&nbsp;</p>

                <p><i>流动性风险提示</i>锁定期满后次日，平台根据您的委托发起债权转让（如有未结束债权），您所持债权转让完成的具体时间和进度，视债权转让实际交易情况而定。平台不承诺退出时效，期满后可能无法即时完成债权转让，债权持有时间视您出借的借款项目而定。根据历史经验转让时长不超过3个工作日。</p>
            </div>
            <div class="cont">
                <h3>常见问题</h3>
                <p v-for="(item, index) in productQaList">
                    <i>{{index+1}}、{{item.question}}</i>{{item.answer}}<br>&nbsp;
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'timeDepositoryIntro',
  data(){
    return {
        productQaList : []
    }
  },
  created :function(){
      var _this = this;
      $.ajax({
          url : 'https://cic.facebank.cn/api/getAppConfigByKey',
          data : JSON.stringify({
              configKey : 'product_qa'
          }),
          async : false,
          success : function(rss){
              var rs = typeof rss == 'string' ? eval('('+ rss +')') : rss;
              if(rs.statusCode*1 == 200){
                  if(rs.generalModelList.length > 0){
                      _this.productQaList = rs.generalModelList
                  }
              }
          }
      })
  },
  mounted:function(){

  },
  methods:{

  }
}

</script>
<style scoped>
.product_intro{ display:block;padding-left:1rem;margin-top:.625rem;background:#FFFFFF;}
.product_intro h2{line-height:3.25rem;border-bottom:1px solid #DFE3EB;font-size:1rem;color:#2b313d;height:auto;overflow:hidden;}
.product_intro .article{color:#848999;font-size:.75rem;line-height:1.25rem;}
.product_intro .article .cont h3{display:block;width:auto; white-space: nowrap;line-height:1.25rem;font-size:.875rem;font-weight:bold;color:#2B313D;margin:1.25rem 0 1.125rem;padding-right:.9375rem;background:url(//static.facebank.cn/static/wapFront/common/img/title_line.gif) no-repeat bottom center/100% 100%;float:left;clear:both;}
.product_intro .article .cont{clear:both;display:block;padding-bottom:1.5625rem;border-bottom:1px solid #DFE3EB;padding-right:1rem;}
.product_intro .article .cont:first-child{padding:1.25rem 0;}
.product_intro .article .cont p{display:block;clear:both;}
.product_intro .article .cont p span{color:#F0484E}
.product_intro .article>.cont:last-child{border:0;}
.product_intro .article .cont p i{display:block;font-style:normal;color:#2B313D;font-weight:600;}
.product_intro .article .cont dl{height:auto;overflow:hidden;width:4.5rem;float:left; text-align:center;}
.product_intro .article .cont>dl:last-child{margin-bottom:0}
.product_intro .article .cont dl dt{display:block;height:2rem;margin-bottom:.5rem;}
.product_intro .article .cont dl dd{display:block;line-height:1.5;font-size:.75rem;}
.product_intro .article .cont dl dd span{display:block;font-weight:600;color:#2B313D}
.product_intro .article .cont dl:nth-child(2){float:right;}
.product_intro .article .cont dl:nth-child(3){float:none;width:auto;margin:0 4.5rem;}
.product_intro .article .clear{width:1px;height:1px;float:left;clear:both;overflow:hidden;;}
.product_intro .article>.cont p a{color:#F0484E}
</style>
