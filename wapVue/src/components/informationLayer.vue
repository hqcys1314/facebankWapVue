<template>
    <div>
        <div class="layer_style" v-show="showLayer" v-cloak>
            <div class="layer_title" v-if="layerTitle" v-html="layerTitle"></div>
            <div class="layer_content" :style="{'text-align':textAlign}" v-html="layerContent"></div>
            <div class="layer_btn one">
                <a href="javascript:;" @click="closeLayer()">{{buttonText != '' ? btnFont : '确定'}}</a>
            </div>
        </div>
        <div class="layerMask" v-show="showLayer" v-cloak></div>
    </div>
</template>
<script>
    export default {
      name: 'informationLayer',
      props: ['content', 'active', 'show', 'title', 'btnFont'],
      data () {
          return {
              showLayer : false,
              layerContent : '',
              layerTitle : '',
              activeFn : 'closeLayer',
              textAlign : 'center',
              buttonText : '',
          }
      },
      created:function(){
          this.showLayer = this.show;
          this.layerContent = this.content;
          this.layerTitle = this.title ? this.title : '提示';
          if(this.content.length > 40) this.textAlign = 'left';
      },
      methods:{
          closeLayer(){
              this.showLayer = false;
              this.layerContent = '';
              this.layerTitle = '';
              this.$emit('update:show', this.showLayer)
              this.$emit('update:content', this.layerContent)
              this.$emit('update:title', this.layerTitle)
          }
      },
      watch : {
          btnFont : function(val){
              this.buttonText = val;
          },
          show : function(val){
              this.showLayer = val;
          },
          content : function(val){
              this.layerContent = val;
              if(this.layerContent.length > 40) this.textAlign = 'left';
          },
          title : function(val){
              this.layerTitle = val ? val : '提示';
          }
      }
    }
</script>
