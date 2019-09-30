<template>
  <div id="firstAddRate" v-show="isfirstAddRateShow">
    <div class="wapMc"></div>
    <div class="wapGz"  v-cloak >
        <div class="gz_con">
            <p class="p_title">首购加息说明</p>
            <div class="content">
                <p class="mtop">1、首次购买大于等于90天小于180天的产品，自动加息0.3%。</p>
                <p>	2、首次购买大于等于180天的产品，自动加息0.5%。</p>
                <p>	3、参加了0.5%的首投加息活动后，不可以再参加0.3%的首投加息活动。</p>
                <p>	4、参与了该活动仍可在出借时使用加息红包，效果叠加。</p>
            </div>
            <p class="p_btn">上下滑动查看更多...</p>
            <p class="p_close">
                <img src="~assets/wapFront/common/img/close.png" class="tk_close"  v-on:click="toHide()">
            </p>
         </div>
    </div>
  </div>

</template>
<script>
    export default {
      name: 'firstAddRate',
      props: ['isfirstAddRateShow'],
      methods:{
        toHide:function(){
            this.$emit('close');
        }
      }
    }
</script>
<style scoped>
    /*首购加息规则*/
    .wapGz{position: fixed;top: 10%;left: 50%;margin-left: -41%;z-index: 21;width: 82%;height: 395px;}
    .wapGz .gz_con{border-radius: 10px;position: relative;padding-bottom: 15px;background-color: #fff;height: 95%;}
    .wapGz .gz_con .p_title{height: 50px;line-height: 50px;margin: 0 auto;color:#f0484e;font-size: 0.9rem;text-align: center;border-bottom: 1px #DFE3EB solid;}
    .wapGz .gz_con .content{overflow-y: scroll;    height: 80%;}
    .wapGz .gz_con .content .mtop{margin-top: 1rem; }
    .wapGz .gz_con .content h3{color: #f0484e;font-size: 0.95rem;font-weight: normal;width: 90%;margin: 10px auto 0;}
    .wapGz .gz_con .content p{color: #848999;font-size: 0.9rem;width: 90%;margin: 3px auto 10px;}
    .wapGz .gz_con .p_con{width: 210px;margin: 0 auto;padding: 20px 0;text-align: center;}
    .wapGz .gz_con .p_btn{background-color:#f1f1f1;color:#848999;height: 35px;line-height: 35px;font-size: 0.9em;text-align: center;
        position: absolute;bottom: 0; border-radius: 0 0 10px 10px;width: 100%;}
    .wapGz .gz_con .p_close{text-align: center;position: absolute;bottom: -42px;left: 50%;margin-left: -15px;}
    .wapGz .gz_con .p_close img{width: 30px;}
</style>
