<template>
<div class="white_background" v-cloak>
    <div class="blank_36"></div>
    <div class="card_box">
      <div class="card_info">
        <img class="bank" v-if="bankInfo.bankCode" v-bind:src="'//static.facebank.cn/static/wapFront/common/images/bankBack/'+ (bankTrans(bankInfo.bankCode).bigImgName ? bankTrans(bankInfo.bankCode).bigImgName : 'default') +'.png'">
        <div class="bank_info">
            <div class="bankName">{{bankInfo.bankName}}</div>
            <div class="card_num">{{bankInfo.cardNo}}</div>
            <div class="name">{{bankInfo.realName}}
                <span class="limit2"></span>

            </div>
        </div>
      </div>
      <div class="linear"></div>
    </div>
    <div class="limit">
        单笔限额：<span>{{bankInfo.singleMaxAmtLimit | formatAmount}}</span>元/笔；单日限额：<span>{{bankInfo.daycarMaxAmtLimit | formatAmount}}</span>元/天
    </div>
    <div class="btn_area">
        <a href="javascript:;" class="btn_tpls" @click="changeBank">更换</a>
    </div>
    <div class="desc">
        <h2>温馨提示：</h2>
        <ul>
            <li>账户可用余额、待收本息均为0时，可自助更换银行卡；</li>
            <li>如果账户可用余额或待收本息不为0，更换银行卡时需通过安全性审核；</li>
            <li>建议绑定银行卡账户为银行Ⅰ类账户（Ⅱ类、Ⅲ类账户会有金额及其他使用限制），具体可与银行客服沟通确认账户类型</li>
        </ul>
    </div>

    <!--统一提示层-->
    <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
    <needActive ref="needActive"></needActive>
    <depositoryEntering ref="depositoryEntering" />
</div>
</template>

<style scoped src="./userBankInfo.css">
</style>
<script>
import {bankTrans} from 'tools';
import informationLayer from '@/components/informationLayer';
export default {
  name: 'userBankInfo',
  data() {
      return {
          bankInfo : '',
          bankTrans: {},
          userCashInfo : '',

          informationLayerContent : '',
          showLayerStatus : false,
      }
  },
  components:{informationLayer},//这里注册
  filters: {
      formatAmount: function(val) {
          return parseInt((val / 10000) * 100) / 100 + '万';
      }
  },
  created: function() {
      this.bankTrans = bankTrans.bankTrans;
      //用户银行卡信息
      var _this = this;

      //获取用户资金
      $.ajax({
          url : this.utils.AJAXDOMAINNAME+"/wap/getUserAccountCashInfo",
          success : function(res){
              if(res.code==1){
                 _this.userCashInfo=res.data;
              }
          }
      })

      $.ajax({
          url: this.utils.AJAXDOMAINNAME + "/wap/getUserBindCard",
          success: function(res) {
              if (res.code * 1 == 1) {
                  _this.bankInfo = res.data;
              } else {
                  _this.informationLayerContent = res.message;
                  _this.showLayerStatus = true;
              }
          }

      })
  },
  mounted: function(){
      this.$refs.needActive.checkDepositoryStatus();
  },
  methods: {
      changeBank(){
          var _this = this;
          if(!this.$refs.needActive.checkDepositoryStatus()) return false;
          /*
            获取用户绑定银行卡接口 , cardStatus 绑卡状态字段定义 :
            1 正常 2 存在审核中的换绑卡记录
          */
          if(this.bankInfo.cardStatus == '2'){
              this.$router.replace({
                  name : 'changeSuccess',
                  query : {
                      type : 'changeBank'
                  }
              })
          }else if(this.userCashInfo.totalAssert * 1 > 0){
              this.$router.push({
                  name : 'changeBankcard'
              })
          }else{
              $.ajax({
                  url : this.utils.AJAXDOMAINNAME+"/wap/changeBindBank",
                  data : JSON.stringify({
                      idCardFrontImg : '',
                      idCardBackImg : '',
                      personBankCardImg : ''
                  }),
                  success : function(rs){
                      if(rs.code*1 == 1){
                          _this.$refs.depositoryEntering.show();
                          setTimeout(function() {
                              _this.$refs.depositoryEntering.close();
                              window.location.href = rs.data.url;
                          },
                          2000)
                      }else{
                          _this.informationLayerContent = rs.message;
                          _this.showLayerStatus = true;
                      }
                  }
              })
          }
      }
  }
}
</script>
