<template>
  <div v-show="isSfShow" id="wapTk">
    <div class="wapMc"></div>
    <div class="wapSf">
        <div class="wapSfTip">
            <p class="p-title">{{sfTitle}}</p>
            <p class="p-left" v-html="sfLeft"></p>
            <p class="p3"  v-on:click="toHide()">
                知道了
            </p>
        </div>
    </div>
  </div>
</template>
<script>
    export default {
      name: 'wapTk',
      props: ['isSfShow','sfTitle','sfLeft'],
      data () {
          return {
              isSfShowV : false,
              sfTitleV : '',
              sfLeftV : '',
          }
      },
      methods:{
        toHide:function(){
            this.$emit('update:isSfShow', this.isSfShowV)
            this.$emit('update:sfTitle', this.sfTitleV)
            this.$emit('update:sfLeft', this.sfLeftV)
        }
      }
    }
</script>
<style scoped>
.wapMc{background-color: #2b313d;position:fixed;width: 100%;top: 0;opacity: 0.5;z-index: 100;left: 0;height: 100%;}

/*提示框*/
.wapSf{position:fixed;top: 50%;z-index: 101;  width: 100%;left: 0;transform: translateY(-50%);
-ms-transform:translateY(-50%); 	/* IE 9 */
-moz-transform:translateY(-50%); 	/* Firefox */
-webkit-transform:translateY(-50%); /* Safari 和 Chrome */
-o-transform:translateY(-50%); 	/* Opera */}
.wapSf .wapSfTip{width: 75%;margin: 0 auto;background-color: #fff;border-radius: 5px;padding-top: 1.5rem;}
.wapSf .wapSfTip .p-title{text-align: center;font-size: 1.125rem;color: #2B313D;margin-bottom: 0.75rem;}
.wapSf .wapSfTip .p-left{font-size: 0.875rem;color: #717583;margin: 0 1.3125rem;padding: 0 0 1.5rem;position: relative;}
.wapSf .wapSfTip .p3{width: 100%;text-align: center;color:#F0484E;height:3rem;line-height:3rem;font-size: 1rem; border-top: 1px #DFE3EB solid;}
</style>
