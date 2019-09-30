<template>
  <div class="directFrame">
    <div class="wapMc"  v-show="isDirectFrame"></div>
    <div class="directFramePos"  v-show="isDirectFrame">
        <div class="directFrameTip">
            <a class="con" :href="directContent.activitypage">
              <img :src="directContent.imgurl" alt="">
            </a>
            <p class="p_close">
                <img src="~assets/wapFront/common/img/close.png" class="tk_close"  v-on:click="toHide()">
            </p>
        </div>
    </div>
  </div>
</template>
<style >

     .directFramePos{position: fixed;top:35%;left: 10%;z-index: 21;
       width: 80%;transform:translateY(-50%);
      -ms-transform:translateY(-50%); /* IE 9 */
      -moz-transform:translateY(-50%); /* Firefox */
      -webkit-transform:translateY(-50%); /* Safari 和 Chrome */
      -o-transform:translateY(-50%); /* Opera */}
     .directFramePos .directFrameTip{border-radius: 10px;position: relative;}
     .directFramePos .directFrameTip .con{width: 100%;display: block;}
     .directFramePos .directFrameTip .con img{width: 100%;max-height: 500px;}
     .directFramePos .directFrameTip .p_close{text-align: center;position: absolute;
       bottom: -3rem;left: 50%;margin-left: -1rem;}
     .directFramePos .directFrameTip .p_close img{width: 2rem;}
</style>
<script>
    export default {
      name: 'wapTk',
      props: ['isDirectFrame','directContent'],
      methods:{
        toHide:function(){
            this.$emit('close');
        }
      }
    }
</script>
<style scoped>

</style>
