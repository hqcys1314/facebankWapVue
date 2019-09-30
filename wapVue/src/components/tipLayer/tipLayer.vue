<template>
    <div>
        <div class="layer_style" style="top:20%" v-show="showTip" v-cloak>
            <div class="layer_title" v-if="layerTitle" v-html="layerTitle"></div>
            <div class="layer_content" :style="{'text-align':textAlign, 'color':textColor}" v-html="layerContent"></div>
            <div class="layer_btn" :class="btnAreaClassStr">
                <a v-if="this.btnLength == 1" href="javascript:;" @click="closeLayer()">{{btnText}}</a>
                <a v-else-if="btnArr.length > 1" v-for="item in btnArr" href="javascript:;" @click="item.fn(this)" :style="item.style">{{item.text}}</a>
            </div>
        </div>
        <div class="layerMask" v-show="showTip" v-cloak></div>
    </div>
</template>
<script>
    export default {
      name: 'tipLayer',
      props: ['content', 'time', 'show', 'title', 'btn', 'showInputMask'],
      data () {
          return {
              showTip : false,
              layerContent : '',
              layerTitle : '提示',
              textAlign : '',
              textColor : '',
              aloneEvenFn : '',

              btnAreaClass : ['',' one', ' two', ' three'],
              btnText : '确定',
              btnLength : 1,
              btnArr : [],
              btnAreaClassStr : 'one',
          }
      },
      created:function(){
          this.showTip = this.show;
          this.layerContent = this.content;
          this.layerTitle = this.title ? this.title : '提示';
          if(this.btn && this.btn.length > 1){
              this.btnLength = this.btn.length;
          }
      },
      methods:{

          closeLayer(){
              this.showTip = false;
              this.layerTitle = '提示';
              this.layerContent = '';
              if(typeof this.aloneEvenFn == 'function'){
                  this.aloneEvenFn();
              }else{
                  this.$emit('update:showInputMask', this.showTip)
              }
              this.btnArr = [];
              this.btnLength = 1;
          },
          showByParame(parame, callback){
              this.layerTitle = parame.title == 'noTitle' ? '' : parame.title ? parame.title : '提示';
              this.layerContent = parame.content;
              this.textAlign = parame.textAlign ? parame.textAlign : '';
              this.textColor = parame.textColor ? parame.textColor : '';
              this.btnArr = (parame.btnArr && parame.btnArr.length > 1) ? parame.btnArr : [];
              this.btnLength = (parame.btnArr && parame.btnArr.length > 1) ? this.btnArr.length : 1;
              this.btnAreaClassStr = this.btnAreaClass[this.btnLength];
              this.btnText = parame.btnText ? parame.btnText : '知道了';
              this.showTip = true;
              console.log(this.btnArr, this.btnLength)
              if(callback) this.aloneEvenFn = callback;
          },
          showLayer(type, msg, textAlign, hasTitle, btn_text, btnCallback){
              //说明层，无标题左对齐，知道了
              if(type == 1){
                  this.layerTitle = '';
                  this.textAlign = textAlign;
                  this.btnText = btn_text ? btn_text : '知道了';
              }else if(type == 2){
                  this.layerTitle = '提示';
                  this.btnText = '确定';
              }
              if(btnCallback) this.aloneEvenFn = btnCallback;
              this.layerContent = msg;
              this.showTip = true;
          }
      },
      watch : {
          show : function(val){
              this.showTip = val;
          },
          content : function(val){
              this.layerContent = val;
          },
          title(val){
              this.layerTitle = val;
          }
      }
    }
</script>
