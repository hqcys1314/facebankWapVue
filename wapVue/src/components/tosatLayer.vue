<template>
    <div class="pop_layer" v-if="showLayer" :class="{'in' : layerClassIn, 'out' : !layerClassIn}">
        {{layerContent}}
    </div>
</template>
<script>
    export default {
      name: 'tosatLayer',
      props: ['content', 'show'],
      data () {
          return {
              showLayer : false,
              layerContent : '',
              activeFn : 'closeLayer',
              layerClassIn : true,
              layerTimer : null,
              animationTimer : null,
          }
      },
      created:function(){
          this.showLayer = this.show;
          this.layerClassIn = this.show;
          this.layerContent = this.content;
          var _this = this;

      },
      methods:{
          closeLayer(){
              this.showLayer = false;
              this.layerClassIn = false;
              this.layerContent = '';
              this.$emit('update:show', this.showLayer)
              this.$emit('update:content', this.layerContent)
          }
      },
      watch : {
          show : function(val){
              this.showLayer = val;
              this.layerClassIn = val;
              var _this = this;
              clearTimeout(_this.layerTimer)
              clearTimeout(_this.animationTimer)
              _this.layerTimer = setTimeout(function(){
                  _this.layerClassIn = false;
                  _this.animationTimer = setTimeout(function(){
                      _this.closeLayer();
                      clearTimeout(_this.animationTimer)
                      clearTimeout(_this.layerTimer)
                  },200)
              },2000)
          },
          content : function(val){
              this.layerContent = val;
          }
      }
    }
</script>
<style scoped>
/* 动画 泡泡 */
.pop_layer{display:block;padding:.8rem 1.25rem;line-height:100%;font-size:1rem;color:#FFFFFF; background-color:rgba(0,0,0,.6); position:absolute;top:30%;left:50%;z-index:101;
-webkit-border-radius:.5rem;
-moz-border-radius:.5rem;
border-radius:.5rem;
-webkit-transform:translateX(-50%);
-moz-transform:translateX(-50%);
transform:translateX(-50%);
opacity:0;
}
.pop_layer{
	-webkit-transform-origin: 50% 50%;
	-moz-transform-origin: 50% 50%;
	transform-origin: 50% 50%;
}
.pop_layer.in{
	-webkit-animation-duration: 125ms;
	-webkit-animation-name: popin;
	-moz-animation-duration: 125ms;
	-moz-animation-name: popin;
	animation-duration: 125ms;
	animation-name: popin;
	opacity: 1;
	z-index:104;
}
.pop_layer.out{
	-webkit-animation-duration: 125ms;
	-webkit-animation-name: popout;
	-moz-animation-duration: 125ms;
	-moz-animation-name: popout;
	animation-duration: 125ms;
	animation-name: popout;
	opacity: 0;
}
@-webkit-keyframes popin {
	from { opacity:0;}
	to{ opacity:1;}
}
@-moz-keyframes popin {
    from { opacity:0;}
	to{ opacity:1;}
}
@keyframes popin {
    from { opacity:0;}
	to{ opacity:1;}
}

@-webkit-keyframes popout {
    from { opacity:1;}
	to{ opacity:0;}
}
@-moz-keyframes popout {
    from { opacity:1;}
	to{ opacity:0;}
}
@keyframes popout {
    from { opacity:1;}
	to{ opacity:0;}
}
</style>
