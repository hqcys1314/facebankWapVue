<template>
    <div>
        <!-- <div class="icons serviceBtn" :style="styles" :class="className" @click="showKFLayer">在线客服</div> -->
        <div class="icons serviceBtn jh-btn" :style="styles" :class="className" jh-name="在线客服" @click="kefu">在线客服</div>
        <!--客服-->
        <div class="layer_style" v-show="kflayerStatus" v-cloak>
            <div class="layer_content">
                <div @click="()=>{this.kflayerStatus = false}" class="close"></div>
                <p><i class="icon_tel"></i></p>
                <p>笑脸平台客服</p>
                <p class="jh-btn" jh-name="客服电话">4008-900-766</p>
                <p>工作日 08:00-20:00</p>
                <p>关注“笑脸平台”微信公众号为您解答各种<br />问题或拨打客服热线</p>
            </div>
            <div class="layer_btn two">
                <a href="javascript:;"  class="jh-btn" jh-name="在线客服">在线客服</a>
                <a href="tel:4008900766"  class="jh-btn" jh-name="客服电话" >呼叫</a>
            </div>
        </div>
        <div class="layerMask" v-show="kflayerStatus" v-cloak @click="()=>{this.kflayerStatus = false}"></div>
</div>
</template>
<script>
    export default {
      name: 'shareComponents',
      props: ['className', 'styles'],
      data () {
          return {
              kflayerStatus : false
          }
      },
      // created:function(){
      //   $('.zhiBtn').on('click', function() {
      //     zhiManager.expand(); //展开聊天页面
      //   });
      // },
      // mounted:function(){
      //   $('.zhiBtn').on('click', function() {
      //     zhiManager.expand(); //展开聊天页面
      //   });
      // },
      methods:{
          kefu(){
            zhiManager.expand(); //展开聊天页面
          },
          closeLayer(){

          },
          showKFLayer(){
              this.kflayerStatus = true;

          },
      },
      watch : {

      }
    }
</script>
<style scoped>

.serviceBtn{background:url(~assets/images/icon_service.png) no-repeat center center/1.125rem 1.125rem;}
.icons.serviceBtnType2{width:4.6875rem;height:2.25rem;padding-left:2.8125rem;font-size:.875rem; line-height:2.25rem;color:#848999;margin:2.0625rem auto;display:block;float:none; text-indent: 0;box-shadow:0 0 0 1px #BCC2CC inset;overflow:hidden;border-radius:1.75rem;background:url(//static.facebank.cn/static/wapFront/common/images/icon/icon_services.png) no-repeat 1.1875rem center/1.25rem 1.25rem;background-color:none;}

.icon_tel{width:1.5rem;height:1.5rem; display:block;margin:0 auto;margin-bottom:.375rem;background:url(~assets/images/icon_tel.png) no-repeat center center/100% 100%}
.layer_style .iconfont{font-size:.75rem;padding:.375rem;box-shadow:0 0 0 1px #BCC2CC inset;}
.layer_style .layer_btn.two a:first-child{color:#848999}
.layer_style .layer_btn.two a:last-child{color:#F0484E}
.layer_style .layer_content .close{width:3rem;height:3rem;display:block; position: absolute;right:0;top:0;background:url('//static.facebank.cn/static/wapFront/common/images/icon/icon_close2.png') no-repeat center center/1rem 1rem;}

.layer_style .layer_content p{font-size:.75rem !important;line-height:1rem !important;color:#848999 !important;font-weight:normal !important;}
.layer_style .layer_content p:nth-child(3){font-size:.875rem !important;line-height:1.5rem !important;}
.layer_style .layer_content p:nth-child(4){font-size:1.25rem !important;color:#000000 !important;line-height:1.5rem !important;margin:.1rem .375rem !important;}
.layer_style .layer_content p:last-child{padding-top:1.75rem !important;}
</style>
