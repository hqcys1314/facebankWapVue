<template>
    <a href="javascript:;" class="footer" :class="{'static': hasStatic}"><i></i>阳光保险集团旗下成员</a>
</template>
<script>
export default {
  name: 'sunshineFooter',
  data(){
    return {
        hasStatic : false
    }
  },
  created :function(){
  },
  mounted:function(){
      var _this = this;
      _this.resizeFooter();
      if(window.location.pathname == '/bindBankCard'){
          this.hasStatic = true;
      }else{
          window.addEventListener('resize', function(){
              _this.resizeFooter()
          }, false)
      }
  },
  methods:{
      resizeFooter(){
          var winHeight = window.innerHeight;
          if(winHeight < 28 * (window.innerWidth / 750 * 32)){
              this.hasStatic = true;
          }else{
              this.hasStatic = false;
          }
      }
  }
}

</script>
