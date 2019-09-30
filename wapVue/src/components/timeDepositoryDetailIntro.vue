<template>
    <div class="product_intro">
        <div class="article">
            <div class="cont">
                <h3>什么是月月笑锁定期产品</h3>
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
                <h3>退出方式</h3>
                <p>月月笑产品锁定期满后，如有回款资金未被出借则直接结算到您的余额账户；如有未结束的债权，您委托平台进行债权转让，转让成功后资金实时结算到您的余额账户，未转让成功的债权持续转让或继续持有直到结清。如因国家法律法规、监管政策、自律规定、市场变化等原因，笑脸金融平台有权调整月月笑产品的相关规则，单方终止本产品且无需承担违约责任。</p>
            </div>
            <div class="cont">
                <h3>费用说明</h3>
                <p>
                    服务费在债权成功回款和成功转让时收取：<br>
                    1、回款成功时收费 = 该笔单一债权回款实收利息 - 该笔单一债权回款实收利息 x 期待年化回报率 / 借款协议约定年化利率<br>
                    2、转让成功时收费 = 该笔转让债权当期应收利息 - 该笔转让债权当期应收利息 x 期待年化回报率 / 借款协议约定年化利率 <br>
                    注：期待年化回报率 >= 借款协议约定年化利率 则不收取服务费<br>
                </p>
            </div>

        </div>
    </div>
</template>
<script>
export default {
  name: 'timeDepositoryDetailIntro',
  data(){
    return {
        hasStatic : false
    }
  },
  created :function(){

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
