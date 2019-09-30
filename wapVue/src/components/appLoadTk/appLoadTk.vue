<template>
  <div v-show="appLoadTkShow" class="appLoadTk">
    <div class="wapMc"></div>
    <div class="app-download">
        <img src="//static.facebank.cn/static/wapFront/common/img/app-download.png" alt="笑脸金融app"><div class="link-download" v-on:click="appLoad()">&nbsp;</div>
        <p class="p_close" v-on:click="toHide()">
            <img src="~assets/wapFront/common/img/close.png">
        </p>
    </div>
  </div>
</template>
<script>
    export default {
      name: 'appLoadTk',
      data () {
            return {
              language : (navigator.browserLanguage || navigator.language).toLowerCase(),
            }
        },
      props: ['appLoadTkShow'],
      methods:{
        toHide:function(){
            this.$emit('close');
        },
        //下载客户端立即下载按钮
       appLoad:function(){
           if (isWeiXin()) {
               window.location = "//a.app.qq.com/o/simple.jsp?pkgname=com.ghph.smile";
           } else {
               if (this.$options.methods.versions.ios || this.$options.methods.versions.iPhone|| this.$options.methods.versions.iPad) {
                   window.location = "//itunes.apple.com/cn/app/xiao-lian-jin-rong-li-cai/id1038803512?mt=8";
               } else if (this.$options.methods.versions.android) {
                   window.location = "//static.facebank.cn/fb/FaceSmile-PRO-release_130_jiagu_sign/FaceSmile-PRO-release_130_jiagu_sign.apk";
               } else {
                   alert("当前浏览器非Android或IOS");
               }
           }
         },
         versions : function() {
           var u = navigator.userAgent, app = navigator.appVersion;
           return {//移动终端浏览器版本信息
             trident : u.indexOf('Trident') > -1, //IE内核
             presto : u.indexOf('Presto') > -1, //opera内核
             webKit : u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
             gecko : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
             mobile : !!u.match(/AppleWebKit.*Mobile.*/)
                 || !!u.match(/AppleWebKit/), //是否为移动终端
             ios : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
             android : u.indexOf('Android') > -1
                 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
             iPhone : u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
             iPad : u.indexOf('iPad') > -1, //是否iPad
             webApp : u.indexOf('Safari') == -1
           //是否web应该程序，没有头部与底部
           };
         },
      }
    }

      //是否在微信里打开
      function isWeiXin(){
    	        var ua = window.navigator.userAgent.toLowerCase();
    	        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    	            return true;
    	        }else{
    	            return false;
    	        }
     }

</script>
<style scoped="" lang="less" src="./appLoadTk.less"></style>
