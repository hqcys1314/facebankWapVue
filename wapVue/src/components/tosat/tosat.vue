<template>
    <div class="tosat" v-if="showTosat" :class="{'in' : animationIn, 'out' : !animationIn}" v-html="tosatContent"></div>
</template>
<script>
    export default {
      name: 'tosat',
      props: ['content', 'time', 'show'],
      data () {
          return {
              showTosat : false,
              tosatContent : '',
              showTime : 2 * 1000,
              animationOut : false,
              animationIn : false,
              className : '',
          }
      },
      created:function(){
          this.showTosat = this.show;
          this.tosatContent = this.content;
      },
      methods:{
          closeLayer(){
              var _this = this;
              _this.animationIn = false;
              setTimeout(()=>{
                  _this.showTosat = false;
                  _this.tosatContent = '';
                  _this.$emit('update:show', _this.showTosat)
                  _this.$emit('update:content', _this.tosatContent)
              },200)
          },
          tosatShow(parame, callback){
              var _this = this;
              this.showTosat = true;
              this.tosatContent = parame.msg;
              setTimeout(()=>{
                  _this.animationIn = true;
              },100)
              var times = parame.time ? parame.time : 2;
              setTimeout(()=>{
                  _this.closeLayer();
                  setTimeout(()=>{
                      if(typeof callback == 'function') callback();
                  },200)
              }, times*1000)
          },
      },
      watch : {
          show : function(val){
              this.showTosat = val;
              var _this = this;
              if(val){
                  setTimeout(()=>{
                      _this.animationIn = true;
                  },100)
                  setTimeout(()=>{
                      _this.closeLayer();
                  }, _this.showTime)
              }
          },
          content : function(val){
              this.tosatContent = val;
          },
          time : function(){
              this.showTime = val;
          }
      }
    }
</script>
<style scoped>
.tosat{ display: block; position: fixed;left:50%;top:40%;background:rgba(0,0,0,.8);color:#FFFFFF;width:18rem; padding:1rem;font-size:.875rem;line-height:1.25;border-radius:1000px; text-align:center;z-index:999;margin-left:-10rem;}
.tosat.in {transition: all .2s linear;transition: all .2s linear; opacity: 1;}
.tosat.out{transition: all .2s linear;transition: all .2s linear; opacity: 0;}
</style>
