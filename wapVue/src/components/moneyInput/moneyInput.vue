<template>
    <div class="moneyInput">
        <span>￥</span>
        <input type="text" ref="inputBox" name="tranAmt" :placeholder="placeholder" :disabled="isDisabled" v-model="amounts"
            @focus="inputFocus"
            @blur="inputBlur"
            @keyup="keyUp"
        >
        <input name="withdrawBtn" type="button" value="全部提现" @click="setAll()" class="code-red"
            v-if="type == 'withdraw' &&  (userCash*1<1000000 && userCash*1 > 1) && amounts == ''"
        >
        <a href="javascript:;" @click="clearAmount" class="input_clear"
            v-if="type == 'withdraw' && handlerAmount(amounts) > 0 && !clearAmountStatus"
        ></a>
        <a href="javascript:;" @click="clearAmount" class="input_clear"
            v-if="type == 'recharge' && handlerAmount(amounts) > 0 && !clearAmountStatus"
        ></a>
    </div>
</template>
<script>
    export default {
      name: 'moneyInput',
      props: ['amount', 'userCash', 'limitAmount', 'type', 'placeholder','isDisabled'],
      data () {
          return {
              amounts : this.amount,
              userCashs : '',
              limitAmounts : '',
              clearAmountStatus : false,
          }
      },
      created:function(){
      },
      methods:{
          handlerAmount:function(number){
              return (typeof number == 'string' ? number.replace(/,/g, '')*1 : number)
          },
          clearAmount : function(event){
              this.clearAmountStatus = false;
              this.amounts = '';
              this.$refs.inputBox.focus();
              this.$emit('update:amount', this.amounts)
              if(this.$emit('inputBlur')) this.$emit('inputBlur', this.amounts)
          },
          setAll:function(){
              this.amounts=this.thousandthToNumber(this.userCashs);
              this.clearAmountStatus = true;
              this.inputBlur();
          },
          thousandthToNumber:function(num) {
              return this.utils.formatThousandthFixed(num)
          },
          inputFocus:function(){
              if(this.amounts > 0 || this.amounts != '') this.clearAmountStatus = false
              this.$emit('inputFocus', this.amounts)
          },
          inputBlur:function(event){
              if(this.amounts != '') this.clearAmountStatus = true;
              this.amounts = this.utils.formatThousandth(this.utils.formatThousandthFixed(this.amounts));
              if(this.amounts && this.amounts.indexOf('.') == -1){
                  this.amounts=this.amounts+'.00'
              }
              this.$emit('update:amount', this.amounts)
              if(this.$emit('inputBlur')) this.$emit('inputBlur', this.amounts)
          },
          keyUp:function(){
              this.amounts = this.utils.formatThousandthFixed(this.amounts);
              this.$emit('update:amount', this.amounts)
              if(this.$emit('keyUp')) this.$emit('keyUp', this.amounts)
          },
      },
      watch : {
          amount : function(val){
              this.amounts = val;
          },
          userCash : function(val){
              this.userCashs = this.utils.formatThousandth(this.utils.formatThousandthFixed(val));
          },
          limitAmount : function(val){
              this.limitAmounts = val;
          },
      }
    }
</script>
<style scoped>
.moneyInput{margin:0 1rem;height:4.75rem; display:block;background:url(//static.facebank.cn/static/wapFront/depository/img/input_bg.png) no-repeat center center/100% 100%; position: relative;}
.moneyInput span{float:left;line-height:4.75rem;width:auto; white-space: nowrap;font-size:2.25rem;color:#2B313D}
.moneyInput input{width:80%;float:left;margin-left:1rem;font-size:2.25rem;height:3.75rem;line-height:3.75rem;padding:.5rem 0;border:0;background:none;color:#2B313D;font-weight: bold;}
.moneyInput input::-webkit-input-placeholder{height:3.75rem !important;margin:0 !important;color: #BCC2CC !important;font-size:1.25rem !important;font-weight:200 !important;line-height:3.75rem !important;font-weight:200;}
.moneyInput input::-moz-input-placeholder{height:3.75rem !important;margin:0 !important;color: #BCC2CC !important;font-size:1.25rem !important;font-weight:200 !important;line-height:3.75rem !important;font-weight:200;}
.moneyInput .code-red{width:auto;text-align: center;font-size: 0.75rem;background-color:transparent;top:0;padding: 0;border-radius:5px;position: absolute;height:4.75rem;line-height:4.75rem;right:0;border:0;color:#F0484E;}
</style>
