<template>
  <div v-show="iswapTkShowInvest" class="wapTkInvest">
    <div class="wapMc"></div>
    <div class="wapPos">
        <div class="wapTip">
            <p class="p-title">{{pTitleInvest}}</p>
            <p class="p-left" v-html="pLeftInvest"></p>
            <p class="p3"  v-on:click="toLoanlist()">
                去出借
            </p>
        </div>
    </div>
  </div>
</template>
<script>

    export default {
      name: 'wapTkInvest',
      props: ['iswapTkShowInvest','pTitleInvest','pLeftInvest'],
      methods:{
        toLoanlist:function(){
            this.$emit('toLoanlist');
        }
      },

    }
</script>
<style scoped>
   .wapTkInvest{z-index: 12;}
</style>
