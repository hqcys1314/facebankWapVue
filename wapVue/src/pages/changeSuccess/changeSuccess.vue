<template>
    <div id="resule" class="white_background">
        <div class="error_img changeSuccess">
            <img v-if="type == 'changeBank'" src="//static.facebank.cn/static/wapFront/depository/img/shenhe.png" />
            <img v-else src="//static.facebank.cn/static/wapFront/depository/img/duigouSuc.png" />
        </div>
        <div class="error_font">{{tips[type]}}</div>
        <div class="charge_amount" v-if="type == 'recharge'">￥{{chargeAmount | currency}}</div>
        <div class="error_small">{{stips[type]}}</div>
        <div class="blank88"></div>
        <a href="javascript:;" class="btn_tpls" @click="toAccount">返回我的账户</a>
        <a v-if="type=='recharge'" href="/rechargeUI" class="btn_tpls2">再充一笔
            <span class="rtt">
               该卡下次可充值最大金额:{{maxValue | formatAmount}}
            </span>
        </a>
        <div class="desc" v-if="type == 'changeBank'">
            提示<br>
            1、审核结果将以短信告知，请注意查收<br>
            2、审核通过后，您就可以使用新的银行卡了<br>
        </div>
        <services v-if="type == 'recharge'" :rid="resule.requestNo" showItem="online, feedback" sourceType="recharge-success" pos="bottom"></services>
    </div>
</template>
<style src="assets/css/resule.css"></style>
<style scoped>
    .btn_tpls2{position:relative;}
    .rtt{display: block;background-color: #2b313d;
      width: 60%;
      margin: 0.2rem auto 0;
      position: relative;
      border-radius: 0.3rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      border: 1px #fff solid;
      color: #ffffff;
      font-size: 0.688rem;}
    .rtt:after{position: absolute;background-color: #2b313d;
    content: '';
    top: -5px;
    left: 50%;
    margin-left: -4px;
    height: 8px;
    width: 8px;
    border-width: 0 1px 1px 0;
    border-color: #2b313d;
    background-color: #2b313d;
    border-style: solid;
    -webkit-transform: matrix(0.707107,0.707107,-0.707107,0.707107,0,0);
    transform: matrix(0.707107,0.707107,-0.707107,0.707107,0,0);
    -webkit-transform-origin: center;
    transform-origin: center;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;}
</style>
<script>
export default {
    name: 'changeSuccessPage',
    data () {
        return {
            type : '',
            accountBalance : '',
            chargeAmount : 0,
            resule : '',
            tips : {
                changeBank : '更换申请已提交',
                changeBankSuc : '成功更换银行卡',
                resetPW : '成功重置存管交易密码',
                mobile : '成功更换银行预留手机号',
                recharge : '充值成功',
            },
            stips : {
                changeBank : '我们会在1个工作日内审核完成',
                changeBankSuc : '您在「存管账户」的资金出入将通过该银行卡',
                resetPW : '该交易密码将用于充值、提现，请妥善保管该密码',
                mobile : '该手机号将用于充值、提现、更换交易密码等操作',
                recharge : '',
            },
            maxValue:'',
        }
    },
    created:function () {
        this.type = this.$route.query.type;
        this.resule = this.$route.query;
        var _this = this;
        if(this.type == 'recharge'){

            this.chargeAmount = this.$route.query.chargeAmount;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+"/wap/getAccountBalance",
                success : function(res){
                    if(res.code==1){
                       _this.accountBalance=res.data.accountBalance;
                       _this.$set(_this.stips, 'recharge', '账户余额'+ (_this.utils.currency(_this.accountBalance)) +'元')
                    }
                }
            })
            $.ajax({
              url: this.utils.AJAXDOMAINNAME + "/wap/getBankCardDynamicsLimit",
              success: function(res) {
                if (res.code * 1 == 1) {
                  _this.maxValue = res.data.singleMaxAmtLimit;
                }
              }

            })
        }
    },
    methods: {
        toAccount(){
            this.utils.toAccount();
        }
    },
    filters: {
      formatAmount: function(val) {
        return parseInt((val / 10000) * 100) / 100 + '万';
      }
    },
    watch:{
        type(val){
            document.title=this.tips[val];
        }
    }
}
</script>
