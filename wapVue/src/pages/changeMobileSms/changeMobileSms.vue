<template>
<div class="page" :style="'top:'+pageTop">
  <div class="box" v-show="pageStep === '1-1'">
      <div class="mobile">当前登录手机号:{{userInfo.mobile}}</div>
      <div class="desc">为保障您的账号安全，在更换手机号前需要验证您的身份</div>
      <div class="input_line"><label>验证码</label><input name="oldSmsCode" type="text" v-model="oldSmsCode" placeholder="请输入验证码" /><input @click="getUnbindOldMobileSMSCode" name="getSmsCodeBtn" v-model="oldSMSCodeObj.value" type="button" :class="{disabled:oldSMSCodeObj.status}" :disabled="oldSMSCodeObj.status" /></div>
      <p class="cue_text">无法接收短信验证码？使用<span @click="otherModeVer">其他方式验证账号</span></p>
      <button name="changeMobileBtn" class="btn_tpl" :class="{'none':!oldBtnStatus}" :disabled="!oldBtnStatus" @click="getVerifyOldMobileSMSCode" value="" >更换手机号</button>
  </div>

  <ul class="list" v-show="pageStep === '1-2'">
    <li class="input_line"><label>当前手机号</label> <input name="oldMobile" v-model="oldMobile" maxlength="11" type="tel" placeholder="请输入当前的登录手机号" /></li>
    <li class="input_line"><label>身份证号码</label> <input name="idCardNo" v-model="idCardNo" type="text" placeholder="请输入你的身份证号码" /></li>
    <li class="input_line"><label>登录密码</label> <input name="password" v-model="password" type="password" placeholder="请输入你的登录密码" /></li>
    <li>
      <button name="getVerifyIDNoPwdBtn" class="btn_tpl" :class="{'none':!realNameBtnStatus}" :disabled="!realNameBtnStatus" @click="getVerifyIDNoPwd" value="">下一步</button>
    </li>
    <li class="desc">
      如果您无法提供以上信息，将无法自助更换手机号<br>如遇疑问，请联系笑脸客服
    </li>
  </ul>

  <ul class="list" v-show="pageStep === '1-3'">
    <li class="input_line"><label>当前手机号</label> <input name="notIdNoOldMobile" v-model="notIdNoOldMobile" maxlength="11" type="tel" placeholder="请输入当前的登录手机号" /></li>
    <li class="input_line"><label>登录密码</label> <input name="notIdNoPassword" v-model="notIdNoPassword" type="password" placeholder="请输入你的登录密码" /></li>
    <li>
       <button name="getVerifyMobilePwdBtn" class="btn_tpl" :class="{'none':!notRealNameBtnStatus}" :disabled="!notRealNameBtnStatus" @click="getVerifyMobilePwd" value="">下一步</button>
    </li>
    <li class="desc">
      如果您无法提供以上信息，将无法自助更换手机号<br>如遇疑问，请联系笑脸客服
    </li>
  </ul>

  <ul class="list" v-show="pageStep === '2-1'">
    <li class="input_line"><label>新手机号</label> <input name="newMobile" v-model="newMobile" maxlength="11" type="tel" placeholder="请输入新手机号" /></li>
    <li class="input_line"><label>验证码</label> <input name="newsmsCode" v-model="newsmsCode" maxlength="6" type="text" placeholder="请输入验证码" /><input @click="getUnbindNewMobileSMSCode" v-model="newSMSCodeObj.value" type="button" :class="{disabled:newSMSCodeObj.status}"  :disabled="newSMSCodeObj.status" /></li>
    <li>
       <button name="getVerifyNewMobileSMSCodeBtn" class="btn_tpl" :class="{'none':!newBtnStatus}" :disabled="!newBtnStatus" @click="getVerifyNewMobileSMSCode" value="">下一步</button>
    </li>
  </ul>

  <div class="layerMask" v-if="showLayerStatus">
     <div class="layer_style">
         <div class="layer_content">
            {{informationLayerContent}}
         </div>
         <div class="layer_btn one">
             <a href="javascript:;" @click="showLayerStatus = false">知道了</a>
         </div>
     </div>
  </div>
</div>
</template>
<style scoped src="./changeMobileSms.css"></style>
<style scoped>
.headIos{z-index:2;}
</style>
<script>
import * as constants from './changeMobileSmsConstants';
import layerRepaymentExplain from '@/components/layerRepaymentExplain'
// import {bankTrans} from 'tools';
import {utils} from 'tools';

let countdown = {}
let saveMobile = '' // 用于判断两次手机号是否一致



export default {
    name: constants.NAME,
    components: {layerRepaymentExplain},
    data() {
        return {
            // userInfo : {},
            userInfo : {
              idNo:'',
              userHasSetPassword:''
            },
            informationLayerContent : '',
            showLayerStatus : false,
            password: '', // 密码
            oldMobile: '', // 旧手机号
            newMobile: '', // 新手机号
            idCardNo: '', // 身份证号
            oldSmsCode: '', // 旧手机验证码
            newsmsCode: '', // 新手机验证码
            notIdNoOldMobile: '', // 非实名手机号
            notIdNoPassword: '', // 非实名密码

            oldSMSCodeObj: { // 旧手机号 验证码
              value: '获取验证码',
              status: false,
              id: 'old'
            },
            newSMSCodeObj: { // 新手机号 验证码
              value: '获取验证码',
              status: false,
              id: 'new'
            },
            pageStep: '1-1', // 修改步骤状态
            oldBtnStatus: false, // 验证旧手机按钮状态
            realNameBtnStatus: false, // 实名按钮状态
            notRealNameBtnStatus: false, // 未实名按钮状态
            newBtnStatus: false, // 验证新手机按钮状态

            pageTop : '0',
        }
    },
    watch: {
      oldSmsCode (e) { // 验证旧验证码长度
        if(e.length === 6){
          this.oldBtnStatus = true
        }
      },
      oldMobile () {
        this.realNameStatusVerify()
      },
      idCardNo () {
        this.realNameStatusVerify()
      },
      password () {
        this.realNameStatusVerify()
      },
      notIdNoOldMobile () {
        this.notNameStatusVerify()
      },
      notIdNoPassword () {
        this.notNameStatusVerify()
      },
      newMobile () {
        this.newMobileStatusVerify()
      },
      newsmsCode () {
        this.newMobileStatusVerify()
      },
      '$route' (to,from) {
        this.pageStep = to.query.step
      }
    },
    created () {
        this.userInfo = utils.getUserInfo().info;
        this.stepShowStatus()
        if(utils.getCookie('curDevice')=='ios'&& utils.getCookie('curVersion')=='2.7.5'){
           this.pageTop = '2.6875rem'
       }else{
           this.pageTop = '0'
       }
    },
    methods: {
      realNameStatusVerify () { // 实名有密码按钮验证
        this.realNameBtnStatus = false
        if (this.oldMobile.length === 11 && this.idCardNo.length === 18 && this.password.length >= 6) {
          this.realNameBtnStatus = true
        }
      },
      notNameStatusVerify () { // 非实名有密码按钮验证
        this.notRealNameBtnStatus = false
        if (this.notIdNoOldMobile.length === 11 && this.notIdNoPassword.length >= 6) {
          this.notRealNameBtnStatus = true
        }
      },
      newMobileStatusVerify () { // 新手机号按钮验证
        this.newBtnStatus = false
        if (this.newMobile.length === 11 && this.newsmsCode.length === 6) {
          this.newBtnStatus = true
        }
      },
      showLayer(msg){ // 弹窗
          this.informationLayerContent = msg
          this.showLayerStatus = true;
      },
      stepShowStatus() { // 步骤状态
        this.pageStep = this.$route.query.step
      },
      jumpStep (step) { // 路由
        this.$router.push({
            path: 'changeMobileSms',
            query: {
                step: step
            }
        })
        this.pageStep = step
      },
      getUnbindOldMobileSMSCode () { // 给登录人旧手机号发送短信验证码  1-1-1
        this.countdownVer(this.oldSMSCodeObj)
        $.ajax({
          url: utils.AJAXDOMAINNAME+ '/wap/getUnbindOldMobileSMSCode',
          data: {},
          success: (res) => {
            if (res.code !== '1'){
              this.countdownVerError(this.oldSMSCodeObj)
              this.showLayer(res.message)
            }
          }
        })
      },
      getVerifyOldMobileSMSCode () { // 通过收到的验旧短信验证码更换登陆手机号 1-1-2
        $.ajax({
          url: utils.AJAXDOMAINNAME+ '/wap/changeMobile/verifyOldMobileSMSCode',
          data: `{"smsCode": "${this.oldSmsCode}"}`,
          success: (res) => {
            if (res.code === '1') {
              this.jumpStep('2-1')
            }else{
              this.showLayer(res.message)
            }
          }
        })
      },
      getVerifyIDNoPwd () { // 通过手机号,身份证号,密码校验身份,更换登陆手机号 1-2-1
        if (!this.testPhone(this.oldMobile)) {
          this.showLayer('请正确填写手机号码')
          return
        }else if (!this.testIdCardNo()) {
          this.testIdCardNo('身份证号码填写有误')
          return
        }
        $.ajax({
          url: utils.AJAXDOMAINNAME+ '/wap/changeMobile/verifyIDNoPwd',
          data: `{"mobile": "${this.oldMobile}","idCardNo": "${this.idCardNo}","pwd": "${this.password}"}`,
          success: (res) => {
            if (res.code === '1') {
              this.jumpStep('2-1')
            }else{
              this.showLayer(res.message)
            }
          }
        })
      },
      getVerifyMobilePwd(){ // 通过手机号+登陆密码校验身份,更换登陆手机号 1-1-3
        if (!this.testPhone(this.notIdNoOldMobile)) {
          this.showLayer('请正确填写手机号码')
          return
        }
        $.ajax({
          url: utils.AJAXDOMAINNAME+ '/wap/changeMobile/verifyMobilePwd',
          data: `{"mobile": "${this.notIdNoOldMobile}","pwd": "${this.notIdNoPassword}"}`,
          success: (res) => {
            if (res.code === '1') {
              this.jumpStep('2-1')
            }else{
              this.showLayer(res.message)
            }
          }
        })
      },
      getUnbindNewMobileSMSCode () { // 给登录人需要更换的手机号发送短信验证码 2-1-1
        if (!this.testPhone(this.newMobile)) {
          this.showLayer('请正确填写手机号码')
          return
        }
        this.countdownVer(this.newSMSCodeObj)
        $.ajax({
          url: utils.AJAXDOMAINNAME+ '/wap/getUnbindNewMobileSMSCode',
          data: `{"newMobile": "${this.newMobile}"}`,
          success: (res) => {
            if (res.code !== '1'){
              this.countdownVerError(this.newSMSCodeObj)
              this.showLayer(res.message)
            }else{
              saveMobile = this.newMobile
            }
          }
        })
      },
      getVerifyNewMobileSMSCode () { // 通过新手机号+短信验证码校验身份,更换登陆手机号 2-1-2
        if (!this.testPhone(this.newMobile)) {
          this.showLayer('请正确填写手机号码')
          return
        }
        if (saveMobile != this.newMobile) {
          this.informationLayerContent = '两次输入的手机号不相同，请正确输入手机号'
          this.showLayerStatus = true
          return
        }
        $.ajax({
          url: utils.AJAXDOMAINNAME+ '/wap/changeMobile/verifyNewMobileSMSCode',
          data: `{"newMobile": "${this.newMobile}","smsCode": "${this.newsmsCode}"}`,
          success: (res) => {
            if (res.code === '1') {
              utils.setCookieAll('mic_sessionid', '',-1);
              utils.setCookieAll('_key', '',-1);
              utils.setCookieAll('certifi_key', '',-1);
              utils.setCookieAll('appQuickToken', '',-1);
              utils.setCookieAll('SESSION', '', -1);
              utils.setCookieAll('mic-ticket', '', -1);
              //utils.loginOut("/changeMobileSuc");
              utils.loginOutChangeMobile("/changeMobileSuc?newMobile="+this.newMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2"));
              //window.location.href="/changeMobileSuc?newMobile="+this.newMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
              // this.$router.push({
              //     path: 'changeMobileSuc',
              //     query: {
              //         newMobile: this.newMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")
              //     }
              // })
            }else{
              this.showLayer(res.message)
            }
          }
        })
      },
      otherModeVer () { // 点击 他方式验证账号 按钮触发事件
        if((this.userInfo.idNo == '' || this.userInfo.idNo == null) && this.userInfo.userHasSetPassword*1 == 0){
          this.informationLayerContent = '您的账号未进行实名验证且未设置过密码，请联系客服修改手机号'
          this.showLayerStatus = true
          return
        }else if (this.userInfo.idNo != '' && this.userInfo.idNo != null) {
          this.jumpStep('1-2')
          return
        }else if (this.userInfo.userHasSetPassword*1 !== 0) {
          this.jumpStep('1-3')
        }
      },
      countdownVer (a) { // 验证码倒计时
        let second = 60
        a.status = true
        a.value = `重新获取${second}s`
        for(let i in countdown){
          clearInterval(countdown[i])
        }
        countdown[a.id] = setInterval(() => {
          second--
          if (second === 0) {
            clearInterval(countdown[a.id])
            a.value = '获取验证码'
            a.status = false
            return
          }
          a.value = `重新获取${second}s`
        },1000)
      },
      countdownVerError (a) { // 验证码获取失败
        clearInterval(countdown[a.id])
        a.value = '获取验证码'
        a.status = false
      },
      testPhone (phone) { //判断手机号是否合法
        var reg = /^1\d{10}$/;
        if(!reg.test(phone)){
          return false
        }else{
          return true
        }
      },
      testIdCardNo () { // 验证身份证号
        var idCardNo = this.idCardNo ? this.idCardNo.replace(/\s/ig,'') : '';
        if(idCardNo === '' || idCardNo.length !== 18){
          return false
        }
        return true
      }
    },
}
</script>
