<template>
    <div class="empty_box">
        <div class="img_box"><img :src="emptyImage" /></div>
        <div class="font" v-html="text"></div>
    </div>
</template>
<script>
    export default {
      name: 'tipLayer',
      props: ['show', 'text', 'image'],
      data () {
          return {
              showEmptyBox : false,
              emptyText : '',
              emptyImage : '//static.facebank.cn/static/wapFront/common/images/empty_record.png'
          }
      },
      created:function(){
      },
      methods:{

      },
      watch : {
          show : function(val){
              this.showEmptyBox = val;
          },
          text : function(val){
              this.emptyText = val;
          },
          image : function(val){
              this.emptyImage = val;
          }
      }
    }
</script>
