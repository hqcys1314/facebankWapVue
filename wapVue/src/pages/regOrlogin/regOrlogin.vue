<template>
    <div v-cloak class="whiteBack">
        <h2>欢迎回来</h2>
        <div class="input_box">
            <div class="item_name" v-if="mobile!='' || inputFocusStatus_1">您的手机号码</div>
            <a href="javascript:;" v-if="mobile!=''" class="clearText" @click="()=>{mobile = ''}"></a>
            <input name="mobile" type="tel"
            @focus="()=>{changeRegisterPosition(true);this.inputFocusStatus_1 = true;}"
            @blur="()=>{changeRegisterPosition(false);this.inputFocusStatus_1 = false;}"
            :placeholder="!inputFocusStatus_1 ? '您的手机号码' : ''"
            v-model="mobile"  />
        </div>
        <div class="input_box" v-if="passwordLogin">
            <div class="item_name" v-if="password!='' || inputFocusStatus_2">您的登录密码</div>
            <input name="password" type="password"  class="password" v-model="password"
            @focus="()=>{changeRegisterPosition(true);this.inputFocusStatus_2 = true;}"
            @blur="()=>{changeRegisterPosition(false);this.inputFocusStatus_2 = false;}"
            :placeholder="!inputFocusStatus_2 ? '您的登录密码' : ''" />
        </div>
        <div class="input_box" v-if="passwordLogin">
            <div class="item_name" v-if="imgCode!='' || inputFocusStatus_3">图形验证码</div>
            <span class="code"><img @click="reloadImgVerification()" :src="imgCodeUrl"  name="verifyCodeImg"></span>
            <input name="imgCode" type="text" v-model="imgCode"
            @focus="()=>{changeRegisterPosition(true);this.inputFocusStatus_3 = true;}"
            @blur="()=>{changeRegisterPosition(false);this.inputFocusStatus_3 = false;}"
            :placeholder="!inputFocusStatus_3 ? '图形验证码' : ''"
             />
        </div>
        <div class="other">
            <a href="javascript:;" class="l" @click="changeOption(true)" v-if="!passwordLogin">密码登录</a>
            <a href="javascript:;" class="l" @click="changeOption(false)" v-if="passwordLogin">验证码登录</a>
            <router-link class="r" v-if="passwordLogin" :to="{ name: 'forgetPassword'}">忘记密码</router-link>
        </div>
        <a href="javascript:;" class="btn_submit" v-if="passwordLogin" @click="loginActive" :class="{'disabled' : btnDisabledStatus}">登录</a>
        <a href="javascript:;" class="btn_submit" v-else @click="toVerificationPage" :class="{'disabled' : btnDisabledStatus}">获取验证码</a>

        <div class="agreement" v-if="!passwordLogin">
          <span class="spanm"  @click="showContract('register')">《笑脸金融平台用户注协议》</span>
          <span class="spanm"  @click="showContract('informationCatch')">《用户信息采集授权声明》</span>
        </div>



        <router-link :to="{ name: 'register', params: {mobile : mobile} }" class="btn_register_img_top animation" :class="{'in':inputFocus, 'out':!inputFocus}"></router-link>
        <router-link v-if="!inputFocus" :to="{ name: 'register', params: {mobile : mobile} }" class="btn_register_img"></router-link>

        <smileLoading  :showSmileLoading="isShowSmileLoading"></smileLoading>

        <!--统一提示层-->
        <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
        <tosat :content.sync="tosatContent" :show.sync="tosatShow" />
      <layerAgreement ref="layerAgreement"></layerAgreement>

    </div>
</template>
<style lang="postcss" scoped src="./regOrlogin.css">
</style>
<style>
  .spanm{display:inline-block;}
</style>
<script>
import {utils} from 'tools';
import informationLayer from '@/components/informationLayer';

export default {
    name: 'login',
    components:{informationLayer},//这里注册
    data(){
        return{
            mobile : '',
            password : '',
            imgCode : '',
            imgCodeUrl : '',
            imgToken : '',
            isFocus : false,
            inputFocus : false,

            passwordLogin : false,

            btnDisabledStatus : true,
            showImageVerification : false,

            informationLayerContent : '',
            showLayerStatus : false,

            tosatContent : '',
            tosatShow : false,

            inputFocusStatus_1 : false,
            inputFocusStatus_2 : false,
            inputFocusStatus_3 : false,

            isShowSmileLoading:false,
        }
    },
    created:function () {
        var _this = this;
        document.onkeydown = function(e){
            if(e.keyCode == 13){
                if(!_this.btnDisabledStatus){
                    document.onkeydown = '';
                    if(_this.passwordLogin){
                        _this.loginActive();
                    }else{
                        _this.toVerificationPage();
                    }
                }
            }
        }
        utils.setCookieAll('mic_sessionid', '',-1);
        utils.setCookieAll('mic-ticket', '', -1);
        utils.setCookie('mic_sessionid', '',-1);
        utils.setCookie('mic-ticket', '', -1);

        this.mobile = utils.getCookie('mobileNum') ? utils.getCookie('mobileNum') : '';
    },
    methods:{
        showContract(type){
          this.$refs.layerAgreement.showAgreement(type, '', true)
        },
        clsoeVerLayer(){
            this.showImageVerification = false;
            this.imgCode = '';
            this.$refs.codeInput.blur();
        },
        changeRegisterPosition(val){
            var _this = this;
            this.inputFocus = val;
            if(utils.borwer.android || utils.borwer.iPhone){
                if(!val){
                    setTimeout(()=>{
                        _this.inputFocus = val;
                    },300)
                    return;
                }
            }
        },
        showTosat(msg){
            this.tosatContent = msg;
            this.tosatShow = true;
        },
        changeOption(val){
            this.passwordLogin = val;
            if(val) this.reloadImgVerification();
            this.changeBtnStatus();
        },
        checkMobile(){
            var reg = /^1\d{10}$/;
            return reg.test(this.mobile);
        },
        reloadImgVerification(){
            this.imgToken = new Date().getTime()+Math.round(Math.random()*10000);
            this.imgCodeUrl = utils.AJAXDOMAINNAME+ '/wap/getImageCode?imgToken='+this.imgToken;
        },
        changeBtnStatus(){
            if(this.passwordLogin){
                this.btnDisabledStatus = !(this.mobile!= '' && this.mobile.length == 11 && this.password != '' && this.password.length >= 6 && this.password.length <= 20 && this.imgCode != '' && this.imgCode.length == 4);
            }else{
                this.btnDisabledStatus = !(this.mobile!= '' && this.mobile.length == 11);
            }
        },
        loginActive(){
            this.isShowSmileLoading=true;
            if(this.btnDisabledStatus) return;
            if(!this.checkMobile()){
                this.isShowSmileLoading=false;
                this.showTosat('手机格式不正确')
                return;
            }
            var _this = this;
            utils.setCookie('mobileNum', _this.mobile, 10000)
            $.ajax({
                url : utils.AJAXDOMAINNAME+"/wap/login",
                data : JSON.stringify({
                    loginImgCode : _this.imgCode,
                    loginPwd : _this.utils.executePrompt(_this.password),
                    mobile : _this.mobile,
                    imgToken : _this.imgToken,
                    wechatOpenId: _this.utils.getCookie('wechatOpenId')
                }),
                success : function(res){
                    _this.isShowSmileLoading=false;
                    if(res.code *1 == 1){
                        if(res.data && res.data.nickname){ // nickname 存在就保存 微信用户昵称和头像
                            _this.utils.setCookieAll('_WeChatNickName',escape(res.data.nickname));
                            _this.utils.setCookie('_WeChatNickName',escape(res.data.nickname));
                            _this.utils.setCookie('_WeChatHeadImgLink',res.data.headimgurl);
                        }
                           var cu=_this.$route.query.cburl;
                           if(cu&&cu.indexOf("//")==-1) {//cburl中不存在‘//’时直接跳转cburl
                               window.location.href=_this.$route.query.cburl;
                           }else if(cu&&cu.indexOf("facebank.cn")>-1){//cburl中存在‘//’时，如果存在facebank直接跳转cburl
                               window.location.href=_this.$route.query.cburl;
                           }else{
                              _this.$router.push({path: '/account'});
                           }

                    }else if(res.code == '-801'){
                        if(res.data.userStatus == '200'){//nopass=200
                            _this.password = '';
                            _this.informationLayerContent = '您未设置过密码，请使用验证码登录',
                            _this.showLayerStatus = true;
                        }else if(res.data.userStatus == '100'){//nouser=100
                            _this.password = '';
                            _this.informationLayerContent = '用户名或密码错误请重试';//原：手机号不存在
                            _this.showLayerStatus = true;
                        }else{
                            _this.informationLayerContent = res.message,
                            _this.showLayerStatus = true;
                        }
                    }else if(res.code == '-858'){
                        _this.showImageVerification = true;
                        _this.imgCode = '';
                        _this.reloadImgVerification();
                        _this.informationLayerContent = res.message;
                        _this.showLayerStatus = true;
                    }else{
                        _this.reloadImgVerification();
                        _this.imgCode = '';
                        _this.password = '';
                        _this.informationLayerContent = res.message;
                        _this.showImageVerification = false;
                        _this.showLayerStatus = true;
                    }
                }
            })

        },
        toVerificationPage(){
            if(this.btnDisabledStatus) return;
            if(!this.checkMobile()){
                this.showTosat('手机格式不正确')
                return;
            }
            utils.setCookie('mobileNum', this.mobile, 10000)
            this.$router.push({
                name: 'loginByVerification',
                query: {
                    mobile : this.mobile,
                    cburl:this.$route.query.cburl
                }
            })
        }
    },
    watch:{
        mobile(val){
            this.mobile = (val+'').substr(0,11);
            this.changeBtnStatus();
        },
        password(val){
            this.changeBtnStatus();
        },
        imgCode(){
            this.changeBtnStatus();
        }
    }
}
</script>
