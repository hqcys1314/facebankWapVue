<template>
    <div>
        <div class="layer_style" v-show="showLayer" v-cloak>
            <div class="layer_content" :style="{'text-align':textAlign}" v-html="layerContent"></div>
            <div class="layer_btn two">
                <a href="javascript:;" @click="resetMobile()">重填手机号</a>
                <a href="javascript:;" @click="resendSmsCode()">重发验证码</a>
            </div>
        </div>
        <div class="layerMask" v-show="showLayer" v-cloak></div>
    </div>
</template>
<script>
import {utils} from 'tools';
export default {
    name: 'informationLayer',
    props: ['content', 'active', 'show'],
    data () {
        return {
            showLayer : false,
            layerContent : '',
            layerTitle : '',
            activeFn : 'closeLayer',
            textAlign : 'center'
        }
    },
    created:function(){
        this.showLayer = this.show;
        this.layerContent = this.content;
        this.layerTitle = this.title;
    },
    methods:{
      closeLayer(){
          this.showLayer = false;
          this.layerContent = '';
          this.layerTitle = '';
          this.$emit('update:show', this.showLayer)
          this.$emit('update:content', this.layerContent)
          this.$emit('update:title', this.layerTitle)
      },
      resendSmsCode(){
          this.closeLayer();
          this.$emit('resendSmsCode')
      },
      resetMobile(){
          utils.setCookie('mobileNum', '', -1)
          this.closeLayer();
          window.history.go(-1);
      }
    },
    watch : {
        show : function(val){
            this.showLayer = val;
        },
        content : function(val){
            this.layerContent = val;
        },
        title : function(val){
            this.layerTitle = val;
        }
    }
}
</script>
