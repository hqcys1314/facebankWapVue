<template>
    <div>
    <div class="needActive" v-if="showLayer">
        <div class="content">
            <a class="link_1" href="javascript:;" @click="toSecuritiesClearing"></a>
            <a class="link_2" href="javascript:;" @click="toIntro"></a>
            <a href="javascript:;" class="layer_close" @click="closeLayer"></a>
        </div>
    </div>
    <tosat :content.sync="tosatContent" :show.sync="tosatShow" ref="tosat"></tosat>
</div>
</template>
<script>
    export default {
      name: 'needActive',
      props: ['show', 'userInfo'],
      data () {
          return {
              showLayer : false,
              userInfos : '',
              tosatContent : '',
              tosatShow : false,
          }
      },
      created:function(){
          this.showLayer = this.show;
          this.userInfos=this.userInfo;
      },
      methods:{
          closeLayer(){
              this.showLayer = false;
              this.$emit('update:show', this.showLayer)
          },
          toIntro(){
              this.utils.newWebView('/depositoryIntro')
          },
          toSecuritiesClearing(){
              var _this = this;
              this.utils.activeType(function(re){
                  _this.closeLayer();
                  if(re == 'isTwo'){
                      _this.utils.newWebView('/depositoryOpen')
                  }else{
                      _this.utils.newWebView('/bindBankCard')
                  }
              })
          },
          checkDepositoryStatus(cburl){
              var _this = this;
              var userInfo = this.userInfos ? this.userInfos : this.utils.getUserInfo().info;
              if(userInfo.hasIdValify == '0'){
                  this.$refs.tosat.tosatShow({
                      msg : '请先完成实名',
                      time : 2
                  }, function(){
                      _this.utils.newWebView('/authentication'+'?cburl='+cburl)
                  })
                  return false;
              }
             // if(userInfo.accountState == '150' || userInfo.accountState == '100' || userInfo.accountState == '160'){
              if(userInfo.accountState*1 == 150 || userInfo.accountState*1 == 160){
                  this.showLayer = true;
                  return false
              }else if(userInfo.accountState*1 == 100){
                  this.$refs.tosat.tosatShow({
                      msg : '请先完成开通存管银行',
                      time : 2
                  }, function(){
                      _this.utils.newWebView('/depositoryOpen'+'?cburl='+cburl)
                  })
                  return false;
              }
              return true;
          },
      },
      watch : {
          show : function(val){
              this.showLayer = val;
          },
          userInfo : function(val){
              this.userInfos = val.info;
          }
      }
    }
</script>
<style scoped>
.needActive{ position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.6);z-index:100;}
.needActive .content{width:19rem;height:21.375rem; position: absolute;left:50%;margin-left:-9.5rem;top:20%;background:url(//static.facebank.cn/static/wapFront/depository/img/activeTk.png?20181012) no-repeat center center/100% 100%;}
.needActive .content a.link_1{width:100%;height:3rem; position: absolute;left:0;top:15.4rem;}
.needActive .content a.link_2{width:100%;height:2rem; position: absolute;left:0;bottom:1rem;}
.needActive .layer_close{width:1.875rem;height:1.875rem; position:absolute;left:50%;margin-left:-0.9375rem;bottom:-4.62625rem;background:url(//static.facebank.cn/static/wapFront/depository/img/close.png) no-repeat center center/100% 100%;}
.needActive .layer_close:active{background-image:url(//static.facebank.cn/static/wapFront/depository/img/close_pressed.png)}
</style>
