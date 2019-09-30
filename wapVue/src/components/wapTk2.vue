<template>
  <div v-show="iswapTkShow2" id="wapTk2">
    <div class="wapMc"></div>
    <div class="wapPos">
        <div class="wapTip">
            <p class="p-title" v-if="pTitle2">{{pTitle2}}</p>
            <p class="p-left" v-html="pLeft2"></p>
            <p class="p3"  v-on:click="toHide()">
                确定
            </p>
        </div>
    </div>
  </div>
</template>
<script>
    export default {
      name: 'wapTk2',
      props: ['iswapTkShow2','pTitle2','pLeft2'],
      methods:{
        toHide:function(){
            this.$emit('close');
        }
      }
    }
</script>
<style scoped>

</style>
