<template>
<div class="loading" v-show="showLoading">
    <img src="~assets/wapFront/common/img/loading.gif">
    <p>正在为您加载列表内容</p>
</div>
</template>
<script>
    export default {
      name: 'loadingLayer',
      props: ['show'],
      data (){
          return {
              showLoading:false
          }
      },
      created () {
          this.showLoading = this.show;
      },
      watch : {
          show : function(val){
              this.showLoading = val;
          }
      }
    }
</script>
<style scoped>
.loading{width: 100%;position: fixed;bottom: 0;background-color:rgba(0,0,0,0.7) ;height: 100%;text-align: center;z-index: 20;left:0;}
.loading img{position: fixed;bottom: 50%;left: 50%;margin-left: -17px;width: 35px;}
.loading p{text-align:center;color:#fff;font-size:0.875rem;position: fixed;bottom: 43%;width:100%;}
</style>
