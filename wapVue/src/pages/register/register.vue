<template>
    <div id="formPage" v-cloak class="whiteBack">
        <h2>注册 1/3</h2>
        <h3>该账户将作为您的平台登录账户，笑脸平台承诺绝不泄露您的个人信息</h3>
        <div class="input_box">
            <div class="item_name" v-if="mobile!='' || inputFocusStatus_1">您的手机号码</div>
            <a href="javascript:;" v-if="mobile!=''" class="clearText" @click="()=>{mobile = ''}"></a>
            <input name="mobile" type="text" v-model="mobile" @focus="()=>{this.inputFocusStatus_1 = true}" @blur="()=>{this.inputFocusStatus_1 = false}" :placeholder="!inputFocusStatus_1 ? '您的手机号码' : ''" />
        </div>
        <div class="input_box">
            <div class="item_name" v-if="imgCode!='' || inputFocusStatus_2">图形验证码</div>
            <span class="code"><img @click="reloadImgVerification()" :src="imgCodeUrl"  name="verifyCodeImg"></span>
            <input name="imgCode" type="text" v-model="imgCode"
            @focus="()=>{this.inputFocusStatus_2 = true;}"
            @blur="()=>{this.inputFocusStatus_2 = false;}"
            :placeholder="!inputFocusStatus_2 ? '图形验证码' : ''"
             />
        </div>
        <div class="blank"></div>
        <a href="javascript:;" class="btn_submit animation" @click="registerActive" :class="{'disabled' : !btnDisabledStatus}">注册</a>
        <div class="agreement">
            <label class="ui__checkbox">
  				<span class="ui-checkbox" v-bind:class="{'is-checked' : agreementState}"></span>
  				<input name="changeAgreement" type="checkbox" v-on:click="changeAgreementState()" v-bind:checked="this.agreementState">
  			</label>
  	        <span>
                我已阅读并确认
                <a href="javascript:;" @click="showContract('register')">《笑脸金融平台用户注协议》</a><br>
                <a href="javascript:;" @click="showContract('informationCatch')">《用户信息采集授权声明》</a>
            </span>
        </div>




        <!--统一提示层-->
        <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
        <tosat :content.sync="tosatContent" :show.sync="tosatShow"></tosat>
        <smileLoading  :showSmileLoading="loadingLayerStatus"></smileLoading>

        <layerAgreement ref="layerAgreement"></layerAgreement>
        <tipLayer ref="tipLayer"></tipLayer>

    </div>
</template>
<style src="assets/css/formPage.css">
</style>

<script>
//import {utils} from 'tools';
import informationLayer from '@/components/informationLayer'
import sunshineFooter from '@/components/sunshineFooter'


export default {
    name: 'register',
    components:{informationLayer, sunshineFooter},//这里注册
    data(){
        return{
            mobile : '',
            imgCode : '',
            imgToken : '',
            imgCodeUrl : '',

            informationLayerContent : false,
            showLayerStatus : false,

            btnDisabledStatus : false,

            agreementState : true,

            tosatContent : '',
            tosatShow : false,

            inputFocusStatus_1 : false,
            inputFocusStatus_2 : false,
            loadingLayerStatus:false,

        }
    },
    created:function () {
        var _this = this;
        this.reloadImgVerification();
        this.utils.setCookieAll('mic_sessionid', '',-1);
        this.utils.setCookieAll('mic-ticket', '', -1);
        this.utils.setCookie('mic_sessionid', '',-1);
        this.utils.setCookie('mic-ticket', '', -1);

        // this.mobile = utils.getCookie('mobileNum') ? utils.getCookie('mobileNum') : '';
    },
    methods:{
        showContract(type){
            this.$refs.layerAgreement.showAgreement(type, '', true)
        },
        changeAgreementState() {
            this.agreementState = !this.agreementState;
        },
        checkMobile(){
            var reg = /^1\d{10}$/;
            return reg.test(this.mobile);
        },
        reloadImgVerification(){
            this.imgToken = new Date().getTime()+Math.round(Math.random()*10000);
            this.imgCodeUrl = this.utils.AJAXDOMAINNAME+ '/wap/getImageCode?imgToken='+this.imgToken;
        },
        changeBtnStatus(){
            this.btnDisabledStatus = this.mobile!= '' && this.mobile.length == 11 && this.imgCode != '' && this.imgCode.length == 4;
        },
        registerActive(){
            if(!this.btnDisabledStatus) return;
            if(!this.checkMobile()){
                this.tosatContent = '手机格式不正确';
                this.tosatShow = true;
                return;
            }
            if(!this.agreementState){
                this.tosatContent = '请同意笑脸注册协议';
                this.tosatShow = true;
                return false;
            }
            var _this = this;
            this.utils.setCookie('mobileNum', _this.mobile, 10000)
            this.loadingLayerStatus=true;
            $.ajax({
                url : this.utils.AJAXDOMAINNAME+"/wap/preLogin",
                data : JSON.stringify({
                    loginImgCode : _this.imgCode,
                    loginPwd : _this.password,
                    mobile : _this.mobile,
                    imgToken : _this.imgToken
                }),
                error : function(XMLHttpRequest, textStatus){
                    if(textStatus == 'error'){
                        _this.utils.toastFuc('网络请求错误，请稍候重试');
                	}else if(textStatus == 'timeout'){
                        _this.utils.toastFuc('网络请求超时，请稍候重试');
                	}
                    _this.reloadImgVerification();
                    _this.imgCode = '';
                    _this.loadingLayerStatus=false;
                },
                success : function(res){
                    _this.loadingLayerStatus=false;
                    if(res.code == '1'){
                        _this.$router.push({
                            name : 'registerVerification',
                            query : {
                                mobile : _this.mobile,
                                isRegister : (res.data.userStatus == "100" ? 1 : 0)//nouser=100
                            }
                        })
                    }else if(res.code=='-700'){
                      _this.reloadImgVerification();
                      _this.imgCode = '';
                      _this.$refs.tipLayer.showByParame({
                        title : '提示',
                        content : res.message,
                        btnArr : [
                          {
                            text : '拨打电话',
                            style: 'color:#F0484E',
                            fn : function(){
                              window.location.href="tel:4008900766";
                            }
                          },
                          {
                            text : '我知道了',
                            fn : function(){
                              _this.$refs.tipLayer.closeLayer();
                            }
                          }
                        ]
                      })
                    }else{
                        _this.reloadImgVerification();
                        _this.imgCode = '';
                        _this.informationLayerContent = res.message;
                        _this.showLayerStatus = true;
                    }
                }
            })

        }
    },
    watch:{
        mobile(val){
            this.mobile = val.substr(0,11);
            this.changeBtnStatus();
        },
        imgCode(val){
            this.changeBtnStatus();
        }
    }
}
</script>
