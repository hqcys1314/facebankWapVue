<template>
    <div id="alertLoginPwd" v-cloak>
        <div class="bcbPart1 bcbMargin">
      		<div class="div1 infoborder">
        			<span class="span1">原密码 </span>
              <input v-on:keyup="changeBtnStatus()" type="password" name="oldpassword" placeholder="请输入原登录密码" v-model="oldPwd">
      		</div>
      		<span></span>
      		<div class="div1 infoborder">
        			<span class="span1">新密码</span>
              <input v-on:keyup="changeBtnStatus()" type="password" name="newpassword" placeholder="请输入新登录密码" v-model="newPwd">
      		</div>
      		<span></span>
      		<div class="div1">
        			<span class="span1">重复新密码</span>
              <input v-on:keyup="changeBtnStatus()" type="password" name="rnewpassword"  placeholder="请重复输入新登录密码" v-model="rnewPwd">
      		</div>
      		<span></span>
      	</div>
      	<div class="bcbPart2">
      		<input name="setPassword" type="button" value="完成" class="btn_tpls" v-on:click="confirm()" v-bind:class="{'disabled':isB}"
      		v-bind:disabled="isB">
      	</div>
      	<div class="com_forget">
              <a :href="'https://cms'+utils.CMSSET+'.facebank.cn/wapHelpAccount14.html'">忘记密码?</a>
          </div>
          <wapTk2 v-bind:iswapTkShow2="wapTkStatus2" v-bind:pLeft2="pLeft2" v-on:close="wapTkClose()"></wapTk2>
          <smileLoading  :showSmileLoading="isShowSmileLoading"></smileLoading>


    </div>
</template>
<style scoped src="assets/wapFront/information/css/information.css">
</style>
<script>
   import {wapTk2} from 'components'
   import {utils,globalVariable} from'tools'

    export default {
      name: 'alertLoginPwd',
      data () {
            return {
              alertLoginPwdJsonUrl:"/wap/resetPwdByOldPwd",
              alertLoginPwdResult:'',
              wapTkStatus2:false,
              pLeft2:'',
              oldPwd:'',
              newPwd:'',
              rnewPwd:'',
              isA:false,
              isB:true,
              isSuc:false,
              isShowSmileLoading:false,
            }
        },
        components:{wapTk2},//这里注册
        created:function () {

        },
        methods: {
          //弹框关闭
          wapTkClose:function(){
              this.wapTkStatus2=false;
              if(this.isSuc){
                utils.loginOut();
              }
          },
          confirm:function(){
              if(this.oldPwd == ''){
                  _this.pLeft2='请输入原密码';
                  _this.wapTkStatus2=true;
                  return;
              }
              if(this.rnewPwd == ''){
                  _this.pLeft2='请输入重复密码';
                  _this.wapTkStatus2=true;
                  return;
              }
              if(this.newPwd == ''){
                  _this.pLeft2='请输入新密码';
                  _this.wapTkStatus2=true;
                  return;
              }
              if(this.newPwd != this.rnewPwd){
                  _this.pLeft2='两次输入密码不一致';
                  _this.wapTkStatus2=true;
                  return;
              }
              // if(this.newPwd.length < 8 || this.newPwd.length > 20 || !this.utils.checkPassword(this.newPwd)){
              //     _this.pLeft2='请输入由字母、数字、特殊符号(@#$%&)组成的8-20位密码';
              //     _this.wapTkStatus2=true;
              //     return;
              // }
               this.isShowSmileLoading=true;
               var _this = this;
               $.ajax({
                   url : utils.AJAXDOMAINNAME+"/wap/modifyLoginPwd",
                   data : '{"oldLoginPwd":"'+_this.utils.executePrompt(_this.oldPwd)+'","newLoginPwd":"'+_this.utils.executePrompt(_this.newPwd)+'","repeatNewPwd":"'+_this.utils.executePrompt(_this.rnewPwd)+'"}',
                   complete:function(){
                     _this.isShowSmileLoading=false;
                   },
                   success : function(res){
                       if(res.code==1){
                         _this.pLeft2="修改成功";
                         _this.wapTkStatus2=true;
                         utils.setCookieAll('mic_sessionid', '',-1);
                         utils.setCookieAll('_key', '',-1);
                         utils.setCookieAll('certifi_key', '',-1);
                         utils.setCookieAll('appQuickToken', '',-1);
                         utils.setCookieAll('SESSION', '', -1);
                         utils.setCookieAll('mic-ticket', '', -1);
                         _this.isSuc=true;

                       }else {
                         _this.pLeft2=res.message;
                         _this.wapTkStatus2=true;
                       }
                   }
               })


          },
          changeBtnStatus:function(){
            if(this.oldPwd!=''&&(this.newPwd != "") && (this.rnewPwd != "")){
                this.isA=true;
                this.isB=false;
            }else {
              this.isA=false;
              this.isB=true;
            }
          }

        },
        watch:{

        }
  }

</script>
