<template>
  <div v-show="iswapTkShow" id="wapTk">
    <div class="wapMc"></div>
    <div class="wapPos">
        <div class="wapTip">
            <p class="p-title">{{pTitle}}</p>
            <p class="p-left" v-html="pLeft"></p>
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
      props: ['iswapTkShow','pTitle','pLeft'],
      methods:{
        toHide:function(){
            this.$emit('close');
        }
      }
    }
</script>
<style scoped>

</style>
