<template>
    <div>
        <div class="feedBanner" v-if="type*1 == 1&&showFeed"><a href="javascript:;" @click="jumpPage()"><img :src="bannerImgUrl[sourceType]" /></a></div>
        <div class="icons serviceBtnType2" v-if="type*1 == 2" @click="jumpPage()">意见反馈</div>
    </div>
</template>
<script>
    export default {
      name: 'feedbackEntrance',
      props: ['sourceType', 'type', 'rids'],
      data(){
          return {
              showFeed : false,
              relationId : '',
              jumpUrl : '',
              bannerImgUrl : {
                  'login-success' : 'https://static.facebank.cn/static/wapFront/feedback/images/feedback_home.png',
                  'bulk-standard-success' : 'https://static.facebank.cn/static/wapFront/feedback/images/feedback_invest.png',//散标出借成功
                  'intelligent-recommendationj-success' : 'https://static.facebank.cn/static/wapFront/feedback/images/feedback_invest.png',//智能推荐出借成功
                  'closed-period-success' : 'https://static.facebank.cn/static/wapFront/feedback/images/feedback_invest.png',//月月笑出借成功
                  'payment-calendar' : 'https://static.facebank.cn/static/wapFront/feedback/images/feedback_calendar.png',//还款日历
              }
          }
      },
      created:function(){
          console.log(this.rids)
          //type:1:banner;2:icon
          this.jumpUrl = 'https://jinshuju.net/f/2B53S7'
          if(this.type!=2){
            var _this = this;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+"/wap/facebank/investigateShow/v1.0",
                data : {
                    code : _this.sourceType
                },
                type:'get',
                success : function(res){
                    if(res.code==1){
                        _this.showFeed = res.data*1 == 1;
                    }
                }
            })
          }

      },
      methods:{
          jumpPage(){
              var url = 'https://cgw'+ this.utils.URLSET +'.facebank.cn/promo/activity/satisfactionSurvey?pageCode='+ this.sourceType +'&relationId='+((this.relationId || this.rids) || '');
              //var url = 'https://cgw.facebank.cn/promo/activity/satisfactionSurvey?pageCode='+ this.sourceType +'&relationId=';
              this.utils.newWebViewAll(url);
          }
      },
      mounted : function(){

      },
      watch:{
          rids:function(val){
              this.relationId = val;
          }
      }
    }
</script>
<style>
    .feedBanner{display:block;width:21.4375rem;height:3.75rem;overflow:hidden;margin:0 auto;padding-bottom:.75rem;}
    .feedBanner img{width:100%;height:3.75rem;}

    .icons.serviceBtnType2{width:4.6875rem;height:2.25rem;padding-left:2.8125rem;font-size:.875rem; line-height:2.25rem;color:#848999;margin:0 auto;display:block;float:none; text-indent: 0;box-shadow:0 0 0 1px #BCC2CC inset;overflow:hidden;border-radius:1.75rem;background:url(//static.facebank.cn/static/wapFront/common/images/icon/icon_feedback.png) no-repeat 1.1875rem center/1.25rem 1.25rem;background-color:none;}

</style>
