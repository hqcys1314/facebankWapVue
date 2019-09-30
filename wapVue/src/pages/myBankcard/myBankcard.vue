<template>
  <div class="myBankcard">
    <div class="rw-1">
            <img v-bind:src="'https://static.facebank.cn/static/wapFront/common/images/bankBack/'+ (bankTrans(userBankcardInfoResult.bankCode).bigImgName ? bankTrans(userBankcardInfoResult.bankCode).bigImgName : 'default') +'.png'">
            <div class="pos">
                <p class="p1">
                    <span>{{userBankcardInfoResult.bankName}}</span>
                </p>
                <p class="p2">
                    {{userBankcardInfoResult.cardNo}}
                </p>
                <p class="p3">
                    {{userBankcardInfoResult.realName}}
                </p>
            </div>
      </div>
      <div class="rw-2">单笔限额：<span v-if="userBankcardInfoResult.singleMaxAmtLimit/10000 >= 1">{{userBankcardInfoResult.singleMaxAmtLimit/10000 | currency}}万元</span>
                                 <span v-if="userBankcardInfoResult.singleMaxAmtLimit/10000 < 1">{{userBankcardInfoResult.singleMaxAmtLimit | currency}}元</span>/笔；&nbsp;
                        单日限额：<span v-if="userBankcardInfoResult.daycarMaxAmtLimit/10000 >= 1">{{userBankcardInfoResult.daycarMaxAmtLimit/10000 | currency}}万元</span>
                                 <span v-if="userBankcardInfoResult.daycarMaxAmtLimit/10000 < 1">{{userBankcardInfoResult.daycarMaxAmtLimit | currency}}元</span>/天
      </div>
      <div class="suc-page-btn">
          <router-link class="btn_tpls" :to="{ path: '/changeBankcard'}">更换银行卡</router-link>
      </div>
      <div class="chage-tip">
          温馨提示：<br/>
          账户可用余额、待收本息均为0后才能更换银行卡
      </div>
  </div>
</template>

<style scoped src="./myBankcard.css"></style>

<script>
  import * as constants from './myBankcardConstants';
  import {bankTrans} from 'tools';
  import {utils,Modal} from 'tools';

  export default {
    name: constants.NAME,
    data() {
      return {
        userBankcardInfoResult:'',
        bankTrans : {},
      }
    },
    created:function () {
        this.bankTrans = bankTrans.bankTrans;
      //用户银行卡信息
      var _this = this;
      $.ajax({
          url : utils.AJAXDOMAINNAME+"/wap/getUserBindCard",
          success : function(res){
              if(res.code==1){
                _this.userBankcardInfoResult = res.data;
              }
          }

      })
    },
    methods: {

    },
    components: {}
  }
</script>
