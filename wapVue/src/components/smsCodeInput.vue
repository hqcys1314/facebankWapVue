<template>
    <div class="code_list">
        <span :class="{'active' : isFocus || smsCode.length > 0}">{{smsCode[0]}}
            <i v-if="isFocus && smsCode[0] === undefined && smsCode.length == 0"></i>
        </span>
        <span :class="{'active' : (isFocus && smsCode.length == 1) || smsCode.length > 1}">{{smsCode[1]}}
            <i v-if="isFocus && smsCode[1] === undefined && smsCode.length == 1"></i>
        </span>
        <span :class="{'active' : (isFocus && smsCode.length == 2) || smsCode.length > 2}">{{smsCode[2]}}
            <i v-if="isFocus && smsCode[2] === undefined && smsCode.length == 2"></i>
        </span>
        <span :class="{'active' : (isFocus && smsCode.length == 3) || smsCode.length > 3}">{{smsCode[3]}}
            <i v-if="isFocus && smsCode[3] === undefined && smsCode.length == 3"></i>
        </span>
        <span :class="{'active' : (isFocus && smsCode.length == 4) || smsCode.length > 4}">{{smsCode[4]}}
            <i v-if="isFocus && smsCode[4] === undefined && smsCode.length == 4"></i>
        </span>
        <span :class="{'active' : (isFocus && smsCode.length == 5) || smsCode.length > 5}">{{smsCode[5]}}
            <i v-if="isFocus && smsCode[5] === undefined && smsCode.length == 5"></i>
        </span>
        <input name="smsCode" class="allCode" maxlength="6" @focus="()=>{this.isFocus = true}" @blur="()=>{this.isFocus = false}" type="tel" ref="codeInput" v-model="smsCode" />
    </div>
</template>
<script>
    export default {
      name: 'informationLayer',
      props: ['code', 'focus', 'length'],
      data () {
          return {
              smsCode : '',
              smsLength : 6,
              isFocus : true,
          }
      },
      created:function(){
          this.smsCode = this.code;
          this.smsLenght = this.length;
      },
      mounted:function(){
         this.setFocus(true)
      },
      methods:{
          setFocus(inFocus){
              this.isFocus = inFocus;
              if(this.isFocus){
                  this.$refs.codeInput.focus();
              }else{
                  this.$refs.codeInput.blur();
              }
          }
      },
      watch : {
          focus : function(val){
              this.isFocus = val;
              if(val){
                  this.$refs.codeInput.focus();
              }else{
                  this.$refs.codeInput.blur();
              }
          },
          smsCode : function(val){
              var val = val.replace(/[^\d]/g,"")
              this.$emit('update:code', val.substr(0,this.smsLength))
              this.smsCode= val;
              if(val.length >= this.smsLength){
                  this.isFocus = false;
                  this.$refs.codeInput.blur();
                  this.$emit('update:focus', false)
                  this.$emit('inputEnd', val)
              }
          },
          code : function(val){
              this.smsCode = val;;
          },
          length : function(val){
              this.smsLength = val;
          }
      }
    }
</script>
<style scoped>
.code_list{ display: block;height:2.4rem;line-height:2.25rem;margin:0 .9375rem; position:relative;margin-bottom:1.375rem;}
.code_list span{width:1.75rem;margin-right:.875rem;float:left;height:2.25rem;line-height:2.25rem;font-size:1.5rem;border-bottom:2px solid #D8DCE3; text-align:center; position:relative;color:#2B313D}
.code_list span i{display:block;width:2px;height:1.5rem;background:#2B313D;overflow:hidden;margin:0 auto; position: absolute;left:50%;margin-left:-1px;top:50%;margin-top:-.75rem;
    -webkit-animation: cursor_animate .5s infinite;
    animation: cursor_animate .5s infinite;
}


.code_list span.active{border-bottom:2px solid #2B313D}
.code_list span input{width:1.75rem;height:2.25rem;font-size:1.5rem;line-height:2.25rem;border:0;background:#FFFFFF;text-align:center;}
.code_list input.allCode{width:200%;height:2.25rem;line-height:2.25rem;border:0;background:rgba(255,255,255,0);color:rgba(255,255,255,0); position: absolute;left:0;top:0;color:transparent; text-indent: -999em;-webkit-tap-highlight-color:rgba(0,0,0,0);outline: none;margin-left: -100%;}
@-webkit-keyframes cursor_animate {
    0%{ opacity: 1}
    50%{ opacity: 0}
    100%{ opacity: 1}
}
@keyframes cursor_animate {
    0%{ opacity: 1}
    50%{ opacity: 0}
    100%{ opacity: 1}
}
</style>
