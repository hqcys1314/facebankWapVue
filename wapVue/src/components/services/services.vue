<template>
    <div class="service_area" :class="classNamesNew">
        <serviceComponents styles="margin-top:0;margin-bottom:0;" v-if="showOnline" className="serviceBtnType2"></serviceComponents>
        <feedbackEntrance :rids="rid" v-if="showFeedback" type="2" :sourceType="sourceType"></feedbackEntrance>
        <a class="tel jh-btn"  jh-name="客服电话" href="tel:4008900766">客服电话：400-890-0766</a>
    </div>
</template>
<script>
    import serviceComponents from '../serviceComponents';
    export default {
      name: 'services',
      components:{serviceComponents},
      props: ['showItem', 'type', 'sourceType', 'pos', 'rid'],
      data(){
          return {
              showOnline : false,
              showFeedback : false,
              classNames : 'two',
              poss : '',
              classNamesNew : '',
              showFeedSwich:false,
          }
      },
      created:function(){
          var _this = this;
          if(this.sourceType) {
            $.ajax({
              url: this.utils.AJAXDOMAINNAME + "/wap/facebank/investigateShow/v1.0",
              data: {
                code: _this.sourceType
              },
              async: false,
              type: 'get',
              success: function (res)  {
                if (res.code == 1) {
                  _this.showFeedSwich = res.data * 1 == 1;
                }
              }
            })
          }
          this.showOnline = this.showItem.indexOf('online') > -1;
          this.showFeedback = this.showItem.indexOf('feedback') > -1&&this.showFeedSwich;
          this.classNames = this.showOnline && this.showFeedback ? 'two' : 'one';
          this.classNamesNew = this.classNames+ ' ' + this.pos;

      },
      methods:{

      },
      mounted : function(){

      },
      watch:{
          pos : function(val){
              this.poss = val;
              this.classNamesNew = this.classNames+ ' ' + val;
          }
      }
    }
</script>
<style>
    .service_area{display:block;padding:1.75rem 0;width:15.625rem;margin:0 auto;height:auto;overflow:hidden;}
    .service_area.bottom{ position: absolute;left:50%;margin-left:-7.8125rem;bottom:0;}
    .service_area .tel{display:block; text-align:center;padding-top:.375rem;color:#848999;font-size:.75rem;line-height:1rem;clear:both;width:100%;float:left;}
    .service_area.two div:first-child{float:left;}
    .service_area.two div:nth-child(2){float:right;}
</style>
