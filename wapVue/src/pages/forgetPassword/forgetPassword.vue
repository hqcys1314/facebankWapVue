<template>
    <div id="formPage" v-cloak class="whiteBack">
        <h2>重置登录密码</h2>
        <div class="input_box">
            <div class="item_name" v-if="mobile!='' || inputFocusStatus_1">您的手机号码</div>
            <a href="javascript:;" v-if="mobile!=''" class="clearText" @click="()=>{mobile = ''}"></a>
            <input name="mobile" type="number" v-model="mobile" @focus="()=>{this.inputFocusStatus_1 = true}" @blur="()=>{this.inputFocusStatus_1 = false}" :placeholder="!inputFocusStatus_1 ? '您的手机号码' : ''" />
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
        <a href="javascript:;" class="btn_submit" @click="verificationMobile" :class="{'disabled' : btnDisabledStatus}">下一步</a>
        <!--统一提示层-->
        <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
        <tosat :content.sync="tosatContent" :show.sync="tosatShow"></tosat>
    </div>
</template>
<style src="assets/css/formPage.css">
</style>

<script>
//import {utils} from 'tools';
import informationLayer from '@/components/informationLayer'


export default {
    name: 'forgetPassword',
    components:{informationLayer},//这里注册
    data(){
        return{
            mobile : '',
            imgCode : '',
            imgToken : '',
            imgCodeUrl : '',


            btnDisabledStatus : true,

            informationLayerContent : '',
            showLayerStatus : false,

            tosatContent : '',
            tosatShow : false,

            inputFocusStatus_1 : false,
            inputFocusStatus_2 : false,
        }
    },
    created:function () {
        var _this = this;
        document.onkeydown = function(e){
            if(e.keyCode == 13){
                if(!_this.btnDisabledStatus){
                    document.onkeydown = '';
                    _this.verificationMobile();
                }
            }
        }
        this.reloadImgVerification();
        this.utils.setCookieAll('mic_sessionid', '',-1);
        this.utils.setCookieAll('mic-ticket', '', -1);
        this.utils.setCookie('mic_sessionid', '',-1);
        this.utils.setCookie('mic-ticket', '', -1);
    },
    methods:{
        checkMobile(){
            var reg = /^1\d{10}$/;
            return reg.test(this.mobile);
        },
        reloadImgVerification(){
            this.imgToken = new Date().getTime()+Math.round(Math.random()*10000);
            this.imgCodeUrl = this.utils.AJAXDOMAINNAME+ '/wap/getImageCode?imgToken='+this.imgToken;
        },
        changeBtnStatus(){
            this.btnDisabledStatus = !(this.mobile!= '' && this.mobile.length == 11 && this.imgCode != '' && this.imgCode.length == 4);
        },
        verificationMobile(){
            if(this.btnDisabledStatus) return;
            if(!this.checkMobile()){
                this.tosatContent = '手机号码格式错误';
                this.tosatShow = true;
                return;
            };
            var _this = this;
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
                },
                success : function(res){
                    if(res.code == '1'){
                        if(res.data.userStatus == "100"){//nouser=100
                            _this.informationLayerContent = '用户名或密码错误请重试';//原：用户不存在
                            _this.showLayerStatus = true;
                            _this.reloadImgVerification();
                            _this.imgCode = '';
                        }else{
                            _this.$router.push({
                                name : 'resetPassword',
                                query : {
                                    mobile : _this.mobile
                                }
                            })
                        }
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
