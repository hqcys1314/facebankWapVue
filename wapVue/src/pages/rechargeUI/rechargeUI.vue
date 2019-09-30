<template>
<div class="white_background" v-cloak>
    <div class="setPwdTip" v-if="needrecharge!=''&&needrecharge!=0&&needrecharge!=null&&needrecharge*1>0">
      <p>
        <span class="span4">账户余额不足，至少充值{{needrecharge|currency }}元</span>
      </p>
    </div>
  <div v-if="isShowVoice">
    <div class="setPwdTip auto" :class="{'animate' : isShowVoice}">
      <p><span class="span4">应国家监管要求，本次充值的同时将对您的银行卡信息进行安全验证，请注意查收验证短信</span></p>
    </div>
  </div>

    <div class="setPwdTip" v-if="bankMaintain">
      <p>
          <span class="span4">当前银行通道维护中，维护期间无法充值。维护时间：{{userBankcardInfoResult.rechargeMaintainSTime}}~{{userBankcardInfoResult.rechargeMaintainETime}}</span>
      </p>
    </div>
  <div class="top_tips">
      <router-link :to="{ name: 'cardList', query: {f:'recharge'} }">支持银行&nbsp;<i class="iconfont icon-ic_rightarrow"></i></router-link>
  </div>
  <div class="card_box">
    <div class="card_info recharge">
      <div class="bank_info">
        <img class="bank" v-if="userBankcardInfoResult.bankCode" v-bind:src="'//static.facebank.cn/static/wapFront/common/images/bankIconWhite/'+ (bankTrans(userBankcardInfoResult.bankCode).smallIcon ? bankTrans(userBankcardInfoResult.bankCode).smallIcon :
        'default') +'.png'">
        <img class="bank" v-else src="//static.facebank.cn/static/wapFront/common/images/bankIconWhite/default.png">
         {{userBankcardInfoResult.bankName}}

     </div>
      <div class="card_num">{{userBankcardInfoResult.cardNo}}</div>
      <div class="name" v-if="bankMaintain">
          <span class="limit2">当前银行通道正在维护
              <i v-on:click="tipShow('2')"><img src="~assets/images/icon_i_white.png"></i>
                 </span>{{userBankcardInfoResult.realName}}
      </div>
      <div class="name" v-else>
          <span class="limit2">
              限额：单笔{{userBankcardInfoResult.singleMaxAmtLimit | formatAmount}}<i v-on:click="tipShow('1')"><img src="~assets/images/icon_i_white.png"></i>
                 </span>{{userBankcardInfoResult.realName}}
      </div>
    </div>
    <div class="linear"></div>
  </div>
  <div class="limit">
      <div class="xw_logo">银行存管账户</div>
      账户余额 <span class="font_number">{{utils.currency(availableBalance)}}</span>元
  </div>

  <moneyInput
        :isDisabled="true"
        :amount.sync="chargeAmount"
        :userCash.sync="availableBalance"
        placeholder="暂时无法充值"
        type="recharge"
        @inputFocus="InputClickFocus()"
        @inputBlur="AmountInputBlur()"
    v-if="bankMaintain"></moneyInput>
  <moneyInput
        :isDisabled="false"
        :amount.sync="chargeAmount"
        :userCash.sync="availableBalance"
        placeholder="输入充值金额"
        type="recharge"
        @inputFocus="InputClickFocus()"
        @inputBlur="AmountInputBlur()"  v-else
  ></moneyInput>
  <div class="small_tips">{{tips}}</div>
  <div class="btn_area">
    <a href="javascript:;" @click="rechargeConfirm()" class="btn_tpls" :class="{'disabled' : (btnNextDisabled)}">充值</a>
  </div>

  <div class="desc">
      <h2>充值说明：</h2>
      <p>如大额充值，请使用电脑打开笑脸官网(PC)进行充值<br>官网网址:<span>https://www.facebank.cn</span></p>
  </div>
  <contactUs float="no"></contactUs>
  <wapTk2 v-bind:iswapTkShow2="wapTkStatus2" v-bind:pLeft2="pLeft2" v-bind:pTitle2="pTitle2" v-on:close="wapTkClose()"></wapTk2>
  <tosat :content.sync="tosatContent" :show.sync="tosatShow" ref="tosat"></tosat>
  <depositoryEntering ref="depositoryEntering" />
  <needActive :userInfo.sync="userInfo" ref="needActive"></needActive>
</div>
</template>

<style scoped src="./rechargeUI.css">
</style>
<script>
import wapTk2 from '@/components/wapTk2';
import {bankTrans} from 'tools';
export default {
  name: 'rechargeUI',
  data() {
    return {
        userInfo : '',
      userBankcardInfoJsonUrl: '/wap/getBankList',
      userBankcardInfoResult: '403',
      needrecharge: '', //还需充值
      verifyCodeBtnText: '获取验证码', //充值验证码
      verifyCodeBtnStatus: false,
      btnNextStatus: true, //按钮是否disabled
      isA: false, //按钮是否变红
      clA: true,
      clB: false,
      chargeAmount: '', //充值金额
      verfyCode: '', //验证码
      smsMobile: '',
      smsMobileStatus: '',
      wapTkStatus2: false, //弹框组件2
      pLeft2: '', //弹框组件2
      pTitle2: '', //弹框组件2
      isBindcard: false,
      userId: '',
      btnNextDisabled: true,
      isChecked: true, //是否签订协议
      subAmount: '0', //出借金额校对
      bankTrans: {},
      timeOut: '',
      startTime: '',
      serialNumber: '无',

      isShowVoice: false,

      tosatContent: '',
      tosatShow: '',

      tips: '',
      availableBalance : 0,
      miao:60,

      bankMaintain : false,

    }
  },
  filters: {
    formatAmount: function(val) {
      return parseInt((val / 10000) * 100) / 100 + '万';
    }
  },

  components: {
    wapTk2
  }, //这里注册

  created: function() {
    this.bankTrans = bankTrans.bankTrans;
    var userInfo = this.utils.getUserInfo();
    this.userInfo = userInfo.info;
    //用户银行卡信息
    var _this = this;
    $.ajax({
      url: this.utils.AJAXDOMAINNAME + "/wap/getBankCardDynamicsLimit",
      success: function(res) {
        if (res.code * 1 == 1) {
          _this.userBankcardInfoResult = res.data;
          _this.smsMobile = res.data.mobile;
          _this.bankMaintain = res.data.maintainStatus*1 == 1 || res.data.maintainStatus*1 == 3;
          if(_this.bankMaintain){
            _this.tips="";
            _this.btnNextDisabled = true;
          }else{
            _this.tips="该卡本次可充值最大金额"+_this.formatAmount(res.data.singleMaxAmtLimit);
          }
        } else {
          _this.pLeft2 = res.message;
          _this.wapTkStatus2 = true;
        }
      }

    })

    //获取用户资金
    var _this = this;
    $.ajax({
      url: this.utils.AJAXDOMAINNAME + "/wap/getAccountBalance",
      success: function(res) {
        if (res.code * 1 == 1) {
          _this.availableBalance = res.data.accountBalance;
          _this.needrecharge = _this.$route.query.investamount - _this.availableBalance;
        }
      }
    })
  },
  mounted:function(){

      this.$refs.needActive.checkDepositoryStatus();
  },
  methods: {
    formatAmount: function(val) {
      return parseInt((val / 10000) * 100) / 100 + '万';
    },
    changeCheckedState: function() {
      this.isChecked = !this.isChecked;
    },
    rechargeConfirm: function() {
        if (!this.$refs.needActive.checkDepositoryStatus()) return false;
        if(this.btnNextDisabled) return;

      if (!this.isChecked) {
        this.pLeft2 = "是否已经阅读《代收代付业务授权书》？";
        this.wapTkStatus2 = true;
        return;
      }
      // if(this.subAmount!=this.chargeAmount){
      //   this.pLeft2="尊敬的用户您好，由于您的充值金额发生变化，为了您的资金安全，建议您重新获取短信验证码！";
      //   this.wapTkStatus2=true;
      //     return;
      // }
      var _this = this;
      _this.btnNextDisabled = true;
      $.ajax({
        url: this.utils.AJAXDOMAINNAME + "/wap/depositoryRecharge",
        data: '{"amount":"' + (_this.chargeAmount.replace(/,/g, '')) + '"}',
        success: function(res) {

          if (res.data != null) {
            _this.serialNumber = res.data.serialNumber;
          }
          if (res.code * 1 == 1) {

            _this.$refs.depositoryEntering.show();
            setTimeout(function() {
                _this.btnNextDisabled = false;
                _this.$refs.depositoryEntering.close();
                window.location.href = res.data.url;
            }, 2000)
          } else {
            _this.pLeft2 = res.message;
            _this.wapTkStatus2 = true;
            _this.btnNextDisabled = false;

          }
        },
        error: function() {
            _this.btnNextDisabled = false;

        }
      })
    },
    tipShow(d){
      if(d==1){
        this.pLeft2 = "银行卡的充值限额，是由各支付通道支持的充值额度和您今日的充值记录综合计算得出。由于各银行限额可能随时调整，具体限额以实际情况为准。";
        this.wapTkStatus2 = true;
      }else if(d==2){
        this.pLeft2 = "当前银行通道维护中，维护期间无法充值。<br><br>维护时间："+this.userBankcardInfoResult.rechargeMaintainSTime+"~"+this.userBankcardInfoResult.rechargeMaintainETime;
        this.wapTkStatus2 = true;
      }
    },
    //弹框关闭
    wapTkClose: function() {
      this.wapTkStatus2 = false;
      this.verifyCodeBtnText = "获取验证码";
      this.clA = true;
      this.clB = false;
      this.verifyCodeBtnStatus = false;
      this.miao = 0;
      this.verfyCode = '';
      this.chargeAmount = '';
    },

    InputClickFocus() {
      this.startTime = new Date().getTime();
    },
    AmountInputBlur(){
        //this.chargeAmount = this.utils.formatThousandth(this.chargeAmount);

    }
  },
  watch: {
    chargeAmount: function(val) {

      var newVal = val.replace(/,/g, '')*1;
      if(newVal > this.userBankcardInfoResult.singleMaxAmtLimit * 1){
          this.tips = '输入金额已超出本次可充值最大金额';
          this.btnNextDisabled = true;
          return;
      }else if(newVal < 1 && newVal > 0){
          this.tips = '不能少于1元';
          this.btnNextDisabled = true;
          return;
      }else if(newVal=='0'){
        this.tips="该卡本次可充值最大金额"+this.formatAmount(this.userBankcardInfoResult.singleMaxAmtLimit);
        this.btnNextDisabled = true;
        return;
      }
      var money = this.utils.currency(this.availableBalance*1 + newVal);
      this.tips = newVal*1 > 0 ? ('充值后账户余额 ' + money + '元') : '';
      this.btnNextDisabled = newVal < 1 || newVal == 0;
    }
  }
}
</script>
