<template>
    <div class="loading_content">
        <div class="loading_full" v-if="showThis">
            <div class="animation" ref="loadingAnimation"></div>
            <div class="font">拼命加载中…</div>
        </div>
    </div>
</template>
<script>
    export default {
      name: 'fullLoadingTpl',
      //props: ['show'],
      data () {
          return {
              showThis : true,
          }
      },
      created:function(){
          //this.showThis = this.show;
      },
      methods:{
          showLoading(){
              this.showThis = true;
              this.addAnimation();
          },
          hideLoading(){
              this.showThis = false;
          },
          addAnimation(){
              setTimeout(()=>{
                  lottie.loadAnimation({
                      container: this.$refs.loadingAnimation, // the dom element that will contain the animation
                      renderer: 'svg',
                      loop: true,
                      autoplay: true,
                      path: '/static/js/loading.json' // the path to the animation json
                  });
              }, 10)
          }
      },
      mounted : function(){
          this.addAnimation();
      },
      // watch : {
      //     show : function(val){
      //         this.showThis = val;
      //         if(val){
      //             this.addAnimation();
      //         }
      //     }
      // }
    }
</script>
<style>
.loading_content{ position: absolute;left:0;top:0;width:100%;height:100%;background:#FFFFFF;}
.loading_full{ display:block;margin:0 auto;width:6rem;padding-top:8.125rem;}
.loading_full .animation{width:100%;height:6rem; display: block;}
.loading_full .font{text-align:center;color:#83899B;font-size:.75rem;margin-top:-1rem;}
</style>
