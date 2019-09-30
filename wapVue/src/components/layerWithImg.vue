<template>
<div class="layerWithImg" v-show="showLayer" @click="clickSelf">
    <img :src="showImgPath">
    <p>{{ loadText }}</p>
</div>
</template>
<script>
    export default {
      name: 'layerWithImg',
      props: ['showLayerOut', 'textOut','showImgPathOut'],
      data (){
          return {
            showLayer:false,
            loadText:'',
            showImgPath:'',
          }
      },
      created () {
          this.showLayer = this.showLayerOut;
          this.loadText = this.textOut;
          this.showImgPath = this.showImgPathOut;
      },
      methods:{
        clickSelf:function () {
          this.showLayer = false;
        },
      },
      watch : {
        showLayerOut : function(val){
              this.showLayer = val;
          },
        textOut:function(val){
            this.loadText = val || '正在为您加载列表内容'
        },
        showImgPathOut:function (val) {
          this.showImgPath = val;
        },
      }
    }
</script>
<style scoped>
.layerWithImg{width: 100%;position: fixed;bottom: 0;background-color:rgba(0,0,0,0.7) ;height: 100%;text-align: center;z-index: 20;left:0;}
.layerWithImg img{position: fixed;bottom: 50%;left: 50%;margin-left: -60px;width: 120px;}
.layerWithImg p{text-align:center;color:#fff;font-size:0.875rem;position: fixed;bottom: 43%;width:100%;}
</style>
