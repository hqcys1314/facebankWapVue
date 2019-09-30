<template>
  <div class="loadingMoreData">
      <div v-show="isLoading||isLoadingV">
          <div class="animation" ref="loadMore"></div>
          <div class="font">加载中...</div>
      </div>
      <div v-show="reloadDataStatus||reloadDataStatusV"  @click="getresultData()">
          <span class="reload"></span>
          <span class="text">加载失败，点击重试</span>
      </div>
      <div v-show="safeShow">
          安全可靠有底线
      </div>
  </div>
</template>
<script>
    export default {
      name: 'loadingMoreData',
      props: ['isLoading','reloadDataStatus','enLong'],
      data(){
        return{
          isLoadingV:false,
          reloadDataStatusV:false,
          safeShow:false,
        }
      },
      created:function(){
         this.showSafe=!this.isLoading&&!this.reloadDataStatus&&this.enLong;
      },
      methods:{
          getresultData(){
              this.$emit('getresultData');
          },
          isLoadingShow(){
            this.isLoadingV=true;
            this.reloadDataStatusV=false;
            this.safeShow=false;
          },
          reloadDataStatusShow(){
            this.isLoadingV=false;
            this.reloadDataStatusV=true;
            this.safeShow=false;
          },
          isSafeShow(){
            this.isLoadingV=false;
            this.reloadDataStatusV=false;
            this.safeShow=true;
          },
          allHide(){
            this.isLoadingV=false;
            this.reloadDataStatusV=false;
            this.safeShow=false;
          }

      },
      mounted : function(){
        var _this=this;
        setTimeout(function(){
          lottie.loadAnimation({
              container: _this.$refs.loadMore, // the dom element that will contain the animation
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: '/static/js/down_loading.json' // the path to the animation json
          })
        },20)
      },
      watch:{
        isLoading(){
          this.safeShow=!this.isLoading&&!this.reloadDataStatus&&this.enLong;
        },
        reloadDataStatus(){
          this.safeShow=!this.isLoading&&!this.reloadDataStatus&&this.enLong;
        },
        enLong(){
          this.safeShow=!this.isLoading&&!this.reloadDataStatus&&this.enLong;
        },
      }

    }
</script>
<style>
.loadingMoreData{ display:block;padding:.25rem 0 .875rem;font-size:.875rem;
  line-height:1.25rem; text-align:center;color:#848999;}
.loadingMoreData div{display: block;}
.loadingMoreData .animation{width:1.25rem;height:1.25rem; display: inline-block;; vertical-align: middle}
.loadingMoreData .font{display: inline-block;line-height:1.25rem; vertical-align: middle;
    height: 1.25rem;
}
.loadingMoreData .text{display:inline-block;line-height: 1.35rem;
    height: 1.35rem;}
.loadingMoreData .reload{width:1.35rem;height:1.35rem;margin-right:0.2rem ; vertical-align:middle;
  display:inline-block;background:url(~assets/images/reload.png) no-repeat center center/100% 100%;}

</style>
