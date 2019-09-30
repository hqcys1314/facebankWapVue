<template>
  <div id="regSuccess">
    <div class="suc-page-con">
        <div class="spc-img">
            <img src="//static.facebank.cn/static/wapFront/common/img/suc_duigou.png">
        </div>
        <a class="spc-a" v-if="loadingResult.registerNew != 'new'"  v-on:click="utils.toIndex()">  返回首页>
        </a>
        <div class="spc-text-grey" v-if="loadingResult.registerNew == 'new'">
                点击“立即出借”或“下载APP”后，<br>
                在【我的】页面中查看使用
        </div>
    </div>
    <div class="suc-page-img" v-if="loadingResult.registerNew == 'new'">
            <img src="//static.facebank.cn/static/wapFront/register/img/suc-page-img.png">
    </div>
    <div class="suc-page-btn-two" v-if="loadingResult.registerNew == 'new'">
            <div class="btn_tpls left sensors-btn" sensors-name="注册成功页面-手机app下载"
                 >下载APP</div>
            <div class="btn_tpls right">
                <a v-on:click="utils.toAutoInvestMatchPage()">立即出借</a>
            </div>
    </div>

    <div class="suc-page-btn" v-if="loadingResult.registerNew != 'new'">
            <p class="tip">添加银行卡后<br/>
                再获1%加息红包和{{loadingResult.bindCardConf}}笑脸币</p>
            <a class="btn_tpls" href="/bindBankCard">绑定银行卡</a>
    </div>


</div>
</template>

<script>
import {utils} from 'tools';

  export default {
    name: 'regSuccess',
    data(){
       return{
         telPhone:'',
         loadingResult:'',
         textTk:'',
         isA:false,
         loadingJsonUrl:'',

       }
    },
    created:function () {

   },
   methods:{

   },

  }

</script>
