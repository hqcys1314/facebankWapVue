<template>
  <div class="white_background">
      <div class="setPwdTip" v-if="userBankcardInfoResult.maintainStatus*1 == 2 || userBankcardInfoResult.maintainStatus*1 == 3">
        <p>
            <span class="span4">当前银行通道维护中，维护期间无法提现。维护时间：{{userBankcardInfoResult.withdrawMaintainSTime}}~{{userBankcardInfoResult.withdrawMaintainETime}}</span>
        </p>
      </div>
      <div class="card_box">
        <div class="card_info">
          <div class="bank_info">
            <img v-bind:src="'//static.facebank.cn/static/wapFront/common/images/bankIconWhite/'+ (bankTrans(userBankcardInfoResult.bankCode).smallIcon ? bankTrans(userBankcardInfoResult.bankCode).smallIcon : 'default') +'.png'">
             {{userBankcardInfoResult.bankName}}

         </div>
          <div class="card_num">{{userBankcardInfoResult.cardNo}}</div>
          <div class="name">
              <span class="limit2" v-if="userBankcardInfoResult.maintainStatus*1 == 0">限额：单笔{{userBankcardInfoResult.withDrawSingleMaxAmtLimit | formatAmount}}</span>
              {{userBankcardInfoResult.realName}}
          </div>
        </div>
        <div class="linear"></div>
      </div>

      <div class="limit_type2">
          <div class="xw_logo">银行存管账户</div>
          <p>可提现余额 <span class="font_number">{{utils.currency(availableBalance)}}</span>元</p>
          <p class="p_yellow" v-if="drawCashFrozenCash*1 > 0" @click="showWithdrawLayer()">提现中金额 <span class="font_number">{{utils.currency(drawCashFrozenCash)}}</span>元 <i class="iconfont icon-info sensors-btn" sensors-name="提现提示"></i></p>
      </div>

      <moneyInput type="withdraw"
            :isDisabled="false"
            :amount.sync="withdrawAmount"
            :userCash.sync="availableBalance"
            :limitAmount.sync="withdrawLimit"
            placeholder='输入提现金额,最低1元'
            @inputFocus="InputClickFocus()"
            @inputBlur="AmountInputBlur()"
      ></moneyInput>
      <div class="small_tips">{{tips}}</div>
      <div class="btn_area">
        <a href="javascript:;" @click="debaseWidthdrawShow()" class="btn_tpls" :class="{'disabled' : btnNextDisabled}">预计下个工作日到账，下一步</a>
      </div>

      <div class="desc" style="display:none;">
          <h2>提现说明：</h2>
          <p>1、提现申请提交后的下一个工作内到账（周末节假日顺延）<br>2、提现暂不收取服务费</p>
      </div>


      <div class="layer_style" style="top:20%" v-show="debaseWidthdraw" v-cloak>
          <div class="layer_title">提示</div>
          <div class="layer_content" style="text-align:left;padding:.75rem 1rem 0 1rem;color:#2B313D">进入银行存管系统后，如果提现中断，资金将会在20分钟内退回到账户余额！</div>
          <div class="drawTipsItem">
              <div class="left">
                  <p class="first">输入提现金额</p>
                  <p>进入银行存管系统</p>
                  <p>输入交易密码，确认提现</p>
              </div>
              <div class="right">
                  <p class="first">已完成</p>
                  <p>下一步</p>
                  <p>未开始</p>
              </div>
          </div>
          <div class="layer_btn two">
              <a style="color:#848999" @click="wapTkClose()">取消</a>
              <a @click="withdrawConfirm()">下一步</a>
          </div>
      </div>
      <div class="layerMask" v-show="debaseWidthdraw" v-cloak></div>

        <!-- <div class="wapPos" v-show="debaseWidthdraw">
            <div class="wapTip">
                <p class="p-title">提示</p>
                <p class="p-center" style="color:#848899">{{debaseContent}}</p>
                <p class="p2">
                    <span @click="wapTkClose()" style="color:#848899">取消</span>
                    <span @click="withdrawConfirm()">提现</span>
                </p>
            </div>
        </div> -->
        <wapTk2 v-bind:iswapTkShow2="wapTkStatus2" v-bind:pLeft2="pLeft2" v-bind:pTitle2="pTitle2" v-on:close="wapTkClose()"></wapTk2>
        <withdrawLayer from="withdrawPage" ref="withdrawLayer" :listItem="withdrawCashList" :drawCashFrozenCash="drawCashFrozenCash"></withdrawLayer>
        <contactUs></contactUs>

        <depositoryEntering ref="depositoryEntering" />
        <needActive :userInfo.sync="userInfo" ref="needActive"></needActive>

  </div>
</template>

<style scoped src="./withdraw.css"></style>

<script>
import {Modal}from 'tools';
import {bankTrans}from 'tools';
import * as constants from './withdrawConstants';
import wapTk2 from '@/components/wapTk2'
import withdrawLayer from '@/components/withdrawLayer'

export default {
    name:
    constants.NAME,
    data() {
        return {
            userInfo : '',
            withdrawAmount: '',
            availableBalance: '0.00',
            userBankcardInfoResult: '',
            smsCodeJsonUrl: '/wap/getWithdrawSms',
            //获取验证码
            verifyCodeBtnText: '获取验证码',
            //充值验证码
            verifyCodeBtnStatus: false,
            btnNextStatus: true,
            //按钮是否disabled
            isA: false,
            //按钮是否变红
            clA: true,
            clB: false,
            withdrawSmsCode: '',
            province: '',
            city: '',
            mobile: '',
            btnNextDisabled: true,
            cityList: '',
            provinceList: '',
            debaseWidthdraw: false,
            //防提现
            //debaseContent:'由于近期充值额度不高，提现后再次充值将不如以前便捷。为保证您不因充值限额问题而错过优质标的，请您确认本次提现是否继续？',
            debaseContent: '如果提现中断，资金将会在20分钟内退回到账户余额！',
            wapTkStatus2: false,
            //弹框组件2
            pLeft2: '',
            //弹框组件2
            pTitle2: '',
            //弹框组件2
            payFee: '',
            bankTrans: {},
            withdrawDisabled: false,
            startTime: '',
            serialNumber: '无',
            tips: '',
            miao: 60,
            withdrawLimit : 0,
            withdrawCashList : '',
            drawCashFrozenCash : 0,
        }
    },
    filters: {
        formatAmount: function(val) {
            return parseInt((val / 10000) * 100) / 100 + '万';
        }
    },
    components: {
        wapTk2, withdrawLayer
    },
    //这里注册
    created: function() {
        this.bankTrans = bankTrans.bankTrans;
        var userInfo = this.utils.getUserInfo();
        this.userInfo = userInfo.info;
        //用户银行卡信息
        var _this = this;
        $.ajax({
            url: this.utils.AJAXDOMAINNAME + "/wap/getUserBindCard",
            success: function(res) {
                if (res.code == 1) {
                    _this.userBankcardInfoResult = res.data;
                    _this.mobile = res.data.mobile;
                    _this.withdrawLimit = res.data.withDrawSingleMaxAmtLimit * 1;
                } else {
                    _this.pLeft2 = res.message;
                    _this.wapTkStatus2 = true;
                }
            }

        })

        //获取提现中列表
        $.ajax({
            url: this.utils.AJAXDOMAINNAME + "/wap/getUserProcessingWithdrawList",
            success: function(res) {
                if (res.code == 1) {
                    _this.withdrawCashList = res.data;
                }
            }
        })
        //获取用户资金
        $.ajax({
            url: this.utils.AJAXDOMAINNAME + "/wap/getUserAccountCashInfo",
            success: function(res) {
                if (res.code == 1) {
                    _this.drawCashFrozenCash = res.data.drawCashFrozenCash;
                    _this.availableBalance = res.data.accountBalance;
                    console.log(_this.drawCashFrozenCash)
                }
            }
        })

    },
    mounted:function(){

        if (!this.$refs.needActive.checkDepositoryStatus()) return false;
    },
    methods: {
        showWithdrawLayer(){
            var _this = this;
            setTimeout(function(){
                _this.$refs.withdrawLayer.show();
            },200)

        },
        InputClickFocus() {
            this.startTime = new Date().getTime();
        },
        AmountInputBlur(){

        },
        debaseWidthdrawShow: function() {
            if (this.btnNextDisabled) return;
            if (!this.$refs.needActive.checkDepositoryStatus()) return false;
            if (this.withdrawAmount * 1 > this.availableBalance * 1) {
                this.pLeft2 = "余额不足";
                this.wapTkStatus2 = true;
                return;
            }
            this.debaseWidthdraw = true;
        },
        withdrawConfirm: function() {

            var _this = this;
            _this.debaseWidthdraw = false;
            _this.withdrawDisabled = true;
            $.ajax({
                url: this.utils.AJAXDOMAINNAME + "/wap/depositoryWithdraw",
                data: '{"amount":"' + _this.withdrawAmount.replace(/,/g, '') + '"}',
                success: function(res) {
                    _this.btnNextDisabled = false;
                    _this.withdrawDisabled = false;
                    if (res.data != null) {
                        _this.serialNumber = res.data.serialNumber;
                    }

                    if (res.code == 1) {

                        _this.$refs.depositoryEntering.show();
                        setTimeout(function() {
                            _this.$refs.depositoryEntering.close();
                            window.location.href = res.data.url;
                        },
                        2000)
                    } else {

                        _this.pLeft2 = res.message;
                        _this.wapTkStatus2 = true;
                    }
                },
                error: function() {

                }
            })
        },

        wapTkClose: function() {
            this.wapTkStatus2 = false;
            this.debaseWidthdraw = false;
        },
    },
    watch: {
        withdrawAmount: function(val) {
            var newVal = val.replace(/,/g, '')*1;
            this.btnNextDisabled = true;
            if (newVal != '' && newVal * 1 > this.availableBalance * 1) {
                this.tips = '输入金额已超过可提现金额';
            } else if (newVal != '' && newVal * 1 < 1) {
                this.tips = '不能少于1元';
            } else if (newVal != '' && newVal * 1 > this.withdrawLimit) {
                var limit = parseInt(((this.withdrawLimit * 1) / 10000) * 100) / 100;
                this.tips = '单笔提现限额'+ limit +'万，如提现金额超出'+ limit +'万，可分多笔提现';
            } else if (newVal != '' && newVal * 1 >= 1 && newVal * 1 <= this.withdrawLimit) {
                this.tips = '应到账' + this.utils.currency(newVal) + '元(暂不收取手续费)';
                this.btnNextDisabled = false;
            } else {
                this.tips = '';
            }

        }
    }
}
</script>
