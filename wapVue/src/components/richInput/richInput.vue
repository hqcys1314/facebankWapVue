<template>
  <div class="rich-input-wrap">
    <label v-if="label">{{label}}</label>
    <input ref="input" class="rich-input" :id="id" :value="value" :type="type" :maxlength="maxlength"
           :placeholder="placeholder"
           @input="updateValue($event.target.value)"
           @keydown = "returnThisEvent($event)"
           @focus="inputFocus($event.target.value)"
           @blur="inputBlur"
    >
    <div class="input-tips" v-if="isShowTips">
      <slot></slot>
    </div>
    <i v-if="showClear && isShowClear" class="iconfont icon-ic_close" v-on:click="clear"></i>
  </div>
</template>
<style src="./richInput.less" lang="less"></style>
<script>
  export default{
    props: {
      id: String,
      value: String,
      label: String,
      type: String,
      maxlength: String,
      showClear: {
        type: Boolean,
        default: true
      },
      placeholder: String,
      dataEvent:String,
      dataEventName:String,
      dataEventCategory:String,
    },
    data() {
      return {
        isShowClear: false,
        isShowTips: false
      };
    },
    methods: {
      clear() {
          this.updateValue('');
          this.$refs.input.value='';
          this.$refs.input.focus();
          this.isShowTips = false;
          this.isShowClear = false
      },
      updateValue(value) {
        this.$emit('input', value);
        if(value != ''){
            this.isShowTips = true;
            this.isShowClear = true;
        }else{
            this.isShowTips = false;
            this.isShowClear = false;
        }
        /*if (!this.isShowClear) {
            this.isShowClear = true;
            this.isShowTips = true;
        }*/
      },
      returnThisEvent(event){
        this.$emit('keydown', event);
      },
      inputFocus(val) {
        this.$emit('focus');
        if (this.$slots.default && val != '') {
          this.isShowTips = true;
        }

        if (val && val.length>0 && !this.isShowClear) {
          this.isShowClear = true;
        }
      },
      inputBlur() {
        this.$emit('blur');
        this.isShowTips = false;
        setTimeout(() => {this.isShowClear = false}, 150);
      }
    }
  }
</script>
