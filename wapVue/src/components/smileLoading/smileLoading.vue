<template>
    <div class="smileloading_content"  v-show="showSmileLoading">
        <div class="smileloading">
            <div class="animation" ref="smileLoadingAnimation"></div>
        </div>
    </div>
</template>
<script>
    export default {
      name: 'smileLoadingTpl',
      props: ['showSmileLoading'],
      created:function(){
      },
      methods:{ },
      mounted : function(){
        var _this=this;
        setTimeout(function(){
          lottie.loadAnimation({
              container: _this.$refs.smileLoadingAnimation, // the dom element that will contain the animation
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: '/static/js/smile_loading.json' // the path to the animation json
          })
        },20)
      },
      watch:{}
    }
</script>
<style>
.smileloading_content{ position: absolute;left:0;top:0;width:100%;height:100%;z-index: 100;}
.smileloading{ position: absolute;
    width: 5rem;
    left: 50%;
    margin-left: -2.5rem;
    top: 30%;}
.smileloading .animation{width:100%;height:6rem; display: block;}
.smileloading .font{text-align:center;color:#83899B;font-size:.75rem;margin-top:-1rem;}
</style>
