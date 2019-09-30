<template>
    <div id="formPage" v-cloak class="whiteBack">
        <h2>设置登录密码</h2>
        <div class="input_box">
            <div class="item_name" v-if="password!='' || inputFocusStatus_1">请输入八位以上数字、字母特殊符号(@#$%&)组合密码</div>
            <input name="password" class="password" type="text" v-model="password"
             @focus="()=>{this.inputFocusStatus_1 = true}" @blur="()=>{this.inputFocusStatus_1 = false}" :placeholder="!inputFocusStatus_1 ? '设置您的新密码' : ''"
             />
        </div>
        <div class="input_box">
            <div class="item_name" v-if="smsCode!='' || inputFocusStatus_2">短信验证码</div>
            <a href="javascript:;" class="countDown" v-if="countTime > 0"><span>{{countTime}}</span>后重新获取</a>
            <a href="javascript:;" class="getSmsCode" v-else @click="sendSmsCode()">重新获取</a>
            <input name="smsCode" type="number" v-model="smsCode"
            @focus="()=>{this.inputFocusStatus_2 = true}" @blur="()=>{this.inputFocusStatus_2 = false}" :placeholder="!inputFocusStatus_2 ? '短信验证码' : ''" />
        </div>
        <div class="input_box">
            <div class="item_name" v-if="imgCode!='' || inputFocusStatus_3">图形验证码</div>
            <span class="code"><img :src="reloadImgSrc" v-on:click="reloadImgCode()"></span>
            <input name="imgCode" type="text" maxlength="4" v-model="imgCode"
            @focus="()=>{this.inputFocusStatus_3 = true}" @blur="()=>{this.inputFocusStatus_3 = false}" :placeholder="!inputFocusStatus_3 ? '图形验证码' : ''" />
        </div>
        <div class="blank"></div>
        <a href="javascript:;" class="btn_submit" @click="submit" :class="{'disabled' : btnDisabledStatus}">确认</a>
        <!--统一提示层-->
        <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
    </div>
</template>
<style src="assets/css/formPage.css">
</style>

<script>
//import {utils} from 'tools';
import informationLayer from '@/components/informationLayer'

export default {
    name: 'resetPassword',
    components:{informationLayer},//这里注册
    data(){
        return{
            mobile : '',
            password : '',
            smsCode : '',
            imgCode : '',
            reloadImgSrc:'',
            resetPWDToken : '',

            countTime : 60,

            showMobileTitle : false,

            btnDisabledStatus : true,

            informationLayerContent : '',
            showLayerStatus : false,

            inputFocusStatus_1 : false,
            inputFocusStatus_2 : false,
            inputFocusStatus_3 : false,
        }
    },
    created:function () {
        var _this = this;
        this.mobile = this.$route.query.mobile;
        this.sendSmsCode();
        this.reloadImgCode();
    },
    methods:{
        reloadImgCode:function(){
           this.resetPWDToken=new Date().getTime()+Math.round(Math.random()*10000);
           this.reloadImgSrc=this.utils.AJAXDOMAINNAME+ '/wap/getImageCode?imgToken='+this.resetPWDToken
        },
        countDown(){
            var _this = this;
            _this.timer = setInterval(()=>{
                if(_this.countTime <= 0){
                    window.clearInterval(_this.timer)
                }else{
                    _this.countTime--;
                }
            },1000)
        },
        clearCountDown(){
            window.clearInterval(this.timer);
            this.countTime = 60;
            this.smsCode = '';
        },
        checkMobile(){
            var reg = /^1\d{10}$/;
            return reg.test(this.mobile);
        },
        sendSmsCode(){
            var _this = this;
            this.clearCountDown();
            if(this.mobile == '' || !this.checkMobile()){
                this.showLayer('手机格式不正确')
                return;
            }
            $.ajax({
                url : this.utils.AJAXDOMAINNAME + '/wap/resetPwdSMSCode',
                data : JSON.stringify({
                    mobile : _this.mobile
                }),
                success : function(rs){
                    if(rs.code*1 == 1){
                        _this.countDown();

                    }else{
                        _this.informationLayerContent = rs.message
                        _this.showLayerStatus = true;
                    }
                }
            })
        },
        showLayer(msg){
            this.informationLayerContent = msg
            this.showLayerStatus = true;
        },
        submit(){
            var _this = this;
            // if(this.password.length < 8 || this.password.length > 20 || !this.utils.checkPassword(this.password)){
            //     this.showLayer('请输入由字母、数字、特殊符号(@#$%&)组成的8-20位密码');
            //     return;
            // }
            if(this.password == ''){
                this.showLayer('请输入密码');
                return;
            }
            if(this.smsCode == ''){
                this.showLayer('请输入短信验证码');
                return;
            }

            if(this.imgCode == '' || this.imgCode.length != 4){
                this.showLayer('请输入正确的图形验证码');
                return;
            }
            $.ajax({
                url: this.utils.AJAXDOMAINNAME + "/wap/resetLoginPwd",
                data : JSON.stringify({
                    smsCode : _this.smsCode,
                    newLoginPwd : _this.utils.executePrompt(_this.password),
                    mobile : _this.mobile,
                    loginImgCode : _this.imgCode,
                    imgToken : _this.resetPWDToken
                }),
                error : function(){
                    _this.reloadImgCode();
                },
                success: function(rs) {
                    _this.reloadImgCode();
                    if (rs.code == 1) {
                      var cu=_this.$route.query.cburl;
                      if(cu&&cu.indexOf("//")==-1) {//cburl中不存在‘//’时直接跳转cburl
                          window.location.href=_this.$route.query.cburl;
                      }else if(cu&&cu.indexOf("facebank.cn")>-1){//cburl中存在‘//’时，如果存在facebank直接跳转cburl
                          window.location.href=_this.$route.query.cburl;
                      }else{
                         _this.$router.push({path: '/account'});
                      }

                    } else {
                        _this.showLayer(rs.message);
                    }
                }
            })
        }
    },
    watch:{
        mobile(val){
            this.showMobileTitle = val != '';
            this.mobile = val.substr(0,11);
            this.btnDisabledStatus = !(this.mobile!= '' && this.mobile.length == 11);
        },
        smsCode(val){
            this.smsCode = val.substr(0,6);
        }
    }
}
</script>
